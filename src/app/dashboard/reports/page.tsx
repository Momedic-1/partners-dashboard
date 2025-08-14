"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { ConsultationReports } from "@/components/consultation-reports";
import { motion } from "framer-motion";

export default function ReportsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6"
    >
      <DashboardHeader
        heading="Reports"
        text="View consultation reports and statistics"
      />

      <ConsultationReports />
    </motion.div>
  );
}
