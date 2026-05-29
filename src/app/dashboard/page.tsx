"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecentUsers } from "@/components/recent-users";
import { DashboardGreeting } from "@/components/dashboard-greeting";
import { DashboardOverview } from "@/components/dashboard-overview";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        heading="Dashboard"
        text="Overview of your partner account"
      />

      <DashboardGreeting />
      <DashboardOverview />

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="inline-flex h-auto w-full gap-1 rounded-lg bg-slate-100 p-1 md:w-auto">
          <TabsTrigger
            value="users"
            className="rounded-md data-[state=active]:bg-[#020E7C] data-[state=active]:text-white"
          >
            Recent consultations
          </TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-4">
          <RecentUsers />
        </TabsContent>
      </Tabs>
    </div>
  );
}
