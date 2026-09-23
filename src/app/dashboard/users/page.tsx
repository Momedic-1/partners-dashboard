"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { UserManagement } from "@/components/user-management";
import { PendingMembers } from "@/components/pending-members";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadExcel } from "@/components/upload-excel";
import { CreateUserForm } from "@/components/create-user-form";

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        heading="User Management"
        text="Manage members, bulk upload, or create a single user"
      />

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="inline-flex h-auto w-full flex-wrap gap-1 rounded-lg bg-slate-100 p-1 md:w-auto">
          <TabsTrigger
            value="users"
            className="rounded-md data-[state=active]:bg-[#020E7C] data-[state=active]:text-white"
          >
            All users
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="rounded-md data-[state=active]:bg-[#020E7C] data-[state=active]:text-white"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="upload"
            className="rounded-md data-[state=active]:bg-[#020E7C] data-[state=active]:text-white"
          >
            Upload Excel
          </TabsTrigger>
          <TabsTrigger
            value="create"
            className="rounded-md data-[state=active]:bg-[#020E7C] data-[state=active]:text-white"
          >
            Create user
          </TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <PendingMembers />
        </TabsContent>
        <TabsContent value="upload" className="space-y-4">
          <UploadExcel />
        </TabsContent>
        <TabsContent value="create" className="space-y-4">
          <CreateUserForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
