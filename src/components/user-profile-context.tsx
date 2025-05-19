// "use client"

// import { createContext, useContext, useState, type ReactNode } from "react"

// interface UserProfile {
//   name: string
//   email: string
//   phone: string
//   organizationName: string
//   avatarUrl: string
// }

// interface UserProfileContextType {
//   userProfile: UserProfile | null
//   updateUserProfile: (profile: Partial<UserProfile>) => void
// }

// const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)

// export function UserProfileProvider({ children }: { children: ReactNode }) {
//   const [userProfile, setUserProfile] = useState<UserProfile>({
//     name: "Dr. Jane Smith",
//     email: "jane.smith@hospital.com",
//     phone: "+234 812 345 6789",
//     organizationName: "City General Hospital",
//     avatarUrl: "",
//   })

//   const updateUserProfile = (profile: Partial<UserProfile>) => {
//     setUserProfile((prev) => ({ ...prev, ...profile }))
//   }

//   return (
//     <UserProfileContext.Provider value={{ userProfile, updateUserProfile }}>{children}</UserProfileContext.Provider>
//   )
// }

// export function useUserProfile() {
//   const context = useContext(UserProfileContext)
//   if (context === undefined) {
//     throw new Error("useUserProfile must be used within a UserProfileProvider")
//   }
//   return context
// }


"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/AuthContext"

// Define the shape of the user profile with separate first and last names
interface UserProfile {
  firstName: string
  lastName: string
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
  const { user } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  // Initialize or update profile whenever the auth user changes
  useEffect(() => {
    if (user) {
      // Split full name into first and last names
      const [firstName, ...rest] = user.name.trim().split(" ")
      const lastName = rest.join(" ") || ""

      setUserProfile({
        firstName,
        lastName,
        email: user.email,
        phone: user.phone || "",
        organizationName: user.organizationName || "",
        avatarUrl: user.avatarUrl || "",
      })
    } else {
      setUserProfile(null)
    }
  }, [user])

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => prev ? { ...prev, ...profile } : prev)
  }

  return (
    <UserProfileContext.Provider value={{ userProfile, updateUserProfile }}>
      {children}
    </UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  const context = useContext(UserProfileContext)
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider")
  }
  return context
}
