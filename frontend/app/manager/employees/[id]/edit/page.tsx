"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { API_URL } from "@/lib/api";


export default function EditEmployeePage() {

    const router = useRouter();
    const params = useParams();

    const id = params.id as string;


    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(true);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");


    // ==========================================
    // Existing Employee Load
    // ==========================================

    useEffect(() => {

        const fetchEmployee = async () => {
            try {

                setLoading(true);

                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${API_URL}/employees/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(
                        data.message || "Unable to fetch employee"
                    );

                    return;
                }


                // Existing data form me fill
                setName(data.employee.name);
                setEmail(data.employee.email);
                setIsActive(data.employee.isActive);

            } catch (error) {

                console.error(error);

                setError("Unable to connect to server");

            } finally {

                setLoading(false);

            }
        };


        if (id) {
            fetchEmployee();
        }

    }, [id]);


    // ==========================================
    // Update Employee
    // ==========================================

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        setError("");


        if (!name || !email) {

            setError("Name and email are required");

            return;

        }


        try {

            setSaving(true);

            const token =
                localStorage.getItem("token");


            // Request object
            const employeeData: {
                name: string;
                email: string;
                isActive: boolean;
                password?: string;
            } = {
                name,
                email,
                isActive
            };


            // Password empty hai to backend ko mat bhejo
            if (password) {

                employeeData.password = password;

            }


            const response = await fetch(
                `${API_URL}/employees/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify(employeeData)
                }
            );


            const data = await response.json();


            if (!response.ok) {

                setError(
                    data.message ||
                    "Unable to update employee"
                );

                return;

            }


            toast.success(
                "Employee updated successfully"
            );


            router.push(
                `/manager/employees/${id}`
            );


        } catch (error) {

            console.error(error);

            setError(
                "Unable to connect to server"
            );

        } finally {

            setSaving(false);

        }

    };


    if (loading) {

        return (
            <div className="p-8 text-slate-500">
                Loading employee...
            </div>
        );

    }


    return (
        <div>

            {/* HEADER */}
            <header className="bg-white border-b border-slate-200 px-8 py-5">

                <div className="flex items-center justify-between">

                    <div>

                        <h1 className="text-2xl font-bold text-slate-900">
                            Edit Employee
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            Update employee account information.
                        </p>

                    </div>


                    <button
                        onClick={() =>
                            router.push(
                                `/manager/employees/${id}`
                            )
                        }
                        className="text-slate-600 hover:text-indigo-600 font-medium"
                    >
                        ← Back
                    </button>

                </div>

            </header>


            {/* CONTENT */}
            <div className="p-8">

                <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200 p-8">


                    {/* ERROR */}
                    {error && (

                        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
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
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                        </div>


                        {/* PASSWORD */}
                        <div>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                New Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Leave blank to keep current password"
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                            <p className="text-xs text-slate-400 mt-2">
                                Leave blank if you do not want to change the password.
                            </p>

                        </div>


                        {/* STATUS */}
                        <div>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Employee Status
                            </label>

                            <select
                                value={
                                    isActive
                                        ? "active"
                                        : "inactive"
                                }
                                onChange={(e) =>
                                    setIsActive(
                                        e.target.value ===
                                            "active"
                                    )
                                }
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-indigo-500"
                            >

                                <option value="active">
                                    Active
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>

                            </select>

                        </div>


                        {/* BUTTONS */}
                        <div className="flex gap-3 pt-3">

                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-lg font-semibold"
                            >

                                {saving
                                    ? "Updating..."
                                    : "Update Employee"}

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
    );
}