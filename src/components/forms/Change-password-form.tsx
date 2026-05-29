"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { baseUrl } from "@/env";
import { useAuth } from "@/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function ChangePasswordForm() {
  const { token, setMustChangePassword } = useAuth();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState({ current: false, next: false, confirm: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Your session expired. Please sign in again.");
      router.replace("/auth/login");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${baseUrl}/api/organization/change-password`,
        { currentPassword, newPassword, confirmPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMustChangePassword(false);
      router.replace("/dashboard");
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } }; message?: string };
      setError(
        ax.response?.data?.message || ax.message || "Could not update password."
      );
    } finally {
      setLoading(false);
    }
  };

  const field = (
    id: string,
    label: string,
    value: string,
    onChange: (v: string) => void,
    visible: boolean,
    toggle: () => void
  ) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="h-11 pr-10"
          autoComplete={id === "current" ? "current-password" : "new-password"}
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <Lock className="h-5 w-5 shrink-0" />
        <p>
          For security, set a new password before continuing to your partner
          dashboard.
        </p>
      </div>

      {field(
        "current",
        "Current password",
        currentPassword,
        setCurrentPassword,
        show.current,
        () => setShow((s) => ({ ...s, current: !s.current }))
      )}
      {field(
        "new",
        "New password",
        newPassword,
        setNewPassword,
        show.next,
        () => setShow((s) => ({ ...s, next: !s.next }))
      )}
      {field(
        "confirm",
        "Confirm new password",
        confirmPassword,
        setConfirmPassword,
        show.confirm,
        () => setShow((s) => ({ ...s, confirm: !s.confirm }))
      )}

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading}
        variant="brand"
        className="w-full"
      >
        {loading ? "Updating…" : "Update password & continue"}
      </Button>
    </form>
  );
}
