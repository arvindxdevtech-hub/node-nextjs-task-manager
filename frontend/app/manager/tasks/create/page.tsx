"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { API_URL } from "@/lib/api";


// ==========================================
// TYPES
// ==========================================

type Employee = {
    _id: string;
    name: string;
    email: string;
};


// ==========================================
// ASSIGN TASK PAGE
// ==========================================

export default function CreateTaskPage() {

    const router = useRouter();


    // ==========================================
    // FORM STATES
    // ==========================================

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [priority, setPriority] = useState("medium");
    const [dueDate, setDueDate] = useState("");


    // Employee dropdown
    const [employees, setEmployees] =
        useState<Employee[]>([]);


    // Loading states
    const [loadingEmployees, setLoadingEmployees] =
        useState(true);

    const [saving, setSaving] =
        useState(false);


    // ==========================================
    // FETCH EMPLOYEES
    // ==========================================

    useEffect(() => {

        const fetchEmployees = async () => {

            try {

                const token =
                    localStorage.getItem("token");


                const response = await fetch(
                    `${API_URL}/employees`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


                const data =
                    await response.json();


                if (!response.ok) {

                    toast.error(
                        data.message ||
                        "Unable to fetch employees"
                    );

                    return;
                }


                // Employee dropdown data
                setEmployees(
                    data.employees || []
                );


            } catch (error) {

                console.error(
                    "Employee API error:",
                    error
                );

                toast.error(
                    "Unable to connect to server"
                );


            } finally {

                setLoadingEmployees(false);

            }

        };


        fetchEmployees();

    }, []);


    // ==========================================
    // ASSIGN TASK
    // ==========================================

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();


        // --------------------------------------
        // Frontend Validation
        // --------------------------------------

        if (!title.trim()) {

            toast.error(
                "Task title is required"
            );

            return;
        }


        if (!assignedTo) {

            toast.error(
                "Please select an employee"
            );

            return;
        }


        if (!dueDate) {

            toast.error(
                "Due date is required"
            );

            return;
        }


        try {

            setSaving(true);


            const token =
                localStorage.getItem("token");


            // --------------------------------------
            // API Request
            // --------------------------------------

            const response = await fetch(
                `${API_URL}/tasks`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        title,
                        description,
                        assignedTo,
                        priority,
                        dueDate
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                toast.error(
                    data.message ||
                    "Unable to assign task"
                );

                return;
            }


            toast.success(
                "Task assigned successfully"
            );


            // Task list par wapas
            router.push(
                "/manager/tasks"
            );


        } catch (error) {

            console.error(
                "Create task error:",
                error
            );


            toast.error(
                "Unable to connect to server"
            );


        } finally {

            setSaving(false);

        }

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="min-h-screen bg-slate-100">


            {/* HEADER */}

            <div className="bg-white border-b border-slate-200 px-8 py-5">

                <div className="flex items-center justify-between">

                    <div>

                        <h1 className="text-2xl font-bold text-slate-900">
                            Assign Task
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            Create and assign a task to an employee.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/manager/tasks"
                            )
                        }
                        className="text-sm font-semibold text-slate-600 hover:text-indigo-600"
                    >
                        ← Back to Tasks
                    </button>

                </div>

            </div>


            {/* CONTENT */}

            <div className="p-8">


                <form
                    onSubmit={handleSubmit}
                    className="max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-sm p-7"
                >


                    {/* TASK TITLE */}

                    <div className="mb-5">

                        <label className="block text-sm font-semibold text-slate-700 mb-2">

                            Task Title
                            <span className="text-red-500 ml-1">
                                *
                            </span>

                        </label>


                        <input
                            type="text"

                            value={title}

                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }

                            placeholder="Enter task title"

                            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div className="mb-5">

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Description
                        </label>


                        <textarea
                            value={description}

                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }

                            rows={5}

                            placeholder="Enter task description..."

                            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                    </div>


                    {/* EMPLOYEE + PRIORITY */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">


                        {/* EMPLOYEE */}

                        <div>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">

                                Assign To

                                <span className="text-red-500 ml-1">
                                    *
                                </span>

                            </label>


                            <select
                                value={assignedTo}

                                onChange={(e) =>
                                    setAssignedTo(
                                        e.target.value
                                    )
                                }

                                disabled={loadingEmployees}

                                className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-indigo-500"
                            >

                                <option value="">

                                    {loadingEmployees
                                        ? "Loading employees..."
                                        : "Select Employee"}

                                </option>


                                {employees.map(
                                    (employee) => (

                                        <option
                                            key={employee._id}
                                            value={employee._id}
                                        >

                                            {employee.name}
                                            {" - "}
                                            {employee.email}

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* PRIORITY */}

                        <div>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Priority
                            </label>


                            <select
                                value={priority}

                                onChange={(e) =>
                                    setPriority(
                                        e.target.value
                                    )
                                }

                                className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-indigo-500"
                            >

                                <option value="low">
                                    Low
                                </option>

                                <option value="medium">
                                    Medium
                                </option>

                                <option value="high">
                                    High
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* DUE DATE */}

                    <div className="mb-7 max-w-sm">

                        <label className="block text-sm font-semibold text-slate-700 mb-2">

                            Due Date

                            <span className="text-red-500 ml-1">
                                *
                            </span>

                        </label>


                        <input
                            type="date"

                            value={dueDate}

                            onChange={(e) =>
                                setDueDate(
                                    e.target.value
                                )
                            }

                            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                    </div>


                    {/* BUTTONS */}

                    <div className="flex gap-3 pt-5 border-t border-slate-100">


                        <button
                            type="submit"
                            disabled={saving}

                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >

                            {saving
                                ? "Assigning..."
                                : "Assign Task"}

                        </button>


                        <button
                            type="button"

                            onClick={() =>
                                router.push(
                                    "/manager/tasks"
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
    );
}