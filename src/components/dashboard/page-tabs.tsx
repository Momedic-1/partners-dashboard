"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface PageTab {
  value: string;
  label: string;
}

interface PageTabsProps {
  tabs: PageTab[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function PageTabs({
  tabs,
  value,
  defaultValue,
  onValueChange,
  className,
}: PageTabsProps) {
  return (
    <Tabs
      value={value}
      defaultValue={defaultValue ?? tabs[0]?.value}
      onValueChange={onValueChange}
      className={className}
    >
      <TabsList
        className={cn(
          "inline-flex h-auto w-full flex-wrap gap-1 rounded-lg bg-slate-100 p-1 md:w-auto",
          "grid-cols-none"
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-md px-4 py-2 text-sm font-medium data-[state=active]:bg-[#020E7C] data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
