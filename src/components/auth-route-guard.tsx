"use client";

import { useAuth } from "@/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const PUBLIC_PREFIXES = ["/auth/login", "/auth/reset-password", "/auth/verify-reset-password"];

export function AuthRouteGuard({ children }: { children: React.ReactNode }) {
  const { token, user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const isPublic = PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
    const isChangePassword = pathname.startsWith("/auth/change-password");

    if (!token && !isPublic) {
      router.replace("/auth/login");
      return;
    }

    if (token && user?.mustChangePassword === true && !isChangePassword) {
      router.replace("/auth/change-password");
      return;
    }

    if (token && user?.mustChangePassword !== true && isChangePassword) {
      router.replace("/dashboard");
      return;
    }

    if (token && (pathname === "/" || pathname === "/auth/login")) {
      router.replace(
        user?.mustChangePassword === true ? "/auth/change-password" : "/dashboard"
      );
    }
  }, [loading, token, user, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#020E7C] border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
