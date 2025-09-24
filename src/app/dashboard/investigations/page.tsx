// "use client";

// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Download,
//   Filter,
//   Search,
//   Loader2,
//   Lock,
//   AlertCircle,
//   Calendar,
//   User,
//   FileSearch,
//   Clipboard,
//   FileText,
//   Shield,
//   RefreshCw,
//   X,
//   Microscope,
//   CreditCard,
//   Wallet,
//   Building2,
//   CheckCircle,
// } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
//   DropdownMenuLabel,
// } from "@/components/ui/dropdown-menu";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// // Mock axios and baseUrl for demonstration
// const axios = {
//   get: async (url, config) => {
//     console.log('GET request to:', url, config);
//     return { data: mockInvestigations };
//   },
//   post: async (url, data, config) => {
//     console.log('POST request to:', url, data, config);
//     return { data: { success: true, paymentUrl: 'https://checkout.paystack.com/abc123' } };
//   },
//   put: async (url, data, config) => {
//     console.log('PUT request to:', url, data, config);
//     return { data: { success: true } };
//   }
// };

// const baseUrl = 'https://api.example.com';

// // Mock auth context
// const useAuth = () => ({
//   user: { id: '1' },
//   token: 'mock-token'
// });

// // Mock data
// const mockInvestigations = [
//   {
//     id: 1,
//     patientName: "John Doe",
//     patientPhone: "+234-801-234-5678",
//     patientEmail: "john.doe@email.com",
//     doctorName: "Dr. Smith",
//     orderDate: "2024-09-20T10:30:00Z",
//     items: [
//       {
//         investigationName: "Full Blood Count",
//         instruction: "Fasting required"
//       },
//       {
//         investigationName: "Blood Sugar",
//         instruction: "12-hour fast"
//       }
//     ]
//   },
//   {
//     id: 2,
//     patientName: "Jane Smith",
//     patientPhone: "+234-802-345-6789",
//     patientEmail: "jane.smith@email.com",
//     doctorName: "Dr. Johnson",
//     orderDate: "2024-09-19T14:15:00Z",
//     items: [
//       {
//         investigationName: "Lipid Profile",
//         instruction: "No special preparation"
//       }
//     ]
//   }
// ];

// interface InvestigationItem {
//   investigationName: string;
//   instruction: string;
// }

// interface InvestigationOrder {
//   id: number;
//   patientName: string;
//   patientPhone: string;
//   patientEmail: string;
//   doctorName: string;
//   orderDate: string;
//   items: InvestigationItem[];
// }

// const LAB_PARTNERS = [
//   { value: 'SILAHEALTH', label: 'SILA Health', icon: '🏥' },
//   { value: 'MedFair_Lab', label: 'MedFair Lab', icon: '🧪' }
// ];

// const InvestigationReports = () => {
//   const [investigations, setInvestigations] = useState<InvestigationOrder[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [doctorFilter, setDoctorFilter] = useState("all");
//   const [showFilters, setShowFilters] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [hasAccess, setHasAccess] = useState(true);
//   const [accessLoading, setAccessLoading] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<InvestigationOrder | null>(null);
//   const [selectedLab, setSelectedLab] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [showPaymentDialog, setShowPaymentDialog] = useState(false);
//   const [processingPayment, setProcessingPayment] = useState(false);
//   const { user, token } = useAuth();

//   const doctors = Array.from(
//     new Set(investigations.map((inv) => inv.doctorName))
//   );

//   useEffect(() => {
//     // Initialize with mock data
//     setInvestigations(mockInvestigations);
//   }, []);

//   const handleLabSelection = async (orderId: number, labPartner: string) => {
//     try {
//       setProcessingPayment(true);
//       const response = await axios.post(
//         `${baseUrl}/api/investigations/investigations/select-lab?orderId=${orderId}&labPartner=${labPartner}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );
      
//       if (response.data) {
//         console.log('Lab selected successfully');
//         return true;
//       }
//     } catch (error) {
//       console.error('Error selecting lab:', error);
//       setError('Failed to select lab partner');
//       return false;
//     } finally {
//       setProcessingPayment(false);
//     }
//   };

//   const initiatePayment = async (orderId: number, email: string, paymentMethod: string) => {
//     try {
//       setProcessingPayment(true);
//       const response = await axios.post(
//         `${baseUrl}/api/investigations/initiate-payment`,
//         {
//           orderId,
//           email,
//           paymentMethod
//         },
//         {
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       if (response.data && response.data.paymentUrl) {
//         // Redirect to payment URL
//         window.location.href = response.data.paymentUrl;
//       }
//     } catch (error) {
//       console.error('Error initiating payment:', error);
//       setError('Failed to initiate payment');
//     } finally {
//       setProcessingPayment(false);
//     }
//   };

//   const verifyPayment = async (reference: string, redirect: boolean = true) => {
//     try {
//       const response = await axios.get(
//         `${baseUrl}/api/investigations/verify-payment?reference=${reference}&redirect=${redirect}`,
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );
      
