"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Home,
  LogOut,
  User,
  Users,
  Wallet,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserProfile } from "@/components/user-profile-context"
import { useNotifications } from "@/components/notifications-context"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { userProfile } = useUserProfile()
  const { unreadCount } = useNotifications()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Check if sidebar state is saved in localStorage
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState) {
      setIsCollapsed(savedState === "true")
    }

    // Set collapsed state on mobile by default
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("sidebarCollapsed", String(newState))
  }

  const routes = [
    {
      href: "/dashboard",
      icon: Home,
      title: "Dashboard",
    },
    {
      href: "/dashboard/wallet",
      icon: Wallet,
      title: "Wallet",
    },
    {
      href: "/dashboard/users",
      icon: Users,
      title: "Users",
    },
    {
      href: "/dashboard/reports",
      icon: BarChart3,
      title: "Reports",
    },
    {
      href: "/dashboard/notifications",
      icon: Bell,
      title: "Notifications",
      badge: unreadCount,
    },
    {
      href: "/dashboard/profile",
      icon: User,
      title: "Profile",
    },
  ]

  if (!isMounted) return null

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative h-screen border-r bg-card flex flex-col z-10"
    >
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <FileSpreadsheet className="h-6 w-6 text-primary" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                Partner Portal
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <Button variant="ghost" size="icon" className="ml-auto" onClick={toggleSidebar}>
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-2 px-2">
        <TooltipProvider delayDuration={0}>
          <nav className="grid items-start gap-1">
            {routes.map((route) => (
              <Tooltip key={route.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={route.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent",
                      pathname === route.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                      "relative",
                    )}
                  >
                    <route.icon
                      className={cn(
                        "h-5 w-5",
                        pathname === route.href
                          ? "text-primary-foreground"
                          : "text-muted-foreground group-hover:text-foreground",
                      )}
                    />

                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex-1"
                        >
                          {route.title}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {route.badge && route.badge > 0 && (
                      <Badge
                        className={cn(
                          "ml-auto badge-pulse",
                          pathname === route.href
                            ? "bg-primary-foreground text-primary"
                            : "bg-primary text-primary-foreground",
                        )}
                      >
                        {route.badge}
                      </Badge>
                    )}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    <p>{route.title}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </nav>
        </TooltipProvider>
      </div>

      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={userProfile?.avatarUrl || "/placeholder.svg"} alt={userProfile?.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userProfile?.name?.charAt(0) || "P"}
            </AvatarFallback>
          </Avatar>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium truncate">{userProfile?.name || "Partner"}</p>
                <p className="text-xs text-muted-foreground truncate">{userProfile?.hospitalName || "Hospital"}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start", isCollapsed && "justify-center px-0")}
                size="sm"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Log out
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <p>Log out</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  )
}
