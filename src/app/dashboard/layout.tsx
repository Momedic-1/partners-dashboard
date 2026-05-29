"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { UserProfileProvider } from "@/components/user-profile-context";
import { NotificationsProvider } from "@/components/notifications-context";
import {
  SidebarProvider,
  useSidebar,
} from "@/components/sidebar-layout-context";

function DashboardMain({ children }: { children: React.ReactNode }) {
  const { sidebarWidth, isMobile } = useSidebar();

  return (
    <div
      className="flex min-h-screen min-w-0 flex-1 flex-col transition-[margin-left] duration-200 ease-in-out"
      style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
    >
      <main className="min-w-0 flex-1 overflow-x-hidden px-4 pb-6 pt-14 md:px-8 md:py-8">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="partner-shell flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#020E7C] border-t-transparent" />
      </div>
    );
  }

  return (
    <NotificationsProvider>
      <UserProfileProvider>
        <SidebarProvider>
          <div className="partner-shell flex min-h-screen overflow-x-hidden">
            <DashboardSidebar />
            <DashboardMain>{children}</DashboardMain>
          </div>
        </SidebarProvider>
      </UserProfileProvider>
    </NotificationsProvider>
  );
}