//       return response.data;
//     } catch (error) {
//       console.error('Error verifying payment:', error);
//       setError('Failed to verify payment');
//       return null;
//     }
//   };

//   const handlePaymentFlow = async (order: InvestigationOrder, method: string) => {
//     setSelectedOrder(order);
//     setPaymentMethod(method);
//     setShowPaymentDialog(true);
//   };

//   const processPayment = async () => {
//     if (!selectedOrder || !selectedLab) return;

//     // First select the lab
//     const labSelected = await handleLabSelection(selectedOrder.id, selectedLab);
    
//     if (labSelected) {
//       // Then initiate payment
//       await initiatePayment(selectedOrder.id, selectedOrder.patientEmail, paymentMethod);
//       setShowPaymentDialog(false);
//     }
//   };

//   const filteredInvestigations = investigations.filter((inv) => {
//     const matchSearch =
//       inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       inv.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       inv.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       inv.items.some((item) =>
//         item.investigationName.toLowerCase().includes(searchTerm.toLowerCase())
//       );

//     const matchDoctor =
//       doctorFilter === "all" || inv.doctorName === doctorFilter;

//     return matchSearch && matchDoctor;
//   });

//   const clearFilters = () => {
//     setSearchTerm("");
//     setDoctorFilter("all");
//   };

//   const hasActiveFilters = searchTerm !== "" || doctorFilter !== "all";

//   const totalInvestigationsCount = investigations.reduce(
//     (total, order) => total + order.items.length,
//     0
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-0 lg:p-8">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="max-w-7xl mx-auto space-y-6"
//       >
//         {/* Header Section */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.1 }}
//           className="text-center sm:text-left"
//         >
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
//             <div>
//               <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
//                 Investigation Orders
//               </h1>
//               <p className="text-gray-600 mt-2 text-lg">
//                 Comprehensive view of all client investigation orders
//               </p>
//             </div>
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//               <Button
//                 onClick={() => setInvestigations(mockInvestigations)}
//                 variant="outline"
//                 className="bg-white/80 backdrop-blur-sm border-2 hover:border-blue-300 transition-all duration-200"
//               >
//                 <RefreshCw className="mr-2 h-4 w-4" />
//                 Refresh
//               </Button>
//             </motion.div>
//           </div>

//           {/* Statistics Cards */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6"
//           >
//             <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
//               <CardContent className="p-4">
//                 <div className="flex items-center gap-3">
//                   <FileText className="h-6 w-6" />
//                   <div>
//                     <p className="text-blue-100 text-sm">Total Orders</p>
//                     <p className="text-2xl font-bold">
//                       {investigations.length}
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
//               <CardContent className="p-4">
//                 <div className="flex items-center gap-3">
//                   <User className="h-6 w-6" />
//                   <div>
//                     <p className="text-green-100 text-sm">Doctors</p>
//                     <p className="text-2xl font-bold">{doctors.length}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
//               <CardContent className="p-4">
//                 <div className="flex items-center gap-3">
//                   <Microscope className="h-6 w-6" />
//                   <div>
//                     <p className="text-purple-100 text-sm">Investigations</p>
//                     <p className="text-2xl font-bold">
//                       {totalInvestigationsCount}
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white">
//               <CardContent className="p-4">
//                 <div className="flex items-center gap-3">
//                   <Calendar className="h-6 w-6" />
//                   <div>
//                     <p className="text-amber-100 text-sm">This Month</p>
//                     <p className="text-2xl font-bold">
//                       {
//                         investigations.filter(
//                           (inv) =>
//                             new Date(inv.orderDate).getMonth() ===
//                             new Date().getMonth()
//                         ).length
//                       }
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </motion.div>

//         {/* Main Content Card */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//         >
//           <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
//             <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-white to-blue-50/50">
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                   <CardTitle className="text-xl font-semibold text-gray-900">
//                     Investigation Orders Database
//                   </CardTitle>
//                   <CardDescription className="text-gray-600 mt-1">
//                     Search, filter, and process investigation order payments
//                   </CardDescription>
//                 </div>

