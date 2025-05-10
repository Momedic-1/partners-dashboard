"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/components/notifications-context"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
  const { unreadCount } = useNotifications()
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleSearch = () => {
    setShowSearch(!showSearch)
    if (showSearch) {
      setSearchQuery("")
    }
  }

  const handleNotificationsClick = () => {
    router.push("/dashboard/notifications")
  }

  if (!isMounted) return null

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="grid gap-1"
        >
          <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
          {text && <p className="text-muted-foreground">{text}</p>}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          {children}
          <Button variant="outline" size="icon" onClick={toggleSearch}>
            <Search className="h-[1.2rem] w-[1.2rem]" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNotificationsClick} className="relative">
            <Bell className="h-[1.2rem] w-[1.2rem]" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center badge-pulse bg-primary text-primary-foreground">
                {unreadCount}
              </Badge>
            )}
          </Button>
          <ModeToggle />
        </motion.div>
      </div>

      {showSearch && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Input
            placeholder="Search across dashboard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
            autoFocus
          />
        </motion.div>
      )}
    </div>
  )
}
