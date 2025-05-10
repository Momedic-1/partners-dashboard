"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { UserProfileProvider } from "@/components/user-profile-context"
import { NotificationsProvider } from "@/components/notifications-context"
import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <NotificationsProvider>
      <UserProfileProvider>
        <div className="flex min-h-screen flex-col md:flex-row bg-background">
          <DashboardSidebar />
          <AnimatePresence mode="wait">
            <motion.main
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="flex-1 p-4 md:p-8 overflow-hidden"
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </div>
      </UserProfileProvider>
    </NotificationsProvider>
  )
}