//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <motion.div
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
//                         <Download className="mr-2 h-4 w-4" />
//                         Export Data
//                       </Button>
//                     </motion.div>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="w-48">
//                     <DropdownMenuItem
//                       onClick={() => alert("Download CSV")}
//                       className="cursor-pointer"
//                     >
//                       <FileText className="mr-2 h-4 w-4" />
//                       Export as CSV
//                     </DropdownMenuItem>
//                     <DropdownMenuItem
//                       onClick={() => alert("Download PDF")}
//                       className="cursor-pointer"
//                     >
//                       <FileText className="mr-2 h-4 w-4" />
//                       Export as PDF
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </CardHeader>

//             <CardContent className="p-6">
//               {/* Search and Filter Controls */}
//               <div className="flex flex-col sm:flex-row gap-4 mb-6">
//                 <div className="flex-1">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//                     <Input
//                       placeholder="Search by patient, doctor, investigation name, or email..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10 bg-white/70 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex gap-2">
//                   <motion.div
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <Button
//                       variant="outline"
//                       onClick={() => setShowFilters(!showFilters)}
//                       className="bg-white/70 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
//                     >
//                       <Filter className="h-4 w-4 mr-2" />
//                       Filters
//                     </Button>
//                   </motion.div>

//                   {hasActiveFilters && (
//                     <motion.div
//                       initial={{ opacity: 0, scale: 0.8 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={clearFilters}
//                         className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                       >
//                         <X className="h-4 w-4 mr-1" />
//                         Clear
//                       </Button>
//                     </motion.div>
//                   )}
//                 </div>
//               </div>

