"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // 👈 new loading state
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true); // 👈 start loading

    try {
      await login(credentials.email, credentials.password);
      router.push("/dashboard");
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Incorrect email or password");
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false); // 👈 stop loading
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        name="email"
        value={credentials.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
      />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className={`w-full flex justify-center cursor-pointer items-center bg-blue-900 text-white py-2 rounded-md ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        ) : null}
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
