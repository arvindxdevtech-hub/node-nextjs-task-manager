"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { API_URL } from "@/lib/api";
import ConfirmActionModal from "@/app/components/ConfirmActionModal";
import { socket } from "@/lib/socket";


type TaskUser = {
    _id: string;
    name: string;
    email: string;
};


type Task = {
    _id: string;
    title: string;
    description: string;

    assignedBy: TaskUser;

    priority:
        | "high"
        | "medium"
        | "low";

    status:
        | "pending"
        | "working"
        | "hold"
        | "completed";

    assignDate: string;
    dueDate: string | null;
};


export default function EmployeeTaskListPage() {

    useEffect(() => {

    const handleNewTask = (data: any) => {

        setTasks((previousTasks) => [

            data.task,

            ...previousTasks

        ]);

    };


    socket.on(
        "new-task",
        handleNewTask
    );


    return () => {

        socket.off(
            "new-task",
            handleNewTask
        );

    };

}, []);

    const router = useRouter();

    // URL query read karne ke liye
    // Example:
    // /employee/tasks?status=pending
    const searchParams = useSearchParams();


    // ==========================================
    // STATES
    // ==========================================

    const [tasks, setTasks] =
        useState<Task[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // Priority filter
    const [priority, setPriority] =
        useState("");


    // Status change ke liye selected task
    const [selectedTask, setSelectedTask] =
        useState<Task | null>(null);


    // New selected status
    const [newStatus, setNewStatus] =
        useState("");


    const [updateLoading, setUpdateLoading] =
        useState(false);


    // ==========================================
    // URL SE STATUS
    // ==========================================

    const status =
        searchParams.get("status") || "";


    // ==========================================
    // FETCH TASKS
    // ==========================================

    const fetchTasks = async () => {

        try {

            setLoading(true);
            setError("");


            const token =
                localStorage.getItem("token");


            const response = await fetch(
                `${API_URL}/employee/tasks`,
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
                    "Unable to fetch tasks"
                );

                return;

            }


            setTasks(
                data.tasks || []
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


    // Page load
    useEffect(() => {

        fetchTasks();

    }, []);


    // ==========================================
    // FILTER + SORT
    // ==========================================

    const filteredTasks = useMemo(() => {

        let result = [...tasks];


        // Status filter
        if (status) {

            result = result.filter(
                task =>
                    task.status === status
            );

        }


        // Priority filter
        if (priority) {

            result = result.filter(
                task =>
                    task.priority === priority
            );

        }


        // Priority ranking
        const priorityOrder = {
            high: 1,
            medium: 2,
            low: 3
        };


        // --------------------------------------
        // SORT
        // Due Date nearest first
        // Same date → priority high first
        // --------------------------------------

        result.sort((a, b) => {

            const dateA =
                a.dueDate
                    ? new Date(a.dueDate).getTime()
                    : Infinity;


            const dateB =
                b.dueDate
                    ? new Date(b.dueDate).getTime()
                    : Infinity;


            if (dateA !== dateB) {

                return dateA - dateB;

            }


            return (
                priorityOrder[a.priority] -
                priorityOrder[b.priority]
            );

        });


        return result;

    }, [
        tasks,
        status,
        priority
    ]);


    // ==========================================
    // STATUS CHANGE SELECT
    // ==========================================

    const requestStatusChange = (
        task: Task,
        status: string
    ) => {

        // Same status select kiya
        if (task.status === status) {
            return;
        }


        // Task save
        setSelectedTask(task);

        // New status save
        setNewStatus(status);

    };


    // ==========================================
    // UPDATE STATUS
    // ==========================================

    const handleStatusUpdate =
        async () => {

        if (!selectedTask || !newStatus) {
            return;
        }


        try {

            setUpdateLoading(true);


            const token =
                localStorage.getItem("token");


            const response = await fetch(

                `${API_URL}/employee/tasks/${selectedTask._id}/status`,

                {
                    method: "PATCH",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({
                        status: newStatus
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


            // --------------------------------------
            // Local state update
            // Isse page refresh nahi karna padega
            // --------------------------------------

            setTasks(
                previousTasks =>
                    previousTasks.map(
                        task =>
                            task._id ===
                            selectedTask._id

                                ? {
                                    ...task,
                                    status:
                                        newStatus as Task["status"]
                                }

                                : task
                    )
            );


            toast.success(
                `Task changed status to ${newStatus}`
            );


            // Modal close
            setSelectedTask(null);

            setNewStatus("");


        } catch (error) {

            console.error(error);

            toast.error(
                "Unable to connect to server"
            );


        } finally {

            setUpdateLoading(false);

        }

    };


    // ==========================================
    // PAGE TITLE
    // ==========================================

    const pageTitle = status
        ? `${
            status.charAt(0).toUpperCase() +
            status.slice(1)
        } Tasks`
        : "My Tasks";


    return (

        <div className="p-8">


            {/* =====================================
                HEADER
            ====================================== */}

            <div className="flex items-center justify-between mb-7">

                <div>

                    <h1 className="text-3xl font-bold text-slate-900">
                        {pageTitle}
                    </h1>

                    <p className="text-slate-500 mt-1">
                        View and manage your assigned tasks.
                    </p>

                </div>


                {status && (

                    <button
                        onClick={() =>
                            router.push(
                                "/employee/tasks"
                            )
                        }
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                        View All Tasks
                    </button>

                )}

            </div>


            {/* =====================================
                FILTER
            ====================================== */}

            <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">

                <div className="flex items-end gap-4">


                    {/* PRIORITY FILTER */}

                    <div className="w-56">

                        <label className="block text-sm font-semibold text-slate-600 mb-2">
                            Priority
                        </label>


                        <select
                            value={priority}

                            onChange={(e) =>
                                setPriority(
                                    e.target.value
                                )
                            }

                            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 bg-white outline-none focus:border-indigo-500"
                        >

                            <option value="">
                                All Priorities
                            </option>

                            <option value="high">
                                High
                            </option>

                            <option value="medium">
                                Medium
                            </option>

                            <option value="low">
                                Low
                            </option>

                        </select>

                    </div>


                    <button
                        onClick={() =>
                            setPriority("")
                        }
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-semibold"
                    >
                        Clear
                    </button>


                    <div className="ml-auto text-sm text-slate-500">

                        Tasks:

                        <span className="font-bold text-slate-800 ml-1">
                            {filteredTasks.length}
                        </span>

                    </div>

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">

                    {error}

                </div>

            )}


            {/* =====================================
                LIST
            ====================================== */}

            {loading ? (

                <p className="text-slate-500">
                    Loading tasks...
                </p>

            ) : (

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

                    <table className="w-full">


                        <thead className="bg-slate-50 border-b border-slate-200">

                            <tr>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                    Task
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                    Priority
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                    Due Date
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                    Status
                                </th>

                                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">
                                    View
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y divide-slate-100">

                            {filteredTasks.map(
                                task => (

                                    <tr
                                        key={task._id}
                                        className="hover:bg-slate-50"
                                    >


                                        {/* TASK */}

                                        <td className="px-6 py-4">

                                            <p className="font-semibold text-slate-800">
                                                {task.title}
                                            </p>

                                            <p className="text-xs text-slate-400 mt-1 max-w-[300px] truncate">
                                                {task.description}
                                            </p>

                                        </td>


                                        {/* PRIORITY */}

                                        <td className="px-6 py-4">

                                            <span
                                                className={`
                                                    px-3 py-1
                                                    rounded-full
                                                    text-xs
                                                    font-semibold
                                                    capitalize

                                                    ${
                                                        task.priority === "high"
                                                            ? "bg-red-100 text-red-700"
                                                            : task.priority === "medium"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-green-100 text-green-700"
                                                    }
                                                `}
                                            >
                                                {task.priority}
                                            </span>

                                        </td>


                                        {/* DUE DATE */}

                                        <td className="px-6 py-4">

                                            <p className="font-medium text-slate-700">

                                                {task.dueDate
                                                    ? new Date(
                                                        task.dueDate
                                                    ).toLocaleDateString()
                                                    : "-"}

                                            </p>

                                        </td>


                                        {/* STATUS DROPDOWN */}

                                        <td className="px-6 py-4">

                                            <select
                                                value={task.status}

                                                onChange={(e) =>
                                                    requestStatusChange(
                                                        task,
                                                        e.target.value
                                                    )
                                                }

                                                className="
                                                    border
                                                    border-slate-300
                                                    rounded-lg
                                                    px-3 py-2
                                                    bg-white
                                                    text-sm
                                                    font-medium
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

                                        </td>


                                        {/* VIEW */}

                                        <td className="px-6 py-4">

                                            <div className="flex justify-end">

                                                <button
                                                    title="View Task"

                                                    onClick={() =>
                                                        router.push(
                                                            `/employee/tasks/${task._id}`
                                                        )
                                                    }

                                                    className="
                                                        w-8 h-8
                                                        flex
                                                        items-center
                                                        justify-center
                                                        bg-blue-50
                                                        text-blue-600
                                                        rounded-md
                                                        hover:bg-blue-100
                                                    "
                                                >

                                                    <svg
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    >
                                                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />

                                                        <circle
                                                            cx="12"
                                                            cy="12"
                                                            r="3"
                                                        />
                                                    </svg>

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>


                    {filteredTasks.length === 0 && (

                        <div className="text-center py-12 text-slate-500">
                            No tasks found.
                        </div>

                    )}

                </div>

            )}


            {/* =====================================
                STATUS CONFIRMATION MODAL
            ====================================== */}

            <ConfirmActionModal

                isOpen={
                    selectedTask !== null
                }

                title="Update Task Status"

                message={
                    selectedTask

                        ? `Change "${selectedTask.title}" from ${selectedTask.status} to ${newStatus}?`

                        : ""
                }

                confirmText="Yes, Update"

                loading={
                    updateLoading
                }

                onCancel={() => {

                    setSelectedTask(null);

                    setNewStatus("");

                }}

                onConfirm={
                    handleStatusUpdate
                }

            />

        </div>

    );
}