//               {/* Filter Panel */}
//               <AnimatePresence>
//                 {showFilters && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, height: "auto", scale: 1 }}
//                     exit={{ opacity: 0, height: 0, scale: 0.95 }}
//                     transition={{ duration: 0.3, ease: "easeInOut" }}
//                     className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50"
//                   >
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                       <div className="space-y-2">
//                         <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                           <User className="h-4 w-4" />
//                           Filter by Doctor
//                         </label>
//                         <Select
//                           value={doctorFilter}
//                           onValueChange={setDoctorFilter}
//                         >
//                           <SelectTrigger className="bg-white border-gray-200 focus:border-blue-300">
//                             <SelectValue placeholder="Select doctor..." />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="all">All Doctors</SelectItem>
//                             {doctors.map((doctor) => (
//                               <SelectItem key={doctor} value={doctor}>
//                                 {doctor}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               {/* Table Container */}
//               <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
//                 <div className="overflow-x-auto">
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="bg-gradient-to-r from-gray-50 to-blue-50/50 border-gray-200">
//                         <TableHead className="font-semibold text-gray-700">
//                           <div className="flex items-center gap-2">
//                             <User className="h-4 w-4" />
//                             Patient
//                           </div>
//                         </TableHead>
//                         <TableHead className="font-semibold text-gray-700">
//                           <div className="flex items-center gap-2">
//                             <User className="h-4 w-4" />
//                             Doctor
//                           </div>
//                         </TableHead>
//                         <TableHead className="font-semibold text-gray-700">
//                           <div className="flex items-center gap-2">
//                             <Microscope className="h-4 w-4" />
//                             Investigations
//                           </div>
//                         </TableHead>
//                         <TableHead className="font-semibold text-gray-700">
//                           <div className="flex items-center gap-2">
//                             <Calendar className="h-4 w-4" />
//                             Order Date
//                           </div>
//                         </TableHead>
//                         <TableHead className="font-semibold text-gray-700">
//                           <div className="flex items-center gap-2">
//                             <Clipboard className="h-4 w-4" />
//                             Items Count
//                           </div>
//                         </TableHead>
//                         <TableHead className="font-semibold text-gray-700">
//                           <div className="flex items-center gap-2">
//                             <CreditCard className="h-4 w-4" />
//                             Actions
//                           </div>
//                         </TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {loading ? (
//                         <TableRow>
//                           <TableCell colSpan={6} className="text-center py-12">
//                             <motion.div
//                               initial={{ opacity: 0 }}
//                               animate={{ opacity: 1 }}
//                               className="flex flex-col items-center gap-4"
//                             >
//                               <motion.div
//                                 animate={{ rotate: 360 }}
//                                 transition={{
//                                   duration: 1,
//                                   repeat: Infinity,
//                                   ease: "linear",
//                                 }}
//                               >
//                                 <Loader2 className="w-8 h-8 text-blue-500" />
//                               </motion.div>
//                               <div className="text-center">
//                                 <p className="text-lg font-medium text-gray-700">
//                                   Loading Investigation Orders
//                                 </p>
//                                 <p className="text-gray-500">
//                                   Please wait while we fetch the data...
//                                 </p>
//                               </div>
//                             </motion.div>
//                           </TableCell>
//                         </TableRow>
//                       ) : error ? (
//                         <TableRow>
//                           <TableCell colSpan={6} className="text-center py-12">
//                             <motion.div
//                               initial={{ opacity: 0, scale: 0.9 }}
//                               animate={{ opacity: 1, scale: 1 }}
//                               className="flex flex-col items-center gap-4 text-red-500"
//                             >
//                               <AlertCircle className="w-12 h-12" />
//                               <div className="text-center">
//                                 <p className="text-lg font-medium">
//                                   Error Loading Data
//                                 </p>
//                                 <p className="text-red-400">{error}</p>
//                               </div>
//                             </motion.div>
//                           </TableCell>
//                         </TableRow>
//                       ) : filteredInvestigations.length === 0 ? (
//                         <TableRow>
//                           <TableCell colSpan={6} className="text-center py-12">
//                             <motion.div
//                               initial={{ opacity: 0, scale: 0.9 }}
//                               animate={{ opacity: 1, scale: 1 }}
//                               className="flex flex-col items-center gap-4 text-gray-400"
//                             >
//                               <FileSearch className="w-12 h-12" />
//                               <div className="text-center">
//                                 <p className="text-lg font-medium text-gray-600">
//                                   No Investigation Orders Found
//                                 </p>
//                                 <p>
//                                   Try adjusting your search criteria or filters
//                                 </p>
//                               </div>
//                             </motion.div>
//                           </TableCell>
//                         </TableRow>
//                       ) : (
//                         filteredInvestigations.map((order, index) => (
//                           <motion.tr
//                             key={order.id}
//                             initial={{ opacity: 0, x: -20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: index * 0.05 }}
//                             className="hover:bg-blue-50/50 transition-colors duration-200 border-b border-gray-100"
//                           >
//                             <TableCell className="py-4">
//                               <div className="space-y-1">
//                                 <p className="font-medium text-gray-900">
//                                   {order.patientName}
//                                 </p>
//                                 <p className="text-xs text-blue-600 font-medium">
//                                   {order.patientEmail}
//                                 </p>
//                                 <p className="text-xs text-gray-500">
//                                   {order.patientPhone}
//                                 </p>
//                               </div>
//                             </TableCell>
//                             <TableCell className="py-4">
//                               <div className="flex items-center gap-2">
//                                 <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
//                                   <User className="w-4 h-4 text-white" />
//                                 </div>
//                                 <span className="font-medium text-gray-700">
//                                   {order.doctorName}
//                                 </span>
//                               </div>
//                             </TableCell>
//                             <TableCell className="py-4">
//                               <div className="space-y-2 max-w-md">
//                                 {order.items.map((item, itemIndex) => (
//                                   <div
//                                     key={itemIndex}
//                                     className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
//                                   >
//                                     <div className="flex items-start gap-2">
//                                       <Microscope className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
//                                       <div className="flex-1 min-w-0">
//                                         <p className="font-medium text-gray-900 text-sm">
//                                           {item.investigationName}
//                                         </p>
//                                         {item.instruction && (
//                                           <p className="text-xs text-gray-600 mt-1 bg-white rounded px-2 py-1">
//                                             {item.instruction}
//                                           </p>
//                                         )}
//                                       </div>
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             </TableCell>
//                             <TableCell className="py-4">
//                               <div className="space-y-1">
//                                 <div className="flex items-center gap-2">
//                                   <Calendar className="w-4 h-4 text-indigo-500" />
//                                   <p className="font-medium text-gray-700">
//                                     {new Date(
//                                       order.orderDate
//                                     ).toLocaleDateString()}
//                                   </p>
//                                 </div>
//                                 <p className="text-xs text-gray-500">
//                                   {new Date(
//                                     order.orderDate
//                                   ).toLocaleTimeString()}
//                                 </p>
//                               </div>
//                             </TableCell>
//                             <TableCell className="py-4">
//                               <Badge
//                                 variant="secondary"
//                                 className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-200"
//                               >
//                                 {order.items.length}{" "}
//                                 {order.items.length === 1 ? "Item" : "Items"}
//                               </Badge>
//                             </TableCell>
//                             <TableCell className="py-4">
//                               <DropdownMenu>
//                                 <DropdownMenuTrigger asChild>
//                                   <Button 
//                                     className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
//                                     disabled={processingPayment}
//                                   >
//                                     {processingPayment ? (
//                                       <Loader2 className="w-4 h-4 animate-spin" />
//                                     ) : (
//                                       <>
//                                         <CreditCard className="mr-2 h-4 w-4" />
//                                         Pay
//                                       </>
//                                     )}
//                                   </Button>
//                                 </DropdownMenuTrigger>
//                                 <DropdownMenuContent
//                                   align="end"
//                                   className="w-56 rounded-xl shadow-xl border border-gray-200 bg-white p-2"
//                                 >
//                                   <DropdownMenuLabel className="px-4 py-2 text-sm font-semibold text-gray-700">
//                                     Payment Options
//                                   </DropdownMenuLabel>
//                                   <DropdownMenuSeparator />
//                                   <DropdownMenuItem
//                                     onClick={() => handlePaymentFlow(order, 'paystack')}
//                                     className="cursor-pointer rounded-lg px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-colors"
//                                   >
//                                     <div className="flex items-center gap-3">
//                                       <CreditCard className="h-4 w-4" />
//                                       <div>
//                                         <p className="font-medium">Pay with Paystack</p>
//                                         <p className="text-xs opacity-80">Credit/Debit Card</p>
//                                       </div>
//                                     </div>
//                                   </DropdownMenuItem>
//                                   <DropdownMenuItem
//                                     onClick={() => handlePaymentFlow(order, 'wallet')}
//                                     className="cursor-pointer rounded-lg px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:text-white transition-colors"
//                                   >
//                                     <div className="flex items-center gap-3">
//                                       <Wallet className="h-4 w-4" />
//                                       <div>
//                                         <p className="font-medium">Pay with Wallet</p>
//                                         <p className="text-xs opacity-80">Use wallet balance</p>
//                                       </div>
//                                     </div>
//                                   </DropdownMenuItem>
//                                 </DropdownMenuContent>
//                               </DropdownMenu>
//                             </TableCell>
//                           </motion.tr>
//                         ))
//                       )}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Payment Dialog */}
//         <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <DialogTitle className="flex items-center gap-2">
//                 <Building2 className="h-5 w-5 text-blue-600" />
//                 Select Lab Partner
//               </DialogTitle>
//               <DialogDescription>
//                 Choose a lab partner to process the investigation for {selectedOrder?.patientName}
//               </DialogDescription>
//             </DialogHeader>
            
