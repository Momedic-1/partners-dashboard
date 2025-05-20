// // "use client"

// // import type React from "react"
// // import { useState } from "react"
// // import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// // import { toast } from "@/components/ui/use-toast"
// // import { motion } from "framer-motion"
// // import { CreditCard, Landmark, Smartphone } from "lucide-react"

// // export function FundWalletForm() {
// //   const [amount, setAmount] = useState("")
// //   const [paymentMethod, setPaymentMethod] = useState("card")
// //   const [isLoading, setIsLoading] = useState(false)

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault()
// //     setIsLoading(true)

// //     // Simulate API call
// //     setTimeout(() => {
// //       setIsLoading(false)
// //       toast({
// //         title: "Wallet funded successfully",
// //         description: `₦${Number.parseInt(amount).toLocaleString()} has been added to your wallet.`,
// //       })
// //       setAmount("")
// //     }, 1500)
// //   }

// //   const paymentMethods = [
// //     {
// //       id: "card",
// //       label: "Credit/Debit Card",
// //       icon: CreditCard,
// //     },
// //     {
// //       id: "transfer",
// //       label: "Bank Transfer",
// //       icon: Landmark,
// //     },
// //     {
// //       id: "ussd",
// //       label: "USSD",
// //       icon: Smartphone,
// //     },
// //   ]

// //   return (
// //     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
// //       <Card>
// //         <CardHeader>
// //           <CardTitle>Fund Your Wallet</CardTitle>
// //           <CardDescription>Add funds to your wallet to enable consultations for your users</CardDescription>
// //         </CardHeader>
// //         <form onSubmit={handleSubmit}>
// //           <CardContent className="space-y-6">
// //             <motion.div
// //               className="space-y-2"
// //               initial={{ opacity: 0, x: -20 }}
// //               animate={{ opacity: 1, x: 0 }}
// //               transition={{ delay: 0.1, duration: 0.5 }}
// //             >
// //               <Label htmlFor="amount">Amount (₦)</Label>
// //               <div className="relative">
// //                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
// //                 <Input
// //                   id="amount"
// //                   type="number"
// //                   placeholder="Enter amount"
// //                   value={amount}
// //                   onChange={(e) => setAmount(e.target.value)}
// //                   className="pl-8"
// //                   required
// //                 />
// //               </div>
// //             </motion.div>

// //             <motion.div
// //               className="space-y-4"
// //               initial={{ opacity: 0, x: -20 }}
// //               animate={{ opacity: 1, x: 0 }}
// //               transition={{ delay: 0.2, duration: 0.5 }}
// //             >
// //               <Label>Payment Method</Label>
// //               <RadioGroup
// //                 defaultValue={paymentMethod}
// //                 onValueChange={setPaymentMethod}
// //                 className="grid grid-cols-1 md:grid-cols-3 gap-4"
// //               >
// //                 {paymentMethods.map((method) => (
// //                   <motion.div key={method.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
// //                     <Label
// //                       htmlFor={method.id}
// //                       className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
// //                         paymentMethod === method.id
// //                           ? "border-primary bg-primary/5"
// //                           : "border-muted hover:border-primary/50"
// //                       }`}
// //                     >
// //                       <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
// //                       <method.icon
// //                         className={`h-6 w-6 mb-2 ${
// //                           paymentMethod === method.id ? "text-primary" : "text-muted-foreground"
// //                         }`}
// //                       />
// //                       <span
// //                         className={`text-sm font-medium ${
// //                           paymentMethod === method.id ? "text-primary" : "text-muted-foreground"
// //                         }`}
// //                       >
// //                         {method.label}
// //                       </span>
// //                     </Label>
// //                   </motion.div>
// //                 ))}
// //               </RadioGroup>
// //             </motion.div>
// //           </CardContent>
// //           <CardFooter>
// //             <Button type="submit" className="w-full button-hover-effect" disabled={!amount || isLoading}>
// //               {isLoading ? (
// //                 <motion.div
// //                   animate={{ rotate: 360 }}
// //                   transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
// //                   className="mr-2"
// //                 >
// //                   <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
// //                     <circle
// //                       className="opacity-25"
// //                       cx="12"
// //                       cy="12"
// //                       r="10"
// //                       stroke="currentColor"
// //                       strokeWidth="4"
// //                     ></circle>
// //                     <path
// //                       className="opacity-75"
// //                       fill="currentColor"
// //                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
// //                     ></path>
// //                   </svg>
// //                 </motion.div>
// //               ) : null}
// //               {isLoading ? "Processing..." : "Fund Wallet"}
// //             </Button>
// //           </CardFooter>
// //         </form>
// //       </Card>
// //     </motion.div>
// //   )
// // }

// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { toast } from "@/components/ui/use-toast"
// import { motion } from "framer-motion"
// import { ArrowUpRight, Wallet } from "lucide-react"
// import { useAuth } from "@/AuthContext"
// import axios from "@/lib/axios"
// import { baseUrl } from "@/env"

// export function FundWalletForm() {
//   const { user, token } = useAuth()
//   const router = useRouter()
//   const [amount, setAmount] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [isVerifying, setIsVerifying] = useState(false)
//   const [verificationMessage, setVerificationMessage] = useState(null)
//   const [walletBalance, setWalletBalance] = useState(0)
//   const [loadingBalance, setLoadingBalance] = useState(true)
  
//   const orgId = user?.id

//   useEffect(() => {
//     // Check if we have a reference in the URL for payment verification
//     const params = new URLSearchParams(window.location.search)
//     const reference = params.get('reference')
    
//     if (reference) {
//       setIsVerifying(true)
//       verifyPayment(reference)
//     }
//   }, [token, orgId])

//   const handleSubmit = async (e: { preventDefault: () => void }) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       // Initiate payment with orgId included
//       const response = await axios.post(`${baseUrl}/api/payment/fund`, {
//         amount: Number(amount),
//         organizationId: orgId
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         }
//       })

//       // Check if the payment was initiated successfully
//       if (response.data && response.data.authorization_url) {
//         // Redirect to payment gateway
//         window.location.href = response.data.authorization_url
//       } else {
//         toast({
//           title: "Payment Error",
//           description: "Failed to initiate payment. Please try again.",
//           variant: "destructive"
//         })
//         setIsLoading(false)
//       }
//     } catch (error) {
//       console.error("Payment initiation error:", error)
//       toast({
//         title: "Payment Error",
//         description: error.response?.data?.message || "Failed to initiate payment. Please try again.",
//         variant: "destructive"
//       })
//       setIsLoading(false)
//     }
//   }

//   const verifyPayment = async (reference: string) => {
//     try {
//       const response = await axios.get(`${baseUrl}/api/payment/verify/${reference}`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       })
      
//       setVerificationMessage(response.data.message || "Payment verified successfully!")
      
//       // Show success toast
//       toast({
//         title: "Payment Successful",
//         description: "Your wallet has been funded successfully.",
//       })
      
//       // Remove reference from URL without reloading the page
//       window.history.replaceState({}, document.title, window.location.pathname)
//     } catch (error) {
//       setVerificationMessage(error.response?.data?.message || "Payment verification failed. Please contact support.")
      
//       // Show error toast
//       toast({
//         title: "Verification Failed",
//         description: "There was an issue verifying your payment.",
//         variant: "destructive"
//       })
//     } finally {
//       setIsVerifying(false)
//     }
//   }

//   const goToDashboard = () => {
//     router.push('/dashboard')
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }} 
//         animate={{ opacity: 1, y: 0 }} 
//         transition={{ duration: 0.5 }}
//       >
//         {/* Wallet Balance Card */}
//         <Card className="mb-8">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-primary/10 to-primary/5">
//             <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
//             <Wallet className="h-4 w-4 text-primary" />
//           </CardHeader>
//           <CardContent className="pt-6">
//             <motion.div
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ delay: 0.2, duration: 0.5 }}
//               className="text-2xl font-bold"
//             >
//               {/* Wallet balance display is static or can be passed as prop */}
//               ₦0.00
//             </motion.div>
//             <p className="text-xs text-muted-foreground mt-1">
//               Available for consultations
//             </p>
//           </CardContent>
//         </Card>
        
