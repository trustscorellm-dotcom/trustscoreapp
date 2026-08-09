"use client";

import { FiGrid, FiUser, FiLock, FiShield } from "react-icons/fi";
import { cn } from "@/lib/utils";

export type DashboardSection = "overview" | "profile" | "gated" | "nda";

const SECTIONS: { id: DashboardSection; label: string; icon: typeof FiGrid }[] = [
  { id: "overview", label: "Overview", icon: FiGrid },
  { id: "profile", label: "Public Profile", icon: FiUser },
  { id: "gated", label: "Gated Data", icon: FiLock },
  { id: "nda", label: "NDA Data", icon: FiShield },
];

interface DashboardSidebarProps {
  active: DashboardSection;
  onChange: (section: DashboardSection) => void;
}

export function DashboardSidebar({ active, onChange }: DashboardSidebarProps) {
  return (
    <nav
      aria-label="Dashboard sections"
      className="flex gap-2 overflow-x-auto pb-2 lg:w-56 lg:flex-col lg:overflow-visible lg:pb-0"
    >
      {SECTIONS.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => onChange(section.id)}
          aria-current={active === section.id ? "page" : undefined}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
            active === section.id
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <section.icon size={16} aria-hidden="true" />
          {section.label}
        </button>
      ))}
    </nav>
  );
}
