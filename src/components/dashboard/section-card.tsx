"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  noPadding?: boolean;
}

export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
  noPadding,
}: SectionCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm",
        className
      )}
    >
      {(title || actions) && (
        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            )}
            {description && (
              <p className="mt-0.5 text-sm text-slate-500">{description}</p>
            )}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn(!noPadding && "p-4 sm:p-6", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
