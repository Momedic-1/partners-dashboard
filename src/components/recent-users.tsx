import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "@/lib/axios";
import { baseUrl } from "@/env";
import { useAuth } from "@/AuthContext";

interface Consultation {
  patientName: string;
  patientEmail: string;
  consultationDate: string;
  amountCharged: number;
  id?: string;
}

interface ConsultationResponse {
  content: Consultation[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  numberOfElements: number;
}

// Enhanced user interface to match your API response
interface User {
  successful: boolean;
  message: string;
  userId: number;
  email: string;
  createdAt: string; // ISO date string
  organization: string;
}

export function RecentUsers() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { user, token } = useAuth();

  // Function to get initials from name
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  // Function to format date relative to user's creation date
  const getRelativeDateInfo = (consultationDate: string) => {
    if (!user?.createdAt) return null;
    
    const userCreated = new Date(user.createdAt);
    const consultation = new Date(consultationDate);
    const diffDays = Math.floor((consultation.getTime() - userCreated.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Same day as signup";
    if (diffDays === 1) return "Day after signup";
    if (diffDays > 0 && diffDays <= 7) return `${diffDays} days after signup`;
    if (diffDays > 0) return `${Math.floor(diffDays / 7)} weeks after signup`;
    return "Before signup"; // This shouldn't normally happen
  };

  // Function to check if consultation is within first week of user signup
  const isNewUserConsultation = (consultationDate: string) => {
    if (!user?.createdAt) return false;
    
    const userCreated = new Date(user.createdAt);
    const consultation = new Date(consultationDate);
    const diffDays = Math.floor((consultation.getTime() - userCreated.getTime()) / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 && diffDays <= 7;
  };

  // Fetch consultations data from API
  const fetchConsultations = async () => {
    setLoading(true);
    setError("");

    // guard: ensure user and token exist
    if (!user || !token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    // use user.id for organization
    const orgId = user.userId || user.id; // Support both userId and id properties
    if (!orgId) {
      setError("Organization not found. Please contact support.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get<ConsultationResponse>(
        `${baseUrl}/api/organization/${orgId}/consultations/basic`,
        {
          params: { page: currentPage - 1, size: pageSize },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Sort consultations by date in descending order (newest first)
      const sortedConsultations = response.data.content.sort((a, b) => {
        return (
          new Date(b.consultationDate).getTime() -
          new Date(a.consultationDate).getTime()
        );
      });

      setConsultations(sortedConsultations);
      setTotalPages(response.data.totalPages);
    } catch (err: any) {
      console.error("Error fetching consultations:", err);
      if (err.response?.status === 403) {
        setError("Access denied. Please check your permissions.");
      } else if (err.response?.status === 500) {
        setError("Server error when fetching page " + currentPage);
      } else {
        setError("Failed to load consultations data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [currentPage, pageSize, user, token]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Recent Consultations
            </h2>
            <p className="text-gray-500 text-sm">
              Users who recently had consultations
            </p>
          </div>
          {user?.createdAt && (
            <div className="text-sm text-gray-500 text-right">
              <p>Organization since:</p>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="px-2 md:px-6 pb-6">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-center">Loading consultations...</div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          <>
            {/* Table */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.05 } },
              }}
              initial="hidden"
              animate="show"
              className="rounded-md border overflow-hidden"
            >
              <div className="w-full overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      {[
                        "Patient Name",
                        "Patient Email",
                        "Consultation Date",
                        "Amount Charged",
                        "Timeline",
                      ].map((col) => (
                        <th
                          key={col}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {consultations.length > 0 ? (
                      consultations.map((c, index) => {
                        const isNewUser = isNewUserConsultation(c.consultationDate);
                        const relativeInfo = getRelativeDateInfo(c.consultationDate);
                        
                        return (
                          <motion.tr
                            key={c.id || index}
                            variants={{
                              hidden: { opacity: 0, y: 10 },
                              show: { opacity: 1, y: 0 },
                            }}
                            className={`hover:bg-gray-50 ${isNewUser ? 'bg-blue-50' : ''}`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-full text-white flex items-center justify-center text-sm font-medium ${
                                  isNewUser ? 'bg-green-600' : 'bg-blue-900'
                                }`}>
                                  {getInitials(c.patientName)}
                                </div>
                                <div>
                                  <span className="font-medium">
                                    {c.patientName}
                                  </span>
                                  {isNewUser && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      New
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {c.patientEmail}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {new Date(c.consultationDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">
                              ₦{c.amountCharged.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {relativeInfo}
                            </td>
                          </motion.tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-8">
                          No consultations found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Summary Stats */}
            {user?.createdAt && consultations.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Consultations:</span>
                    <span className="ml-2 font-medium">{consultations.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">New User Consultations:</span>
                    <span className="ml-2 font-medium text-green-600">
                      {consultations.filter(c => isNewUserConsultation(c.consultationDate)).length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Revenue:</span>
                    <span className="ml-2 font-medium">
                      ₦{consultations.reduce((sum, c) => sum + c.amountCharged, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="mt-4 flex justify-center">
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() =>
                      currentPage > 1 && handlePageChange(currentPage - 1)
                    }
                    className={`px-2 py-1 border rounded ${
                      currentPage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:bg-gray-50"
                    }`}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      const left = Math.max(1, currentPage - 2);
                      const right = Math.min(totalPages, currentPage + 2);
                      return p >= left && p <= right;
                    })
                    .map((p) => (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`w-8 h-8 flex items-center justify-center rounded ${
                          p === currentPage
                            ? "bg-blue-900 text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {p}
                      </button>
                    ))}

                  <button
                    onClick={() =>
                      currentPage < totalPages &&
                      handlePageChange(currentPage + 1)
                    }
                    className={`px-2 py-1 border rounded ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:bg-gray-50"
                    }`}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}