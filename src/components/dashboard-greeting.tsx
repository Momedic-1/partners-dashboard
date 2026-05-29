"use client";

import { useUserProfile } from "@/components/user-profile-context";
import { useAuth } from "@/AuthContext";
import { useState, useEffect } from "react";
import { Building2, Calendar, Loader2 } from "lucide-react";

export function DashboardGreeting() {
  const { userProfile } = useUserProfile();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [currentTime]);

  const fallbackName =
    user?.name?.trim() ||
    user?.email?.split("@")[0] ||
    "Partner";
  const fullName = userProfile
    ? `${userProfile.firstName}${userProfile.lastName ? ` ${userProfile.lastName}` : ""}`.trim()
    : fallbackName;
  const orgName =
    userProfile?.organizationName ||
    (user?.organizationName as string) ||
    "Your organization";

  if (!user && !userProfile) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-8">
        <Loader2 className="h-6 w-6 animate-spin text-[#020E7C]" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#020E7C] via-[#1e40af] to-[#3b82f6] p-6 text-white shadow-lg shadow-[#020E7C]/20 md:p-8">
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-blue-300/20 blur-2xl" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-100">Partner dashboard</p>
          <h2 className="mt-1 text-2xl font-bold md:text-3xl">
            {greeting}, {fullName}
          </h2>
          <p className="mt-2 flex items-center gap-2 text-sm text-blue-100/90">
            <Building2 className="h-4 w-4 shrink-0" />
            {orgName}
          </p>
        </div>

        <div className="flex flex-col gap-1 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm md:text-right">
          <div className="flex items-center gap-2 text-sm font-medium md:justify-end">
            <Calendar className="h-4 w-4" />
            {currentTime.toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <p className="text-lg font-semibold tabular-nums">
            {currentTime.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
