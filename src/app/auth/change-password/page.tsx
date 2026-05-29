"use client";

import ChangePasswordForm from "@/components/forms/Change-password-form";
import Image from "next/image";

export default function ChangePasswordPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col md:flex-row">
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden p-10 text-white md:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020E7C] via-[#1e40af] to-[#3b82f6]" />
        <div className="relative z-10">
          <Image src="/medfair.svg" alt="MedFair" width={140} height={40} className="brightness-0 invert" />
          <h1 className="mt-12 text-3xl font-semibold tracking-tight">
            Secure your account
          </h1>
          <p className="mt-3 max-w-sm text-blue-100">
            Choose a strong password only you know. You will use it each time you
            sign in to the partner portal.
          </p>
        </div>
        <p className="relative z-10 text-sm text-blue-200/80">© MedFair Partner Portal</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-[#FAF8F8] px-4 py-10 sm:px-6 sm:py-12">
        <div className="w-full max-w-md pb-[env(safe-area-inset-bottom)]">
          <div className="mb-8 md:hidden">
            <Image src="/medfair.svg" alt="MedFair" width={120} height={36} />
          </div>
          <h2 className="text-2xl font-semibold text-[#020E7C]">Change password</h2>
          <p className="mt-2 text-sm text-slate-600">
            Required on first sign-in or after an admin reset.
          </p>
          <div className="mt-8">
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
