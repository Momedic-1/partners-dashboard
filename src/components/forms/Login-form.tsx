"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(credentials.email, credentials.password);
      if (user.mustChangePassword === true) {
        router.push("/auth/change-password");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const ax = err as {
        response?: { status?: number; data?: { message?: string } };
        message?: string;
      };
      if (ax.response?.status === 401) {
        setError("Incorrect email or password");
      } else {
        setError(
          ax.response?.data?.message ||
            ax.message ||
            "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Work email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
          placeholder="you@organization.com"
          required
          autoComplete="email"
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className="h-11 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading}
        variant="brand"
        className="h-11 w-full"
      >
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
};

export default LoginForm;
