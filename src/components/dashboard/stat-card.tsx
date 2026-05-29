"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "brand" | "success" | "warning" | "neutral";
  className?: string;
}

const variants = {
  brand: "bg-[#020E7C] text-white",
  success: "bg-emerald-600 text-white",
  warning: "bg-amber-500 text-white",
  neutral: "bg-white text-slate-900 border border-slate-200",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  variant = "neutral",
  className,
}: StatCardProps) {
  const isNeutral = variant === "neutral";

  return (
    <div
      className={cn(
        "rounded-xl p-4 shadow-sm transition-shadow hover:shadow-md",
        variants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={cn(
              "text-sm font-medium",
              isNeutral ? "text-slate-500" : "text-white/80"
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              "mt-1 text-2xl font-bold tracking-tight",
              !isNeutral && "text-white"
            )}
          >
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            isNeutral ? "bg-[#020E7C]/10 text-[#020E7C]" : "bg-white/15"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
