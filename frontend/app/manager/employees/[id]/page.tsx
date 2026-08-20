"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

type Employee = {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export default function ViewEmployeePage() {
    const router = useRouter();

    // URL se employee id milega
    const params = useParams();

    const id = params.id as string;

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // -----------------------------------------
    // Single Employee API
    // -----------------------------------------
    useEffect(() => {

        const fetchEmployee = async () => {
            try {

                setLoading(true);
                setError("");

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

                setEmployee(data.employee);

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


    if (loading) {
        return (
            <div className="p-8 text-slate-500">
                Loading employee...
            </div>
        );
    }


    if (!employee) {
        return (
            <div className="p-8">
                <div className="bg-red-50 text-red-700 p-4 rounded-xl">
                    {error || "Employee not found"}
                </div>
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
                            Employee Details
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            View employee account information.
                        </p>
                    </div>


                    <div className="flex gap-3">

                        <button
                            onClick={() =>
                                router.push(
                                    `/manager/employees/${employee._id}/edit`
                                )
                            }
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold"
                        >
                            Edit Employee
                        </button>

                        <button
                            onClick={() =>
                                router.push("/manager/employees")
                            }
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-lg font-semibold"
                        >
                            Back
                        </button>

                    </div>

                </div>

            </header>


            {/* CONTENT */}
            <div className="p-8">

                <div className="max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-sm p-8">

                    {/* PROFILE */}
                    <div className="flex items-center gap-4 pb-6 border-b border-slate-100">

                        <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-bold">
                            {employee.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">
                                {employee.name}
                            </h2>

                            <p className="text-slate-500">
                                {employee.email}
                            </p>
                        </div>

                    </div>


                    {/* DETAILS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                        <div>
                            <p className="text-sm text-slate-500">
                                Full Name
                            </p>

                            <p className="font-semibold text-slate-800 mt-1">
                                {employee.name}
                            </p>
                        </div>


                        <div>
                            <p className="text-sm text-slate-500">
                                Email
                            </p>

                            <p className="font-semibold text-slate-800 mt-1">
                                {employee.email}
                            </p>
                        </div>


                        <div>
                            <p className="text-sm text-slate-500">
                                Role
                            </p>

                            <p className="font-semibold text-slate-800 mt-1 capitalize">
                                {employee.role}
                            </p>
                        </div>


                        <div>
                            <p className="text-sm text-slate-500">
                                Status
                            </p>

                            <div className="mt-2">
                                {employee.isActive ? (
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                        Active
                                    </span>
                                ) : (
                                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                                        Inactive
                                    </span>
                                )}
                            </div>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}