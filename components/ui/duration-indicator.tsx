"use client";
import type React from "react";

type DurationIndicatorProps = {
  seconds?: number | null;
  label?: string | null;
  size?: "xs" | "sm";
};

function formatDuration(totalSeconds?: number | null): string {
  if (totalSeconds == null || Number.isNaN(totalSeconds) || totalSeconds <= 0) return "Unknown";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function DurationIndicator({ seconds, label = "Duration", size = "sm" }: DurationIndicatorProps): React.ReactElement {
  const sizeClasses = { xs: "text-[0.5rem]", sm: "text-[0.6rem]" };
  return (
    <div className={`mt-1 uppercase ${sizeClasses[size]} text-primary-foreground/60`}>
      {label ? `${label}: ` : null}
      {formatDuration(seconds)}
    </div>
  );
}