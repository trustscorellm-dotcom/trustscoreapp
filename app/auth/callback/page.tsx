import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface AuthCallbackPageProps {
  searchParams: Promise<{ code?: string; redirectTo?: string }>;
}

export default async function AuthCallbackPage({
  searchParams,
}: AuthCallbackPageProps) {
  const { code, redirectTo } = await searchParams;

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  redirect(redirectTo || "/dashboard");
}
