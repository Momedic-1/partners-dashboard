"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Wallet } from "lucide-react";
import cardBg from "../assets/card.jpg";
import walletBg from "../assets/account.jpg";
import { motion, AnimatePresence } from "framer-motion";
// import { useTheme } from "next-themes";
import { useAuth } from "@/AuthContext";
import axios from "@/lib/axios";
import { baseUrl } from "@/env";

export function WalletOverview() {
  const { user, token } = useAuth();
  const orgId = user?.id;

  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!token || !orgId) return;

    async function fetchBalance() {
      setLoading(true);
      try {
        const response = await axios.get(
          `${baseUrl}/api/organization/${orgId}/balance`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Balance fetched:", response.data);
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
    <div className="grid grid-cols-1 gap-4">
      {/* Wallet Balance Card */}
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
          <Card className="overflow-hidden text-[#f3f3f3] h-[250px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-primary/10 to-primary/5">
              <CardTitle className="text-base font-medium">
                Wallet Balance
              </CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">
                {loading ? "Loading..." : `₦${walletBalance.toLocaleString()}`}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Available for consultations
              </p>
              <Button
                variant="outline"
                size="sm"
                className=" bg-amber-600 cursor-pointer mt-2 hover:bg-amber-700 text-white"
                onClick={() => setShowModal(true)}
              >
                Fund Wallet
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>{" "}
          </Card>
        </motion.div>
      </motion.div>

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
                  {loading ? "Loading..." : ""}
                </motion.div>
                <p className="text-sm text-muted-foreground mt-1">
                  Total payments made for all consultations
                </p>
              </CardContent>
            </div>
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
    </div>
  );
}
