"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { baseUrl } from "@/env";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import {
  // Edit,
  MoreHorizontal,
  Search,
  Trash2,
  Filter,
  // Download,
  // UserPlus,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  PhoneCall,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/AuthContext";

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateUploaded: string;
  avatarUrl?: string;
}

interface UserResponse {
  content: User[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [callLimit, setCallLimit] = useState<number>(5);
  const [callPeriod, setCallPeriod] = useState<string>("DAILY");
  const [callAccessEnabled, setCallAccessEnabled] = useState(true);
  const [isUpdatingCallSettings, setIsUpdatingCallSettings] = useState(false);
  const { user, token } = useAuth();

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      if (!user || !token) {
        setError("Not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const orgId = user.id;
        const res = await axios.get<UserResponse>(
          `${baseUrl}/api/organization/organization/${orgId}/users`,
          {
            params: { page: currentPage - 1, size: pageSize },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Sort users by dateUploaded in descending order (most recent first)
        const sortedUsers = res.data.content.sort((a, b) => {
          const dateA = new Date(a.dateUploaded || 0).getTime();
          const dateB = new Date(b.dateUploaded || 0).getTime();
          return dateB - dateA; // Descending order
        });

        setUsers(sortedUsers);
        setTotalPages(res.data.totalPages);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load users data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, pageSize, user, token]);

  const getInitials = (name: string | undefined) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "-";
    // Simple phone formatting for display
    return phone.replace(/(\+\d{1})(\d{3})(\d{3})(\d{4})/, "$1 ($2) $3-$4");
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const confirmDelete = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete || !user || !token) return;

    try {
      await axios.delete(
        `${baseUrl}/api/organization/organizations/${user.id}/users/${userToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((prev) => prev.filter((u) => u.id !== userToDelete));
      toast({
        title: "User deleted",
        description: "The user has been successfully removed.",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: "Unable to delete the user. Please try again.",
      });
    } finally {
      setUserToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openCallModal = (userId: string) => {
    console.log("Opening call modal for user:", userId); // Debug log
    setSelectedUserId(userId);
    setCallLimit(5); // Reset to default values
    setCallPeriod("DAILY");
    setCallAccessEnabled(true);
    setIsCallModalOpen(true);
  };

  const handleCallSettingsUpdate = async () => {
    if (!selectedUserId || !user || !token) return;

    setIsUpdatingCallSettings(true);

    try {
      // Set call access enabled/disabled
      await axios.patch(
        `${baseUrl}/api/call-access/${user.id}/patient/${selectedUserId}/call-access-enabled?enabled=${callAccessEnabled}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Set call limit and period
      await axios.post(
        `${baseUrl}/api/call-access/${user.id}/patient/${selectedUserId}/set-call-limit?callLimit=${callLimit}&period=${callPeriod}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Call settings updated",
        description: `Call access has been ${
          callAccessEnabled ? "enabled" : "disabled"
        } with a limit of ${callLimit} calls per ${callPeriod.toLowerCase()}.`,
      });

      setIsCallModalOpen(false);
    } catch (error) {
      console.error("Error updating call settings:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Unable to update call settings. Please try again.",
      });
    } finally {
      setIsUpdatingCallSettings(false);
    }
  };

  // Apply filtering and sorting
  const filtered = users
    .filter(
      (u) =>
        (u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false) ||
        (u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (u.phone?.includes(searchTerm) ?? false)
    )
    .sort((a, b) => {
      const dateA = new Date(a.dateUploaded || 0).getTime();
      const dateB = new Date(b.dateUploaded || 0).getTime();
      return dateB - dateA; // Most recent first
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            User Management
          </h1>
          <p className="text-gray-500">
            Manage and monitor your organization&#39;s users
          </p>
        </div>

        {/* <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 hidden sm:flex">
            <Download className="h-4 w-4" />
            Export
          </Button>

          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Add User</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div> */}
      </div>

      {/* Main Table Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="shadow-sm border-0 bg-white">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-semibold">
                  All Users
                </CardTitle>
              </div>

              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-80 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 whitespace-nowrap"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Loading users...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-2 text-2xl">⚠️</div>
                <p className="text-red-600 font-medium">{error}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-100">
                        <TableHead className="font-semibold text-gray-700 pl-6">
                          User
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Contact
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Date Added
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-right pr-6">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-12">
                            <div className="flex flex-col items-center text-gray-500">
                              <Search className="h-12 w-12 mb-4 text-gray-300" />
                              <p className="text-lg font-medium">
                                No users found
                              </p>
                              <p className="text-sm">
                                Try adjusting your search criteria
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        <AnimatePresence>
                          {filtered.map((u, i) => (
                            <motion.tr
                              key={u.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.3, delay: i * 0.05 }}
                              className="border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                              <TableCell className="pl-6">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10 border-2 border-gray-100">
                                    <AvatarImage
                                      src={u.avatarUrl || ""}
                                      alt={u.fullName}
                                    />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                                      {getInitials(u.fullName)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">
                                      {u.fullName || "Unnamed User"}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-3 w-3 text-gray-400" />
                                    <span className="text-gray-900 truncate">
                                      {u.email || "-"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-3 w-3 text-gray-400" />
                                    <span className="text-gray-500">
                                      {formatPhoneNumber(u.phone) || "-"}
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {formatDate(u.dateUploaded)}
                              </TableCell>
                              <TableCell className="text-right pr-6">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 cursor-pointer"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-48"
                                  >
                                    <DropdownMenuLabel>
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="gap-2 cursor-pointer"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        openCallModal(u.id);
                                      }}
                                    >
                                      <PhoneCall className="h-4 w-4" />
                                      Set Call
                                    </DropdownMenuItem>
                                    {/* <DropdownMenuItem className="gap-2">
                                      <Edit className="h-4 w-4" />
                                      Edit User
                                    </DropdownMenuItem> */}
                                    <DropdownMenuItem
                                      className="gap-2 text-red-600 focus:text-red-600"
                                      onClick={() => confirmDelete(u.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Delete User
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4 p-4">
                  {filtered.length === 0 ? (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium text-gray-900">
                        No users found
                      </p>
                      <p className="text-sm text-gray-500">
                        Try adjusting your search criteria
                      </p>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {filtered.map((u, i) => (
                        <motion.div
                          key={u.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                        >
                          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <Avatar className="h-12 w-12 border-2 border-gray-100">
                                    <AvatarImage
                                      src={u.avatarUrl || ""}
                                      alt={u.fullName}
                                    />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                                      {getInitials(u.fullName)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="font-semibold text-gray-900 truncate">
                                        {u.fullName || "Unnamed User"}
                                      </h3>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail className="h-3 w-3" />
                                        <span className="truncate">
                                          {u.email || "-"}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="h-3 w-3" />
                                        <span>
                                          {formatPhoneNumber(u.phone) || "-"}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar className="h-3 w-3" />
                                        <span>
                                          Added {formatDate(u.dateUploaded)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      className="gap-2 cursor-pointer"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        openCallModal(u.id);
                                      }}
                                    >
                                      <PhoneCall className="h-4 w-4" />
                                      Set Call
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="gap-2 text-red-600"
                                      onClick={() => confirmDelete(u.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="border-t border-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-700">
                        Showing {(currentPage - 1) * pageSize + 1} to{" "}
                        {Math.min(currentPage * pageSize, filtered.length)} of{" "}
                        {filtered.length} results
                      </p>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                          className="gap-1"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="hidden sm:inline">Previous</span>
                        </Button>

                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }

                              return (
                                <Button
                                  key={pageNum}
                                  variant={
                                    pageNum === currentPage
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() => handlePageChange(pageNum)}
                                  className={`w-8 h-8 p-0 ${
                                    pageNum === currentPage
                                      ? "bg-blue-600 hover:bg-blue-700"
                                      : ""
                                  }`}
                                >
                                  {pageNum}
                                </Button>
                              );
                            }
                          )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === totalPages}
                          onClick={() => handlePageChange(currentPage + 1)}
                          className="gap-1"
                        >
                          <span className="hidden sm:inline">Next</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isCallModalOpen} onOpenChange={setIsCallModalOpen}>
        <DialogContent className="sm:max-w-[500px] z-50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Call Settings
            </DialogTitle>
            <DialogDescription>
              Configure call access and limits for this user
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Call Access Toggle */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Call Access</Label>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {callAccessEnabled ? "Enabled" : "Disabled"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {callAccessEnabled
                      ? "User can make calls within the set limits"
                      : "User cannot make any calls"}
                  </p>
                </div>
                <Switch
                  checked={callAccessEnabled}
                  onCheckedChange={setCallAccessEnabled}
                />
              </div>
            </div>

            {/* Call Limit Settings */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Call Limits</Label>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="callLimit" className="text-sm">
                    Number of Calls
                  </Label>
                  <Input
                    id="callLimit"
                    type="number"
                    min="1"
                    max="100"
                    value={callLimit}
                    onChange={(e) => setCallLimit(Number(e.target.value))}
                    className="w-full"
                    disabled={!callAccessEnabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="period" className="text-sm">
                    Period
                  </Label>
                  <Select
                    value={callPeriod}
                    onValueChange={setCallPeriod}
                    disabled={!callAccessEnabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DAILY">Daily</SelectItem>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="YEARLY">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Summary:</strong>{" "}
                  {callAccessEnabled
                    ? `User can make ${callLimit} calls per ${callPeriod.toLowerCase()}`
                    : "User cannot make any calls"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsCallModalOpen(false)}
              disabled={isUpdatingCallSettings}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCallSettingsUpdate}
              disabled={isUpdatingCallSettings}
              className="gap-2"
            >
              {isUpdatingCallSettings && (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              )}
              Update Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-gray-900">
              Delete User Account
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              This action cannot be undone. The user&#39;s account and all
              associated data will be permanently removed from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="mr-2 cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500 cursor-pointer"
              onClick={handleDeleteUser}
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