//         {/* Payment Verification Message */}
//         {isVerifying && (
//           <Card className="mb-8">
//             <CardHeader>
//               <CardTitle>Payment Verification</CardTitle>
//             </CardHeader>
//             <CardContent className="text-center">
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
//                 className="flex justify-center"
//               >
//                 <svg className="h-12 w-12 animate-spin text-primary" viewBox="0 0 24 24">
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//               </motion.div>
//               <p className="mt-4">Verifying your payment...</p>
//             </CardContent>
//           </Card>
//         )}
        
//         {verificationMessage && !isVerifying && (
//           <Card className="mb-8">
//             <CardHeader>
//               <CardTitle>Payment Result</CardTitle>
//             </CardHeader>
//             <CardContent className="text-center">
//               <p className="text-lg">{verificationMessage}</p>
//             </CardContent>
//             <CardFooter>
//               <Button 
//                 onClick={goToDashboard} 
//                 className="w-full"
//               >
//                 Go to Dashboard
//                 <ArrowUpRight className="ml-2 h-4 w-4" />
//               </Button>
//             </CardFooter>
//           </Card>
//         )}
        
//         {/* Fund Wallet Form */}
//         {!isVerifying && !verificationMessage && (
//           <Card>
//             <CardHeader>
//               <CardTitle>Fund Your Wallet</CardTitle>
//               <CardDescription>Add funds to your wallet to enable consultations for your users</CardDescription>
//             </CardHeader>
//             <form onSubmit={handleSubmit}>
//               <CardContent className="space-y-6">
//                 <motion.div
//                   className="space-y-2"
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.1, duration: 0.5 }}
//                 >
//                   <Label htmlFor="amount">Amount (₦)</Label>
//                   <div className="relative">
//                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
//                     <Input
//                       id="amount"
//                       type="number"
//                       placeholder="Enter amount"
//                       value={amount}
//                       onChange={(e) => setAmount(e.target.value)}
//                       className="pl-8"
//                       required
//                     />
//                   </div>
//                 </motion.div>
//               </CardContent>
//               <CardFooter>
//                 <Button type="submit" className="w-full button-hover-effect" disabled={!amount || isLoading}>
//                   {isLoading ? (
//                     <motion.div
//                       animate={{ rotate: 360 }}
//                       transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
//                       className="mr-2"
//                     >
//                       <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         ></circle>
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         ></path>
//                       </svg>
//                     </motion.div>
//                   ) : null}
//                   {isLoading ? "Processing..." : "Make Payment"}
//                 </Button>
//               </CardFooter>
//             </form>
//           </Card>
//         )}
//       </motion.div>
//     </div>
//   )
// }



// import React, { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { toast } from "@/components/ui/use-toast"
// import { motion } from "framer-motion"
// import { ArrowUpRight, Wallet } from "lucide-react"
// import { useAuth } from "@/AuthContext"
// import axios from "@/lib/axios"
// import { baseUrl } from "@/env"

// export function FundWalletForm() {
//   const { user, token } = useAuth()
//   const router = useRouter()
//   const [amount, setAmount] = useState<string>("")
//   const [isLoading, setIsLoading] = useState<boolean>(false)
//   const [isVerifying, setIsVerifying] = useState<boolean>(false)
//   const [verificationMessage, setVerificationMessage] = useState<string | null>(null)

