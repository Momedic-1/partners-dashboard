"use client"

import { CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

// Mock transaction data - just showing the most recent 5
const recentTransactions = [
  {
    id: "TX123456",
    date: "2023-05-10T10:30:00",
    type: "credit",
    amount: 50000,
    status: "completed",
    description: "Wallet funding",
  },
  {
    id: "TX123457",
    date: "2023-05-09T14:20:00",
    type: "debit",
    amount: 2500,
    status: "completed",
    description: "Consultation fee - Dr. Johnson",
  },
  {
    id: "TX123458",
    date: "2023-05-08T09:15:00",
    type: "debit",
    amount: 3000,
    status: "completed",
    description: "Consultation fee - Dr. Smith",
  },
  {
    id: "TX123459",
    date: "2023-05-07T16:45:00",
    type: "credit",
    amount: 20000,
    status: "completed",
    description: "Wallet funding",
  },
  {
    id: "TX123460",
    date: "2023-05-06T11:30:00",
    type: "debit",
    amount: 2000,
    status: "pending",
    description: "Consultation fee - Dr. Williams",
  },
]

export function RecentTransactions() {
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
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your most recent wallet transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div variants={container} initial="hidden" animate="show" className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <motion.tr key={transaction.id} variants={item} className="table-row-hover">
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className={transaction.type === "credit" ? "text-green-600" : "text-red-600"}>
                    {transaction.type === "credit" ? "+" : "-"}₦{transaction.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {transaction.status === "completed" ? (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 flex items-center gap-1"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Completed</span>
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 flex items-center gap-1"
                        >
                          <Clock className="h-3 w-3" />
                          <span>Pending</span>
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </CardContent>
    </Card>
  )
}
