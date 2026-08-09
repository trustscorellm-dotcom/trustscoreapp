import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminPanel, type UnlockWithDetails } from "./AdminPanel";
import type { Company } from "@/types/startup";
import type { Profile } from "@/types/user";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const [{ data: profiles }, { data: companies }, { data: unlocksRaw }] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("companies").select("*").order("created_at", { ascending: false }),
    supabase
      .from("profile_unlocks")
      .select("*, company:companies(*)")
      .order("created_at", { ascending: false }),
  ]);

  const unlocks = unlocksRaw ?? [];
  const investorIds = Array.from(new Set(unlocks.map((u) => u.investor_id)));

  // Joined separately rather than via a nested PostgREST embed — profile_unlocks
  // and investor_profiles aren't directly foreign-keyed to each other (both
  // reference auth.users independently), so a single embedded select isn't
  // guaranteed to resolve.
  const { data: investorProfiles } =
    investorIds.length > 0
      ? await supabase
          .from("investor_profiles")
          .select("user_id, full_name, firm_name")
          .in("user_id", investorIds)
      : { data: [] as { user_id: string; full_name: string | null; firm_name: string | null }[] };

  const investorMap = new Map((investorProfiles ?? []).map((p) => [p.user_id, p]));

  const enrichedUnlocks: UnlockWithDetails[] = unlocks.map((u) => ({
    ...u,
    investor: investorMap.get(u.investor_id) ?? null,
  }));

  return (
    <AdminPanel
      profiles={(profiles as Profile[] | null) ?? []}
      companies={(companies as Company[] | null) ?? []}
      unlocks={enrichedUnlocks}
    />
  );
}
