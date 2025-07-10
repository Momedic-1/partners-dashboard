"use client";

import React, { useState } from "react";
import axios from "@/lib/axios";
import { baseUrl } from "@/env";
import { useAuth } from "@/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Check, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    date: "", // Date of birth
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmedPassword)
      newErrors.confirmedPassword = "Passwords do not match";
    if (!formData.gender) newErrors.gender = "Please select a gender";
    if (!formData.date.trim()) newErrors.date = "Date of birth is required";
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
      if (!user?.id || !token) throw new Error("Not authenticated");

      await axios.post(
        `${baseUrl}/api/organization/createNewUser/${user.id}`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData?.email,
          phoneNumber: formData.phone,
          password: formData.password,
          confirmedPassword: formData.confirmedPassword,
          gender: formData.gender,
          date: formData.date, // send date
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsSuccess(true);
      toast({
        title: "User created successfully",
        description: `${formData.firstName} ${formData.lastName} has been added to your users.`,
      });
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Creation failed",
        description: err.message || "Unable to create user.",
      });
    } finally {
      setIsSubmitting(false);
      if (isSuccess) {
        setTimeout(() => {
          setIsSuccess(false);
          resetForm();
        }, 2000);
      }
    }
  };

  const getInitials = (first = "", last = "") => {
    return (first[0] || "") + (last[0] || "");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
          <CardDescription>Add a new user to your organization</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-6">
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Avatar className="h-24 w-24 backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-full hover:scale-105 transition-transform duration-300">
                  <AvatarFallback className="text-white text-2xl font-bold uppercase tracking-wide bg-black/40">
                    {isSuccess ? (
                      <Check className="h-8 w-8" />
                    ) : (
                      getInitials(formData.firstName, formData.lastName)
                    )}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2 space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting || isSuccess}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>

              <div className="w-full md:w-1/2 space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting || isSuccess}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
            </div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Label htmlFor="date">Date of Birth</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                disabled={isSubmitting || isSuccess} 
                className="cursor-pointer"
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date}</p>
              )}
            </motion.div>

            {["email", "phone", "password", "confirmedPassword"].map(
              (id, idx) => (
                <motion.div
                  key={id}
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (idx + 2) * 0.1, duration: 0.5 }}
                >
                  <Label htmlFor={id}>
                    {id === "email"
                      ? "Email Address"
                      : id === "phone"
                      ? "Phone Number"
                      : id === "password"
                      ? "Password"
                      : "Confirm Password"}
                    {id === "email" && (
                      <span className="text-red-500 text-sm ml-2">
                        (optional)
                      </span>
                    )}
                  </Label>
                  <Input
                    id={id}
                    name={id}
                    type={
                      id.includes("password")
                        ? "password"
                        : id === "phone"
                        ? "tel"
                        : "email"
                    }
                    value={formData[id as keyof typeof formData]}
                    onChange={handleChange}
                    required={id !== "email"}
                    disabled={isSubmitting || isSuccess}
                  />
                  {errors[id] && (
                    <p className="text-red-500 text-sm">{errors[id]}</p>
                  )}
                </motion.div>
              )
            )}

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={isSubmitting || isSuccess}
                className="w-full border border-gray-300 rounded p-2"
                required
              >
                <option value="">Select gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender}</p>
              )}
            </motion.div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating...
                </>
              ) : isSuccess ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  User Created
                </>
              ) : (
                <>
                  <User className="mr-2 h-4 w-4" />
                  Create User
                </>
              )}
            </Button>

            {isSuccess && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsSuccess(false);
                  resetForm();
                }}
              >
                Create Another User
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
