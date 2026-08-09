"use client";

import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";

export interface DashboardSectionConfig<T extends string> {
  id: T;
  label: string;
  icon: IconType;
}

interface DashboardSidebarProps<T extends string> {
  sections: DashboardSectionConfig<T>[];
  active: T;
  onChange: (section: T) => void;
}

export function DashboardSidebar<T extends string>({
  sections,
  active,
  onChange,
}: DashboardSidebarProps<T>) {
  return (
    <nav
      aria-label="Dashboard sections"
      className="flex gap-2 overflow-x-auto pb-2 lg:w-56 lg:flex-col lg:overflow-visible lg:pb-0"
    >
      {sections.map((section) => (
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