//   const orgId = user?.id

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search)
//     const reference = params.get('reference')
//     if (reference) {
//       setIsVerifying(true)
//       verifyPayment(reference)
//     }
//   }, [])

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     if (!orgId) {
//       toast({ title: "Organization not found", variant: "destructive" })
//       return
//     }
//     if (!amount || isNaN(Number(amount))) {
//       toast({ title: "Invalid amount", variant: "destructive" })
//       return
//     }
//     setIsLoading(true)
//     try {
//       // Send as query params for @RequestParam
//       const response = await axios.post(
//         `${baseUrl}/api/payment/fund`,
//         null,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//           params: { organizationId: orgId, amount: Number(amount) },
//         }
//       )

//       if (response.data?.authorization_url) {
//         window.location.href = response.data.authorization_url
//       } else {
//         throw new Error('No authorization URL')
//       }
//     } catch (error: any) {
//       console.error("Payment initiation error:", error)
//       toast({
//         title: "Payment Error",
//         description:
//           error.response?.data?.message || error.message ||
//           "Failed to initiate payment. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const verifyPayment = async (reference: string) => {
//     try {
//       const response = await axios.get(
//         `${baseUrl}/api/payment/verify/${reference}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       )
//       setVerificationMessage(response.data.message || "Payment verified successfully!")
//       toast({ title: "Payment Successful", description: "Your wallet has been funded successfully." })
//       window.history.replaceState({}, document.title, window.location.pathname)
//     } catch (error: any) {
//       setVerificationMessage(
//         error.response?.data?.message || "Payment verification failed. Please contact support."
//       )
//       toast({
//         title: "Verification Failed",
//         description: "There was an issue verifying your payment.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsVerifying(false)
//     }
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         {/* Wallet Balance Card */}
//         <Card className="mb-8">
//           <CardHeader className="flex items-center justify-between pb-2 bg-gradient-to-r from-primary/10 to-primary/5">
//             <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
//             <Wallet className="h-4 w-4 text-primary" />
//           </CardHeader>
//           <CardContent className="pt-6">
//             <motion.div
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ delay: 0.2, duration: 0.5 }}
//               className="text-2xl font-bold"
//             >
//               ₦0.00
//             </motion.div>
//             <p className="text-xs text-muted-foreground mt-1">
//               Available for consultations
//             </p>
//           </CardContent>
//         </Card>

//         {/* Verification */}
//         {isVerifying && (
//           <Card className="mb-8">
//             <CardHeader>
//               <CardTitle>Payment Verification</CardTitle>
//             </CardHeader>
//             <CardContent className="text-center">
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
//                 className="flex justify-center"
//               >
//                 <svg className="h-12 w-12 animate-spin text-primary" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2-647z"
//                   />
//                 </svg>
//               </motion.div>
//               <p className="mt-4">Verifying your payment...</p>
//             </CardContent>
//           </Card>
//         )}

//         {/* Result */}
//         {verificationMessage && !isVerifying && (
//           <Card className="mb-8">
//             <CardHeader>
//               <CardTitle>Payment Result</CardTitle>
//             </CardHeader>
//             <CardContent className="text-center">
//               <p className="text-lg">{verificationMessage}</p>
//             </CardContent>
//             <CardFooter>
//               <Button onClick={() => router.push('/dashboard')} className="w-full">
//                 Go to Dashboard
//                 <ArrowUpRight className="ml-2 h-4 w-4" />
//               </Button>
//             </CardFooter>
//           </Card>
//         )}

//         {/* Fund Form */}
//         {!isVerifying && !verificationMessage && (
//           <Card>
//             <CardHeader>
//               <CardTitle>Fund Your Wallet</CardTitle>
//               <CardDescription>
//                 Add funds to your wallet to enable consultations for your users
//               </CardDescription>
//             </CardHeader>
//             <form onSubmit={handleSubmit}>
//               <CardContent className="space-y-6">
//                 <motion.div
//                   className="space-y-2"
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.1, duration: 0.5 }}
//                 >
//                   <Label htmlFor="amount">Amount (₦)</Label>
//                   <div className="relative">
//                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
//                     <Input
//                       id="amount"
//                       type="number"
//                       placeholder="Enter amount"
//                       value={amount}
//                       onChange={(e) => setAmount(e.target.value)}
//                       className="pl-8"
//                       required
//                     />
//                   </div>
//                 </motion.div>
//               </CardContent>
//               <CardFooter>
//                 <Button type="submit" className="w-full" disabled={!amount || isLoading}>
//                   {isLoading ? (
//                     <motion.div
//                       animate={{ rotate: 360 }}
//                       transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
//                       className="mr-2"
//                     >
//                       <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         />
//                       </svg>
//                     </motion.div>
//                   ) : null}
//                   {isLoading ? "Processing..." : "Make Payment"}
//                 </Button>
//               </CardFooter>
//             </form>
//           </Card>
//         )}
//       </motion.div>
//     </div>
//   )
// }
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { ArrowUpRight, Wallet } from "lucide-react"
import { useAuth } from "@/AuthContext"
import axios from "@/lib/axios"
import { baseUrl } from "@/env"

