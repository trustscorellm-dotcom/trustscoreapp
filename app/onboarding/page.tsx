import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingChoice } from "./OnboardingChoice";
 
export default async function OnboardingPage() {
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
 
  // Already onboarded — send them where they belong instead of asking again.
  if (profile?.role === "investor") redirect("/investor/register");
  if (profile?.role === "founder") redirect("/register");
  if (profile?.role === "admin") redirect("/dashboard");
 
  return <OnboardingChoice />;
}
 
