import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { baseUrl } from "@/env";
import { useAuth } from "@/AuthContext";
import { getOrganizationId } from "@/lib/organization";
import { SectionCard } from "@/components/dashboard/section-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Consultation {
  patientName: string;
  patientEmail: string;
  consultationDate: string;
  amountCharged: number;
  id?: string;
}

interface ConsultationResponse {
  content: Consultation[];
  totalPages: number;
  totalElements?: number;
}

type ConsultRange = "today" | "7d";

export function RecentUsers() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [range, setRange] = useState<ConsultRange>("today");
  const pageSize = 10;
  const { user, token } = useAuth();

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const fetchConsultations = async () => {
    setLoading(true);
    setError("");

    if (!user || !token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const orgId = getOrganizationId(user);
    if (!orgId) {
      setError("Organization not found. Please contact support.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get<ConsultationResponse>(
        `${baseUrl}/api/organization/${orgId}/consultations/basic`,
        {
          params: { page: currentPage - 1, size: pageSize, range },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const sorted = [...(response.data.content || [])].sort(
        (a, b) =>
          new Date(b.consultationDate).getTime() -
          new Date(a.consultationDate).getTime()
      );

      setConsultations(sorted);
      setTotalPages(Math.max(1, response.data.totalPages || 1));
      setTotalElements(response.data.totalElements ?? sorted.length);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      if (status === 403) {
        setError("Access denied. Please check your permissions.");
      } else if (status === 500) {
        setError(`Server error when fetching page ${currentPage}`);
      } else {
        setError("Failed to load consultations data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [range]);

  useEffect(() => {
    fetchConsultations();
  }, [currentPage, range, user, token]);

  const orgSince = user?.createdAt as string | undefined;
  const pageRevenue = consultations.reduce((s, c) => s + c.amountCharged, 0);

  return (
    <SectionCard
      title="Recent consultations"
      description={
        range === "today"
          ? "Consultations from today"
          : "Consultations from the last 7 days"
      }
      actions={
        <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={() => setRange("today")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                range === "today"
                  ? "bg-[#020E7C] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setRange("7d")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                range === "7d"
                  ? "bg-[#020E7C] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Last 7 days
            </button>
          </div>
          {orgSince ? (
            <div className="hidden text-right text-sm text-slate-500 lg:block">
              <p>Organization since</p>
              <p className="font-medium text-slate-700">
                {new Date(orgSince).toLocaleDateString()}
              </p>
            </div>
          ) : null}
        </div>
      }
      noPadding
      contentClassName="min-w-0"
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-[#020E7C]" />
          Loading consultations…
        </div>
      ) : error ? (
        <p className="py-8 text-center text-sm text-red-600">{error}</p>
      ) : consultations.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-500">
          No consultations found for {range === "today" ? "today" : "the last 7 days"}
        </p>
      ) : (
        <>
          <div className="min-w-0 overflow-hidden">
            <Table className="w-full table-fixed">
              <TableHeader>
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="w-[32%] pl-4 sm:pl-6">Patient</TableHead>
                  <TableHead className="hidden w-[28%] md:table-cell">
                    Email
                  </TableHead>
                  <TableHead className="w-[22%]">Date</TableHead>
                  <TableHead className="w-[18%] pr-4 text-right sm:pr-6">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultations.map((c, index) => (
                  <TableRow
                    key={c.id ?? `${c.patientEmail}-${index}`}
                    className="border-slate-100"
                  >
                    <TableCell className="pl-4 sm:pl-6">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#020E7C] text-xs font-medium text-white">
                          {getInitials(c.patientName)}
                        </div>
                        <span className="truncate font-medium text-slate-900">
                          {c.patientName}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-slate-500 md:hidden">
                        {c.patientEmail}
                      </p>
                    </TableCell>
                    <TableCell className="hidden truncate text-slate-600 md:table-cell">
                      {c.patientEmail}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {new Date(c.consultationDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="pr-4 text-right font-medium text-slate-900 sm:pr-6">
                      ₦{c.amountCharged.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {consultations.length > 0 && (
            <div className="border-t border-slate-100 px-4 py-3 sm:px-6">
              <p className="text-sm text-slate-600">
                Page total:{" "}
                <span className="font-semibold text-slate-900">
                  ₦{pageRevenue.toLocaleString()}
                </span>
                <span className="ml-2 text-slate-400">
                  · {totalElements} in range
                </span>
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 border-t border-slate-100 px-4 py-4">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="h-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  const left = Math.max(1, currentPage - 2);
                  const right = Math.min(totalPages, currentPage + 2);
                  return p >= left && p <= right;
                })
                .map((p) => (
                  <Button
                    key={p}
                    variant={p === currentPage ? "brand" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(p)}
                    className="h-8 w-8 p-0"
                  >
                    {p}
                  </Button>
                ))}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="h-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </SectionCard>
  );
}
