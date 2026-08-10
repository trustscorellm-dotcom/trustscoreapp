"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function chooseRole(role: "founder" | "investor") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  // Upsert in case a profiles row already exists without a role set.
  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: user.id,
      role,
      full_name: user.user_metadata?.full_name ?? null,
    },
    { onConflict: "user_id" }
  );

  if (error) {
    // Surface the failure back to the client instead of silently redirecting
    // into a broken state.
    throw new Error(error.message);
  }

  redirect(role === "investor" ? "/investor/register" : "/register");
}
