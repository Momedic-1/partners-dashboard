"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { NotificationsList } from "@/components/notifications-list"
import { motion } from "framer-motion"

export default function NotificationsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6"
    >
      <DashboardHeader heading="Notifications" text="Stay updated with important alerts and messages" />

      <NotificationsList />
    </motion.div>
  )
}
