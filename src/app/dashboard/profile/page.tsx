"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { ProfileForm } from "@/components/profile-form"

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader heading="Profile" text="View organization and admin account details" />

      <ProfileForm />
    </div>
  )
}
