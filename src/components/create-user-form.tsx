"use client";

import React, { useState } from "react";
import axios from "@/lib/axios";
import { baseUrl } from "@/env";
import { useAuth } from "@/AuthContext";
import { getOrganizationId } from "@/lib/organization";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  Check,
  User,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
  Phone,
  Mail,
  Lock,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SectionCard } from "@/components/dashboard/section-card";
import { cn } from "@/lib/utils";

const inputClass =
  "border-slate-200 bg-white focus-visible:ring-[#020E7C]/30";

function FormSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-4 sm:p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#020E7C]/10 text-[#020E7C]">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-900">{title}</h4>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function CreateUserForm() {
  const { user, token } = useAuth();

  const initialFormState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmedPassword: "",
    gender: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      if (next[name]) next[name] = "";

      if (name === "password") {
        if (!value) next.password = "Password is required";
        else if (value.length < 8)
          next.password = "Password must be at least 8 characters";
        else delete next.password;

        if (
          formData.confirmedPassword &&
          value !== formData.confirmedPassword
        ) {
          next.confirmedPassword = "Passwords do not match";
        } else if (next.confirmedPassword === "Passwords do not match") {
          delete next.confirmedPassword;
        }
      }

      if (name === "confirmedPassword") {
        if (formData.password && value !== formData.password) {
          next.confirmedPassword = "Passwords do not match";
        } else if (next.confirmedPassword === "Passwords do not match") {
          delete next.confirmedPassword;
        }
      }

      return next;
    });
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmedPassword)
      newErrors.confirmedPassword = "Passwords do not match";
    if (!formData.gender) newErrors.gender = "Please select a gender";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const orgId = getOrganizationId(user);
      if (!orgId || !token) throw new Error("Not authenticated");

      await axios.post(
        `${baseUrl}/api/organization/createNewUser/${orgId}`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email || undefined,
          phoneNumber: formData.phone,
          password: formData.password,
          confirmedPassword: formData.confirmedPassword,
          gender: formData.gender,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsSuccess(true);
      toast({
        title: "User created",
        description: `${formData.firstName} ${formData.lastName} was added successfully.`,
      });
      setTimeout(() => {
        setIsSuccess(false);
        resetForm();
      }, 2500);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const rawMessage =
        axiosErr.response?.data?.message ||
        axiosErr.response?.data?.error ||
        axiosErr.message ||
        "Unable to create user.";
      const isConstraintError =
        typeof rawMessage === "string" &&
        (rawMessage.toLowerCase().includes("constraint") ||
          rawMessage.includes("uk_1ar956vx8jufbghpyi09yr16l"));
      const apiMessage = isConstraintError
        ? "A user with this email or phone number already exists."
        : rawMessage;
      setErrors((prev) => ({ ...prev, form: apiMessage }));
      toast({
        variant: "destructive",
        title: "Creation failed",
        description: apiMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (first = "", last = "") =>
    ((first[0] || "") + (last[0] || "")).toUpperCase();

  const disabled = isSubmitting || isSuccess;

  return (
    <SectionCard
      title="Create new user"
      description="Register one member manually. Fields marked required must be filled."
    >
      <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-2xl space-y-6">
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-slate-200 bg-white py-6">
          <Avatar className="h-16 w-16 border-2 border-[#020E7C]/25">
            <AvatarFallback
              className={cn(
                "text-lg font-bold uppercase",
                isSuccess ? "bg-emerald-600 text-white" : "bg-[#020E7C] text-white"
              )}
            >
              {isSuccess ? (
                <Check className="h-7 w-7" />
              ) : (
                getInitials(formData.firstName, formData.lastName) || "?"
              )}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm text-slate-500">
            {isSuccess
              ? "Member added to your organization"
              : "Preview updates as you type"}
          </p>
        </div>

        {errors.form && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errors.form}
          </p>
        )}

        <FormSection
          title="Personal details"
          description="Basic identity information"
          icon={User}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={disabled}
                className={inputClass}
                placeholder="e.g. Ada"
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={disabled}
                className={inputClass}
                placeholder="e.g. Okonkwo"
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">
              Gender <span className="text-red-500">*</span>
            </Label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={disabled}
              className={cn(
                "flex h-10 w-full rounded-md border px-3 text-sm text-slate-900",
                inputClass
              )}
            >
              <option value="">Select gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
            {errors.gender && (
              <p className="text-sm text-red-600">{errors.gender}</p>
            )}
          </div>
        </FormSection>

        <FormSection
          title="Contact"
          description="How the member can be reached"
          icon={Phone}
        >
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              Phone number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              disabled={disabled}
              className={inputClass}
              placeholder="08012345678"
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              Email <span className="text-slate-400">(optional)</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={disabled}
              className={inputClass}
              placeholder="member@company.com"
            />
          </div>
        </FormSection>

        <FormSection
          title="Account access"
          description="Login credentials for the new member"
          icon={Lock}
        >
          <div className="space-y-2">
            <Label htmlFor="password">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                disabled={disabled}
                className={cn(inputClass, "pr-10")}
                placeholder="Minimum 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
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
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmedPassword">
              Confirm password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmedPassword"
                name="confirmedPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmedPassword}
                onChange={handleChange}
                disabled={disabled}
                className={cn(inputClass, "pr-10")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                aria-label={
                  showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmedPassword && (
              <p className="text-sm text-red-600">{errors.confirmedPassword}</p>
            )}
          </div>
        </FormSection>

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-2 sm:flex-row">
          <Button
            type="submit"
            variant="brand"
            className="flex-1"
            disabled={disabled}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating member…
              </>
            ) : isSuccess ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Member created
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Create user
              </>
            )}
          </Button>
          {isSuccess && (
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-slate-200"
              onClick={() => {
                setIsSuccess(false);
                resetForm();
              }}
            >
              Add another
            </Button>
          )}
        </div>
      </form>
    </SectionCard>
  );
}
