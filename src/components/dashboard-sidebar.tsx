"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserProfile } from "@/components/user-profile-context";
// import { useNotifications } from "@/components/notifications-context";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { userProfile } = useUserProfile();
  // const { unreadCount } = useNotifications();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Check if sidebar state is saved in localStorage
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState) {
      setIsCollapsed(savedState === "true");
    }

    // Handle mobile detection and sidebar state
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    // Clear stored user data
    localStorage.removeItem("userData");
    localStorage.removeItem("token"); // if you're storing a token

    // Redirect to login page
    window.location.href = "/auth/login";
  };

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  };

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
    // {
    //   href: "/dashboard/notifications",
    //   icon: Bell,
    //   title: "Notifications",
    //   badge: unreadCount,
    // },
    {
      href: "/dashboard/profile",
      icon: User,
      title: "Profile",
    },
  ];

  if (!isMounted) return null;

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <motion.div
        initial={false}
        animate={{
          width: isCollapsed ? (isMobile ? 0 : 80) : 280,
          x: isCollapsed && isMobile ? -280 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed top-0 left-0 h-screen border-r bg-white flex flex-col z-50 shadow-sm",
          isMobile && "md:relative"
        )}
      >
        <div className="flex h-16 items-center border-b px-4 bg-[#020E7C]">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <FileSpreadsheet className="h-6 w-6 text-white" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-white"
                >
                  Partner&lsquo;s Portal
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto hover:bg-white/10 text-white"
            onClick={toggleSidebar}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex-1 overflow-auto py-4 px-3">
          <TooltipProvider delayDuration={0}>
            <nav className="grid items-start gap-2">
              {routes.map((route) => (
                <Tooltip key={route.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={route.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-md px-3 py-2.5 transition-all",
                        pathname === route.href
                          ? "bg-[#020E7C] text-white"
                          : "text-gray-600 hover:bg-gray-50 hover:text-[#020E7C]",
                        "relative"
                      )}
                      onClick={() => isMobile && toggleSidebar()}
                    >
                      <route.icon
                        className={cn(
                          "h-5 w-5",
                          pathname === route.href
                            ? "text-white"
                            : "text-gray-500 group-hover:text-[#020E7C]"
                        )}
                      />

                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 font-medium"
                          >
                            {route.title}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {route.badge && route.badge > 0 && (
                        <Badge
                          className={cn(
                            "ml-auto",
                            pathname === route.href
                              ? "bg-white text-[#020E7C]"
                              : "bg-[#020E7C] text-white"
                          )}
                        >
                          {route.badge}
                        </Badge>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && !isMobile && (
                    <TooltipContent
                      side="right"
                      className="bg-[#020E7C] text-white"
                    >
                      <p>{route.title}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </nav>
          </TooltipProvider>
        </div>

        <div className="mt-auto p-4 border-t bg-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10 border-2 border-[#020E7C]">
            {/* <AvatarImage src={userProfile?.avatarUrl || "/placeholder.svg"} alt={userProfile?.f} /> */}
            <AvatarFallback className="bg-[#020E7C] text-white">
                {userProfile?.firstName?.charAt(0) || "P"}
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
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {userProfile?.firstName || "Partner"}
                  </p>
                  {/* <p className="text-xs text-gray-500 truncate">{"Hospital"}</p> */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start border-[#020E7C] text-[#020E7C] hover:bg-[#020E7C] hover:text-white cursor-pointer",
                    isCollapsed && "justify-center px-0"
                  )}
                  size="sm"
                  onClick={handleLogout} // 👈 Add this line
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
              {isCollapsed && !isMobile && (
                <TooltipContent
                  side="right"
                  className="bg-[#020E7C] text-white"
                >
                  <p>Log out</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>

      {/* Mobile menu button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden bg-[#020E7C] text-white hover:bg-[#020E7C]/90"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
    </>
  );
}
