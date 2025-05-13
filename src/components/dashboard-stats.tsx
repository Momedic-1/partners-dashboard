"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, Calendar, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

export function DashboardStats() {
  // This would be fetched from your API in a real application
  const stats = [
    {
      title: "Active Users",
      value: "124",
      change: "+12%",
      trend: "up",
      icon: Users,
      description: "from last month",
    },
    {
      title: "Consultations",
      value: "432",
      change: "+8%",
      trend: "up",
      icon: Calendar,
      description: "from last month",
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="card-hover"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className={`mr-1 ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>{stat.change}</span>
                <span>{stat.description}</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
