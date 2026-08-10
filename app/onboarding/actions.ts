"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function chooseRole(role: "founder" | "investor") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: user.id,
      role,
      full_name: user.user_metadata?.full_name ?? null,
    },
    { onConflict: "user_id" }
  );

  if (error) {
    // Return instead of throw — thrown Server Action errors get sanitized
    // to a generic message in production builds. Returning lets the client
    // show the real Postgres/RLS error message.
    return { error: error.message };
  }

  redirect(role === "investor" ? "/investor/register" : "/register");
}
