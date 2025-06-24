"use client";

import LoginForm from "@/components/forms/Login-form";


const Login = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left side with dark blue background */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2  bg-blue-900 text-white p-8 rounded-l-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Welcome Partner
        </h1>
        <p className="text-lg text-center max-w-sm">
          MedFair
        </p>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#FAF8F8] p-8 rounded-r-lg">
        <div className="w-full max-w-md">
          <div className="flex items-center space-x-2 md:hidden mb-4">
          </div>
          <h2 className="text-2xl font-bold mb-6">Sign In</h2>

          <div className="py-2">
            <LoginForm />
          </div>

          <p className="text-start text-gray-500 mt-4">
            Don&apos;t have an account?{" "}
            <a href="/auth/signup" className=" text-blue-900 hover:underline">
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
