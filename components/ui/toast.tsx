"use client";

import * as React from "react";
import { Toast as ToastPrimitive } from "radix-ui";
import { FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";

type ToastVariant = "default" | "success" | "error";

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

let listeners: ((items: ToastItem[]) => void)[] = [];
let toasts: ToastItem[] = [];
let idCounter = 0;

function emit() {
  listeners.forEach((listener) => listener(toasts));
}

function addToast(title: string, description: string | undefined, variant: ToastVariant) {
  const id = ++idCounter;
  toasts = [...toasts, { id, title, description, variant }];
  emit();
  setTimeout(() => removeToast(id), 5000);
}

function removeToast(id: number) {
  toasts = toasts.filter((item) => item.id !== id);
  emit();
}

export const toast = {
  success: (title: string, description?: string) => addToast(title, description, "success"),
  error: (title: string, description?: string) => addToast(title, description, "error"),
  message: (title: string, description?: string) => addToast(title, description, "default"),
};

const VARIANT_STYLES: Record<ToastVariant, string> = {
  default: "border-border bg-card",
  success: "border-brand-success-solid/40 bg-card",
  error: "border-brand-error/40 bg-card",
};

const VARIANT_ICON_COLOR: Record<ToastVariant, string> = {
  default: "text-primary",
  success: "text-brand-success-solid",
  error: "text-brand-error",
};

export function Toaster() {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  React.useEffect(() => {
    listeners.push(setItems);
    return () => {
      listeners = listeners.filter((listener) => listener !== setItems);
    };
  }, []);

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {items.map((item) => {
        const Icon = item.variant === "error" ? FiAlertCircle : FiCheckCircle;
        return (
          <ToastPrimitive.Root
            key={item.id}
            onOpenChange={(open) => {
              if (!open) removeToast(item.id);
            }}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-4 shadow-md",
              VARIANT_STYLES[item.variant]
            )}
          >
            <Icon
              className={cn("mt-0.5 shrink-0", VARIANT_ICON_COLOR[item.variant])}
              size={18}
              aria-hidden="true"
            />
            <div className="flex-1">
              <ToastPrimitive.Title className="text-sm font-medium text-foreground">
                {item.title}
              </ToastPrimitive.Title>
              {item.description && (
                <ToastPrimitive.Description className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </ToastPrimitive.Description>
              )}
            </div>
            <ToastPrimitive.Close
              aria-label="Dismiss"
              className="text-muted-foreground hover:text-foreground"
            >
              <FiX size={16} />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        );
      })}
      <ToastPrimitive.Viewport className="fixed right-0 bottom-0 z-100 flex w-full max-w-sm flex-col gap-2 p-4 outline-none" />
    </ToastPrimitive.Provider>
  );
}
