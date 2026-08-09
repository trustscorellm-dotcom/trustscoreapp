import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminPanel } from "./AdminPanel";
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

  const [{ data: profiles }, { data: companies }] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("companies").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <AdminPanel
      profiles={(profiles as Profile[] | null) ?? []}
      companies={(companies as Company[] | null) ?? []}
    />
  );
}
