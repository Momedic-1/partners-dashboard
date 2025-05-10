"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

// Mock user data
const recentUsers = [
  {
    id: "U12345",
    name: "John Smith",
    email: "john.smith@example.com",
    avatarUrl: "",
    consultationAmount: 2500,
    consultationDate: "2023-05-09T14:20:00",
  },
  {
    id: "U12346",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    avatarUrl: "",
    consultationAmount: 3000,
    consultationDate: "2023-05-08T09:15:00",
  },
  {
    id: "U12347",
    name: "Michael Brown",
    email: "m.brown@example.com",
    avatarUrl: "",
    consultationAmount: 2000,
    consultationDate: "2023-05-06T11:30:00",
  },
  {
    id: "U12348",
    name: "Emily Davis",
    email: "emily.d@example.com",
    avatarUrl: "",
    consultationAmount: 3500,
    consultationDate: "2023-05-05T15:45:00",
  },
  {
    id: "U12349",
    name: "Robert Wilson",
    email: "r.wilson@example.com",
    avatarUrl: "",
    consultationAmount: 2800,
    consultationDate: "2023-05-04T10:20:00",
  },
]

export function RecentUsers() {
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
        <CardDescription>Users who recently had consultations</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div variants={container} initial="hidden" animate="show" className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Consultation Date</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentUsers.map((user) => (
                <motion.tr key={user.id} variants={item} className="table-row-hover">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{new Date(user.consultationDate).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">₦{user.consultationAmount.toLocaleString()}</TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </CardContent>
    </Card>
  )
}
