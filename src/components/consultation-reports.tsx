
"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Filter, Search, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "@/lib/axios";
import { baseUrl } from "@/env";
import { useAuth } from "@/AuthContext";

interface Consultation {
  id: string;
  patientName: string;
  patientEmail: string;
  patientAvatar?: string;
  doctorName: string;
  doctorAvatar?: string;
  specialty: string;
  date: string;
  duration: number;
  status: string;
}

export function ConsultationReports() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, token } = useAuth();

  const specialties = Array.from(
    new Set(consultations.map((c) => c.specialty))
  );

  const fetchConsultations = async () => {
    setLoading(true);
    setError("");

    if (!user || !token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const organizationId = user?.id;
    if (!organizationId) {
      setError("Organization ID not found.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${baseUrl}/api/organization/consultations/full/${organizationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Transform the flat array into Consultation[]

      const transformed: Consultation[] = response.data
        .map((item: any, idx: number) => ({
          id: String(idx),
          patientName: item.patientName || "",
          patientEmail: "",
          patientAvatar: "",
          doctorName: item.doctorName || "",
          doctorAvatar: "",
          specialty: item.specialization || "",
          date: item.dateTime || new Date().toISOString(),
          duration: 0,
          status: item.status || "completed",
        }))
        .sort((a: Consultation, b: Consultation) => {
  // Sort by date in descending order (newest first)
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});

      setConsultations(transformed);

      setConsultations(transformed);
    } catch (err: any) {
      console.error("Error fetching consultations:", err);
      setError("Failed to load consultations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [user, token]);

  const filteredConsultations = consultations.filter((c) => {
    const matchSearch =
      c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.specialty.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchSpecialty =
      specialtyFilter === "all" || c.specialty === specialtyFilter;
    const matchTab =
      activeTab === "all" ||
      (activeTab === "completed" && c.status === "completed") ||
      (activeTab === "in-progress" && c.status === "in-progress") ||
      (activeTab === "cancelled" && c.status === "cancelled");

    return matchSearch && matchStatus && matchSpecialty && matchTab;
  });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Consultation Reports</CardTitle>
            <CardDescription className="pt-2">
              View detailed reports of all consultations
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="cursor-pointer" variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => alert("Download CSV")}>
                Download CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("Download PDF")}>
                Download PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <div className="flex flex-wrap justify-between gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search consultations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-[200px]"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-4 bg-muted/50 rounded-md flex flex-wrap gap-4"
                >
                  <div className="flex items-center gap-2">
                    <span>Status:</span>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>Specialty:</span>
                    <Select
                      value={specialtyFilter}
                      onValueChange={setSpecialtyFilter}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {specialties.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <TabsContent value={activeTab} className="m-0">
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Specialty</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                          <p>Loading consultations...</p>
                        </TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-red-500"
                        >
                          {error}
                        </TableCell>
                      </TableRow>
                    ) : filteredConsultations.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No consultations found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredConsultations.map((c, i) => (
                        <TableRow key={c.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={c.patientAvatar || "/placeholder.svg"}
                                  alt={c.patientName}
                                />
                                <AvatarFallback>
                                  {getInitials(c.patientName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{c.patientName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {c.patientEmail}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{c.doctorName}</TableCell>
                          <TableCell>{c.specialty}</TableCell>
                          <TableCell>
                            <p>{new Date(c.date).toLocaleDateString()}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(c.date).toLocaleTimeString()}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge>
                              {c.status.charAt(0).toUpperCase() +
                                c.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
