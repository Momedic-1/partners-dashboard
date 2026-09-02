"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { SettingsPanel } from "@/components/settings-panel";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        heading="Settings"
        text="Account details, password, and organization admins"
      />
      <SettingsPanel />
    </div>
  );
}
