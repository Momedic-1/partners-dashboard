"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: ReactNode;
}

export function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-6 flex flex-col gap-4 pl-12 md:pl-0 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="min-w-0 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#020E7C]/70">
          MedFair Partners
        </p>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
          {heading}
        </h1>
        {text && <p className="max-w-2xl text-sm text-slate-500 sm:text-base">{text}</p>}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      )}
    </motion.header>
  );
}
