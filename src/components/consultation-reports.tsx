"use client";

import { useState, useEffect, useMemo } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { SectionCard } from "@/components/dashboard/section-card";
import { DataToolbar } from "@/components/dashboard/data-toolbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Loader2,
  Calendar,
  Clock,
  FileText,
  Stethoscope,
  Activity,
  Users,
  RefreshCw,
  X,
  CheckCircle,
  XCircle,
  PlayCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import axios from "@/lib/axios";
import { baseUrl } from "@/env";
import { useAuth } from "@/AuthContext";
import {
  getOrganizationId,
  formatSpecialty,
  normalizeConsultationStatus,
  statusLabel,
  type ConsultationStatus,
} from "@/lib/organization";
import { Input } from "@/components/ui/input";

type DateFilterMode = "all" | "day" | "month" | "year";

interface Consultation {
  id: string;
  patientName: string;
  patientEmail: string;
  doctorName: string;
  specialty: string;
  date: string;
  status: ConsultationStatus;
  specialtyLabel: string;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 8 }, (_, i) => CURRENT_YEAR - i);

function matchesDateFilter(
  dateStr: string,
  mode: DateFilterMode,
  day: string,
  month: string,
  year: string
): boolean {
  if (mode === "all") return true;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;

  if (mode === "day" && day) {
    return d.toISOString().slice(0, 10) === day;
  }
  if (mode === "month" && month) {
    return d.toISOString().slice(0, 7) === month;
  }
  if (mode === "year" && year) {
    return String(d.getFullYear()) === year;
  }
  return true;
}

