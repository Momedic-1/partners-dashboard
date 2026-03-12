"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { UserProfileProvider } from "@/components/user-profile-context";
import { NotificationsProvider } from "@/components/notifications-context";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <NotificationsProvider>
      <UserProfileProvider>
        <div className="flex min-h-screen bg-gray-50">
          <DashboardSidebar />
          <div className="flex-1 w-full md:ml-[280px] transition-all duration-300">
            <AnimatePresence mode="wait">
              <motion.main
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="p-4 md:p-8 overflow-hidden"
              >
                <div className="max-w-7xl mx-auto w-full">{children}</div>
              </motion.main>
            </AnimatePresence>
          </div>
        </div>
      </UserProfileProvider>
    </NotificationsProvider>
  );
}