//             <div className="space-y-4 py-4">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Lab Partner
//                 </label>
//                 <Select value={selectedLab} onValueChange={setSelectedLab}>
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Select a lab partner..." />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {LAB_PARTNERS.map((lab) => (
//                       <SelectItem key={lab.value} value={lab.value}>
//                         <div className="flex items-center gap-2">
//                           <span className="text-lg">{lab.icon}</span>
//                           <span>{lab.label}</span>
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {selectedOrder && (
//                 <div className="bg-gray-50 rounded-lg p-4 space-y-2">
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <User className="h-4 w-4" />
//                     <span>Patient: {selectedOrder.patientName}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <CreditCard className="h-4 w-4" />
//                     <span>Payment Method: {paymentMethod === 'paystack' ? 'Paystack' : 'Wallet'}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <Microscope className="h-4 w-4" />
//                     <span>Items: {selectedOrder.items.length}</span>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="flex gap-3 justify-end">
//               <Button 
//                 variant="outline" 
//                 onClick={() => setShowPaymentDialog(false)}
//                 disabled={processingPayment}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 onClick={processPayment}
//                 disabled={!selectedLab || processingPayment}
//                 className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
//               >
//                 {processingPayment ? (
//                   <>
//                     <Loader2 className="w-4 h-4 animate-spin mr-2" />
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle className="w-4 h-4 mr-2" />
//                     Proceed to Payment
//                   </>
//                 )}
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>

//         {/* Error Alert */}
//         <AnimatePresence>
//           {error && (
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 50 }}
//               className="fixed bottom-4 right-4 z-50"
//             >
//               <Alert className="border-red-200 bg-red-50 max-w-md">
//                 <AlertCircle className="h-4 w-4 text-red-600" />
//                 <AlertDescription className="text-red-800">
//                   {error}
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => setError("")}
//                     className="ml-2 h-6 w-6 p-0 text-red-600 hover:text-red-700"
//                   >
//                     <X className="h-3 w-3" />
//                   </Button>
//                 </AlertDescription>
//               </Alert>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     </div>
//   );
// };

// export default InvestigationReports;


"use client";

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Filter,
  Search,
  Loader2,
  Lock,
  AlertCircle,
  Calendar,
  User,
  FileSearch,
  Clipboard,
  FileText,
  Shield,
  RefreshCw,
  X,
  Microscope,
  CreditCard,
  Wallet,
  Building2,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock axios and baseUrl for demonstration
