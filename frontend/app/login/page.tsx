"use client"; // Is component ko browser/client side par run karna hai.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); 
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          try {
              setError("");
              setLoading(true);
              if (!email || !password) {
                  setError("Email and password are required");
                  return;
              }

              const response = await fetch(
                  `${API_URL}/auth/login`,
                  {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                          email,
                          password
                      })
                  }
              );

              const data = await response.json();

              if (!response.ok) {
                  setError(data.message || "Login failed");
                  return;
              }

              // JWT save
              localStorage.setItem("token", data.token);

              // Logged-in user save
              localStorage.setItem(
                  "user",
                  JSON.stringify(data.user)
              );

              // Role-based redirect
              if (data.user.role === "manager") {
                  router.push("/manager/dashboard");
              } else {
                  router.push("/employee/dashboard");
              }

          } catch (error) {
              console.error(error);
              setError("Unable to connect to server");
          } finally {
              setLoading(false);
          }
      };


    
    return (
        <div className="min-h-screen flex">

            {/* LEFT SIDE */}
            <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 text-white p-12 flex-col justify-between">

                <div>
                    <h2 className="text-2xl font-bold">
                        TaskFlow
                    </h2>
                </div>

                <div>
                    <h1 className="text-5xl font-bold leading-tight">
                        Manage your team.
                        <br />
                        Deliver work faster.
                    </h1>

                    <p className="mt-5 text-blue-100 text-lg max-w-md">
                        Assign tasks, track employee progress and manage
                        your team's work from one place.
                    </p>

                    <div className="flex gap-6 mt-10">
                        <div>
                            <p className="text-2xl font-bold">Realtime</p>
                            <p className="text-blue-100 text-sm">
                                Task Updates
                            </p>
                        </div>

                        <div className="border-l border-blue-300 pl-6">
                            <p className="text-2xl font-bold">Secure</p>
                            <p className="text-blue-100 text-sm">
                                JWT Authentication
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-blue-100">
                    Team Task Management System - @arvindxdevtech-hub
                </p>
            </div>


            {/* RIGHT SIDE */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-slate-50 px-6">

                <div className="w-full max-w-md">

                    <div className="mb-8">
                        <p className="text-indigo-600 font-semibold mb-2">
                            WELCOME BACK
                        </p>

                        <h1 className="text-3xl font-bold text-slate-900">
                            Sign in to your account
                        </h1>

                        <p className="text-slate-500 mt-2">
                            Enter your credentials to access your dashboard.
                        </p>
                    </div>


                    <form className="space-y-5" onSubmit={handleSubmit}>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="hey@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-slate-300 bg-white rounded-lg px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                            />
                        </div>


                        {/* PASSWORD */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-slate-300 bg-white rounded-lg px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                            />
                        </div>


                        {/* REMEMBER */}
                        {/* <div className="flex items-center justify-between">

                            <label className="flex items-center gap-2 text-sm text-slate-600">
                                <input
                                    type="checkbox"
                                    className="accent-indigo-600"
                                />
                                Remember me
                            </label>

                            <button
                                type="button"
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                            >
                                Forgot password?
                            </button>

                        </div> */}


                        {/* LOGIN */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-lg shadow-lg shadow-indigo-200 transition"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>

                    </form>


                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-400">
                            Node.js • Next.js • MongoDB • Socket.IO
                        </p>
                    </div>

                </div>
            </div>

        </div>
    );
}