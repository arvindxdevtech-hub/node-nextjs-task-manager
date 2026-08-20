"use client";

import {
    useEffect,
    useState
} from "react";

import {
    useParams,
    useRouter
} from "next/navigation";

import toast from "react-hot-toast";

import { API_URL } from "@/lib/api";


type Employee = {
    _id: string;
    name: string;
    email: string;
};


export default function EditTaskPage() {

    const router = useRouter();

    const params = useParams();

    const id = params.id as string;


    // ==========================================
    // FORM STATES
    // ==========================================

    const [title, setTitle] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [assignedTo, setAssignedTo] =
        useState("");

    const [priority, setPriority] =
        useState("medium");

    const [dueDate, setDueDate] =
        useState("");


    // Employee dropdown
    const [employees, setEmployees] =
        useState<Employee[]>([]);


    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    // ==========================================
    // PAGE LOAD
    // Task + Employees dono fetch
    // ==========================================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);

                const token =
                    localStorage.getItem("token");


                // --------------------------------------
                // Single Task API
                // --------------------------------------

                const taskResponse = await fetch(
                    `${API_URL}/tasks/${id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


                // --------------------------------------
                // Employees API
                // --------------------------------------

                const employeeResponse = await fetch(
                    `${API_URL}/employees`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


                const taskData =
                    await taskResponse.json();

                const employeeData =
                    await employeeResponse.json();


                if (!taskResponse.ok) {

                    setError(
                        taskData.message ||
                        "Unable to fetch task"
                    );

                    return;
                }


                if (!employeeResponse.ok) {

                    setError(
                        employeeData.message ||
                        "Unable to fetch employees"
                    );

                    return;
                }


                // --------------------------------------
                // Existing task data form me fill
                // --------------------------------------

                setTitle(
                    taskData.task.title
                );

                setDescription(
                    taskData.task.description || ""
                );

                setAssignedTo(
                    taskData.task.assignedTo?._id || ""
                );

                setPriority(
                    taskData.task.priority
                );


                // HTML date input ko YYYY-MM-DD chahiye
                if (taskData.task.dueDate) {

                    setDueDate(
                        taskData.task.dueDate.split("T")[0]
                    );

                }


                setEmployees(
                    employeeData.employees || []
                );


            } catch (error) {

                console.error(error);

                setError(
                    "Unable to connect to server"
                );

            } finally {

                setLoading(false);

            }

        };


        if (id) {

            loadData();

        }

    }, [id]);


    // ==========================================
    // UPDATE TASK
    // ==========================================

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        setError("");


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


        try {

            setSaving(true);

            const token =
                localStorage.getItem("token");


            const response = await fetch(
                `${API_URL}/tasks/${id}`,
                {
                    method: "PUT",

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
                    "Unable to update task"
                );

                return;

            }


            toast.success(
                "Task updated successfully"
            );


            router.push(
                `/manager/tasks/${id}`
            );


        } catch (error) {

            console.error(error);

            toast.error(
                "Unable to connect to server"
            );

        } finally {

            setSaving(false);

        }

    };


    if (loading) {

        return (
            <div className="p-8 text-slate-500">
                Loading task...
            </div>
        );

    }


    return (

        <div className="min-h-screen bg-slate-100">


            {/* HEADER */}

            <div className="bg-white border-b border-slate-200 px-8 py-5">

                <div className="flex items-center justify-between">

                    <div>

                        <h1 className="text-2xl font-bold text-slate-900">
                            Edit Task
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            Update task and assignment information.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                `/manager/tasks/${id}`
                            )
                        }
                        className="text-sm font-semibold text-slate-600 hover:text-indigo-600"
                    >
                        ← Back
                    </button>

                </div>

            </div>


            {/* CONTENT */}

            <div className="p-8">


                <form
                    onSubmit={handleSubmit}
                    className="max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-sm p-7"
                >


                    {/* ERROR */}

                    {error && (

                        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">

                            {error}

                        </div>

                    )}


                    {/* TITLE */}

                    <div className="mb-5">

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Task Title
                        </label>


                        <input
                            type="text"

                            value={title}

                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }

                            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div className="mb-5">

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Description
                        </label>


                        <textarea
                            rows={5}

                            value={description}

                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }

                            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                    </div>


                    {/* EMPLOYEE + PRIORITY */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">


                        {/* EMPLOYEE */}

                        <div>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Assigned Employee
                            </label>


                            <select
                                value={assignedTo}

                                onChange={(e) =>
                                    setAssignedTo(
                                        e.target.value
                                    )
                                }

                                className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-indigo-500"
                            >

                                <option value="">
                                    Select Employee
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
                        </label>


                        <input
                            type="date"

                            value={dueDate}

                            onChange={(e) =>
                                setDueDate(
                                    e.target.value
                                )
                            }

                            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500"
                        />

                    </div>


                    {/* BUTTONS */}

                    <div className="flex gap-3 pt-5 border-t border-slate-100">


                        <button
                            type="submit"

                            disabled={saving}

                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-lg font-semibold"
                        >

                            {saving
                                ? "Updating..."
                                : "Update Task"}

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