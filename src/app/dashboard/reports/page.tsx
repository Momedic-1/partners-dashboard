"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { ConsultationReports } from "@/components/consultation-reports";

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        heading="Consultation reports"
        text="Filter by day, month, or year and review consultation records"
      />
      <ConsultationReports />
    </div>
  );
}
