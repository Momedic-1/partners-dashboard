"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { FundWalletForm } from "@/components/fund-wallet-form"
import { TransactionHistory } from "@/components/transaction-history"
import { WalletOverview } from "@/components/wallet-overview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

export default function WalletPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-6">
      <DashboardHeader heading="Wallet" text="Manage your wallet and view transaction history" />

      <motion.div variants={item}>
        <WalletOverview />
      </motion.div>

      <motion.div variants={item}>
        <Tabs defaultValue="fund" className="space-y-4">
          <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 md:grid-cols-none">
            <TabsTrigger value="fund">Fund Wallet</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>
          <TabsContent value="fund" className="space-y-4">
            <FundWalletForm />
          </TabsContent>
          <TabsContent value="history" className="space-y-4">
            <TransactionHistory />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
