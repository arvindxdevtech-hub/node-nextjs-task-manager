"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { API_URL } from "@/lib/api";
import ConfirmActionModal from "@/app/components/ConfirmActionModal";


// ==========================================
// TYPES
// ==========================================

type TaskUser = {
    _id: string;
    name: string;
    email: string;
};

type TaskStatus =
    | "pending"
    | "working"
    | "hold"
    | "completed";

type Task = {
    _id: string;
    title: string;
    description: string;

    assignedBy: TaskUser;

    priority:
        | "high"
        | "medium"
        | "low";

    status: TaskStatus;

    assignDate: string;
    dueDate: string | null;
};


// ==========================================
// PAGE
// ==========================================

export default function EmployeeViewTaskPage() {

    const router = useRouter();

    // URL se dynamic task ID
    const params = useParams();

    const id = params.id as string;


    // ==========================================
    // STATES
    // ==========================================

    const [task, setTask] =
        useState<Task | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [selectedStatus, setSelectedStatus] =
        useState<TaskStatus>("pending");

    const [showConfirm, setShowConfirm] =
        useState(false);

    const [updateLoading, setUpdateLoading] =
        useState(false);


    // ==========================================
    // FETCH SINGLE TASK
    // ==========================================

    useEffect(() => {

        const fetchTask = async () => {

            try {

                setLoading(true);
                setError("");


                const token =
                    localStorage.getItem("token");


                const response = await fetch(
                    `${API_URL}/employee/tasks/${id}`,
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

                    setError(
                        data.message ||
                        "Unable to fetch task"
                    );

                    return;
                }


                // Task save
                setTask(data.task);


                // Current task status dropdown me set
                setSelectedStatus(
                    data.task.status
                );


            } catch (error) {

                console.error(
                    "Fetch task error:",
                    error
                );


                setError(
                    "Unable to connect to server"
                );


            } finally {

                setLoading(false);

            }

        };


        if (id) {

            fetchTask();

        }

    }, [id]);


    // ==========================================
    // UPDATE BUTTON CLICK
    // ==========================================

    const requestStatusUpdate = () => {

        if (!task) {
            return;
        }


        // Same status select hai to update ki zarurat nahi
        if (selectedStatus === task.status) {

            toast.error(
                "Please select a different status"
            );

            return;
        }


        // Confirmation popup open
        setShowConfirm(true);

    };


    // ==========================================
    // STATUS UPDATE API
    // ==========================================

    const handleStatusUpdate = async () => {

        if (!task) {
            return;
        }


        try {

            setUpdateLoading(true);


            const token =
                localStorage.getItem("token");


            const response = await fetch(
                `${API_URL}/employee/tasks/${task._id}/status`,
                {
                    method: "PATCH",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({
                        status: selectedStatus
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                toast.error(
                    data.message ||
                    "Unable to update task status"
                );

                return;
            }


            // ======================================
            // LOCAL STATE UPDATE
            // Page refresh ki zarurat nahi
            // ======================================

            setTask(previousTask => {

                if (!previousTask) {
                    return previousTask;
                }


                return {
                    ...previousTask,
                    status: selectedStatus
                };

            });


            // Modal close
            setShowConfirm(false);


            toast.success(
                "Task status updated successfully"
            );

            router.push("/employee/dashboard");


        } catch (error) {

            console.error(
                "Status update error:",
                error
            );


            toast.error(
                "Unable to connect to server"
            );


        } finally {

            setUpdateLoading(false);

        }

    };


    // ==========================================
    // PRIORITY COLOR
    // ==========================================

    const priorityColor = (
        priority: Task["priority"]
    ) => {

        if (priority === "high") {

            return "bg-red-100 text-red-700";

        }


        if (priority === "medium") {

            return "bg-yellow-100 text-yellow-700";

        }


        return "bg-green-100 text-green-700";

    };


    // ==========================================
    // STATUS COLOR
    // ==========================================

    const statusColor = (
        status: TaskStatus
    ) => {

        if (status === "working") {

            return "bg-blue-100 text-blue-700";

        }


        if (status === "hold") {

            return "bg-yellow-100 text-yellow-700";

        }


        if (status === "completed") {

            return "bg-green-100 text-green-700";

        }


        return "bg-orange-100 text-orange-700";

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">

                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto">
                    </div>

                    <p className="text-slate-500 mt-4">
                        Loading task details...
                    </p>

                </div>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (!task) {

        return (

            <div className="p-8">

                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">

                    {error || "Task not found"}

                </div>


                <button
                    onClick={() =>
                        router.push(
                            "/employee/tasks"
                        )
                    }
                    className="mt-4 text-indigo-600 font-semibold"
                >
                    ← Back to Tasks
                </button>

            </div>

        );

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="px-8 py-6">


            {/* =====================================
                PAGE HEADER
            ====================================== */}

            <div className="flex items-center justify-between mb-6">

                <div>

                    <h1 className="text-3xl font-bold text-slate-900">
                        Task Details
                    </h1>

                    <p className="text-slate-500 mt-1">
                        View task information and update your work status.
                    </p>

                </div>


                <button
                    onClick={() =>
                        router.push(
                            "/employee/tasks"
                        )
                    }
                    className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg font-semibold transition"
                >
                    ← Back to Tasks
                </button>

            </div>


            {/* =====================================
                FULL WIDTH TASK CARD
            ====================================== */}

            <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">


                {/* =================================
                    TASK HEADER
                ================================== */}

                <div className="px-7 py-5 border-b border-slate-100">

                    <div className="flex items-start justify-between gap-5">

                        <div>

                            <h2 className="text-2xl font-bold text-slate-900">

                                {task.title}

                            </h2>


                            <p className="text-slate-500 mt-2">

                                {task.description ||
                                    "No description provided."}

                            </p>

                        </div>


                        {/* CURRENT STATUS */}

                        <span
                            className={`
                                ${statusColor(task.status)}
                                px-4
                                py-1.5
                                rounded-full
                                text-xs
                                font-bold
                                capitalize
                                whitespace-nowrap
                            `}
                        >

                            {task.status}

                        </span>

                    </div>

                </div>


                {/* =================================
                    TASK INFORMATION
                ================================== */}

                <div className="px-7 py-5">

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">


                        {/* PRIORITY */}

                        <div>

                            <p className="text-sm text-slate-400">
                                Priority
                            </p>


                            <span
                                className={`
                                    ${priorityColor(task.priority)}
                                    inline-block
                                    mt-2
                                    px-3
                                    py-1
                                    rounded-full
                                    text-xs
                                    font-bold
                                    capitalize
                                `}
                            >

                                {task.priority}

                            </span>

                        </div>


                        {/* ASSIGNED BY */}

                        <div>

                            <p className="text-sm text-slate-400">
                                Assigned By
                            </p>


                            <p className="font-semibold text-slate-800 mt-1">

                                {task.assignedBy?.name || "-"}

                            </p>


                            <p className="text-xs text-slate-400 mt-1">

                                {task.assignedBy?.email}

                            </p>

                        </div>


                        {/* ASSIGN DATE */}

                        <div>

                            <p className="text-sm text-slate-400">
                                Assigned Date
                            </p>


                            <p className="font-semibold text-slate-800 mt-1">

                                {task.assignDate
                                    ? new Date(
                                        task.assignDate
                                    ).toLocaleDateString()
                                    : "-"}

                            </p>

                        </div>


                        {/* DUE DATE */}

                        <div>

                            <p className="text-sm text-slate-400">
                                Due Date
                            </p>


                            <p className="font-semibold text-slate-800 mt-1">

                                {task.dueDate
                                    ? new Date(
                                        task.dueDate
                                    ).toLocaleDateString()
                                    : "-"}

                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================
                    STATUS UPDATE
                ================================== */}

                <div className="bg-slate-50 border-t border-slate-200 px-7 py-5">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">


                        {/* LEFT */}

                        <div>

                            <h3 className="text-lg font-bold text-slate-900">

                                Update Task Status

                            </h3>


                            <p className="text-sm text-slate-500 mt-1">

                                Change the status according to your task progress.

                            </p>

                        </div>


                        {/* RIGHT */}

                        <div className="flex flex-col sm:flex-row gap-3">


                            {/* STATUS */}

                            <select
                                value={selectedStatus}

                                onChange={(e) =>
                                    setSelectedStatus(
                                        e.target.value as TaskStatus
                                    )
                                }

                                className="
                                    w-full
                                    sm:w-56
                                    border
                                    border-slate-300
                                    bg-white
                                    rounded-lg
                                    px-4
                                    py-2.5
                                    outline-none
                                    focus:border-indigo-500
                                "
                            >

                                <option value="pending">
                                    Pending
                                </option>

                                <option value="working">
                                    Working
                                </option>

                                <option value="hold">
                                    Hold
                                </option>

                                <option value="completed">
                                    Completed
                                </option>

                            </select>


                            {/* UPDATE */}

                            <button
                                type="button"

                                onClick={
                                    requestStatusUpdate
                                }

                                className="
                                    bg-indigo-600
                                    hover:bg-indigo-700
                                    text-white
                                    px-6
                                    py-2.5
                                    rounded-lg
                                    font-semibold
                                    transition
                                    whitespace-nowrap
                                "
                            >

                                Update Status

                            </button>

                        </div>

                    </div>

                </div>

            </div>


            {/* =====================================
                CONFIRM STATUS MODAL
            ====================================== */}

            <ConfirmActionModal

                isOpen={showConfirm}

                title="Update Task Status"

                message={
                    `Are you sure you want to change status from ${task.status} to ${selectedStatus}?`
                }

                confirmText="Yes, Update"

                loading={updateLoading}

                onCancel={() => {

                    // Dropdown old/current status par reset
                    setSelectedStatus(
                        task.status
                    );

                    setShowConfirm(false);

                }}

                onConfirm={
                    handleStatusUpdate
                }

            />

        </div>

    );
}