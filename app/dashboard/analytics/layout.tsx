import type { ReactNode } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function AnalyticsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <FiArrowLeft size={14} aria-hidden="true" />
        Back to dashboard
      </Link>
      <div className="mt-6">{children}</div>
    </div>
  );
}
