"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { ProfileForm } from "@/components/profile-form"
import { motion } from "framer-motion"

export default function ProfilePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6"
    >
      <DashboardHeader heading="Profile" text="Manage your personal information and preferences" />

      <ProfileForm />
    </motion.div>
  )
}
