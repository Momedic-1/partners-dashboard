"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/env";
import { Eye, EyeOff } from "lucide-react";

const Page = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/registration/password/reset`,
        {
          email,
          newPassword,
        }
      );

      setMessage(
        response.data?.data || "Password has been reset successfully!"
      );
      setEmail("");
      setNewPassword("");

      // Wait 7 seconds and then redirect to homepage
      setTimeout(() => {
        router.push("/");
      }, 7000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to reset password. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleReset}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm text-gray-600">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="space-y-1 relative">
          <label htmlFor="newPassword" className="text-sm text-gray-600">
            New Password
          </label>
          <input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 cursor-pointer" />
            ) : (
              <Eye className="h-5 w-5 cursor-pointer" />
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white cursor-pointer rounded-md bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-800"
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {message && (
          <p className="text-green-600 text-sm text-center">{message}</p>
        )}
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      </form>
    </div>
  );
};

export default Page;
