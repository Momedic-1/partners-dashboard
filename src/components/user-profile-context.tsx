"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface UserProfile {
  name: string
  email: string
  phone: string
  organizationName: string
  avatarUrl: string
}

interface UserProfileContextType {
  userProfile: UserProfile | null
  updateUserProfile: (profile: Partial<UserProfile>) => void
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Dr. Jane Smith",
    email: "jane.smith@hospital.com",
    phone: "+234 812 345 6789",
    organizationName: "City General Hospital",
    avatarUrl: "",
  })

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }))
  }

  return (
    <UserProfileContext.Provider value={{ userProfile, updateUserProfile }}>{children}</UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  const context = useContext(UserProfileContext)
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider")
  }
  return context
}
