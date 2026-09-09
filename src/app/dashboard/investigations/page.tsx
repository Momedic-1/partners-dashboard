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
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Microscope,
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

interface InvestigationItem {
  investigationName: string;
  instruction: string;
}

interface InvestigationOrder {
  id: number;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorName: string;
  orderDate: string;
  items: InvestigationItem[];
}

const PAGE_SIZE = 10;

function cleanInstruction(instruction?: string) {
  if (!instruction) return "";
  const trimmed = instruction.trim();
  if (trimmed.toLowerCase() === "perform as per protocol") return "";
  return trimmed;
}

const InvestigationReports = () => {
  const [investigations, setInvestigations] = useState<InvestigationOrder[]>(
    []
  );
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
    () => Array.from(new Set(investigations.map((inv) => inv.doctorName))).sort(),
    [investigations]
  );

  const applyRows = (rows: InvestigationOrder[]) => {
    const sorted = [...rows].sort(
      (a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );
    setInvestigations(sorted);
  };

  const checkInvestigationAccess = async () => {
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
        `${baseUrl}/api/organization/${organizationId}/investigation-orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      applyRows(response.data || []);
      setHasAccess(true);
      setLoading(false);
    } catch (err: any) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        await requestInvestigationAccess(Number(organizationId));
      } else {
        setError("Failed to check investigation access.");
        setLoading(false);
      }
    } finally {
      setAccessLoading(false);
    }
  };

  const requestInvestigationAccess = async (organizationId: number) => {
    try {
      await axios.put(
        `${baseUrl}/api/organization/organizations/${organizationId}/investigation-visibility?canView=true`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      await fetchInvestigationOrders();
      setHasAccess(true);
    } catch (err: any) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        setHasAccess(false);
      } else {
        setError("Failed to request investigation access.");
      }
      setLoading(false);
    }
  };

  const fetchInvestigationOrders = async () => {
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
        `${baseUrl}/api/organization/${organizationId}/investigation-orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      applyRows(response.data || []);
    } catch {
      setError("Failed to load investigation orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkInvestigationAccess();
  }, [user, token]);

  const filteredOrders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return investigations.filter((inv) => {
      const matchSearch =
        !q ||
        inv.patientName.toLowerCase().includes(q) ||
        inv.doctorName.toLowerCase().includes(q) ||
        (inv.patientEmail || "").toLowerCase().includes(q) ||
        inv.items.some((item) =>
          item.investigationName.toLowerCase().includes(q)
        );
      const matchDoctor =
        doctorFilter === "all" || inv.doctorName === doctorFilter;
      return matchSearch && matchDoctor;
    });
  }, [investigations, searchTerm, doctorFilter]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, doctorFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const pageOrders = filteredOrders.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const clearFilters = () => {
    setSearchTerm("");
    setDoctorFilter("all");
  };

  const hasActiveFilters = searchTerm !== "" || doctorFilter !== "all";

  const totalTests = investigations.reduce(
    (sum, order) => sum + order.items.length,
    0
  );

  const thisMonthOrders = investigations.filter((inv) => {
    const d = new Date(inv.orderDate);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;

  const exportCsv = () => {
    const header = [
      "Patient",
      "Email",
      "Phone",
      "Doctor",
      "Investigation",
      "Instructions",
      "Order date",
      "Order id",
    ];
    const lines = [header.join(",")];
    for (const order of filteredOrders) {
      for (const item of order.items) {
        lines.push(
          [
            order.patientName,
            order.patientEmail,
            order.patientPhone,
            order.doctorName,
            item.investigationName,
            cleanInstruction(item.instruction),
            order.orderDate,
            order.id,
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
    a.download = `investigations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (accessLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Loader2 className="mb-3 h-8 w-8 animate-spin text-[#020E7C]" />
        Checking investigation access…
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <DashboardHeader
          heading="Investigations"
          text="View investigation orders for your organization"
        />
        <SectionCard title="Access restricted">
          <Alert className="border-amber-200 bg-amber-50">
            <Lock className="h-5 w-5 text-amber-600" />
            <AlertDescription className="text-amber-800">
              This organization does not have access to investigation order
              data. Contact your MedFair administrator to enable it.
            </AlertDescription>
          </Alert>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Investigations"
        text="Orders grouped by consult — multiple tests stay together"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Orders"
          value={filteredOrders.length}
          icon={FileText}
          variant="brand"
        />
        <StatCard
          label="Tests"
          value={totalTests}
          icon={Microscope}
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
          value={thisMonthOrders}
          icon={Calendar}
          variant="success"
        />
      </div>

      <SectionCard
        title="Investigation database"
        description="One row per order. Expand to see every test in that order."
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
              placeholder="Search patient, doctor, test, or email…"
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
                <TableHead>Investigations</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-16 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#020E7C]" />
                    <p className="mt-2 text-sm text-slate-500">
                      Loading investigation orders…
                    </p>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-red-600"
                  >
                    <AlertCircle className="mx-auto mb-2 h-8 w-8" />
                    {error}
                  </TableCell>
                </TableRow>
              ) : pageOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-slate-500"
                  >
                    <Microscope className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                    No investigation orders found
                  </TableCell>
                </TableRow>
              ) : (
                pageOrders.map((order) => {
                  const key = String(order.id);
                  const open = !!expanded[key];
                  return (
                    <Fragment key={key}>
                      <TableRow className="border-slate-100 hover:bg-slate-50/80">
                        <TableCell className="pr-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              setExpanded((prev) => ({
                                ...prev,
                                [key]: !prev[key],
                              }))
                            }
                            aria-label={
                              open ? "Collapse tests" : "Expand tests"
                            }
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
                            {order.patientName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {order.patientEmail}
                          </p>
                          <p className="text-xs text-slate-500 md:hidden">
                            {order.doctorName}
                          </p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                              <User className="h-4 w-4" />
                            </div>
                            <span className="text-slate-700">
                              {order.doctorName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className="bg-[#020E7C] text-white hover:bg-[#020E7C]">
                              {order.items.length} test
                              {order.items.length === 1 ? "" : "s"}
                            </Badge>
                            <span className="truncate text-sm text-slate-700">
                              {order.items
                                .map((i) => i.investigationName)
                                .join(", ")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden text-sm text-slate-600 sm:table-cell">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {new Date(order.orderDate).toLocaleDateString()}
                          </div>
                          <p className="text-xs text-slate-500">
                            {new Date(order.orderDate).toLocaleTimeString()}
                          </p>
                        </TableCell>
                      </TableRow>
                      {open &&
                        order.items.map((item, itemIndex) => (
                          <TableRow
                            key={`${key}-${itemIndex}`}
                            className="border-slate-100 bg-slate-50/60"
                          >
                            <TableCell />
                            <TableCell colSpan={4} className="py-3">
                              <div className="rounded-lg border border-slate-200 bg-white p-3">
                                <p className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                                  <Microscope className="h-3 w-3" /> Test
                                </p>
                                <p className="font-medium text-slate-900">
                                  {item.investigationName}
                                </p>
                                {cleanInstruction(item.instruction) ? (
                                  <p className="mt-1 text-xs text-slate-500">
                                    {cleanInstruction(item.instruction)}
                                  </p>
                                ) : null}
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

        {filteredOrders.length > 0 && (
          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
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

export default InvestigationReports;
