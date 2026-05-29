"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export const SIDEBAR_WIDTH_EXPANDED = 280;
export const SIDEBAR_WIDTH_COLLAPSED = 80;

type SidebarContextValue = {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
  sidebarWidth: number;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    if (saved) setIsCollapsed(saved === "true");

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem("sidebarCollapsed", String(next));
  };

  const sidebarWidth = isMobile
    ? 0
    : isCollapsed
      ? SIDEBAR_WIDTH_COLLAPSED
      : SIDEBAR_WIDTH_EXPANDED;

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, toggleSidebar, isMobile, sidebarWidth }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return ctx;
}
