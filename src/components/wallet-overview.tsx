"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Wallet } from "lucide-react";
import cardBg from "../assets/money-256315_640.jpg";
import walletBg from "../assets/account.jpg";
import { motion, AnimatePresence } from "framer-motion";
// import { useTheme } from "next-themes";
import { useAuth } from "@/AuthContext";
import axios from "@/lib/axios";
import { baseUrl } from "@/env";

export function WalletOverview() {
  const { user, token } = useAuth();
  const orgId = user?.id;
  // const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [totalPaid, setTotalPaid] = useState<number | null>(null);

  // Simulate fetching total amount paid
  useEffect(() => {
    async function fetchTotalPaid() {
      if (!token || !orgId) return;
      try {
        const response = await axios.get<{ totalPaid: number }>(
          `${baseUrl}/api/organization/${orgId}/total-paid`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTotalPaid(response.data.totalPaid ?? 0);
      } catch (err) {
        console.error("Error fetching total paid:", err);
        setTotalPaid(0);
      }
    }
    fetchTotalPaid();
  }, [token, orgId]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchBalance() {
      if (!token || !orgId) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get<{ balance: number }>(
          `${baseUrl}/api/organization/${orgId}/balance`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWalletBalance(response.data.balance ?? 0);
      } catch (err) {
        console.error("Error fetching wallet balance:", err);
        setError("Failed to load balance");
        setWalletBalance(0);
      } finally {
        setLoading(false);
      }
    }

    fetchBalance();
  }, [token, orgId]);

  if (!mounted) return null;

  // const cardVariants = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: { duration: 0.5 },
  //   },
  //   hover: {
  //     y: -5,
  //     boxShadow:
  //       theme === "dark"
  //         ? "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)"
  //         : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  //   },
  // };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <motion.div
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          hover: { y: -5 },
        }}
        className="overflow-hidden rounded-xl h-full"
      >
        <motion.div
          whileHover={{ backgroundPositionY: "-20px" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ backgroundImage: `url(${cardBg.src})` }}
          className="h-full bg-cover bg-center p-1"
        >
          <Card className="overflow-hidden text-[#f3f3f3]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-primary/10 to-primary/5">
              <CardTitle className="text-base font-medium">
                Wallet Balance
              </CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="pt-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl font-bold"
              >
                {loading
                  ? "Loading..."
                  : `₦${(walletBalance ?? 0).toLocaleString()}`}
              </motion.div>
              <p className="text-sm text-muted-foreground mt-1">
                {error ?? "Available for consultations"}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                Fund Wallet
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <h2 className="text-xl font-semibold mb-4">Fund Your Wallet</h2>
              <p className="text-sm mb-3">
                Make payment to the account below. Your wallet will be funded
                shortly after.
              </p>
              <div className="space-y-2 text-sm mb-4">
                <p>
                  <strong>Account Name:</strong> Medfair Technologies Limited
                </p>
                <p>
                  <strong>Bank:</strong> Fidelity Bank
                </p>
                <p>
                  <strong>Account Number:</strong> 5601363405
                </p>
              </div>
              <p className="text-sm mb-6">
                After payment, kindly forward your receipt to:{" "}
                <a
                  href="mailto:medfairfinanace@gmail.com"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  medfairfinanace@gmail.com
                </a>
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-black text-white px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-800 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          hover: { y: -5 },
        }}
        className="overflow-hidden rounded-xl h-full"
      >
        <motion.div
          whileHover={{ backgroundPositionY: "-20px" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ backgroundImage: `url(${walletBg.src})` }}
          className="h-full bg-cover bg-center p-1"
        >
          <Card className="overflow-hidden h-full flex flex-col justify-between text-white">
            <div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-primary/10 to-primary/5">
                <CardTitle className="text-base font-medium">
                  Total Amount Paid
                </CardTitle>
                <Wallet className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="pt-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-3xl font-bold"
                >
                  {loading
                    ? "Loading..."
                    : `₦${(totalPaid ?? 0).toLocaleString()}`}
                </motion.div>
                <p className="text-sm text-muted-foreground mt-1">
                  Total payments made for all consultations
                </p>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
