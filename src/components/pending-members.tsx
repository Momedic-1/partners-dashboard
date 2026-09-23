"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { baseUrl } from "@/env";
import { SectionCard } from "@/components/dashboard/section-card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/AuthContext";
import { getOrganizationId } from "@/lib/organization";
import { Check, X } from "lucide-react";

interface PendingMember {
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  requestedAt: string | null;
}

export function PendingMembers() {
  const { user, token } = useAuth();
  const orgId = getOrganizationId(user);
  const [items, setItems] = useState<PendingMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = async () => {
    if (!token || !orgId) {
      setError("Not authenticated.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<PendingMember[]>(
        `${baseUrl}/api/organization/${orgId}/pending-members`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError("Failed to load pending requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, token]);

  const act = async (userId: number, action: "approve" | "reject") => {
    if (!token || !orgId) return;
    setBusyId(userId);
    try {
      await axios.post(
        `${baseUrl}/api/organization/${orgId}/pending-members/${userId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems((prev) => prev.filter((row) => row.userId !== userId));
      toast({
        title: action === "approve" ? "Member approved" : "Request rejected",
        description:
          action === "approve"
            ? "They can now use your organization wallet."
            : "They remain a personal MedFair patient.",
      });
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      toast({
        title: "Could not update request",
        description: ax.response?.data?.message || "Please try again.",
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <SectionCard
      title={`Pending approval (${items.length})`}
      description="People who selected your organization at signup. Approve to add them as members."
      noPadding
      contentClassName="min-w-0"
    >
      <div className="min-w-0 overflow-x-auto">
        {loading ? (
          <p className="px-6 py-10 text-sm text-slate-500">Loading requests…</p>
        ) : error ? (
          <p className="px-6 py-10 text-sm text-red-600">{error}</p>
        ) : items.length === 0 ? (
          <p className="px-6 py-10 text-sm text-slate-500">
            No pending requests.
          </p>
        ) : (
          <>
            <ul className="divide-y md:hidden">
              {items.map((row) => (
                <li key={row.userId} className="space-y-3 px-4 py-4">
                  <div>
                    <p className="font-semibold text-slate-900">{row.fullName}</p>
                    <p className="break-all text-sm text-slate-700">{row.email}</p>
                    <p className="text-sm text-slate-700">{row.phone}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {row.requestedAt
                        ? new Date(row.requestedAt).toLocaleString("en-NG", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "—"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      disabled={busyId === row.userId}
                      onClick={() => act(row.userId, "approve")}
                    >
                      <Check className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      disabled={busyId === row.userId}
                      onClick={() => act(row.userId, "reject")}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <table className="hidden w-full text-left text-sm md:table">
              <thead className="border-b bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Phone</th>
                  <th className="px-6 py-3 font-medium">Requested</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.userId} className="border-b last:border-0">
                    <td className="px-6 py-3 font-medium text-slate-900">
                      {row.fullName}
                    </td>
                    <td className="px-6 py-3 text-slate-700">{row.email}</td>
                    <td className="px-6 py-3 text-slate-700">{row.phone}</td>
                    <td className="px-6 py-3 text-slate-500">
                      {row.requestedAt
                        ? new Date(row.requestedAt).toLocaleString("en-NG", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "—"}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          disabled={busyId === row.userId}
                          onClick={() => act(row.userId, "approve")}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={busyId === row.userId}
                          onClick={() => act(row.userId, "reject")}
                        >
                          <X className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </SectionCard>
  );
}
