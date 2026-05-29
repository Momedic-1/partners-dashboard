"use client";

import LoginForm from "@/components/forms/Login-form";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col md:flex-row">
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden p-10 text-white md:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020E7C] via-[#1e40af] to-[#3b82f6]" />
        <div className="absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-16 bottom-1/4 h-56 w-56 rounded-full bg-blue-300/20 blur-3xl" />

        <div className="relative z-10">
          <Image
            src="/medfair.svg"
            alt="MedFair"
            width={150}
            height={44}
            className="brightness-0 invert"
            priority
          />
          <h1 className="mt-14 text-4xl font-semibold leading-tight tracking-tight">
            Partner portal
          </h1>
          <p className="mt-4 max-w-md text-lg text-blue-100">
            Manage members, consultations, wallet balance, and reports for your
            organization — in one place.
          </p>
          <ul className="mt-10 space-y-3 text-sm text-blue-200">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Bulk member upload
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Consultation & prescription insights
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Secure organization wallet
            </li>
          </ul>
        </div>

        <p className="relative z-10 text-sm text-blue-200/80">
          © {new Date().getFullYear()} MedFair. All rights reserved.
        </p>
      </div>

      <div className="flex flex-1 flex-col justify-center bg-[#FAF8F8] px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 md:hidden">
            <Image src="/medfair.svg" alt="MedFair" width={130} height={40} priority />
          </div>

          <h2 className="text-2xl font-semibold text-[#020E7C]">Sign in</h2>
          <p className="mt-2 text-sm text-slate-600">
            Use the credentials provided when your organization was onboarded.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            <Link
              href="/auth/reset-password"
              className="font-medium text-[#020E7C] hover:text-[#1e40af] hover:underline"
            >
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
