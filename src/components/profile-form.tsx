"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { baseUrl } from "@/env";
import {
  Card,
  CardContent,
  // CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Upload } from "lucide-react";
import { useAuth } from "@/AuthContext";
import { getOrganizationId } from "@/lib/organization";

export function ProfileForm() {
  const { user, token } = useAuth();
  const orgId = getOrganizationId(user);

  const [formData, setFormData] = useState({
    adminFullName: "",
    organizationEmail: "",
    organizationPhone: "",
    organizationName: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch admin info
  useEffect(() => {
    const fetchAdminInfo = async () => {
      if (!user || !token || !orgId) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get(
          `${baseUrl}/api/organization/${orgId}/admin-info`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data;
        setFormData({
          adminFullName: data.adminFullName || "",
          organizationEmail: data.organizationEmail || "",
          organizationPhone: data.organizationPhone || "",
          organizationName: data.organizationName || "",
        });
      } catch (err: any) {
        console.error("Error fetching admin info", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminInfo();
  }, [user, token, orgId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.put(
        `${baseUrl}/api/organization/${orgId}/admin-info`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsSuccess(true);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (err: any) {
      console.error("Error updating profile", err);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Unable to save changes.",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setIsSuccess(false), 2000);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return <div className="text-center p-6">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-500">{error}</div>;
  }

  return (
    <div>
      <Card className="border border-slate-200/80 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-slate-900">Organization profile</CardTitle>
          <p className="text-sm text-slate-500">
            Profile details are read-only for partner accounts.
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-[#020E7C]/20 shadow-md">
                  <AvatarFallback className="text-2xl font-bold uppercase bg-[#020E7C] text-white">
                    {getInitials(formData.adminFullName)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="adminFullName">Admin Full Name</Label>
                <Input
                  id="adminFullName"
                  name="adminFullName"
                  placeholder="Enter your full name"
                  value={formData.adminFullName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  readOnly
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="organizationEmail"
                  name="organizationEmail"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.organizationEmail}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  readOnly
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="organizationPhone"
                  name="organizationPhone"
                  placeholder="Enter your phone number"
                  value={formData.organizationPhone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  readOnly
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  name="organizationName"
                  placeholder="Enter your organization name"
                  value={formData.organizationName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  readOnly
                  className="bg-slate-50 border-slate-200"
                />
              </div>
            </div>
          </CardContent>
          {/* <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter> */}
        </form>
      </Card>
    </div>
  );
}
