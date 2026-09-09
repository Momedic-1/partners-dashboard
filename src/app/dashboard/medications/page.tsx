"use client";

import { useEffect, useMemo, useState, Fragment } from "react";
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
  Calendar,
  User,
  Pill,
  Clock,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { getOrganizationId } from "@/lib/organization";
import { DashboardHeader } from "@/components/dashboard-header";
import { SectionCard } from "@/components/dashboard/section-card";
import { StatCard } from "@/components/dashboard/stat-card";

interface Prescription {
  id: number;
  orderId?: number | null;
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

interface PrescriptionGroup {
  key: string;
  orderId: number | null;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorName: string;
  createdAt: string;
  drugs: Prescription[];
}

const PAGE_SIZE = 10;

function groupPrescriptions(rows: Prescription[]): PrescriptionGroup[] {
  const map = new Map<string, PrescriptionGroup>();

  for (const row of rows) {
    const key =
      row.orderId != null
        ? `note-${row.orderId}`
        : `single-${row.id}`;

    const existing = map.get(key);
    if (existing) {
      existing.drugs.push(row);
      if (new Date(row.createdAt).getTime() > new Date(existing.createdAt).getTime()) {
        existing.createdAt = row.createdAt;
      }
    } else {
      map.set(key, {
        key,
        orderId: row.orderId ?? null,
        patientName: row.patientName,
        patientEmail: row.patientEmail,
        patientPhone: row.patientPhone,
        doctorName: row.doctorName,
        createdAt: row.createdAt,
        drugs: [row],
      });
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
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
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { user, token } = useAuth();

  const doctors = useMemo(
    () => Array.from(new Set(prescriptions.map((p) => p.doctorName))).sort(),
    [prescriptions]
  );

  const applyRows = (rows: Prescription[]) => {
    const sorted = [...rows].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setPrescriptions(sorted);
  };

  const checkPrescriptionAccess = async () => {
    setAccessLoading(true);
    setError("");

    if (!user || !token) {
      setError("Not authenticated");
      setAccessLoading(false);
      return;
    }

    const organizationId = getOrganizationId(user);
    if (!organizationId) {
      setError("Organization ID not found.");
      setAccessLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${baseUrl}/api/organization/${Number(organizationId)}/prescriptions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      applyRows(response.data || []);
      setHasAccess(true);
      setLoading(false);
    } catch (err: any) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        await requestPrescriptionAccess(Number(organizationId));
      } else {
        setError("Failed to check prescription access.");
        setLoading(false);
      }
    } finally {
      setAccessLoading(false);
    }
  };

  const requestPrescriptionAccess = async (organizationId: number) => {
    try {
      await axios.put(
        `${baseUrl}/api/organization/${organizationId}/prescription-access?canView=true`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      await fetchPrescriptions();
      setHasAccess(true);
    } catch (err: any) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        setHasAccess(false);
      } else {
        setError("Failed to request prescription access.");
      }
      setLoading(false);
    }
  };

  const fetchPrescriptions = async () => {
    setLoading(true);
    setError("");

    if (!user || !token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const organizationId = getOrganizationId(user);
    if (!organizationId) {
      setError("Organization ID not found.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${baseUrl}/api/organization/${Number(organizationId)}/prescriptions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      applyRows(response.data || []);
    } catch {
      setError("Failed to load prescriptions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkPrescriptionAccess();
  }, [user, token]);

  const filteredGroups = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const filtered = prescriptions.filter((p) => {
      const matchSearch =
        !q ||
        p.patientName.toLowerCase().includes(q) ||
        p.doctorName.toLowerCase().includes(q) ||
        p.drugName.toLowerCase().includes(q) ||
        (p.patientEmail || "").toLowerCase().includes(q);
      const matchDoctor = doctorFilter === "all" || p.doctorName === doctorFilter;
      return matchSearch && matchDoctor;
    });
    return groupPrescriptions(filtered);
  }, [prescriptions, searchTerm, doctorFilter]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, doctorFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredGroups.length / PAGE_SIZE));
  const pageGroups = filteredGroups.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const clearFilters = () => {
    setSearchTerm("");
    setDoctorFilter("all");
  };

  const hasActiveFilters = searchTerm !== "" || doctorFilter !== "all";

