"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload } from "lucide-react"
import { motion } from "framer-motion"
import { useUserProfile } from "@/components/user-profile-context"

export function ProfileForm() {
  const { userProfile, updateUserProfile } = useUserProfile()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organizationName: "",
    avatarUrl: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        organizationName: userProfile.organizationName || "",
        avatarUrl: userProfile.avatarUrl || "",
      })
    }
  }, [userProfile])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      
      updateUserProfile(formData)
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
      
      // Reset success state after a delay
      setTimeout(() => {
        setIsSuccess(false)
      }, 2000)
    }, 1500)
  }

  // Function to get initials from name
  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information and preferences</CardDescription>
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
                    <AvatarImage src={formData.avatarUrl || "/placeholder.svg"} alt={formData.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {getInitials(formData.name)}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <Button 
                  type="button" 
                  size="icon" 
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Label htmlFor="organiZationName">Organization Name</Label>
                <Input
                  id="organiZationName"
                  name="organiZationName"
                  placeholder="Enter your Organization name"
                  value={formData.organizationName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </motion.div>
            </div>

          
          </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full button-hover-effect" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>)}
