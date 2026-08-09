import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import { profileUnlockEmail } from "@/lib/email/templates";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const { allowed } = checkRateLimit(`send-email:${ip}`);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json().catch(() => null);

    if (body?.type !== "profile-unlock" || typeof body.startupId !== "string") {
      return NextResponse.json({ error: "Unsupported email type" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const [{ data: company }, investorResult] = await Promise.all([
      supabase
        .from("companies")
        .select("name, contact_email, owner_id")
        .eq("id", body.startupId)
        .maybeSingle(),
      user
        ? supabase
            .from("investor_profiles")
            .select("full_name, firm_name")
            .eq("user_id", user.id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

    if (!company) {
      return NextResponse.json({ sent: false }, { status: 200 });
    }

    let founderEmail = company.contact_email;
    if (!founderEmail && company.owner_id) {
      const { data: ownerProfile } = await supabase
        .from("profiles")
        .select("email")
        .eq("user_id", company.owner_id)
        .maybeSingle();
      founderEmail = ownerProfile?.email ?? null;
    }

    if (!founderEmail) {
      // Nothing to notify — informational only, not an error worth surfacing.
      return NextResponse.json({ sent: false }, { status: 200 });
    }

    const email = profileUnlockEmail({
      founderEmail,
      startupName: company.name,
      investorName: investorResult.data?.full_name ?? null,
      investorFirm: investorResult.data?.firm_name ?? null,
    });

    await sendEmail(email);

    return NextResponse.json({ sent: true }, { status: 200 });
  } catch (error) {
    console.error("send-email error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
