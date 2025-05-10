"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Filter, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock consultation data
const consultations = [
  {
    id: "C12345",
    patientName: "John Smith",
    patientEmail: "john.smith@example.com",
    patientAvatar: "",
    doctorName: "Dr. Sarah Johnson",
    doctorAvatar: "",
    specialty: "Cardiology",
    date: "2023-05-10T10:30:00",
    duration: 30,
    status: "completed",
  },
  {
    id: "C12346",
    patientName: "Emily Davis",
    patientEmail: "emily.d@example.com",
    patientAvatar: "",
    doctorName: "Dr. Michael Brown",
    doctorAvatar: "",
    specialty: "Dermatology",
    date: "2023-05-09T14:20:00",
    duration: 45,
    status: "completed",
  },
  {
    id: "C12347",
    patientName: "Robert Wilson",
    patientEmail: "r.wilson@example.com",
    patientAvatar: "",
    doctorName: "Dr. Jennifer Lee",
    doctorAvatar: "",
    specialty: "Neurology",
    date: "2023-05-08T09:15:00",
    duration: 60,
    status: "completed",
  },
  {
    id: "C12348",
    patientName: "Sarah Johnson",
    patientEmail: "sarah.j@example.com",
    patientAvatar: "",
    doctorName: "Dr. David Taylor",
    doctorAvatar: "",
    specialty: "Orthopedics",
    date: "2023-05-07T16:45:00",
    duration: 30,
    status: "completed",
  },
  {
    id: "C12349",
    patientName: "Michael Brown",
    patientEmail: "m.brown@example.com",
    patientAvatar: "",
    doctorName: "Dr. Emily Davis",
    doctorAvatar: "",
    specialty: "Pediatrics",
    date: "2023-05-06T11:30:00",
    duration: 45,
    status: "cancelled",
  },
  {
    id: "C12350",
    patientName: "Jennifer Lee",
    patientEmail: "j.lee@example.com",
    patientAvatar: "",
    doctorName: "Dr. Robert Wilson",
    doctorAvatar: "",
    specialty: "Psychiatry",
    date: "2023-05-05T15:45:00",
    duration: 60,
    status: "completed",
  },
  {
    id: "C12351",
    patientName: "David Taylor",
    patientEmail: "d.taylor@example.com",
    patientAvatar: "",
    doctorName: "Dr. John Smith",
    doctorAvatar: "",
    specialty: "General Medicine",
    date: "2023-05-04T10:20:00",
    duration: 30,
    status: "in-progress",
  },
  {
    id: "C12352",
    patientName: "Lisa Anderson",
    patientEmail: "l.anderson@example.com",
    patientAvatar: "",
    doctorName: "Dr. Mark Williams",
    doctorAvatar: "",
    specialty: "Ophthalmology",
    date: "2023-05-03T13:10:00",
    duration: 45,
    status: "completed",
  },
  {
    id: "C12353",
    patientName: "Mark Williams",
    patientEmail: "m.williams@example.com",
    patientAvatar: "",
    doctorName: "Dr. Lisa Anderson",
    doctorAvatar: "",
    specialty: "ENT",
    date: "2023-05-02T09:30:00",
    duration: 30,
    status: "completed",
  },
  {
    id: "C12354",
    patientName: "James Johnson",
    patientEmail: "j.johnson@example.com",
    patientAvatar: "",
    doctorName: "Dr. Susan Miller",
    doctorAvatar: "",
    specialty: "Cardiology",
    date: "2023-05-01T14:00:00",
    duration: 60,
    status: "cancelled",
  },
]

export function ConsultationReports() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Get unique specialties for filter
  const specialties = Array.from(new Set(consultations.map((c) => c.specialty)))

  const filteredConsultations = consultations.filter((consultation) => {
    const matchesSearch =
      consultation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.specialty.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || consultation.status === statusFilter
    const matchesSpecialty = specialtyFilter === "all" || consultation.specialty === specialtyFilter
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "completed" && consultation.status === "completed") ||
      (activeTab === "in-progress" && consultation.status === "in-progress") ||
      (activeTab === "cancelled" && consultation.status === "cancelled")

    return matchesSearch && matchesStatus && matchesSpecialty && matchesTab
  })

  const downloadReport = () => {
    // In a real app, this would generate a CSV file
    alert("Downloading consultation report...")
  }

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Consultation Reports</CardTitle>
            <CardDescription>View detailed reports of all consultations</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={downloadReport}>Download CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={downloadReport}>Download Excel</DropdownMenuItem>
              <DropdownMenuItem onClick={downloadReport}>Download PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <TabsList className="mb-2 sm:mb-0">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search consultations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-[200px]"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? "bg-primary/10" : ""}
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
                  transition={{ duration: 0.3 }}
                  className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-md mb-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Specialty:</span>
                    <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Specialties</SelectItem>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <TabsContent value="all" className="m-0">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Specialty</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredConsultations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Search className="h-8 w-8 mb-2" />
                            <p>No consultations found</p>
                            <p className="text-sm">Try adjusting your search or filters</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <AnimatePresence>
                        {filteredConsultations.map((consultation, index) => (
                          <motion.tr
                            key={consultation.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="table-row-hover"
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={consultation.patientAvatar || "/placeholder.svg"}
                                    alt={consultation.patientName}
                                  />
                                  <AvatarFallback className="bg-primary text-primary-foreground">
                                    {getInitials(consultation.patientName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{consultation.patientName}</p>
                                  <p className="text-xs text-muted-foreground">{consultation.patientEmail}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={consultation.doctorAvatar || "/placeholder.svg"}
                                    alt={consultation.doctorName}
                                  />
                                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                                    {getInitials(consultation.doctorName)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{consultation.doctorName}</span>
                              </div>
                            </TableCell>
                            <TableCell>{consultation.specialty}</TableCell>
                            <TableCell>
                              <div>
                                <p>{new Date(consultation.date).toLocaleDateString()}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(consultation.date).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>{consultation.duration} mins</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  consultation.status === "completed"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                    : consultation.status === "in-progress"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                }
                              >
                                {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                              </Badge>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="completed" className="m-0">
              {/* Same table structure as "all" tab */}
            </TabsContent>

            <TabsContent value="in-progress" className="m-0">
              {/* Same table structure as "all" tab */}
            </TabsContent>

            <TabsContent value="cancelled" className="m-0">
              {/* Same table structure as "all" tab */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
