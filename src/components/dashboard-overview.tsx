"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Wallet, Users, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "@/lib/axios";
import { baseUrl } from "@/env";
import { useAuth } from "@/AuthContext";
import { getOrganizationId } from "@/lib/organization";
import { StatCard } from "@/components/dashboard/stat-card";

export function DashboardOverview() {
  const { user, token } = useAuth();
  const orgId = getOrganizationId(user);

  const [walletBalance, setWalletBalance] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [completedConsultations, setCompletedConsultations] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  useEffect(() => {
    async function fetchStats() {
      if (!token || !orgId) {
        setLoadingStats(false);
        return;
      }

      setLoadingStats(true);
      try {
        const [usersRes, consultRes, balanceRes] = await Promise.all([
          axios.get(`${baseUrl}/api/organization/${orgId}/stats/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(
            `${baseUrl}/api/organization/${orgId}/consultations/completed-count`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(`${baseUrl}/api/organization/${orgId}/balance`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setActiveUsers(usersRes.data ?? 0);
        setCompletedConsultations(consultRes.data ?? 0);
        setWalletBalance(balanceRes.data ?? 0);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoadingStats(false);
      }
    }

    fetchStats();
  }, [token, orgId]);

  const loading = loadingStats;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Wallet balance"
          value={loading ? "—" : `₦${walletBalance.toLocaleString()}`}
          icon={Wallet}
          variant="brand"
        />
        <StatCard
          label="Active members"
          value={loading ? "—" : activeUsers.toLocaleString()}
          icon={Users}
          variant="neutral"
        />
        <StatCard
          label="Completed consultations"
          value={loading ? "—" : completedConsultations.toLocaleString()}
          icon={Calendar}
          variant="success"
        />
      </div>

      {loading && (
        <p className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin text-[#020E7C]" />
          Loading statistics…
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/wallet">
          <Button variant="brand">
            Fund wallet
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link href="/dashboard/users">
          <Button variant="outline" className="border-slate-200">
            Manage users
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link href="/dashboard/reports">
          <Button variant="outline" className="border-slate-200">
            View reports
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
