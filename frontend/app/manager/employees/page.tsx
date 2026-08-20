"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "@/app/components/ConfirmDeleteModal";

type Employee = {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
};

export default function EmployeeListPage() {
    const router = useRouter();

    // Employee list store hogi
    const [employees, setEmployees] = useState<Employee[]>([]);

    // Loading state
    const [loading, setLoading] = useState(true);

    // Error message
    const [error, setError] = useState("");

    

    const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);
    const [deleteLoading, setDeleteLoading] =
    useState(false);


    // -----------------------------------------
    // Employees API call
    // -----------------------------------------
    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError("");

            // Login ke time save kiya JWT token
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/employees`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                // setError(data.message || "Unable to fetch employees");
                toast.error(data.message || "Unable to fetch employees");
                return;
            }

            // Backend response ki employee list state me save
            setEmployees(data.employees || []);

        } catch (error) {
            console.error(error);

            toast.error("Unable to connect to server");

        } finally {
            setLoading(false);
        }
    };


    // -----------------------------------------
    // Page first time load → employee API call
    // -----------------------------------------
    useEffect(() => {
        fetchEmployees();
    }, []);


    const handleDelete = async (id: string) => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/employees/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Unable to delete employee");

                return;
            }

            setSelectedEmployee(null);
            // Success message
            toast.success("Employee deleted successfully");

            // Employee list dubara load
            fetchEmployees();

        } catch (error) {

            console.error(error);

            toast.error("Unable to connect to server");
        }
    };


    return (
        <div className="min-h-screen bg-slate-100">

            {/* HEADER */}
            <div className="bg-white border-b border-slate-200 px-8 py-5">

                <div className="flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Employees
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            Manage your team members.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            router.push("/manager/employees/create")
                        }
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold transition"
                    >
                        + Add Employee
                    </button>

                </div>

            </div>


            {/* CONTENT */}
            <div className="p-8">

                {/* ERROR */}
                {error && (
                    <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}


                {/* LOADING */}
                {loading ? (

                    <div className="text-slate-500">
                        Loading employees...
                    </div>

                ) : (

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                        <table className="w-full">

                            <thead className="bg-slate-50 border-b border-slate-200">

                                <tr>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                        Employee
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                        Email
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                        Status
                                    </th>

                                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-slate-100">

                                {employees.map((employee) => (

                                    <tr
                                        key={employee._id}
                                        className="hover:bg-slate-50"
                                    >

                                        {/* NAME */}
                                        <td className="px-6 py-4">

                                            <div className="flex items-center gap-3">

                                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">

                                                    {employee.name
                                                        .charAt(0)
                                                        .toUpperCase()}

                                                </div>

                                                <div>

                                                    <p className="font-semibold text-slate-800">
                                                        {employee.name}
                                                    </p>

                                                    <p className="text-xs text-slate-400">
                                                        Employee
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        {/* EMAIL */}
                                        <td className="px-6 py-4 text-slate-600">
                                            {employee.email}
                                        </td>


                                        {/* STATUS */}
                                        <td className="px-6 py-4">

                                            {employee.isActive ? (

                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                    Active
                                                </span>

                                            ) : (

                                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                    Inactive
                                                </span>

                                            )}

                                        </td>


                                        {/* ACTIONS */}
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">

                                                {/* VIEW */}
                                                <button
                                                    onClick={() =>
                                                        router.push(
                                                            `/manager/employees/${employee._id}`
                                                        )
                                                    }
                                                    className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                                                >
                                                    View
                                                </button>

                                                {/* EDIT */}
                                                <button
                                                    onClick={() =>
                                                        router.push(
                                                            `/manager/employees/${employee._id}/edit`
                                                        )
                                                    }
                                                    className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
                                                >
                                                    Edit
                                                </button>

                                                {/* DELETE */}
                                                <button
                                                    onClick={() => setSelectedEmployee(employee)}
                                                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                                >
                                                    Delete
                                                </button>

                                            </div>
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>


                        {/* NO EMPLOYEE */}
                        {employees.length === 0 && (

                            <div className="text-center py-12 text-slate-500">
                                No employees found.
                            </div>

                        )}

                    </div>

                )}

            </div>
            
            {/* Modal Box */}
            <ConfirmDeleteModal
                isOpen={selectedEmployee !== null}
                title="Delete Employee"
                message={
                    selectedEmployee
                        ? `Are you sure you want to delete ${selectedEmployee.name}?`
                        : ""
                }
                loading={deleteLoading}
                onCancel={() => setSelectedEmployee(null)}
                onConfirm={() => {
                    if (selectedEmployee) {
                        handleDelete(selectedEmployee._id);
                    }
                }}
            />

        </div>

        
    );
    
}