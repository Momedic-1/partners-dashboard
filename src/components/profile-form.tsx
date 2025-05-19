


"use client"

import { useState, useEffect } from "react"
import axios from '@/lib/axios'
import { baseUrl } from '@/env'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from '@/AuthContext'

export function ProfileForm() {
  const { user, token } = useAuth()

  const [formData, setFormData] = useState({
    adminFullName: "",
    organizationEmail: "",
    organizationPhone: "",
    organizationName: "",
    
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Fetch admin info
  useEffect(() => {
    const fetchAdminInfo = async () => {
      if (!user || !token) {
        setError('Not authenticated')
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const res = await axios.get(
          `${baseUrl}/api/organization/${user.id}/admin-info`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const data = res.data
        setFormData({
          adminFullName: data.adminFullName || "",
          organizationEmail: data.organizationEmail || "",
          organizationPhone: data.organizationPhone || "",
          organizationName: data.organizationName || "",
          
        })
      } catch (err: any) {
        console.error('Error fetching admin info', err)
        setError('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }
    fetchAdminInfo()
  }, [user, token])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await axios.put(
        `${baseUrl}/api/organization/${user?.id}/admin-info`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setIsSuccess(true)
      toast({ title: 'Profile updated', description: 'Your profile has been updated successfully.' })
    } catch (err: any) {
      console.error('Error updating profile', err)
      toast({ variant: 'destructive', title: 'Update failed', description: 'Unable to save changes.' })
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setIsSuccess(false), 2000)
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (loading) {
    return <div className="text-center p-6">Loading profile...</div>
  }

  if (error) {
    return <div className="text-center p-6 text-red-500">{error}</div>
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>

        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Avatar className="h-24 w-24">

                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {getInitials(formData.adminFullName)}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <Button
                  type="button"
                  size="icon"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
                >
                  {/* <Upload className="h-4 w-4" /> */}
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name"> Admin Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.adminFullName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.organizationEmail}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.organizationPhone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  readOnly
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
    </motion.div>
  )
}
