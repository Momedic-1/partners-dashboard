// "use client";

// import { useAuthContext } from "@/AuthContext";
// import axios from "axios";

// export const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API;
// // export const apiUrl = "http://localhost:4001";

// const BASE_URL = apiUrl;

// export const useAuth = () => {
//   const { token, signOut } = useAuthContext();

//   const client = axios.create({
//     baseURL: BASE_URL,
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return { client, SignOut: signOut };
// };
