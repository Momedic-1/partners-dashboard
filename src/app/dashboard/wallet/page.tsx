"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { WalletOverview } from "@/components/wallet-overview";

export default function WalletPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        heading="Wallet"
        text="Manage your wallet balance and funding"
      />
      <WalletOverview />
    </div>
  );
}
