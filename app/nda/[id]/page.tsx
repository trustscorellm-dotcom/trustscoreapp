import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiFileText } from "react-icons/fi";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "NDA Access",
};

interface NdaPageProps {
  params: Promise<{ id: string }>;
}

export default async function NdaPage({ params }: NdaPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: company } = await supabase
    .from("companies")
    .select("name")
    .eq("id", id)
    .single();

  if (!company) notFound();

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 px-4 py-20 text-center sm:px-6">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <FiFileText size={22} aria-hidden="true" />
      </span>
      <h1 className="text-2xl font-semibold text-foreground">
        NDA access for {company.name}
      </h1>
      <p className="text-sm text-muted-foreground">
        NDA-gated access requests aren&apos;t available yet — this flow is still being
        finalized. Check back soon.
      </p>
      <Link
        href={`/startup/${id}`}
        className="mt-2 text-sm font-medium text-primary hover:underline"
      >
        Back to {company.name}&apos;s profile
      </Link>
    </div>
  );
}
