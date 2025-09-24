"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Home,
  LogOut,
  User,
  Users,
  Wallet,
  Menu,
  Search,
  // Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUserProfile } from "@/components/user-profile-context";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

// ✅ Define the route type so badge always exists
type Route = {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  badge?: number | null;
  color: string;
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { userProfile } = useUserProfile();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState) {
      setIsCollapsed(savedState === "true");
    }

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
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  };

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  };

  const routes: Route[] = [
    {
      href: "/dashboard",
      icon: Home,
      title: "Dashboard",
      badge: null,
      color: "from-blue-500 to-purple-600",
    },
    {
      href: "/dashboard/wallet",
      icon: Wallet,
      title: "Wallet",
      badge: null,
      color: "from-green-500 to-emerald-600",
    },
    {
      href: "/dashboard/users",
      icon: Users,
      title: "Users",
      badge: null,
      color: "from-orange-500 to-red-600",
    },
    {
      href: "/dashboard/reports",
      icon: BarChart3,
      title: "Reports",
      badge: null,
      color: "from-purple-500 to-pink-600",
    },
    {
      href: "/dashboard/profile",
      icon: User,
      title: "Profile",
      badge: null,
      color: "from-indigo-500 to-blue-600",
    },
    {
      href: "/dashboard/investigations",
      icon: Search,
      title: "Investigations",
      badge: null,
      color: "from-teal-500 to-cyan-600",
    },
    {
      href: "/dashboard/medications",
      icon: FileSpreadsheet,
      title: "Medications",
      badge: null,
      color: "from-rose-500 to-pink-600",
    },
    // {
    //   href: "/dashboard/settings",
    //   icon: Settings,
    //   title: "Settings",
    //   badge: null,
    //   color: "from-gray-500 to-slate-600",
    // },
  ];

  if (!isMounted) return null;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!isCollapsed && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          width: isCollapsed ? (isMobile ? 0 : 80) : 300,
          x: isCollapsed && isMobile ? -300 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
          type: "spring",
          damping: 25,
        }}
        className={cn(
          "fixed top-0 left-0 h-screen border-r flex flex-col z-50",
          "bg-gradient-to-b from-slate-50 via-white to-slate-50",
          "shadow-2xl shadow-slate-200/50",
          "border-slate-200/60",
          isMobile && "md:relative"
        )}
      >
        {/* Header */}
        <div className="flex h-18 items-center border-b px-4 bg-gradient-to-r from-[#020E7C] via-[#1e40af] to-[#3b82f6]">
          <Link href="/dashboard" className="flex items-center gap-3 font-bold">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <FileSpreadsheet className="h-7 w-7 text-white" />
            </motion.div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-white"
                >
                  <span className="text-lg">Partner&#39;s Portal</span>
                  <div className="text-xs opacity-90">
                    Healthcare Management
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-white"
            onClick={toggleSidebar}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </motion.div>
          </Button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-auto py-6 px-3">
          <TooltipProvider 
          // delayDuration={100}
          >
            <nav className="grid items-start gap-2">
              {routes.map((route, index) => (
                <motion.div
                  key={route.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={route.href}
                        className={cn(
                          "group flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-300",
                          pathname === route.href
                            ? "bg-gradient-to-r from-[#020E7C] to-[#1e40af] text-white"
                            : "text-slate-600 hover:bg-white/80 hover:text-[#020E7C]"
                        )}
                        onClick={() => isMobile && toggleSidebar()}
                      >
                        <route.icon
                          className={cn(
                            "h-5 w-5",
                            pathname === route.href
                              ? "text-white"
                              : "text-slate-500 group-hover:text-[#020E7C]"
                          )}
                        />
                        {!isCollapsed && (
                          <div className="flex-1 flex items-center justify-between">
                            <span className="font-semibold">{route.title}</span>
                            {route.badge && route.badge > 0 && (
                              <Badge className="ml-auto bg-gradient-to-r from-red-500 to-pink-500 text-white">
                                {route.badge}
                              </Badge>
                            )}
                          </div>
                        )}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right">
                        <p>{route.title}</p>
                        {route.badge && <Badge>{route.badge}</Badge>}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </motion.div>
              ))}
            </nav>
          </TooltipProvider>
        </div>

        {/* User */}
        <div className="mt-auto border-t border-slate-200/60 bg-gradient-to-r from-slate-50 to-white">
          <div className="p-4">
            <motion.div
              className="flex items-center gap-3 mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="relative">
                <Avatar className="h-12 w-12 border-3 border-gradient-to-r from-[#020E7C] to-[#3b82f6] shadow-lg">
                  <AvatarFallback className="bg-gradient-to-r from-[#020E7C] to-[#1e40af] text-white text-lg font-bold">
                    {userProfile?.firstName?.charAt(0) || "P"}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
              </div>

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {userProfile?.firstName || "Partner"}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs text-green-600 font-medium">
                        Online
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <TooltipProvider 
            // delayDuration={100}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start transition-all duration-300",
                        "border-slate-300 text-slate-700 bg-white/80 backdrop-blur-sm",
                        "hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 hover:text-white hover:border-transparent",
                        "shadow-sm hover:shadow-md hover:shadow-red-200/50",
                        isCollapsed && "justify-center px-0"
                      )}
                      size="sm"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 cursor-pointer h-4 w-4" />
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="font-semibold cursor-pointer"
                          >
                            Log out
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent
                    side="right"
                    className="bg-slate-900 text-white border-slate-700"
                  >
                    <p>Log out</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </motion.div>

      {/* Enhanced mobile menu button */}
      {/* {isMobile && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed top-4 left-4 z-50 md:hidden"
        >
          <Button
            variant="ghost"
            size="icon"
            className="bg-gradient-to-r from-[#020E7C] to-[#1e40af] text-white hover:from-[#1e40af] hover:to-[#3b82f6] shadow-lg shadow-[#020E7C]/30 backdrop-blur-sm border border-white/20"
            onClick={toggleSidebar}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <Menu className="h-5 w-5" />
            </motion.div>
          </Button>
        </motion.div>
      )} */}
      {isMobile && (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="fixed top-4 left-4 z-50 md:hidden"
  >
    <Button
      variant="ghost"
      size="icon"
className="bg-transparent text-white/50 hover:bg-white/5 hover:text-white/70 backdrop-blur-sm border border-white/10"
      onClick={toggleSidebar}
    >
      <motion.div
        animate={{ rotate: isCollapsed ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        <Menu className="h-5 w-5" />
      </motion.div>
    </Button>
  </motion.div>
)}
    </>
  );
}