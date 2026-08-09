"use client";

import type { ReactNode } from "react";
import type { IconType } from "react-icons";

interface FormFieldProps {
  icon: IconType;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  rightSlot?: ReactNode;
}

export function FormField({
  icon: Icon,
  label,
  type,
  value,
  onChange,
  autoComplete,
  rightSlot,
}: FormFieldProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-medium text-foreground">{label}</span>
        {rightSlot}
      </div>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          size={16}
          aria-hidden="true"
        />
        <input
          type={type}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-md border border-border bg-background py-2.5 pr-3 pl-9 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
        />
      </div>
    </label>
  );
}