export function ConsultationReports() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [dateFilterMode, setDateFilterMode] = useState<DateFilterMode>("all");
  const [filterDay, setFilterDay] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState(String(CURRENT_YEAR));
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  const { user, token } = useAuth();

  const specialties = useMemo(
    () =>
      Array.from(
        new Set(consultations.map((c) => c.specialty).filter(Boolean))
      ).sort(),
    [consultations]
  );

  const fetchConsultations = async () => {
    setLoading(true);
    setError("");

    if (!user || !token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const organizationId = getOrganizationId(user);
    if (!organizationId) {
      setError("Organization ID not found. Please sign in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${baseUrl}/api/organization/consultations/full/${organizationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const transformed: Consultation[] = response.data
        .map(
          (
            item: {
              patientName?: string;
              doctorName?: string;
              specialization?: string;
              dateTime?: string;
              status?: string;
            },
            idx: number
          ) => {
            const specialty = item.specialization || "";
            const status = normalizeConsultationStatus(item.status ?? "");
            return {
              id: `${idx}-${item.dateTime || idx}`,
              patientName: item.patientName || "",
              patientEmail: "",
              doctorName: item.doctorName || "",
              specialty,
              specialtyLabel: formatSpecialty(specialty),
              date: item.dateTime || new Date().toISOString(),
              status,
            };
          }
        )
        .sort(
          (a: Consultation, b: Consultation) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

      setConsultations(transformed);
    } catch (err) {
      console.error("Error fetching consultations:", err);
      setError("Failed to load consultations.");
    } finally {
      setLoading(false);
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportFilteredCsv = () => {
    const header = ["Patient", "Doctor", "Specialty", "Date", "Status"];
    const lines = [
      header.join(","),
      ...filteredConsultations.map((c) =>
        [
          c.patientName,
          c.doctorName,
          c.specialtyLabel || c.specialty,
          c.date,
          statusLabel(c.status),
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ];
    const blob = new Blob(["\uFEFF" + lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    downloadBlob(blob, `consultations-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const exportExcelFromApi = async () => {
    const organizationId = getOrganizationId(user);
    if (!token || !organizationId) return;
    setExporting(true);
    try {
      const res = await axios.get(
        `${baseUrl}/api/organization/${organizationId}/consultations/export`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      downloadBlob(
        res.data,
        `consultations-org-${organizationId}-${new Date().toISOString().slice(0, 10)}.xlsx`
      );
    } catch (err) {
      console.error("Excel export failed:", err);
      alert("Could not download Excel. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [user, token]);

  const filteredConsultations = consultations.filter((c) => {
    const q = searchTerm.trim().toLowerCase();
    const matchSearch =
      !q ||
      c.patientName.toLowerCase().includes(q) ||
      c.doctorName.toLowerCase().includes(q) ||
      c.specialty.toLowerCase().includes(q) ||
      c.specialtyLabel.toLowerCase().includes(q);

    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchSpecialty =
      specialtyFilter === "all" || c.specialty === specialtyFilter;
    const matchTab = activeTab === "all" || c.status === activeTab;
    const matchDate = matchesDateFilter(
      c.date,
      dateFilterMode,
      filterDay,
      filterMonth,
      filterYear
    );

    return matchSearch && matchStatus && matchSpecialty && matchTab && matchDate;
  });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSpecialtyFilter("all");
    setDateFilterMode("all");
    setFilterDay("");
    setFilterMonth("");
    setFilterYear(String(CURRENT_YEAR));
    setActiveTab("all");
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    statusFilter !== "all" ||
    specialtyFilter !== "all" ||
    dateFilterMode !== "all";

  const getStatusIcon = (status: ConsultationStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case "pending":
        return <PlayCircle className="h-4 w-4 text-blue-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: ConsultationStatus) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "pending":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-50 text-red-800 border-red-200";
    }
  };

  const completedCount = filteredConsultations.filter(
    (c) => c.status === "completed"
  ).length;
  const pendingCount = filteredConsultations.filter(
    (c) => c.status === "pending"
  ).length;
  const cancelledCount = filteredConsultations.filter(
    (c) => c.status === "cancelled"
  ).length;

  const filterPanel = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="space-y-2 sm:col-span-2 lg:col-span-3">
        <Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Calendar className="h-4 w-4" />
          Date range
        </Label>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <Select
            value={dateFilterMode}
            onValueChange={(v) => setDateFilterMode(v as DateFilterMode)}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All dates</SelectItem>
              <SelectItem value="day">Specific day</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>

          {dateFilterMode === "day" && (
            <Input
              type="date"
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value)}
              className="w-full sm:w-auto"
            />
          )}
          {dateFilterMode === "month" && (
            <Input
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="w-full sm:w-auto"
            />
          )}
          {dateFilterMode === "year" && (
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {YEAR_OPTIONS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Activity className="h-4 w-4" />
          Status
        </Label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Stethoscope className="h-4 w-4" />
          Specialty
        </Label>
        <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All specialties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All specialties</SelectItem>
            {specialties.map((specialty) => (
              <SelectItem key={specialty} value={specialty}>
                {formatSpecialty(specialty)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Showing"
          value={filteredConsultations.length}
          icon={FileText}
          variant="brand"
        />
        <StatCard
          label="Completed"
          value={completedCount}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          label="Pending"
          value={pendingCount}
          icon={PlayCircle}
          variant="neutral"
        />
        <StatCard
          label="Cancelled"
          value={cancelledCount}
          icon={XCircle}
          variant="warning"
        />
      </div>

      <SectionCard
        title="Consultation records"
        description={
          hasActiveFilters
            ? `${filteredConsultations.length} of ${consultations.length} records match your filters`
            : `${consultations.length} total records`
        }
        actions={
          <>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-red-600 hover:text-red-700"
              >
                <X className="mr-1 h-4 w-4" />
                Clear filters
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => fetchConsultations()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="brand" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportFilteredCsv}>
                  Export filtered CSV (Excel)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportExcelFromApi} disabled={exporting}>
                  {exporting ? "Downloading…" : "Export full Excel (.xlsx)"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="inline-flex h-auto w-full flex-wrap gap-1 rounded-lg bg-slate-100 p-1 md:w-auto">
            {(["all", "completed", "pending", "cancelled"] as const).map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-md capitalize data-[state=active]:bg-[#020E7C] data-[state=active]:text-white"
              >
                {tab === "all" ? "All" : statusLabel(tab as ConsultationStatus)}
              </TabsTrigger>
            ))}
          </TabsList>

          <DataToolbar
            searchPlaceholder="Search patient, doctor, or specialty…"
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            onFilterClick={() => setShowFilters(!showFilters)}
            filterActive={hasActiveFilters}
            showFilters={showFilters}
            filterPanel={filterPanel}
          />

          <TabsContent value={activeTab} className="m-0">
            <div className="min-w-0 overflow-hidden rounded-lg border border-slate-200">
              <Table className="w-full table-fixed">
                <TableHeader>
                  <TableRow className="border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
                    <TableHead className="w-[28%] font-semibold text-slate-700">
                      Patient
                    </TableHead>
                    <TableHead className="hidden w-[22%] font-semibold text-slate-700 md:table-cell">
                      Doctor
                    </TableHead>
                    <TableHead className="hidden w-[18%] font-semibold text-slate-700 lg:table-cell">
                      Specialty
                    </TableHead>
                    <TableHead className="w-[26%] font-semibold text-slate-700">
                      Date
                    </TableHead>
                    <TableHead className="w-[16%] font-semibold text-slate-700">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-16 text-center">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#020E7C]" />
                        <p className="mt-3 text-sm text-slate-500">
                          Loading consultations…
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-12 text-center">
                        <XCircle className="mx-auto h-10 w-10 text-red-500" />
                        <p className="mt-2 font-medium text-slate-900">{error}</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredConsultations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-12 text-center">
                        <FileText className="mx-auto h-10 w-10 text-slate-300" />
                        <p className="mt-2 font-medium text-slate-700">
                          No consultations found
                        </p>
                        <p className="text-sm text-slate-500">
                          Try changing search or date filters
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredConsultations.map((consultation) => (
                      <TableRow
                        key={consultation.id}
                        className="border-slate-100 hover:bg-slate-50/80"
                      >
                        <TableCell className="py-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <Avatar className="h-9 w-9 shrink-0 border border-slate-200">
                              <AvatarFallback className="bg-[#020E7C] text-xs font-semibold text-white">
                                {getInitials(consultation.patientName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="truncate font-medium text-slate-900">
                              {consultation.patientName}
                            </span>
                          </div>
                          <p className="mt-0.5 truncate text-xs text-slate-500 md:hidden">
                            {consultation.doctorName}
                          </p>
                        </TableCell>
                        <TableCell className="hidden truncate py-3 text-slate-700 md:table-cell">
                          {consultation.doctorName}
                        </TableCell>
                        <TableCell className="hidden py-3 lg:table-cell">
                          <Badge variant="secondary" className="truncate font-normal">
                            {consultation.specialtyLabel}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                            {new Date(consultation.date).toLocaleDateString()}
                          </div>
                          <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="h-3 w-3 shrink-0" />
                            {new Date(consultation.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-1.5">
                            {getStatusIcon(consultation.status)}
                            <Badge
                              className={`${getStatusColor(consultation.status)} text-xs font-medium`}
                            >
                              {statusLabel(consultation.status)}
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </SectionCard>
    </div>
  );
}
