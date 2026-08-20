"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import { socket } from "@/lib/socket";

type Task = {
    _id: string;
    title: string;
    status: "pending" | "working" | "hold" | "completed";
    priority: "high" | "mid" | "low";
    dueDate: string;
};

export default function EmployeeDashboard() {

    useEffect(() => {

    // Manager new task assign karega
    // backend emit("new-task")
    // yahan frontend receive karega

    const handleNewTask = (data: any) => {

        console.log(
            "Dashboard received new task:",
            data
        );


        // Naya task current task array me add
        setTasks((previousTasks) => [

            data.task,

            ...previousTasks

        ]);

    };


    // Event listener
    socket.on(
        "new-task",
        handleNewTask
    );


    // Cleanup
    return () => {

        socket.off(
            "new-task",
            handleNewTask
        );

    };

}, []);

    const router = useRouter();

    // ==========================================
    // STATES
    // ==========================================

    const [tasks, setTasks] = useState<Task[]>([]);

    const [loading, setLoading] = useState(true);

    const [employeeName, setEmployeeName] =
        useState("Employee");


    // ==========================================
    // FETCH EMPLOYEE TASKS
    // ==========================================

    useEffect(() => {

        const fetchTasks = async () => {

            try {

                const token =
                    localStorage.getItem("token");


                // Login ke time save kiya hua user
                const savedUser =
                    localStorage.getItem("user");


                if (savedUser) {

                    const user =
                        JSON.parse(savedUser);

                    setEmployeeName(user.name);

                }


                // Logged-in employee ke tasks
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

                    console.error(
                        data.message
                    );

                    return;

                }


                setTasks(
                    data.tasks || []
                );


            } catch (error) {

                console.error(
                    "Dashboard error:",
                    error
                );


            } finally {

                setLoading(false);

            }

        };


        fetchTasks();

    }, []);


    // ==========================================
    // STATUS COUNTS
    // ==========================================

    const pendingCount =
        tasks.filter(
            task => task.status === "pending"
        ).length;


    const workingCount =
        tasks.filter(
            task => task.status === "working"
        ).length;


    const holdCount =
        tasks.filter(
            task => task.status === "hold"
        ).length;


    const completeCount =
        tasks.filter(
            task => task.status === "completed"
        ).length;


    const totalTasks = tasks.length;


    // ==========================================
    // DASHBOARD UI
    // ==========================================

    return (

        <div className="p-8">


            {/* =====================================
                WELCOME SECTION
            ====================================== */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-slate-900">

                    Welcome, {employeeName} 👋

                </h1>


                <p className="text-slate-500 mt-2">

                    Here&apos;s an overview of your assigned tasks.

                </p>

            </div>


            {/* =====================================
                STATUS CARDS
            ====================================== */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">


                {/* PENDING */}

                <div
                    onClick={() =>
                        router.push(
                            "/employee/tasks?status=pending"
                        )
                    }
                    className="
                        bg-white
                        border border-orange-200
                        rounded-2xl
                        p-6
                        shadow-sm
                        cursor-pointer
                        hover:shadow-md
                        hover:-translate-y-1
                        transition
                    "
                >

                    <div className="flex items-center justify-between">

                        <div className="
                            w-12 h-12
                            rounded-xl
                            bg-orange-100
                            flex items-center
                            justify-center
                            text-2xl
                        ">
                            ⏳
                        </div>


                        <span className="
                            text-xs
                            font-semibold
                            bg-orange-100
                            text-orange-700
                            px-3 py-1
                            rounded-full
                        ">
                            Pending
                        </span>

                    </div>


                    <div className="mt-5">

                        <p className="text-3xl font-bold text-slate-900">

                            {loading ? "..." : pendingCount}

                        </p>


                        <p className="text-sm text-slate-500 mt-1">

                            Tasks waiting to start

                        </p>

                    </div>

                </div>


                {/* WORKING */}

                <div
                    onClick={() =>
                        router.push(
                            "/employee/tasks?status=working"
                        )
                    }
                    className="
                        bg-white
                        border border-blue-200
                        rounded-2xl
                        p-6
                        shadow-sm
                        cursor-pointer
                        hover:shadow-md
                        hover:-translate-y-1
                        transition
                    "
                >

                    <div className="flex items-center justify-between">

                        <div className="
                            w-12 h-12
                            rounded-xl
                            bg-blue-100
                            flex items-center
                            justify-center
                            text-2xl
                        ">
                            ⚡
                        </div>


                        <span className="
                            text-xs
                            font-semibold
                            bg-blue-100
                            text-blue-700
                            px-3 py-1
                            rounded-full
                        ">
                            Working
                        </span>

                    </div>


                    <div className="mt-5">

                        <p className="text-3xl font-bold text-slate-900">

                            {loading ? "..." : workingCount}

                        </p>


                        <p className="text-sm text-slate-500 mt-1">

                            Tasks currently in progress

                        </p>

                    </div>

                </div>


                {/* HOLD */}

                <div
                    onClick={() =>
                        router.push(
                            "/employee/tasks?status=hold"
                        )
                    }
                    className="
                        bg-white
                        border border-yellow-200
                        rounded-2xl
                        p-6
                        shadow-sm
                        cursor-pointer
                        hover:shadow-md
                        hover:-translate-y-1
                        transition
                    "
                >

                    <div className="flex items-center justify-between">

                        <div className="
                            w-12 h-12
                            rounded-xl
                            bg-yellow-100
                            flex items-center
                            justify-center
                            text-2xl
                        ">
                            ⏸
                        </div>


                        <span className="
                            text-xs
                            font-semibold
                            bg-yellow-100
                            text-yellow-700
                            px-3 py-1
                            rounded-full
                        ">
                            Hold
                        </span>

                    </div>


                    <div className="mt-5">

                        <p className="text-3xl font-bold text-slate-900">

                            {loading ? "..." : holdCount}

                        </p>


                        <p className="text-sm text-slate-500 mt-1">

                            Tasks currently on hold

                        </p>

                    </div>

                </div>


                {/* COMPLETE */}

                <div
                    onClick={() =>
                        router.push(
                            "/employee/tasks?status=completed"
                        )
                    }
                    className="
                        bg-white
                        border border-green-200
                        rounded-2xl
                        p-6
                        shadow-sm
                        cursor-pointer
                        hover:shadow-md
                        hover:-translate-y-1
                        transition
                    "
                >

                    <div className="flex items-center justify-between">

                        <div className="
                            w-12 h-12
                            rounded-xl
                            bg-green-100
                            flex items-center
                            justify-center
                            text-2xl
                        ">
                            ✓
                        </div>


                        <span className="
                            text-xs
                            font-semibold
                            bg-green-100
                            text-green-700
                            px-3 py-1
                            rounded-full
                        ">
                            Completed
                        </span>

                    </div>


                    <div className="mt-5">

                        <p className="text-3xl font-bold text-slate-900">

                            {loading ? "..." : completeCount}

                        </p>


                        <p className="text-sm text-slate-500 mt-1">

                            Successfully completed tasks

                        </p>

                    </div>

                </div>

            </div>


            {/* =====================================
                SUMMARY
            ====================================== */}

            <div className="
                mt-7
                bg-gradient-to-r
                from-indigo-600
                to-blue-500
                rounded-2xl
                p-6
                text-white
                shadow-sm
            ">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-indigo-100 text-sm">
                            Total Assigned Tasks
                        </p>

                        <p className="text-3xl font-bold mt-1">
                            {loading ? "..." : totalTasks}
                        </p>

                    </div>


                    <button
                        onClick={() =>
                            router.push(
                                "/employee/tasks"
                            )
                        }
                        className="
                            bg-white/20
                            hover:bg-white/30
                            px-5 py-2.5
                            rounded-lg
                            font-semibold
                            transition
                        "
                    >
                        View All Tasks →
                    </button>

                </div>

            </div>

        </div>
    );
}