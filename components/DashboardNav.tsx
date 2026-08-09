"use client";

import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "@/components/AuthProvider";

interface DashboardNavProps {
  title: string;
}

export function DashboardNav({ title }: DashboardNavProps) {
  const { signOut } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <div className="flex items-center justify-between border-b border-border pb-4">
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      <button
        type="button"
        onClick={handleSignOut}
        className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <FiLogOut size={14} aria-hidden="true" />
        Sign out
      </button>
    </div>
  );
}
