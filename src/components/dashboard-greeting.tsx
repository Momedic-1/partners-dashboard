"use client"

import { useUserProfile } from "@/components/user-profile-context"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export function DashboardGreeting() {
  const { userProfile } = useUserProfile()
  const [greeting, setGreeting] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const hour = currentTime.getHours()

    if (hour < 12) {
      setGreeting("Good morning")
    } else if (hour < 18) {
      setGreeting("Good afternoon")
    } else {
      setGreeting("Good evening")
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [currentTime])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="bg-gradient-to-r from-primary/20 to-primary/5 border-none overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-2xl font-bold">
              {greeting}, {userProfile?.name || "Partner"}
            </h2>
            <p className="text-muted-foreground mt-1">Welcome to your partner dashboard</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-right"
          >
            <p className="text-sm font-medium">{formatDate(currentTime)}</p>
            <p className="text-sm text-muted-foreground">
              {currentTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}
