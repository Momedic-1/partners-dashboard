// "use client"

// import { CheckCircle2, Clock } from "lucide-react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { motion } from "framer-motion"

// // Mock transaction data - just showing the most recent 5
// const recentTransactions = [
//   {
//     id: "TX123456",
//     date: "2023-05-10T10:30:00",
//     type: "credit",
//     amount: 50000,
//     status: "completed",
//     description: "Wallet funding",
//   },
//   {
//     id: "TX123457",
//     date: "2023-05-09T14:20:00",
//     type: "debit",
//     amount: 2500,
//     status: "completed",
//     description: "Consultation fee - Dr. Johnson",
//   },
//   {
//     id: "TX123458",
//     date: "2023-05-08T09:15:00",
//     type: "debit",
//     amount: 3000,
//     status: "completed",
//     description: "Consultation fee - Dr. Smith",
//   },
//   {
//     id: "TX123459",
//     date: "2023-05-07T16:45:00",
//     type: "credit",
//     amount: 20000,
//     status: "completed",
//     description: "Wallet funding",
//   },
//   {
//     id: "TX123460",
//     date: "2023-05-06T11:30:00",
//     type: "debit",
//     amount: 2000,
//     status: "pending",
//     description: "Consultation fee - Dr. Williams",
//   },
// ]

// export function RecentTransactions() {
//   const container = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.05,
//       },
//     },
//   }

//   const item = {
//     hidden: { opacity: 0, y: 10 },
//     show: { opacity: 1, y: 0 },
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Recent Transactions</CardTitle>
//         <CardDescription>Your most recent wallet transactions</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <motion.div variants={container} initial="hidden" animate="show" className="rounded-md border overflow-hidden">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Date</TableHead>
//                 {/* <TableHead>Description</TableHead> */}
//                 <TableHead>Amount</TableHead>
//                 {/* <TableHead>Status</TableHead> */}
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {recentTransactions.map((transaction) => (
//                 <motion.tr key={transaction.id} variants={item} className="table-row-hover">
//                   <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
//                   {/* <TableCell>{transaction.description}</TableCell> */}
//                   <TableCell className={transaction.type === "credit" ? "text-green-600" : "text-red-600"}>
//                     {transaction.type === "credit" ? "+" : "-"}₦{transaction.amount.toLocaleString()}
//                   </TableCell>
                 
//                 </motion.tr>
//               ))}
//             </TableBody>
//           </Table>
//         </motion.div>
//       </CardContent>
//     </Card>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import axios from '@/lib/axios'
import { baseUrl } from '@/env'
import { useAuth } from '@/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Transaction {
  id: string
  date: string
  type: "credit" | "debit"
  amount: number
  status: string
  description: string
}

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user, token } = useAuth()

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  }
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true)
      setError("")

      if (!user || !token) {
        setError("Not authenticated")
        setLoading(false)
        return
      }

      const orgId = user.id
      if (!orgId) {
        setError("Organization not found")
        setLoading(false)
        return
      }

      try {
        const resp = await axios.get<Transaction[]>(
          `${baseUrl}/api/organization/${orgId}/transactions`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        // take most recent 5
        const sorted = resp.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setTransactions(sorted.slice(0, 5))
      } catch (err: any) {
        console.error(err)
        setError("Failed to load transactions")
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [user, token])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your most recent wallet transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading transactions...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(tx => (
                  <motion.tr key={tx.id} variants={item} className="table-row-hover">
                    <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                    <TableCell className={tx.type === "credit" ? "text-green-600" : "text-red-600"}>
                      {tx.type === "credit" ? "+" : "-"}₦{tx.amount.toLocaleString()}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

