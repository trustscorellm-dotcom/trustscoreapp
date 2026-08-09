"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { FiImage } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface LazyImageProps extends Omit<ImageProps, "onError"> {
  fallbackLabel?: string;
}

export function LazyImage({
  fallbackLabel,
  alt,
  className,
  fill,
  ...props
}: LazyImageProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    const label =
      fallbackLabel ?? (typeof alt === "string" ? alt : "Image coming soon");

    return (
      <div
        role="img"
        aria-label={label}
        className={cn(
          "flex flex-col items-center justify-center gap-2 border border-dashed border-border bg-muted text-muted-foreground",
          fill && "absolute inset-0",
          className
        )}
      >
        <FiImage size={24} aria-hidden="true" />
        <span className="px-4 text-center text-xs">{label}</span>
      </div>
    );
  }

  return (
    <Image
      alt={alt}
      className={className}
      fill={fill}
      onError={() => setErrored(true)}
      {...props}
    />
  );
}
