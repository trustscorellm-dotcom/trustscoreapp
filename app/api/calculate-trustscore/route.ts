import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateTrustScore } from "@/lib/trustscore/calculator";
import { checkRateLimit } from "@/lib/rate-limit";
import type { Company } from "@/types/startup";
import type { GatedData, NdaData } from "@/types/trustscore";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const { allowed } = checkRateLimit(`calculate-trustscore:${ip}`);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json().catch(() => null);
    const companyId = body?.companyId;
    if (!companyId || typeof companyId !== "string") {
      return NextResponse.json({ error: "companyId is required" }, { status: 400 });
    }

    const supabase = await createClient();

    const [{ data: company, error: companyError }, { data: gated }, { data: nda }] =
      await Promise.all([
        supabase.from("companies").select("*").eq("id", companyId).single(),
        supabase
          .from("startup_gated_data")
          .select("*")
          .eq("startup_id", companyId)
          .maybeSingle(),
        supabase.from("startup_nda_data").select("*").eq("startup_id", companyId).maybeSingle(),
      ]);

    if (companyError || !company) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    const result = calculateTrustScore(
      company as Company,
      (gated as GatedData | null) ?? null,
      (nda as NdaData | null) ?? null
    );

    const { error: updateError } = await supabase
      .from("companies")
      .update({ trust_score: result.score })
      .eq("id", companyId);

    if (updateError) {
      console.error("Failed to persist trust_score:", updateError.message);
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("calculate-trustscore error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
