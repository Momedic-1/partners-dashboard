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
import {
  Download,
  Filter,
  Search,
  Loader2,
  User,
  Calendar,
  Clock,
  FileText,
  Stethoscope,
  Activity,
  TrendingUp,
  Users,
  RefreshCw,
  X,
  CheckCircle,
  XCircle,
  PlayCircle,
} from "lucide-react";
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

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSpecialtyFilter("all");
  };

  const hasActiveFilters =
    searchTerm !== "" || statusFilter !== "all" || specialtyFilter !== "all";

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Calculate statistics
  const completedCount = consultations.filter(
    (c) => c.status === "completed"
  ).length;
  const inProgressCount = consultations.filter(
    (c) => c.status === "in-progress"
  ).length;
  const cancelledCount = consultations.filter(
    (c) => c.status === "cancelled"
  ).length;
  const thisMonthCount = consultations.filter(
    (c) => new Date(c.date).getMonth() === new Date().getMonth()
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-0 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center sm:text-left"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-700 bg-clip-text text-transparent">
                Consultation Reports
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Comprehensive overview of all medical consultations
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => fetchConsultations()}
                variant="outline"
                className="bg-white/80 backdrop-blur-sm border-2 hover:border-purple-300 transition-all duration-200"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </motion.div>
          </div>

          {/* Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6"
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6" />
                  <div>
                    <p className="text-purple-100 text-sm">Total</p>
                    <p className="text-2xl font-bold">{consultations.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6" />
                  <div>
                    <p className="text-green-100 text-sm">Completed</p>
                    <p className="text-2xl font-bold">{completedCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <PlayCircle className="h-6 w-6" />
                  <div>
                    <p className="text-blue-100 text-sm">In Progress</p>
                    <p className="text-2xl font-bold">{inProgressCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6" />
                  <div>
                    <p className="text-amber-100 text-sm">This Month</p>
                    <p className="text-2xl font-bold">{thisMonthCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-white to-purple-50/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Consultation Database
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Track, filter, and export consultation records
                  </CardDescription>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg">
                        <Download className="mr-2 h-4 w-4" />
                        Export Data
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => alert("Download CSV")}
                      className="cursor-pointer"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => alert("Download PDF")}
                      className="cursor-pointer"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Export as PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="p-2 md:p-6">
              {/* Tabs and Search Controls */}
              <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-12"
                  >
                    <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200">
                      <TabsTrigger
                        value="all"
                        className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        All
                      </TabsTrigger>
                      <TabsTrigger
                        value="completed"
                        className="data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-md"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completed
                      </TabsTrigger>
                      <TabsTrigger
                        value="in-progress"
                        className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md"
                      >
                        <PlayCircle className="h-4 w-4 mr-1" />
                        In Progress
                      </TabsTrigger>
                      <TabsTrigger
                        value="cancelled"
                        className="data-[state=active]:bg-white data-[state=active]:text-red-700 data-[state=active]:shadow-md"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancelled
                      </TabsTrigger>
                    </TabsList>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-2"
                  >
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search consultations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/70 border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200 w-full sm:w-[250px]"
                      />
                    </div>

                    <div className="flex gap-2">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          onClick={() => setShowFilters(!showFilters)}
                          className="bg-white/70 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                        >
                          <Filter className="h-4 w-4 mr-2" />
                          Filters
                        </Button>
                      </motion.div>

                      {hasActiveFilters && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Clear
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Filter Panel */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: "auto", scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200/50"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Filter by Status
                          </label>
                          <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                          >
                            <SelectTrigger className="bg-white border-gray-200 focus:border-purple-300">
                              <SelectValue placeholder="Select status..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Statuses</SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                              <SelectItem value="in-progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="cancelled">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            Filter by Specialty
                          </label>
                          <Select
                            value={specialtyFilter}
                            onValueChange={setSpecialtyFilter}
                          >
                            <SelectTrigger className="bg-white border-gray-200 focus:border-purple-300">
                              <SelectValue placeholder="Select specialty..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                All Specialties
                              </SelectItem>
                              {specialties.map((specialty) => (
                                <SelectItem key={specialty} value={specialty}>
                                  {specialty}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <TabsContent value={activeTab} className="m-0">
                  {/* Table Container */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-gray-50 to-purple-50/50 border-gray-200">
                            <TableHead className="font-semibold text-gray-700">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Patient
                              </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              <div className="flex items-center gap-2">
                                <Stethoscope className="h-4 w-4" />
                                Doctor
                              </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4" />
                                Specialty
                              </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Date & Time
                              </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Status
                              </div>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading ? (
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                className="text-center py-12"
                              >
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="flex flex-col items-center gap-4"
                                >
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                      duration: 1,
                                      repeat: Infinity,
                                      ease: "linear",
                                    }}
                                  >
                                    <Loader2 className="w-8 h-8 text-purple-500" />
                                  </motion.div>
                                  <div className="text-center">
                                    <p className="text-lg font-medium text-gray-700">
                                      Loading Consultations
                                    </p>
                                    <p className="text-gray-500">
                                      Please wait while we fetch the data...
                                    </p>
                                  </div>
                                </motion.div>
                              </TableCell>
                            </TableRow>
                          ) : error ? (
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                className="text-center py-12"
                              >
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="flex flex-col items-center gap-4 text-red-500"
                                >
                                  <XCircle className="w-12 h-12" />
                                  <div className="text-center">
                                    <p className="text-lg font-medium">
                                      Error Loading Data
                                    </p>
                                    <p className="text-red-400">{error}</p>
                                  </div>
                                </motion.div>
                              </TableCell>
                            </TableRow>
                          ) : filteredConsultations.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                className="text-center py-12"
                              >
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="flex flex-col items-center gap-4 text-gray-400"
                                >
                                  <FileText className="w-12 h-12" />
                                  <div className="text-center">
                                    <p className="text-lg font-medium text-gray-600">
                                      No Consultations Found
                                    </p>
                                    <p>
                                      Try adjusting your search criteria or
                                      filters
                                    </p>
                                  </div>
                                </motion.div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredConsultations.map((consultation, index) => (
                              <motion.tr
                                key={consultation.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-purple-50/50 transition-colors duration-200 border-b border-gray-100"
                              >
                                <TableCell className="py-4">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border-2 border-purple-200">
                                      <AvatarImage
                                        src={
                                          consultation.patientAvatar ||
                                          "/placeholder.svg"
                                        }
                                        alt={consultation.patientName}
                                      />
                                      <AvatarFallback className="bg-gradient-to-r from-purple-400 to-blue-500 text-white font-semibold">
                                        {getInitials(consultation.patientName)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium text-gray-900">
                                        {consultation.patientName}
                                      </p>
                                      {consultation.patientEmail && (
                                        <p className="text-xs text-purple-600 font-medium">
                                          {consultation.patientEmail}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="py-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                                      <Stethoscope className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-medium text-gray-700">
                                      {consultation.doctorName}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-4">
                                  <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-blue-500" />
                                    <Badge
                                      variant="secondary"
                                      className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200"
                                    >
                                      {consultation.specialty}
                                    </Badge>
                                  </div>
                                </TableCell>
                                <TableCell className="py-4">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-4 h-4 text-indigo-500" />
                                      <p className="font-medium text-gray-700">
                                        {new Date(
                                          consultation.date
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock className="w-4 h-4 text-gray-400" />
                                      <p className="text-xs text-gray-500">
                                        {new Date(
                                          consultation.date
                                        ).toLocaleTimeString()}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="py-4">
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(consultation.status)}
                                    <Badge
                                      className={`${getStatusColor(
                                        consultation.status
                                      )} font-medium`}
                                    >
                                      {consultation.status
                                        .charAt(0)
                                        .toUpperCase() +
                                        consultation.status.slice(1)}
                                    </Badge>
                                  </div>
                                </TableCell>
                              </motion.tr>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