  const thisMonthDrugCount = prescriptions.filter((p) => {
    const d = new Date(p.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const exportCsv = () => {
    const header = [
      "Patient",
      "Email",
      "Phone",
      "Doctor",
      "Drug",
      "Dosage",
      "Frequency",
      "Duration",
      "Instructions",
      "Date",
      "Prescription group",
    ];
    const lines = [header.join(",")];
    for (const group of filteredGroups) {
      for (const drug of group.drugs) {
        lines.push(
          [
            group.patientName,
            group.patientEmail,
            group.patientPhone,
            group.doctorName,
            drug.drugName,
            drug.dosage,
            drug.frequency,
            drug.duration,
            drug.instructions || "",
            drug.createdAt,
            group.orderId ?? group.key,
          ]
            .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
            .join(",")
        );
      }
    }
    const blob = new Blob(["\uFEFF" + lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prescriptions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (accessLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Loader2 className="mb-3 h-8 w-8 animate-spin text-[#020E7C]" />
        Checking prescription access…
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <DashboardHeader
          heading="Medications"
          text="View prescription records for your organization"
        />
        <SectionCard title="Access restricted">
          <Alert className="border-amber-200 bg-amber-50">
            <Lock className="h-5 w-5 text-amber-600" />
            <AlertDescription className="text-amber-800">
              This organization does not have access to prescription data.
              Contact your MedFair administrator to enable it.
            </AlertDescription>
          </Alert>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Medications"
        text="Prescriptions grouped by consult — multiple drugs stay together"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Prescriptions"
          value={filteredGroups.length}
          icon={FileText}
          variant="brand"
        />
        <StatCard
          label="Drug lines"
          value={prescriptions.length}
          icon={Pill}
          variant="neutral"
        />
        <StatCard
          label="Doctors"
          value={doctors.length}
          icon={User}
          variant="neutral"
        />
        <StatCard
          label="This month"
          value={thisMonthDrugCount}
          icon={Calendar}
          variant="success"
        />
      </div>

      <SectionCard
        title="Prescription database"
        description="One row per consult. Expand to see every drug in that prescription."
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="brand" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportCsv}>
                Export filtered CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search patient, doctor, drug, or email…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters((v) => !v)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-red-600"
              >
                <X className="mr-1 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Doctor
            </label>
            <Select value={doctorFilter} onValueChange={setDoctorFilter}>
              <SelectTrigger className="max-w-sm bg-white">
                <SelectValue placeholder="All doctors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All doctors</SelectItem>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor} value={doctor}>
                    {doctor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="overflow-hidden rounded-lg border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="w-10" />
                <TableHead>Patient</TableHead>
                <TableHead className="hidden md:table-cell">Doctor</TableHead>
                <TableHead>Medications</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-16 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#020E7C]" />
                    <p className="mt-2 text-sm text-slate-500">
                      Loading prescriptions…
                    </p>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-red-600">
                    <AlertCircle className="mx-auto mb-2 h-8 w-8" />
                    {error}
                  </TableCell>
                </TableRow>
              ) : pageGroups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-slate-500">
                    <FileText className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                    No prescriptions found
                  </TableCell>
                </TableRow>
              ) : (
                pageGroups.map((group) => {
                  const open = !!expanded[group.key];
                  return (
                    <Fragment key={group.key}>
                      <TableRow className="border-slate-100 hover:bg-slate-50/80">
                        <TableCell className="pr-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              setExpanded((prev) => ({
                                ...prev,
                                [group.key]: !prev[group.key],
                              }))
                            }
                            aria-label={open ? "Collapse drugs" : "Expand drugs"}
                          >
                            {open ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-slate-900">
                            {group.patientName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {group.patientEmail}
                          </p>
                          <p className="text-xs text-slate-500 md:hidden">
                            {group.doctorName}
                          </p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                              <User className="h-4 w-4" />
                            </div>
                            <span className="text-slate-700">
                              {group.doctorName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className="bg-[#020E7C] text-white hover:bg-[#020E7C]">
                              {group.drugs.length} drug
                              {group.drugs.length === 1 ? "" : "s"}
                            </Badge>
                            <span className="truncate text-sm text-slate-700">
                              {group.drugs.map((d) => d.drugName).join(", ")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {new Date(group.createdAt).toLocaleDateString()}
                          </div>
                          <p className="text-xs text-slate-500">
                            {new Date(group.createdAt).toLocaleTimeString()}
                          </p>
                        </TableCell>
                      </TableRow>
                      {open &&
                        group.drugs.map((drug) => (
                          <TableRow
                            key={`${group.key}-${drug.id}`}
                            className="bg-slate-50/60 border-slate-100"
                          >
                            <TableCell />
                            <TableCell colSpan={4} className="py-3">
                              <div className="grid gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:grid-cols-4">
                                <div className="sm:col-span-2">
                                  <p className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                                    <Pill className="h-3 w-3" /> Drug
                                  </p>
                                  <p className="font-medium text-slate-900">
                                    {drug.drugName}
                                  </p>
                                  {drug.instructions ? (
                                    <p className="mt-1 text-xs text-slate-500">
                                      {drug.instructions}
                                    </p>
                                  ) : null}
                                </div>
                                <div>
                                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Dosage
                                  </p>
                                  <Badge variant="secondary">{drug.dosage}</Badge>
                                </div>
                                <div>
                                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Frequency / Duration
                                  </p>
                                  <p className="flex items-center gap-1 text-sm text-slate-700">
                                    <Clock className="h-3.5 w-3.5 text-amber-500" />
                                    {drug.frequency}
                                  </p>
                                  <p className="text-sm text-slate-600">
                                    {drug.duration} day
                                    {String(drug.duration) === "1" ? "" : "s"}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {filteredGroups.length > 0 && (
          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filteredGroups.length)} of{" "}
              {filteredGroups.length} prescriptions
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-slate-600">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default PrescriptionReports;
