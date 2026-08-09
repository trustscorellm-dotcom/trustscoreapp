export interface PerformanceMetricInput {
  id: string;
  name: string;
  value: number;
  rating?: "good" | "needs-improvement" | "poor";
}

export function recordMetric(metric: PerformanceMetricInput): void {
  if (process.env.NODE_ENV !== "production") {
    console.info(`[perf] ${metric.name}: ${Math.round(metric.value * 100) / 100} (${metric.rating ?? "n/a"})`);
    return;
  }

  // Placeholder for a production monitoring service — not required now,
  // matching the same "placeholder for later" pattern used for error
  // logging in Section 15.10.
}
