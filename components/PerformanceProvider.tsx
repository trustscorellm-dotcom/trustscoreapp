"use client";

import { useCallback } from "react";
import { useReportWebVitals } from "next/web-vitals";
import { recordMetric } from "@/lib/performance/metrics";

type WebVitalsMetric = Parameters<Parameters<typeof useReportWebVitals>[0]>[0];

export function PerformanceProvider() {
  const handleMetric = useCallback((metric: WebVitalsMetric) => {
    recordMetric({
      id: metric.id,
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
    });
  }, []);

  useReportWebVitals(handleMetric);

  return null;
}
