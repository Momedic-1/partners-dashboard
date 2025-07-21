"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { baseUrl } from "@/env";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Avatar } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { Edit, MoreHorizontal, Search, Trash2 } from "lucide-react";
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

  // const getInitials = (name: string | undefined) => {
  //   // Check if name is defined before using split
  //   if (!name) return "??";

  //   return name
  //     .split(" ")
  //     .map((n) => n[0])
  //     .join("")
  //     .toUpperCase();
  // };

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

  // const handleDeleteUser = () => {
  //   if (!userToDelete) return;
  //   // call delete endpoint if available, else just update UI
  //   setUsers(users.filter((u) => u.id !== userToDelete));
  //   toast({ title: "User deleted", description: "The user has been deleted." });
  //   setUserToDelete(null);
  //   setIsDeleteDialogOpen(false);
  // };

  // Apply sorting to filtered results as well
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
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage your registered users</CardDescription>
          </div>
          {/* <Button className="flex items-center cursor-pointer gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Add User</span>
          </Button> */}
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-full -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center text-muted-foreground">
                            <Search className="h-8 w-8 mb-2" />
                            <p>No users found</p>
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
                            className="table-row-hover"
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  {/* <AvatarImage src={u.avatarUrl || "/placeholder.svg"} alt={u.fullName || "User"} />
                                <AvatarFallback>{getInitials(u.fullName)}</AvatarFallback> */}
                                </Avatar>
                                <span className="font-medium">
                                  {u.fullName || "Unnamed User"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{u.email || "-"}</TableCell>
                            <TableCell>{u.phone || "-"}</TableCell>
                            <TableCell>
                              {u.dateUploaded
                                ? new Date(u.dateUploaded).toLocaleDateString()
                                : "-"}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="cursor-pointer"
                                  >
                                    <MoreHorizontal />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="flex items-center gap-2">
                                    <Edit /> Edit User
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="flex items-center gap-2 text-destructive"
                                    onClick={() => confirmDelete(u.id)}
                                  >
                                    <Trash2 /> Delete User
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

              {/* Pagination */}
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="cursor-pointer"
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Button
                      key={p}
                      variant={p === currentPage ? "secondary" : "ghost"}
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </Button>
                  )
                )}
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="cursor-pointer"
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={handleDeleteUser}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