const axios = {
  get: async (url, config) => {
    console.log('GET request to:', url, config);
    return { data: mockInvestigations };
  },
  post: async (url, data, config) => {
    console.log('POST request to:', url, data, config);
    return { data: { success: true, paymentUrl: 'https://checkout.paystack.com/abc123' } };
  },
  put: async (url, data, config) => {
    console.log('PUT request to:', url, data, config);
    return { data: { success: true } };
  }
};

const baseUrl = 'https://api.example.com';

// Mock auth context
const useAuth = () => ({
  user: { id: '1' },
  token: 'mock-token'
});

// Mock data
const mockInvestigations = [
  {
    id: 1,
    patientName: "John Doe",
    patientPhone: "+234-801-234-5678",
    patientEmail: "john.doe@email.com",
    doctorName: "Dr. Smith",
    orderDate: "2024-09-20T10:30:00Z",
    items: [
      {
        investigationName: "Full Blood Count",
        instruction: "Fasting required"
      },
      {
        investigationName: "Blood Sugar",
        instruction: "12-hour fast"
      }
    ]
  },
  {
    id: 2,
    patientName: "Jane Smith",
    patientPhone: "+234-802-345-6789",
    patientEmail: "jane.smith@email.com",
    doctorName: "Dr. Johnson",
    orderDate: "2024-09-19T14:15:00Z",
    items: [
      {
        investigationName: "Lipid Profile",
        instruction: "No special preparation"
      }
    ]
  }
];

interface InvestigationItem {
  investigationName: string;
  instruction: string;
}

interface InvestigationOrder {
  id: number;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorName: string;
  orderDate: string;
  items: InvestigationItem[];
}

const LAB_PARTNERS = [
  { value: 'SILAHEALTH', label: 'SILA Health', icon: '🏥' },
  { value: 'MedFair_Lab', label: 'MedFair Lab', icon: '🧪' }
];

