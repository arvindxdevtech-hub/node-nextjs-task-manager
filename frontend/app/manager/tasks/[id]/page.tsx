"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

type TaskUser = {
    _id: string;
    name: string;
    email: string;
};

type Task = {
    _id: string;
    title: string;
    description: string;

    assignedTo: TaskUser;
    assignedBy: TaskUser;

    priority: "high" | "medium" | "low";

    status:
        | "pending"
        | "working"
        | "hold"
        | "completed";

    assignDate: string;
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
};

export default function ViewTaskPage() {

    const router = useRouter();

    // URL se dynamic task id
    const params = useParams();
    const id = params.id as string;

    const [task, setTask] =
        useState<Task | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // GET SINGLE TASK
    // ==========================================

    useEffect(() => {

        const fetchTask = async () => {

            try {

                setLoading(true);
                setError("");

                const token =
                    localStorage.getItem("token");


                const response = await fetch(
                    `${API_URL}/tasks/${id}`,
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


                setTask(data.task);


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
            fetchTask();
        }

    }, [id]);


    if (loading) {

        return (
            <div className="p-8 text-slate-500">
                Loading task...
            </div>
        );

    }


    if (!task) {

        return (
            <div className="p-8">

                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">

                    {error || "Task not found"}

                </div>

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
                            Task Details
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            View complete task information.
                        </p>

                    </div>


                    <div className="flex gap-3">

                        <button
                            onClick={() =>
                                router.push(
                                    `/manager/tasks/${task._id}/edit`
                                )
                            }
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold"
                        >
                            Edit Task
                        </button>


                        <button
                            onClick={() =>
                                router.push(
                                    "/manager/tasks"
                                )
                            }
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-lg font-semibold"
                        >
                            Back
                        </button>

                    </div>

                </div>

            </div>


            {/* CONTENT */}

            <div className="p-8">

                <div className="max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-sm p-8">


                    {/* TITLE */}

                    <div className="pb-6 border-b border-slate-100">

                        <div className="flex items-start justify-between">

                            <div>

                                <h2 className="text-2xl font-bold text-slate-900">
                                    {task.title}
                                </h2>

                                <p className="text-slate-500 mt-2">
                                    {task.description || "No description"}
                                </p>

                            </div>


                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">

                                {task.status}

                            </span>

                        </div>

                    </div>


                    {/* DETAILS */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-7">


                        <div>

                            <p className="text-sm text-slate-500">
                                Assigned Employee
                            </p>

                            <p className="font-semibold text-slate-800 mt-1">
                                {task.assignedTo?.name}
                            </p>

                            <p className="text-sm text-slate-400">
                                {task.assignedTo?.email}
                            </p>

                        </div>


                        <div>

                            <p className="text-sm text-slate-500">
                                Assigned By
                            </p>

                            <p className="font-semibold text-slate-800 mt-1">
                                {task.assignedBy?.name}
                            </p>

                            <p className="text-sm text-slate-400">
                                {task.assignedBy?.email}
                            </p>

                        </div>


                        <div>

                            <p className="text-sm text-slate-500">
                                Priority
                            </p>

                            <span className="inline-block mt-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">

                                {task.priority}

                            </span>

                        </div>


                        <div>

                            <p className="text-sm text-slate-500">
                                Status
                            </p>

                            <span className="inline-block mt-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">

                                {task.status}

                            </span>

                        </div>


                        <div>

                            <p className="text-sm text-slate-500">
                                Assign Date
                            </p>

                            <p className="font-semibold text-slate-800 mt-1">

                                {new Date(
                                    task.assignDate
                                ).toLocaleDateString()}

                            </p>

                        </div>


                        <div>

                            <p className="text-sm text-slate-500">
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

            </div>

        </div>
    );
}