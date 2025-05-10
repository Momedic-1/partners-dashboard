"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { UserManagement } from "@/components/user-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadExcel } from "@/components/upload-excel"
import { CreateUserForm } from "@/components/create-user-form"
import { motion } from "framer-motion"

export default function UsersPage() {
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
      <DashboardHeader heading="User Management" text="Manage your users and upload user data" />

      <motion.div variants={item}>
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3 md:grid-cols-none">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="upload">Upload Excel</TabsTrigger>
            <TabsTrigger value="create">Create User</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>
          <TabsContent value="upload" className="space-y-4">
            <UploadExcel />
          </TabsContent>
          <TabsContent value="create" className="space-y-4">
            <CreateUserForm />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
