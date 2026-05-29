"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
import {
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
  useSidebar,
} from "@/components/sidebar-layout-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/AuthContext";

// ✅ Define the route type so `badge` always exists
type Route = {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  badge?: number | null;
  color: string;
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar, isMobile } = useSidebar();
  const { userProfile } = useUserProfile();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const sidebarWidth = isMobile
    ? SIDEBAR_WIDTH_EXPANDED
    : isCollapsed
      ? SIDEBAR_WIDTH_COLLAPSED
      : SIDEBAR_WIDTH_EXPANDED;

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
      color: "from-[#020E7C] to-[#3b82f6]",
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
      {!isCollapsed && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
          aria-hidden
        />
      )}

      <aside
        style={{ width: sidebarWidth }}
        className={cn(
          "fixed top-0 left-0 z-50 flex h-screen flex-col border-r border-slate-200/60",
          "bg-gradient-to-b from-slate-50 via-white to-slate-50 shadow-xl shadow-slate-200/40",
          "transition-[width,transform] duration-200 ease-in-out",
          isMobile && isCollapsed && "-translate-x-full",
          isMobile && !isCollapsed && "translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex h-18 items-center border-b px-4 bg-gradient-to-r from-[#020E7C] via-[#1e40af] to-[#3b82f6]">
          <Link href="/dashboard" className="flex items-center gap-3 font-bold">
            {!isCollapsed ? (
              <Image
                src="/medfair.svg"
                alt="MedFair"
                width={120}
                height={36}
                className="brightness-0 invert"
                priority
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-sm font-bold text-white">
                M
              </div>
            )}
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-white"
            onClick={toggleSidebar}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-auto py-6 px-3">
          <TooltipProvider delayDuration={100}>
            <nav className="grid items-start gap-2">
              {routes.map((route) => (
                <div key={route.href}>
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
                </div>
              ))}
            </nav>
          </TooltipProvider>
        </div>

        {/* User */}
        <div className="mt-auto border-t border-slate-200/60 bg-gradient-to-r from-slate-50 to-white">
          <div className="p-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12 border-3 border-gradient-to-r from-[#020E7C] to-[#3b82f6] shadow-lg">
                  <AvatarFallback className="bg-gradient-to-r from-[#020E7C] to-[#1e40af] text-white text-lg font-bold">
                    {userProfile?.firstName?.charAt(0) || "P"}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
              </div>

              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {userProfile?.firstName || "Partner"}
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs font-medium text-green-600">
                      Online
                    </span>
                  </div>
                </div>
              )}
            </div>

            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
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
                      <LogOut className="mr-2 h-4 w-4" />
                      {!isCollapsed && (
                        <span className="font-semibold">Log out</span>
                      )}
                    </Button>
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
      </aside>

      {isMobile && (
        <div className="fixed top-4 left-4 z-[60] md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="border border-slate-200 bg-white text-[#020E7C] shadow-md hover:bg-slate-50"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      )}
    </>
  );
}
