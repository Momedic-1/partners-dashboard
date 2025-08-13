"use client";

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
  Lock,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "@/lib/axios";
import { baseUrl } from "@/env";
import { useAuth } from "@/AuthContext";
import { useEffect, useState } from "react";

interface Prescription {
  id: number;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  createdAt: string;
  doctorName: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
}

const PrescriptionReports = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [accessLoading, setAccessLoading] = useState(true);
  const { user, token } = useAuth();

  const doctors = Array.from(new Set(prescriptions.map((p) => p.doctorName)));

  // Check if organization has access to prescriptions
  const checkPrescriptionAccess = async () => {
    setAccessLoading(true);
    setError("");

    if (!user || !token) {
      setError("Not authenticated");
      setAccessLoading(false);
      return;
    }

    const organizationId = user?.id;
    if (!organizationId) {
      setError("Organization ID not found.");
      setAccessLoading(false);
      return;
    }

    try {
      // First, check if the organization already has access by trying to fetch prescriptions
      const response = await axios.get(
        `${baseUrl}/api/organization/${organizationId}/prescriptions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If successful, set access to true and set the prescriptions
      const sortedPrescriptions = response.data.sort(
        (a: Prescription, b: Prescription) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
      );

      setPrescriptions(sortedPrescriptions);
      setHasAccess(true);
      setLoading(false);
    } catch (err: any) {
      console.error("Error checking prescription access:", err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        // If access is denied, try to request access
        await requestPrescriptionAccess(organizationId);
      } else {
        setError("Failed to check prescription access.");
        setLoading(false);
      }
    } finally {
      setAccessLoading(false);
    }
  };

  // Request prescription access for the organization
  const requestPrescriptionAccess = async (organizationId: number) => {
    try {
      await axios.put(
        `${baseUrl}/api/organization/${organizationId}/prescription-access?canView=true`,
        {}, // Empty body for PUT request
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // After granting access, fetch prescriptions
      await fetchPrescriptions();
      setHasAccess(true);
    } catch (err: any) {
      console.error("Error requesting prescription access:", err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        setHasAccess(false);
      } else {
        setError("Failed to request prescription access.");
      }
      setLoading(false);
    }
  };

  // Fetch prescriptions if access is granted
  const fetchPrescriptions = async () => {
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
        `${baseUrl}/api/organization/${organizationId}/prescriptions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const sortedPrescriptions = response.data.sort(
        (a: Prescription, b: Prescription) => {
          // Sort by createdAt in descending order (newest first)
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
      );

      setPrescriptions(sortedPrescriptions);
    } catch (err: any) {
      console.error("Error fetching prescriptions:", err);
      setError("Failed to load prescriptions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkPrescriptionAccess();
  }, [user, token]);

  const filteredPrescriptions = prescriptions.filter((p) => {
    const matchSearch =
      p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patientEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchDoctor = doctorFilter === "all" || p.doctorName === doctorFilter;

    return matchSearch && matchDoctor;
  });

  // Access denied component
  if (accessLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mr-3" />
            <p>Checking prescription access...</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!hasAccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Prescription Reports
            </CardTitle>
            <CardDescription>
              Access to client prescription data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This organization has no access to client prescriptions. Please
                contact your administrator to request access.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Prescription Reports</CardTitle>
            <CardDescription className="pt-2">
              View detailed reports of all client prescriptions
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
          <div className="flex flex-wrap justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search prescriptions..."
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
                  <span>Doctor:</span>
                  <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor} value={doctor}>
                          {doctor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Drug</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      <p>Loading prescriptions...</p>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-red-500"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filteredPrescriptions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No prescriptions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPrescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {prescription.patientName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {prescription.patientEmail}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {prescription.patientPhone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{prescription.doctorName}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{prescription.drugName}</p>
                          <p className="text-xs text-muted-foreground">
                            {prescription.instructions}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{prescription.dosage}</Badge>
                      </TableCell>
                      <TableCell>{prescription.frequency}</TableCell>
                      <TableCell>{prescription.duration}</TableCell>
                      <TableCell>
                        <p>
                          {new Date(
                            prescription.createdAt
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(
                            prescription.createdAt
                          ).toLocaleTimeString()}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PrescriptionReports;
