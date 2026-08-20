"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function CreateEmployeePage() {
    const router = useRouter();

    // React states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // -----------------------------------------
    // Add Employee
    // -----------------------------------------
    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // Simple frontend validation
        if (!name || !email || !password) {
            setError("All fields are required");
            return;
        }

        try {
            setLoading(true);

            // Login ke time save JWT
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/employees`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",

                        // Manager JWT backend ko bhejna
                        Authorization: `Bearer ${token}`
                    },

                    // JS Object → JSON
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Unable to create employee"
                );
                return;
            }

            setSuccess(
                "Employee created successfully"
            );

            // Optional form clear
            setName("");
            setEmail("");
            setPassword("");

            // 1 second baad employee list
            setTimeout(() => {
                router.push("/manager/employees");
            }, 1000);

        } catch (error) {
            console.error(error);

            setError(
                "Unable to connect to server"
            );

        } finally {
            setLoading(false);
        }
    };


    return (
        <div>

            {/* HEADER */}
            <header className="bg-white border-b border-slate-200 px-8 py-5">

                <div className="flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Add Employee
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            Create a new employee account.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            router.push("/manager/employees")
                        }
                        className="text-slate-600 hover:text-indigo-600 font-medium"
                    >
                        ← Back to Employees
                    </button>

                </div>

            </header>


            {/* CONTENT */}
            <div className="p-8">

                <div className="max-w-2xl">

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

                        {/* ERROR */}
                        {error && (
                            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* SUCCESS */}
                        {success && (
                            <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                                {success}
                            </div>
                        )}


                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* NAME */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Employee Name
                                </label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Enter employee name"
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>


                            {/* EMAIL */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="employee@example.com"
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>


                            {/* PASSWORD */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Minimum 6 characters"
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>


                            {/* BUTTONS */}
                            <div className="flex items-center gap-3 pt-3">

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-lg font-semibold transition"
                                >
                                    {loading
                                        ? "Creating..."
                                        : "Create Employee"}
                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push(
                                            "/manager/employees"
                                        )
                                    }
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-semibold"
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </div>
    );
}