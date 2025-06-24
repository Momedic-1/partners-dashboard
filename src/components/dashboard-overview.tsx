"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Wallet, Users, Calendar } from "lucide-react"
import Link from "next/link"
import axios from '@/lib/axios'
import { baseUrl } from '@/env'
import { useAuth } from '@/AuthContext'

export function DashboardOverview() {
  const { user, token } = useAuth()
  const orgId = user?.id

  const [walletBalance, setWalletBalance] = useState<number>(0)
  const [totalSpent] = useState(12500)
  const [activeUsers, setActiveUsers] = useState<number>(0)
  const [completedConsultations, setCompletedConsultations] = useState<number>(0)
  const [loadingStats, setLoadingStats] = useState(true)
  const [errorStats, setErrorStats] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function fetchStats() {
      if (!token || !orgId) {
        setLoadingStats(false)
        return
      }

      setLoadingStats(true)
      setErrorStats(null)

      try {
        const [usersRes, consultRes, balanceRes] = await Promise.all([
          axios.get<{ activeUsers: number }>(
            `${baseUrl}/api/organization/${orgId}/stats/users`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get<number>(
            `${baseUrl}/api/organization/${orgId}/consultations/completed-count`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get<{ balance: number }>(
            `${baseUrl}/api/organization/${orgId}/balance`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        ])

        setActiveUsers(usersRes.data.activeUsers ?? 0)
        setCompletedConsultations(consultRes.data ?? 0)
        setWalletBalance(balanceRes.data.balance ?? 0)
      } catch (err: any) {
        console.error('Error fetching dashboard stats', err)
        setErrorStats('Failed to load dashboard statistics')
      } finally {
        setLoadingStats(false)
      }
    }

    fetchStats()
  }, [token, orgId])

  if (!mounted) return null

  const stats = [
    {
      title: "Active Users",
      value: loadingStats ? '...' : activeUsers.toLocaleString(),
      icon: Users,
      link: '/dashboard/users',
      description: "current",
    },
    {
      title: "Consultations",
      value: loadingStats ? '...' : completedConsultations.toString(),
      icon: Calendar,
      link: '/dashboard/consultations',
      description: "completed",
    }
  ]

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <div className="transition-transform duration-300 hover:-translate-y-1 h-full">
        <Card className="overflow-hidden h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="pt-6 flex-grow">
            <div className="text-2xl font-bold">
              {loadingStats ? '...' : `₦${walletBalance.toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Available for consultations</p>
          </CardContent>
          <CardFooter className="mt-auto">
            <Link href="/dashboard/wallet" passHref className="w-full">
              <Button variant="outline" size="sm" className="cursor-pointer w-full">
                Fund Wallet
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {stats.map((stat) => (
        <div key={stat.title} className="transition-transform duration-300 hover:-translate-y-1 h-full">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-6 flex-grow">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Link href={stat.link} passHref className="w-full">
                <Button variant="outline" size="sm" className="cursor-pointer w-full">
                  View {stat.title}
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  )
}
