"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Wallet, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"

export function WalletOverview() {
  // This would be fetched from your API in a real application
  const walletBalance = 25000
  const pendingAmount = 1500
  const totalSpent = 12500
  const monthlyBudget = 50000
  const percentUsed = (totalSpent / monthlyBudget) * 100

  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    hover: {
      y: -5,
      boxShadow:
        theme === "dark"
          ? "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)"
          : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="pt-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl font-bold"
            >
              ₦{walletBalance.toLocaleString()}
            </motion.div>
            <p className="text-xs text-muted-foreground mt-1">Available for consultations</p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/wallet" passHref className="w-full">
              <Button variant="outline" size="sm" className="w-full button-hover-effect">
                Fund Wallet
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-amber-500/10 to-amber-500/5">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="pt-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl font-bold"
            >
              ₦{pendingAmount.toLocaleString()}
            </motion.div>
            <p className="text-xs text-muted-foreground mt-1">In-progress consultations</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-500/10 to-green-500/5">
            <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="pt-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-2xl font-bold"
            >
              ₦{totalSpent.toLocaleString()} / ₦{monthlyBudget.toLocaleString()}
            </motion.div>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Used</span>
                <span>{percentUsed.toFixed(0)}%</span>
              </div>
              <Progress value={percentUsed} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
