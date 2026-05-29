"use client";

import type { ReactNode } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataToolbarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFilterClick?: () => void;
  filterActive?: boolean;
  showFilters?: boolean;
  filterPanel?: ReactNode;
  extra?: ReactNode;
  className?: string;
}

export function DataToolbar({
  searchPlaceholder = "Search…",
  searchValue,
  onSearchChange,
  onFilterClick,
  filterActive,
  showFilters,
  filterPanel,
  extra,
  className,
}: DataToolbarProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 border-slate-200 bg-slate-50/80 pl-9 focus-visible:ring-[#020E7C]/30"
          />
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          {onFilterClick && (
            <Button
              type="button"
              variant="outline"
              onClick={onFilterClick}
              className={cn(
                "h-10 border-slate-200",
                (showFilters || filterActive) && "border-[#020E7C]/40 bg-[#020E7C]/5 text-[#020E7C]"
              )}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          )}
          {extra}
        </div>
      </div>
      {showFilters && filterPanel && (
        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
          {filterPanel}
        </div>
      )}
    </div>
  );
}
