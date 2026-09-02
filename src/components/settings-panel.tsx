"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { baseUrl } from "@/env";
import { useAuth } from "@/AuthContext";
import { getOrganizationId } from "@/lib/organization";
import { ProfileForm } from "@/components/profile-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Trash2, UserPlus, Shield } from "lucide-react";

type AdminMember = {
  id: number;
  fullName: string;
  email: string;
  superAdmin: boolean;
  mustChangePassword: boolean;
};

export function SettingsPanel() {
  const { user, token, setMustChangePassword } = useAuth();
  const orgId = getOrganizationId(user);
  const isSuperAdmin = user?.superAdmin === true;

  const [admins, setAdmins] = useState<AdminMember[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adding, setAdding] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const loadAdmins = async () => {
    if (!token || !orgId) {
      setLoadingAdmins(false);
      return;
    }
    setLoadingAdmins(true);
    try {
      const res = await axios.get(`${baseUrl}/api/organization/${orgId}/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(Array.isArray(res.data) ? res.data : []);
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      toast({
        variant: "destructive",
        title: "Could not load admins",
        description: ax.response?.data?.message || "Please try again.",
      });
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    loadAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, orgId]);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !orgId) return;
    setAdding(true);
    try {
      const res = await axios.post(
        `${baseUrl}/api/organization/${orgId}/admins`,
        {
          fullName,
          email,
          password: password || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const tempPw =
        (res.data as { temporaryPassword?: string })?.temporaryPassword ||
        password ||
        "";
      toast({
        title: "Admin added",
        description: tempPw
          ? `Invite emailed with password. They must change it on first login. Password: ${tempPw}`
          : "They will receive an invite email and must change password on first login.",
      });
      setFullName("");
      setEmail("");
      setPassword("");
      await loadAdmins();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      toast({
        variant: "destructive",
        title: "Could not add admin",
        description: ax.response?.data?.message || "Please try again.",
      });
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteAdmin = async (adminId: number) => {
    if (!token || !orgId) return;
    if (!confirm("Remove this admin from the organization dashboard?")) return;
    try {
      await axios.delete(`${baseUrl}/api/organization/${orgId}/admins/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: "Admin removed" });
      await loadAdmins();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      toast({
        variant: "destructive",
        title: "Could not remove admin",
        description: ax.response?.data?.message || "Please try again.",
      });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "New password must be at least 8 characters.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
      });
      return;
    }
    setChangingPassword(true);
    try {
      await axios.post(
        `${baseUrl}/api/organization/change-password`,
        { currentPassword, newPassword, confirmPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMustChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({ title: "Password updated" });
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      toast({
        variant: "destructive",
        title: "Could not update password",
        description: ax.response?.data?.message || "Please try again.",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <ProfileForm />

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>Update your dashboard login password anytime.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="grid max-w-md gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <Button type="submit" disabled={changingPassword} variant="brand" className="w-fit">
              {changingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Organization admins
          </CardTitle>
          <CardDescription>
            People who can sign in to this partners dashboard. Only the super admin can add or
            remove others.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loadingAdmins ? (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading admins…
            </div>
          ) : (
            <ul className="divide-y rounded-lg border">
              {admins.map((admin) => (
                <li
                  key={admin.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">{admin.fullName}</p>
                    <p className="text-sm text-slate-500">{admin.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {admin.superAdmin ? (
                      <Badge className="border-transparent bg-[#020E7C] text-white hover:bg-[#020E7C]">
                        Super admin
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Admin</Badge>
                    )}
                    {isSuperAdmin && !admin.superAdmin && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleDeleteAdmin(admin.id)}
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {isSuperAdmin ? (
            <form onSubmit={handleAddAdmin} className="grid max-w-lg gap-4 rounded-lg border p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <UserPlus className="h-4 w-4" />
                Add admin
              </p>
              <div className="space-y-2">
                <Label htmlFor="inviteAdminFullName">Full name</Label>
                <Input
                  id="inviteAdminFullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inviteAdminEmail">Email</Label>
                <Input
                  id="inviteAdminEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inviteAdminPassword">
                  Temporary password (optional — generated if blank)
                </Label>
                <Input
                  id="inviteAdminPassword"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                />
              </div>
              <Button type="submit" disabled={adding} variant="brand" className="w-fit">
                {adding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Invite admin
              </Button>
            </form>
          ) : (
            <p className="text-sm text-slate-500">
              Ask your organization super admin if you need to invite another admin.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
