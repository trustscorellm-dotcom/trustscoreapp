import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { DirectoryClient } from "./DirectoryClient";
import type { Company } from "@/types/startup";

export const metadata: Metadata = {
  title: "Directory",
  description: "Browse startup TrustScore profiles.",
};

export default async function DirectoryPage() {
  const supabase = await createClient();
  const { data: companies, error } = await supabase
    .from("companies")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load directory:", error.message);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Startup directory
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Browse structured, explainable TrustScore profiles from founders on the platform.
        </p>
      </div>

      <div className="mt-12">
        <DirectoryClient companies={(companies as Company[] | null) ?? []} />
      </div>
    </div>
  );
}