const PAYSTACK_CHECKOUT_URL = "https://checkout.paystack.com/g6dg64fkfh90slq"

export function FundWalletForm() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [amount, setAmount] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isVerifying, setIsVerifying] = useState<boolean>(false)
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null)

  const orgId = user?.id

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const reference = params.get('reference')
    if (reference) {
      setIsVerifying(true)
      verifyPayment(reference)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!orgId) {
      toast({ title: "Organization not found", variant: "destructive" })
      return
    }
    if (!amount || isNaN(Number(amount))) {
      toast({ title: "Invalid amount", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      // register payment intent on backend
      await axios.post(
        `${baseUrl}/api/payment/fund`,
        null,
        {
          headers: { 'Authorization': `Bearer ${token}` },
          params: { organizationId: orgId, amount: Number(amount) },
        }
      )
      // redirect user to Paystack checkout
      window.location.href = PAYSTACK_CHECKOUT_URL
    } catch (error: any) {
      console.error("Payment initiation error:", error)
      toast({
        title: "Payment Error",
        description:
          error.response?.data?.message || error.message ||
          "Failed to initiate payment. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const verifyPayment = async (reference: string) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/payment/verify/${reference}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      setVerificationMessage(response.data.message || "Payment verified successfully!")
      toast({ title: "Payment Successful", description: "Your wallet has been funded." })
      window.history.replaceState({}, document.title, window.location.pathname)
    } catch (error: any) {
      setVerificationMessage(
        error.response?.data?.message || "Verification failed. Contact support."
      )
      toast({ title: "Verification Failed", description: "Issue verifying payment.", variant: "destructive" })
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-8">
          <CardHeader className="flex items-center justify-between pb-2 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="pt-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl font-bold"
            >
              ₦0.00
            </motion.div>
            <p className="text-xs text-muted-foreground mt-1">Available for consultations</p>
          </CardContent>
        </Card>

        {isVerifying && (
          <Card className="mb-8">
            <CardHeader><CardTitle>Verifying Payment</CardTitle></CardHeader>
            <CardContent className="text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="flex justify-center">
                <svg className="h-12 w-12 animate-spin text-primary" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
              </motion.div>
              <p className="mt-4">Verifying your payment...</p>
            </CardContent>
          </Card>
        )}

        {verificationMessage && !isVerifying && (
          <Card className="mb-8">
            <CardHeader><CardTitle>Payment Result</CardTitle></CardHeader>
            <CardContent className="text-center"><p className="text-lg">{verificationMessage}</p></CardContent>
            <CardFooter><Button onClick={() => router.push('/dashboard')} className="w-full">Go to Dashboard<ArrowUpRight className="ml-2 h-4 w-4"/></Button></CardFooter>
          </Card>
        )}

        {!isVerifying && !verificationMessage && (
          <Card>
            <CardHeader>
              <CardTitle>Fund Your Wallet</CardTitle>
              <CardDescription>Add funds to your wallet to enable consultations</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <motion.div className="space-y-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
                  <Label htmlFor="amount">Amount (₦)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                    <Input id="amount" type="number" placeholder="Enter amount" value={amount} onChange={e => setAmount(e.target.value)} className="pl-8" required />
                  </div>
                </motion.div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={!amount || isLoading}>
                  {isLoading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="mr-2"><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg></motion.div> : null}
                  {isLoading ? "Processing..." : "Make Payment"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