const InvestigationReports = () => {
  const [investigations, setInvestigations] = useState<InvestigationOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [accessLoading, setAccessLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<InvestigationOrder | null>(null);
  const [selectedLab, setSelectedLab] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const { user, token } = useAuth();

  const doctors = Array.from(
    new Set(investigations.map((inv) => inv.doctorName))
  );

  const checkInvestigationAccess = async () => {
    setAccessLoading(true);
    setError("");

    if (!user || !token) {
      setError("Not authenticated");
      setAccessLoading(false);
      return;
    }

    const organizationId = Number(user?.id);
    if (!organizationId || isNaN(organizationId)) {
      setError("Organization ID not found.");
      setAccessLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${baseUrl}/api/organization/${organizationId}/investigation-orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const sortedInvestigations = response.data.sort(
        (a: InvestigationOrder, b: InvestigationOrder) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      );

      setInvestigations(sortedInvestigations);
      setHasAccess(true);
      setLoading(false);
    } catch (err: any) {
      console.error("Error checking investigation access:", err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        await requestInvestigationAccess(organizationId);
      } else {
        setError("Failed to check investigation access.");
        setLoading(false);
      }
    } finally {
      setAccessLoading(false);
    }
  };

  const requestInvestigationAccess = async (organizationId: number) => {
    try {
      await axios.put(
        `${baseUrl}/api/organization/organizations/${organizationId}/investigation-visibility?canView=true`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      await fetchInvestigationOrders();
      setHasAccess(true);
    } catch (err: any) {
      console.error("Error requesting investigation access:", err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        setHasAccess(false);
      } else {
        setError("Failed to request investigation access.");
      }
      setLoading(false);
    }
  };

  const fetchInvestigationOrders = async () => {
    setLoading(true);
    setError("");

    if (!user || !token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const organizationId = Number(user?.id);
    if (!organizationId || isNaN(organizationId)) {
      setError("Organization ID not found.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${baseUrl}/api/organization/${organizationId}/investigation-orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const sortedInvestigations = response.data.sort(
        (a: InvestigationOrder, b: InvestigationOrder) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      );

      setInvestigations(sortedInvestigations);
    } catch (err: any) {
      console.error("Error fetching investigation orders:", err);
      setError("Failed to load investigation orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkInvestigationAccess();
  }, [user, token]);

  const handleLabSelection = async (orderId: number, labPartner: string) => {
    try {
      setProcessingPayment(true);
      const response = await axios.post(
        `${baseUrl}/api/investigations/investigations/select-lab?orderId=${orderId}&labPartner=${labPartner}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data) {
        console.log('Lab selected successfully');
        return true;
      }
    } catch (error) {
      console.error('Error selecting lab:', error);
      setError('Failed to select lab partner');
      return false;
    } finally {
      setProcessingPayment(false);
    }
  };

  const initiatePayment = async (orderId: number, email: string, paymentMethod: string) => {
    try {
      setProcessingPayment(true);
      const response = await axios.post(
        `${baseUrl}/api/investigations/initiate-payment`,
        {
          orderId,
          email,
          paymentMethod
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && response.data.paymentUrl) {
        // Redirect to payment URL
        window.location.href = response.data.paymentUrl;
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      setError('Failed to initiate payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  const verifyPayment = async (reference: string, redirect: boolean = true) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/investigations/verify-payment?reference=${reference}&redirect=${redirect}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      setError('Failed to verify payment');
      return null;
    }
  };

  const handlePaymentFlow = async (order: InvestigationOrder, method: string) => {
    setSelectedOrder(order);
    setPaymentMethod(method);
    setShowPaymentDialog(true);
  };

  const processPayment = async () => {
    if (!selectedOrder || !selectedLab) return;

    // First select the lab
    const labSelected = await handleLabSelection(selectedOrder.id, selectedLab);
    
    if (labSelected) {
      // Then initiate payment
      await initiatePayment(selectedOrder.id, selectedOrder.patientEmail, paymentMethod);
      setShowPaymentDialog(false);
    }
  };

  const filteredInvestigations = investigations.filter((inv) => {
    const matchSearch =
      inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.items.some((item) =>
        item.investigationName.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchDoctor =
      doctorFilter === "all" || inv.doctorName === doctorFilter;

    return matchSearch && matchDoctor;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setDoctorFilter("all");
  };

  const hasActiveFilters = searchTerm !== "" || doctorFilter !== "all";

  const totalInvestigationsCount = investigations.reduce(
    (total, order) => total + order.items.length,
    0
  );

  // Access loading component
  if (accessLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-7xl mx-auto"
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16 px-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mb-6"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Checking Access Permissions
                </h3>
                <p className="text-gray-600">
                  Verifying your access to investigation order data...
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Access denied component
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8 pt-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-6"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center">
                  <Lock className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Access Restricted
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Investigation order data access required
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-12">
              <Alert className="border-amber-200 bg-amber-50">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <AlertDescription className="text-amber-800 font-medium">
                  This organization does not have access to client investigation
                  order data. Please contact your system administrator to
                  request the necessary permissions.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-0 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center sm:text-left"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
                Investigation Orders
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Comprehensive view of all client investigation orders
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => fetchInvestigationOrders()}
                variant="outline"
                className="bg-white/80 backdrop-blur-sm border-2 hover:border-blue-300 transition-all duration-200"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </motion.div>
          </div>

          {/* Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6"
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6" />
                  <div>
                    <p className="text-blue-100 text-sm">Total Orders</p>
                    <p className="text-2xl font-bold">
                      {investigations.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <User className="h-6 w-6" />
                  <div>
                    <p className="text-green-100 text-sm">Doctors</p>
                    <p className="text-2xl font-bold">{doctors.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Microscope className="h-6 w-6" />
                  <div>
                    <p className="text-purple-100 text-sm">Investigations</p>
                    <p className="text-2xl font-bold">
                      {totalInvestigationsCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6" />
                  <div>
                    <p className="text-amber-100 text-sm">This Month</p>
                    <p className="text-2xl font-bold">
                      {
                        investigations.filter(
                          (inv) =>
                            new Date(inv.orderDate).getMonth() ===
                            new Date().getMonth()
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-white to-blue-50/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Investigation Orders Database
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Search, filter, and process investigation order payments
                  </CardDescription>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                        <Download className="mr-2 h-4 w-4" />
                        Export Data
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => alert("Download CSV")}
                      className="cursor-pointer"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => alert("Download PDF")}
                      className="cursor-pointer"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Export as PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search by patient, doctor, investigation name, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/70 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="bg-white/70 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </motion.div>

                  {hasActiveFilters && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Filter Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Filter by Doctor
                        </label>
                        <Select
                          value={doctorFilter}
                          onValueChange={setDoctorFilter}
                        >
                          <SelectTrigger className="bg-white border-gray-200 focus:border-blue-300">
                            <SelectValue placeholder="Select doctor..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Doctors</SelectItem>
                            {doctors.map((doctor) => (
                              <SelectItem key={doctor} value={doctor}>
                                {doctor}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Table Container */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-gray-50 to-blue-50/50 border-gray-200">
                        <TableHead className="font-semibold text-gray-700">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Patient
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Doctor
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          <div className="flex items-center gap-2">
                            <Microscope className="h-4 w-4" />
                            Investigations
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Order Date
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          <div className="flex items-center gap-2">
                            <Clipboard className="h-4 w-4" />
                            Items Count
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Actions
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12">
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex flex-col items-center gap-4"
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              >
                                <Loader2 className="w-8 h-8 text-blue-500" />
                              </motion.div>
                              <div className="text-center">
                                <p className="text-lg font-medium text-gray-700">
                                  Loading Investigation Orders
                                </p>
                                <p className="text-gray-500">
                                  Please wait while we fetch the data...
                                </p>
                              </div>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      ) : error ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex flex-col items-center gap-4 text-red-500"
                            >
                              <AlertCircle className="w-12 h-12" />
                              <div className="text-center">
                                <p className="text-lg font-medium">
                                  Error Loading Data
                                </p>
                                <p className="text-red-400">{error}</p>
                              </div>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      ) : filteredInvestigations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex flex-col items-center gap-4 text-gray-400"
                            >
                              <FileSearch className="w-12 h-12" />
                              <div className="text-center">
                                <p className="text-lg font-medium text-gray-600">
                                  No Investigation Orders Found
                                </p>
                                <p>
                                  Try adjusting your search criteria or filters
                                </p>
                              </div>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredInvestigations.map((order, index) => (
                          <motion.tr
                            key={order.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-blue-50/50 transition-colors duration-200 border-b border-gray-100"
                          >
                            <TableCell className="py-4">
                              <div className="space-y-1">
                                <p className="font-medium text-gray-900">
                                  {order.patientName}
                                </p>
                                <p className="text-xs text-blue-600 font-medium">
                                  {order.patientEmail}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {order.patientPhone}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-medium text-gray-700">
                                  {order.doctorName}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="space-y-2 max-w-md">
                                {order.items.map((item, itemIndex) => (
                                  <div
                                    key={itemIndex}
                                    className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
                                  >
                                    <div className="flex items-start gap-2">
                                      <Microscope className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 text-sm">
                                          {item.investigationName}
                                        </p>
                                        {item.instruction && (
                                          <p className="text-xs text-gray-600 mt-1 bg-white rounded px-2 py-1">
                                            {item.instruction}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-indigo-500" />
                                  <p className="font-medium text-gray-700">
                                    {new Date(
                                      order.orderDate
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  {new Date(
                                    order.orderDate
                                  ).toLocaleTimeString()}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <Badge
                                variant="secondary"
                                className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-200"
                              >
                                {order.items.length}{" "}
                                {order.items.length === 1 ? "Item" : "Items"}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                                    disabled={processingPayment}
                                  >
                                    {processingPayment ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <>
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Pay
                                      </>
                                    )}
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-56 rounded-xl shadow-xl border border-gray-200 bg-white p-2"
                                >
                                  <DropdownMenuLabel className="px-4 py-2 text-sm font-semibold text-gray-700">
                                    Payment Options
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handlePaymentFlow(order, 'paystack')}
                                    className="cursor-pointer rounded-lg px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <CreditCard className="h-4 w-4" />
                                      <div>
                                        <p className="font-medium">Pay with Paystack</p>
                                        <p className="text-xs opacity-80">Credit/Debit Card</p>
                                      </div>
                                    </div>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handlePaymentFlow(order, 'wallet')}
                                    className="cursor-pointer rounded-lg px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:text-white transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Wallet className="h-4 w-4" />
                                      <div>
                                        <p className="font-medium">Pay with Wallet</p>
                                        <p className="text-xs opacity-80">Use wallet balance</p>
                                      </div>
                                    </div>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </motion.tr>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Select Lab Partner
              </DialogTitle>
              <DialogDescription>
                Choose a lab partner to process the investigation for {selectedOrder?.patientName}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Lab Partner
                </label>
                <Select value={selectedLab} onValueChange={setSelectedLab}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a lab partner..." />
                  </SelectTrigger>
                  <SelectContent>
                    {LAB_PARTNERS.map((lab) => (
                      <SelectItem key={lab.value} value={lab.value}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{lab.icon}</span>
                          <span>{lab.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedOrder && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Patient: {selectedOrder.patientName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CreditCard className="h-4 w-4" />
                    <span>Payment Method: {paymentMethod === 'paystack' ? 'Paystack' : 'Wallet'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Microscope className="h-4 w-4" />
                    <span>Items: {selectedOrder.items.length}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowPaymentDialog(false)}
                disabled={processingPayment}
              >
                Cancel
              </Button>
              <Button 
                onClick={processPayment}
                disabled={!selectedLab || processingPayment}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {processingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Proceed to Payment
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 right-4 z-50"
            >
              <Alert className="border-red-200 bg-red-50 max-w-md">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setError("")}
                    className="ml-2 h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default InvestigationReports;