"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Wallet, Building2, X } from "lucide-react";
import { useAuth } from "@/AuthContext";
import axios from "@/lib/axios";
import { baseUrl } from "@/env";
import { getOrganizationId } from "@/lib/organization";
import { StatCard } from "@/components/dashboard/stat-card";
import { SectionCard } from "@/components/dashboard/section-card";

export function WalletOverview() {
  const { user, token } = useAuth();
  const orgId = getOrganizationId(user);

  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!token || !orgId) {
      setLoading(false);
      return;
    }

    async function fetchBalance() {
      setLoading(true);
      try {
        const response = await axios.get<number>(
          `${baseUrl}/api/organization/${orgId}/balance`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWalletBalance(response.data ?? 0);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setWalletBalance(0);
      } finally {
        setLoading(false);
      }
    }

    fetchBalance();
  }, [token, orgId]);

  return (
    <div className="space-y-6">
      <StatCard
        label="Wallet balance"
        value={loading ? "—" : `₦${walletBalance.toLocaleString()}`}
        icon={Wallet}
        variant="brand"
        className="max-w-md"
      />

      <SectionCard
        title="Fund your wallet"
        description="Transfer to the account below. Your balance updates after we confirm payment."
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3 text-sm text-slate-600">
            <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-[#020E7C]" />
            <div className="space-y-1">
              <p>
                <span className="font-medium text-slate-900">Account:</span>{" "}
                Medfair Technologies Limited
              </p>
              <p>
                <span className="font-medium text-slate-900">Bank:</span>{" "}
                Fidelity Bank · 5601363405
              </p>
            </div>
          </div>
          <Button variant="brand" className="shrink-0" onClick={() => setShowModal(true)}>
            View payment details
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </SectionCard>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal
          aria-labelledby="fund-wallet-title"
        >
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <h2
              id="fund-wallet-title"
              className="text-lg font-semibold text-slate-900"
            >
              Fund your wallet
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Make payment to the account below. Your wallet will be credited
              after we verify your transfer.
            </p>
            <div className="mt-4 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p>
                <strong className="text-slate-900">Account name:</strong> Medfair
                Technologies Limited
              </p>
              <p>
                <strong className="text-slate-900">Bank:</strong> Fidelity Bank
              </p>
              <p>
                <strong className="text-slate-900">Account number:</strong>{" "}
                5601363405
              </p>
            </div>
            <p className="mt-4 text-sm text-slate-600">
              Forward your receipt to{" "}
              <a
                href="mailto:medfairfinanace@gmail.com"
                className="font-medium text-[#020E7C] underline"
              >
                medfairfinanace@gmail.com
              </a>
            </p>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
