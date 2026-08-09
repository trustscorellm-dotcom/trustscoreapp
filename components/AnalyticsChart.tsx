import { cn } from "@/lib/utils";
import type { CategoryBreakdown } from "@/types/trustscore";

const BAR_COLORS = ["bg-chart-1", "bg-chart-2", "bg-chart-3"];

interface AnalyticsChartProps {
  breakdown: CategoryBreakdown[];
}

export function AnalyticsChart({ breakdown }: AnalyticsChartProps) {
  return (
    <ul aria-label="TrustScore category breakdown" className="flex flex-col gap-4">
      {breakdown.map((category, index) => (
        <li key={category.category} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">{category.label}</span>
            <span className="text-muted-foreground">
              {Math.round(category.score)} / 100 · {Math.round(category.weight)}% weight
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                BAR_COLORS[index % BAR_COLORS.length]
              )}
              style={{ width: `${Math.max(category.score, 2)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
