import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NDASigner } from "@/components/NDASigner";
import type { Company } from "@/types/startup";

export const metadata: Metadata = {
  title: "NDA Access",
};

interface NdaPageProps {
  params: Promise<{ id: string }>;
}

export default async function NdaPage({ params }: NdaPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/auth?redirectTo=${encodeURIComponent(`/nda/${id}`)}`);

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!company) notFound();

  const { data: existingUnlock } = await supabase
    .from("profile_unlocks")
    .select("id")
    .eq("investor_id", user.id)
    .eq("startup_id", id)
    .maybeSingle();

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-16 sm:px-6">
      <NDASigner company={company as Company} alreadyUnlocked={Boolean(existingUnlock)} />
    </div>
  );
}
