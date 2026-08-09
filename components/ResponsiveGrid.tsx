import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ColumnCount = 1 | 2 | 3 | 4;

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  columns?: {
    base?: ColumnCount;
    sm?: ColumnCount;
    lg?: ColumnCount;
  };
  gap?: "sm" | "md" | "lg";
}

const BASE_COLS: Record<ColumnCount, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

const SM_COLS: Record<ColumnCount, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

const LG_COLS: Record<ColumnCount, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

const GAP_CLASSES = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
};

export function ResponsiveGrid({
  children,
  className,
  columns = { base: 1, sm: 2, lg: 3 },
  gap = "md",
}: ResponsiveGridProps) {
  return (
    <div
      className={cn(
        "grid",
        GAP_CLASSES[gap],
        columns.base && BASE_COLS[columns.base],
        columns.sm && SM_COLS[columns.sm],
        columns.lg && LG_COLS[columns.lg],
        className
      )}
    >
      {children}
    </div>
  );
}
