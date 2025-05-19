// "use client";
// import { useState } from 'react';
// import { useRouter } from 'next/navigation'; 
// import axios from '../../lib/axios';
// import { baseUrl } from '@/env';

// const LoginForm = () => {
//   const [credentials, setCredentials] = useState({
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const router = useRouter(); 

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${baseUrl}/api/organization/login`, credentials);

//       if (response.data.token) {
//         // Save auth data to localStorage
//         localStorage.setItem('authToken', response.data.token);
//         localStorage.setItem('organization', JSON.stringify(response.data.orgAdminLoginDto));
//         console.log('Login successful, navigating to dashboard...');
//         router.push('/dashboard'); 
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Login failed. Please try again.');
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setCredentials({
//       ...credentials,
//       [e.target.name]: e.target.value
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <input
//         type="email"
//         name="email"
//         value={credentials.email}
//         onChange={handleChange}
//         placeholder="Email"
//         required
//         className="w-full px-4 py-2 border border-gray-300 rounded-md"
//       />
//       <input
//         type="password"
//         name="password"
//         value={credentials.password}
//         onChange={handleChange}
//         placeholder="Password"
//         required
//         className="w-full px-4 py-2 border border-gray-300 rounded-md"
//       />

//       {error && <div className="text-red-600 text-sm">{error}</div>}
//       <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-700">
//         Login 
//       </button>
//     </form>
//   );
// };

// export default LoginForm;

"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/AuthContext'; 

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth(); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    try {
      // Use the login function from context
      await login(credentials.email, credentials.password);
      // Redirect on successful login
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        name="email"
        value={credentials.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
      />
      <input
        type="password"
        name="password"
        value={credentials.password}
        onChange={handleChange}
        placeholder="Password"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
      />

      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-700">
        Login 
      </button>
    </form>
  );
};

export default LoginForm;