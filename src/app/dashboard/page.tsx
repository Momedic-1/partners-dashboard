"use client";

// import { WalletOverview } from "@/components/wallet-overview"
import { DashboardHeader } from "@/components/dashboard-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { RecentTransactions } from "@/components/recent-transactions"
import { RecentUsers } from "@/components/recent-users";

import { DashboardGreeting } from "@/components/dashboard-greeting";
import { DashboardOverview } from "@/components/dashboard-overview";
import { motion } from "framer-motion";

export default function Dashboard() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6"
    >
      <DashboardHeader
        heading="Dashboard"
        text="Overview of your partner account"
      />

      <motion.div variants={item}>
        <DashboardGreeting />
      </motion.div>

      <motion.div variants={item}>
        <DashboardOverview />
        {/* <WalletOverview /> */}
      </motion.div>

      <motion.div variants={item}>{/* <DashboardStats /> */}</motion.div>

      <motion.div variants={item}>
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 md:grid-cols-none">
            {/* <TabsTrigger value="transactions">Recent Transactions</TabsTrigger> */}
            <TabsTrigger value="users">Recent Users</TabsTrigger>
          </TabsList>
          {/* <TabsContent value="transactions" className="space-y-4">
            <RecentTransactions />
          </TabsContent> */}
          <TabsContent value="users" className="space-y-4">
            <RecentUsers />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
