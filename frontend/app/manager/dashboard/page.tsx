"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { API_URL } from "@/lib/api";
import { socket } from "@/lib/socket";


// ==========================================
// TYPES
// ==========================================

type Employee = {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
};


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

    createdAt: string;
    updatedAt: string;
};


type LoggedInUser = {
    id: string;
    name: string;
    email: string;
    role: string;
};


// ==========================================
// MANAGER NOTIFICATION TYPE
// ==========================================

type ManagerNotification = {

    // Temporary unique notification ID
    id: string;

    title: string;

    message: string;

    // Task detail page open karne ke liye
    taskId?: string;

    employeeId?: string;

    employeeName?: string;

    status?: string;

    // ISO date string localStorage me save hogi
    createdAt: string;

    // false = unread
    // true = read
    read: boolean;
};


// ==========================================
// LOCAL STORAGE KEY
// ==========================================

const MANAGER_NOTIFICATION_KEY =
    "manager_notifications";


// ==========================================
// MANAGER DASHBOARD
// ==========================================

export default function ManagerDashboard() {

    const router = useRouter();


    // ==========================================
    // MAIN STATES
    // ==========================================

    const [employees, setEmployees] =
        useState<Employee[]>([]);


    const [tasks, setTasks] =
        useState<Task[]>([]);


    const [user, setUser] =
        useState<LoggedInUser | null>(null);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    // ==========================================
    // NOTIFICATION STATES
    // ==========================================

    const [
        notifications,
        setNotifications
    ] = useState<ManagerNotification[]>([]);


    const [
        showNotifications,
        setShowNotifications
    ] = useState(false);


    // Ye batayega localStorage se old
    // notifications load ho chuki hain ya nahi.
    //
    // Isko isliye use kar rahe hain taaki
    // first render ka [] localStorage ki
    // existing notifications overwrite na kare.
    const [
        notificationsLoaded,
        setNotificationsLoaded
    ] = useState(false);


    // ==========================================
    // UNREAD COUNT
    // ==========================================

    const unreadCount =
        notifications.filter(
            notification =>
                !notification.read
        ).length;


    // ==========================================
    // LOAD OLD NOTIFICATIONS
    // LOCAL STORAGE → REACT STATE
    // ==========================================

    useEffect(() => {

        try {

            // Browser localStorage se previously
            // saved manager notifications lo.
            const savedNotifications =
                localStorage.getItem(
                    MANAGER_NOTIFICATION_KEY
                );


            if (savedNotifications) {

                const parsedNotifications =
                    JSON.parse(
                        savedNotifications
                    );


                // Safety:
                // ensure data array hi hai.
                if (
                    Array.isArray(
                        parsedNotifications
                    )
                ) {

                    setNotifications(
                        parsedNotifications
                    );

                }

            }


        } catch (error) {

            console.error(
                "Unable to load manager notifications:",
                error
            );

        } finally {

            // Old notifications load attempt complete
            setNotificationsLoaded(true);

        }

    }, []);


    // ==========================================
    // SAVE NOTIFICATIONS
    // REACT STATE → LOCAL STORAGE
    // ==========================================

    useEffect(() => {

        // Initial localStorage loading complete
        // hone ke baad hi save karo.
        if (!notificationsLoaded) {
            return;
        }


        try {

            localStorage.setItem(
                MANAGER_NOTIFICATION_KEY,
                JSON.stringify(
                    notifications
                )
            );

        } catch (error) {

            console.error(
                "Unable to save manager notifications:",
                error
            );

        }

    }, [
        notifications,
        notificationsLoaded
    ]);


    // ==========================================
    // PAGE LOAD
    // EMPLOYEE + TASK API
    // ==========================================

    useEffect(() => {

        const fetchDashboardData =
            async () => {

                try {

                    setLoading(true);
                    setError("");


                    // Login JWT token
                    const token =
                        localStorage.getItem(
                            "token"
                        );


                    // Login nahi hai
                    if (!token) {

                        router.push(
                            "/login"
                        );

                        return;

                    }


                    // ==================================
                    // LOGGED-IN MANAGER
                    // ==================================

                    const storedUser =
                        localStorage.getItem(
                            "user"
                        );


                    if (storedUser) {

                        setUser(
                            JSON.parse(
                                storedUser
                            )
                        );

                    }


                    // ==================================
                    // EMPLOYEE API
                    // ==================================

                    const employeeResponse =
                        await fetch(
                            `${API_URL}/employees`,
                            {
                                headers: {

                                    Authorization:
                                        `Bearer ${token}`

                                }
                            }
                        );


                    // ==================================
                    // TASK API
                    // ==================================

                    const taskResponse =
                        await fetch(
                            `${API_URL}/tasks`,
                            {
                                headers: {

                                    Authorization:
                                        `Bearer ${token}`

                                }
                            }
                        );


                    const employeeData =
                        await employeeResponse.json();


                    const taskData =
                        await taskResponse.json();


                    // ==================================
                    // ERROR CHECK
                    // ==================================

                    if (
                        !employeeResponse.ok
                    ) {

                        setError(
                            employeeData.message ||
                            "Unable to fetch employees"
                        );

                        return;

                    }


                    if (!taskResponse.ok) {

                        setError(
                            taskData.message ||
                            "Unable to fetch tasks"
                        );

                        return;

                    }


                    // ==================================
                    // SAVE DATA
                    // ==================================

                    setEmployees(
                        employeeData.employees ||
                        []
                    );


                    setTasks(
                        taskData.tasks ||
                        []
                    );


                } catch (error) {

                    console.error(
                        "Dashboard API error:",
                        error
                    );


                    setError(
                        "Unable to connect to server"
                    );


                } finally {

                    setLoading(false);

                }

            };


        fetchDashboardData();


    }, [router]);


    // ==========================================
    // SOCKET.IO
    // EMPLOYEE STATUS REALTIME UPDATE
    // ==========================================

    useEffect(() => {

        // Employee status update karta hai:
        //
        // backend:
        // emit("task-status-updated")
        //
        // manager dashboard:
        // on("task-status-updated")

        const handleTaskStatusUpdate =
            (data: any) => {

                console.log(
                    "Dashboard realtime status update:",
                    data
                );


                // ==================================
                // 1. DASHBOARD TASK UPDATE
                // ==================================

                // Matching task ka status
                // realtime update.
                //
                // Isse pending/working/completed
                // counts bhi automatic update honge.
                setTasks(
                    previousTasks =>

                        previousTasks.map(
                            task =>

                                task._id ===
                                data.taskId

                                    ? {
                                        ...task,

                                        status:
                                            data.status
                                    }

                                    : task
                        )
                );


                // ==================================
                // 2. CREATE NOTIFICATION
                // ==================================

                const notification:
                    ManagerNotification = {

                    // Date + random value
                    // taaki duplicate IDs na ho.
                    id:
                        `${Date.now()}-${Math.random()}`,

                    title:
                        "Task Status Updated",


                    message:
                        `${data.employeeName || "Employee"} updated "${data.title || "Task"}" to ${data.status}`,


                    taskId:
                        data.taskId,


                    employeeId:
                        data.employeeId,


                    employeeName:
                        data.employeeName ||
                        "Employee",


                    status:
                        data.status,


                    // LocalStorage friendly string
                    createdAt:
                        new Date().toISOString(),


                    // New notification initially unread
                    read: false,

                };


                // Latest notification top par
                setNotifications(
                    previousNotifications => [

                        notification,

                        ...previousNotifications

                    ]
                );

            };


        socket.on(
            "task-status-updated",
            handleTaskStatusUpdate
        );


        // ==========================================
        // CLEANUP
        // ==========================================

        return () => {

            socket.off(
                "task-status-updated",
                handleTaskStatusUpdate
            );


            // socket.disconnect()
            // YAHAN NAHI KARNA.
            //
            // Manager layout common
            // connection maintain kar raha hai.

        };


    }, []);


    // ==========================================
    // NOTIFICATION CLICK
    // MARK AS READ
    // ==========================================

    const handleNotificationClick = (
        notification: ManagerNotification
    ) => {

        // ======================================
        // ONLY CLICKED ITEM READ
        // ======================================

        setNotifications(
            previousNotifications =>

                previousNotifications.map(
                    item =>

                        item.id ===
                        notification.id

                            ? {
                                ...item,

                                // Sirf clicked notification
                                // read hogi.
                                read: true
                            }

                            : item
                )
        );


        // Dropdown close
        setShowNotifications(false);


        // Task detail page open
        if (notification.taskId) {

            router.push(
                `/manager/tasks/${notification.taskId}`
            );

        }

    };


    // ==========================================
    // CLEAR ALL NOTIFICATIONS
    // ==========================================

    const handleClearNotifications =
        () => {

            // React state empty
            setNotifications([]);

            // useEffect automatically
            // localStorage me bhi [] save karega.
            setShowNotifications(false);

        };


    // ==========================================
    // DASHBOARD COUNTS
    // ==========================================

    const totalEmployees =
        employees.length;


    const activeEmployees =
        employees.filter(
            employee =>
                employee.isActive === true
        ).length;


    const pendingTasks =
        tasks.filter(
            task =>
                task.status === "pending"
        ).length;


    const workingTasks =
        tasks.filter(
            task =>
                task.status === "working"
        ).length;


    const completedTasks =
        tasks.filter(
            task =>
                task.status === "completed"
        ).length;


    const holdTasks =
        tasks.filter(
            task =>
                task.status === "hold"
        ).length;


    // ==========================================
    // PRIORITY COLOR
    // ==========================================

    const getPriorityColor = (
        priority: Task["priority"]
    ) => {

        switch (priority) {

            case "high":

                return "bg-red-100 text-red-600";


            case "medium":

                return "bg-yellow-100 text-yellow-700";


            case "low":

                return "bg-green-100 text-green-700";


            default:

                return "bg-slate-100 text-slate-600";

        }

    };


    // ==========================================
    // STATUS COLOR
    // ==========================================

    const getStatusColor = (
        status: Task["status"]
    ) => {

        switch (status) {

            case "pending":

                return "bg-orange-100 text-orange-600";


            case "working":

                return "bg-blue-100 text-blue-600";


            case "hold":

                return "bg-yellow-100 text-yellow-700";


            case "completed":

                return "bg-green-100 text-green-700";


            default:

                return "bg-slate-100 text-slate-600";

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="
                min-h-screen
                flex
                items-center
                justify-center
            ">

                <div className="text-center">

                    <div className="
                        w-10
                        h-10
                        border-4
                        border-indigo-200
                        border-t-indigo-600
                        rounded-full
                        animate-spin
                        mx-auto
                    ">
                    </div>


                    <p className="
                        text-slate-500
                        mt-4
                    ">

                        Loading dashboard...

                    </p>

                </div>

            </div>

        );

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div>


            {/* =====================================
                HEADER
            ====================================== */}

            <header className="
                bg-white
                h-20
                border-b
                border-slate-200
                flex
                items-center
                justify-between
                px-8
            ">


                {/* LEFT */}

                <div>

                    <h2 className="
                        text-xl
                        font-bold
                        text-slate-800
                    ">

                        Manager Dashboard

                    </h2>


                    <p className="
                        text-sm
                        text-slate-500
                    ">

                        Manage employees and track team tasks.

                    </p>

                </div>


                {/* =================================
                    RIGHT
                ================================== */}

                <div className="
                    flex
                    items-center
                    gap-4
                ">


                    {/* =============================
                        NOTIFICATION BELL
                    ============================== */}

                    <div className="relative">

                        <button
                            type="button"

                            onClick={() =>
                                setShowNotifications(
                                    !showNotifications
                                )
                            }

                            title="Notifications"

                            className="
                                relative
                                w-10
                                h-10
                                bg-slate-100
                                hover:bg-indigo-50
                                rounded-full
                                flex
                                items-center
                                justify-center
                                transition
                            "
                        >

                            🔔


                            {/* =====================
                                UNREAD COUNT
                            ====================== */}

                            {unreadCount > 0 && (

                                <span className="
                                    absolute
                                    -top-1
                                    -right-1
                                    min-w-5
                                    h-5
                                    px-1
                                    bg-red-500
                                    text-white
                                    text-[10px]
                                    rounded-full
                                    flex
                                    items-center
                                    justify-center
                                    font-bold
                                ">

                                    {unreadCount}

                                </span>

                            )}

                        </button>


                        {/* =============================
                            DROPDOWN
                        ============================== */}

                        {showNotifications && (

                            <div className="
                                absolute
                                right-0
                                mt-3
                                w-96
                                bg-white
                                border
                                border-slate-200
                                rounded-xl
                                shadow-xl
                                z-50
                                overflow-hidden
                            ">


                                {/* =====================
                                    HEADER
                                ====================== */}

                                <div className="
                                    px-4
                                    py-3
                                    border-b
                                    border-slate-100
                                ">

                                    <div className="
                                        flex
                                        items-center
                                        justify-between
                                    ">

                                        <div>

                                            <h3 className="
                                                font-bold
                                                text-slate-800
                                            ">

                                                Notifications

                                            </h3>


                                            <p className="
                                                text-xs
                                                text-slate-400
                                                mt-0.5
                                            ">

                                                {unreadCount > 0

                                                    ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`

                                                    : "No unread notifications"
                                                }

                                            </p>

                                        </div>


                                        {/* CLEAR ALL */}

                                        {notifications.length > 0 && (

                                            <button
                                                type="button"

                                                onClick={
                                                    handleClearNotifications
                                                }

                                                className="
                                                    text-xs
                                                    font-semibold
                                                    text-indigo-600
                                                    hover:text-indigo-800
                                                "
                                            >

                                                Clear All

                                            </button>

                                        )}

                                    </div>

                                </div>


                                {/* =====================
                                    LIST
                                ====================== */}

                                <div className="
                                    max-h-96
                                    overflow-y-auto
                                ">


                                    {notifications.length === 0 ? (

                                        <div className="
                                            py-10
                                            text-center
                                        ">

                                            <div className="
                                                text-2xl
                                            ">

                                                🔔

                                            </div>


                                            <p className="
                                                text-slate-400
                                                text-sm
                                                mt-2
                                            ">

                                                No notifications

                                            </p>

                                        </div>

                                    ) : (

                                        notifications.map(
                                            notification => (

                                                <button
                                                    type="button"

                                                    key={
                                                        notification.id
                                                    }

                                                    onClick={() =>
                                                        handleNotificationClick(
                                                            notification
                                                        )
                                                    }

                                                    className={`
                                                        w-full
                                                        text-left
                                                        px-4
                                                        py-4
                                                        border-b
                                                        border-slate-100
                                                        transition

                                                        ${
                                                            notification.read

                                                                // READ
                                                                // light gray
                                                                ? "bg-slate-50 hover:bg-slate-100"

                                                                // UNREAD
                                                                // light blue
                                                                : "bg-blue-50 hover:bg-blue-100"
                                                        }
                                                    `}
                                                >

                                                    <div className="
                                                        flex
                                                        items-start
                                                        gap-3
                                                    ">


                                                        {/* ICON */}

                                                        <div
                                                            className={`
                                                                w-9
                                                                h-9
                                                                shrink-0
                                                                rounded-full
                                                                flex
                                                                items-center
                                                                justify-center

                                                                ${
                                                                    notification.read

                                                                        ? "bg-slate-200 text-slate-600"

                                                                        : "bg-blue-100 text-blue-600"
                                                                }
                                                            `}
                                                        >

                                                            ✓

                                                        </div>


                                                        {/* CONTENT */}

                                                        <div className="
                                                            flex-1
                                                            min-w-0
                                                        ">


                                                            {/* TITLE */}

                                                            <div className="
                                                                flex
                                                                items-center
                                                                justify-between
                                                                gap-3
                                                            ">

                                                                <p
                                                                    className={`
                                                                        text-sm

                                                                        ${
                                                                            notification.read

                                                                                ? "font-medium text-slate-700"

                                                                                : "font-bold text-slate-900"
                                                                        }
                                                                    `}
                                                                >

                                                                    {
                                                                        notification.title
                                                                    }

                                                                </p>


                                                                {/* UNREAD DOT */}

                                                                {!notification.read && (

                                                                    <span className="
                                                                        w-2
                                                                        h-2
                                                                        shrink-0
                                                                        rounded-full
                                                                        bg-blue-600
                                                                    ">
                                                                    </span>

                                                                )}

                                                            </div>


                                                            {/* MESSAGE */}

                                                            <p
                                                                className={`
                                                                    text-sm
                                                                    mt-1
                                                                    leading-5

                                                                    ${
                                                                        notification.read

                                                                            ? "text-slate-500"

                                                                            : "text-slate-700"
                                                                    }
                                                                `}
                                                            >

                                                                {
                                                                    notification.message
                                                                }

                                                            </p>


                                                            {/* DATE / TIME */}

                                                            <p className="
                                                                text-xs
                                                                text-slate-400
                                                                mt-2
                                                            ">

                                                                {
                                                                    new Date(
                                                                        notification.createdAt
                                                                    )
                                                                        .toLocaleString(
                                                                            "en-IN",
                                                                            {
                                                                                day:
                                                                                    "2-digit",

                                                                                month:
                                                                                    "short",

                                                                                year:
                                                                                    "numeric",

                                                                                hour:
                                                                                    "2-digit",

                                                                                minute:
                                                                                    "2-digit",

                                                                                hour12:
                                                                                    true,
                                                                            }
                                                                        )
                                                                }

                                                            </p>

                                                        </div>

                                                    </div>

                                                </button>

                                            )
                                        )

                                    )}

                                </div>

                            </div>

                        )}

                    </div>


                    {/* =================================
                        MANAGER PROFILE
                    ================================== */}

                    <div className="text-right">

                        <p className="
                            font-semibold
                            text-slate-800
                        ">

                            {user?.name || "Manager"}

                        </p>


                        <p className="
                            text-xs
                            text-slate-500
                        ">

                            Project Manager

                        </p>

                    </div>


                    {/* AVATAR */}

                    <div className="
                        w-11
                        h-11
                        bg-indigo-100
                        text-indigo-700
                        rounded-full
                        flex
                        items-center
                        justify-center
                        font-bold
                    ">

                        {user?.name
                            ?.split(" ")
                            .map(
                                name =>
                                    name.charAt(0)
                            )
                            .slice(0, 2)
                            .join("")
                            .toUpperCase() ||
                            "PM"
                        }

                    </div>

                </div>

            </header>


            {/* =====================================
                CONTENT
            ====================================== */}

            <div className="p-8">


                {/* ERROR */}

                {error && (

                    <div className="
                        mb-6
                        bg-red-50
                        border
                        border-red-200
                        text-red-700
                        px-4
                        py-3
                        rounded-xl
                    ">

                        {error}

                    </div>

                )}


                {/* =================================
                    WELCOME
                ================================== */}

                <div className="mb-8">

                    <h1 className="
                        text-3xl
                        font-bold
                        text-slate-900
                    ">

                        Welcome back,{" "}
                        {user?.name || "Manager"} 👋

                    </h1>


                    <p className="
                        text-slate-500
                        mt-1
                    ">

                        Here&apos;s what&apos;s happening with your team today.

                    </p>

                </div>


                {/* =================================
                    STATS
                ================================== */}

                <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-4
                    gap-6
                ">


                    {/* EMPLOYEES */}

                    <div className="
                        bg-white
                        rounded-2xl
                        p-6
                        shadow-sm
                        border
                        border-slate-100
                    ">

                        <div className="
                            flex
                            items-center
                            justify-between
                        ">

                            <div>

                                <p className="
                                    text-sm
                                    text-slate-500
                                ">

                                    Total Employees

                                </p>


                                <h3 className="
                                    text-3xl
                                    font-bold
                                    text-slate-900
                                    mt-2
                                ">

                                    {totalEmployees}

                                </h3>

                            </div>


                            <div className="
                                w-12
                                h-12
                                bg-indigo-100
                                rounded-xl
                                flex
                                items-center
                                justify-center
                                text-xl
                            ">

                                👥

                            </div>

                        </div>


                        <p className="
                            text-xs
                            text-green-600
                            mt-4
                        ">

                            {activeEmployees} active employees

                        </p>

                    </div>


                    {/* PENDING */}

                    <div className="
                        bg-white
                        rounded-2xl
                        p-6
                        shadow-sm
                        border
                        border-slate-100
                    ">

                        <div className="
                            flex
                            items-center
                            justify-between
                        ">

                            <div>

                                <p className="
                                    text-sm
                                    text-slate-500
                                ">

                                    Pending Tasks

                                </p>


                                <h3 className="
                                    text-3xl
                                    font-bold
                                    text-orange-500
                                    mt-2
                                ">

                                    {pendingTasks}

                                </h3>

                            </div>


                            <div className="
                                w-12
                                h-12
                                bg-orange-100
                                rounded-xl
                                flex
                                items-center
                                justify-center
                                text-xl
                            ">

                                ⏳

                            </div>

                        </div>


                        <p className="
                            text-xs
                            text-slate-400
                            mt-4
                        ">

                            {holdTasks} tasks currently on hold

                        </p>

                    </div>


                    {/* WORKING */}

                    <div className="
                        bg-white
                        rounded-2xl
                        p-6
                        shadow-sm
                        border
                        border-slate-100
                    ">

                        <div className="
                            flex
                            items-center
                            justify-between
                        ">

                            <div>

                                <p className="
                                    text-sm
                                    text-slate-500
                                ">

                                    Working

                                </p>


                                <h3 className="
                                    text-3xl
                                    font-bold
                                    text-blue-600
                                    mt-2
                                ">

                                    {workingTasks}

                                </h3>

                            </div>


                            <div className="
                                w-12
                                h-12
                                bg-blue-100
                                rounded-xl
                                flex
                                items-center
                                justify-center
                                text-xl
                            ">

                                ⚡

                            </div>

                        </div>


                        <p className="
                            text-xs
                            text-blue-500
                            mt-4
                        ">

                            Currently in progress

                        </p>

                    </div>


                    {/* COMPLETED */}

                    <div className="
                        bg-white
                        rounded-2xl
                        p-6
                        shadow-sm
                        border
                        border-slate-100
                    ">

                        <div className="
                            flex
                            items-center
                            justify-between
                        ">

                            <div>

                                <p className="
                                    text-sm
                                    text-slate-500
                                ">

                                    Completed

                                </p>


                                <h3 className="
                                    text-3xl
                                    font-bold
                                    text-green-600
                                    mt-2
                                ">

                                    {completedTasks}

                                </h3>

                            </div>


                            <div className="
                                w-12
                                h-12
                                bg-green-100
                                rounded-xl
                                flex
                                items-center
                                justify-center
                                text-xl
                            ">

                                ✓

                            </div>

                        </div>


                        <p className="
                            text-xs
                            text-green-600
                            mt-4
                        ">

                            Tasks completed

                        </p>

                    </div>

                </div>


                {/* =================================
                    RECENT + QUICK ACTIONS
                ================================== */}

                <div className="
                    grid
                    grid-cols-1
                    xl:grid-cols-3
                    gap-6
                    mt-8
                ">


                    {/* RECENT TASKS */}

                    <div className="
                        xl:col-span-2
                        bg-white
                        rounded-2xl
                        shadow-sm
                        border
                        border-slate-100
                    ">


                        <div className="
                            flex
                            items-center
                            justify-between
                            p-6
                            border-b
                            border-slate-100
                        ">

                            <div>

                                <h3 className="
                                    font-bold
                                    text-lg
                                    text-slate-800
                                ">

                                    Recent Tasks

                                </h3>


                                <p className="
                                    text-sm
                                    text-slate-500
                                ">

                                    Latest assigned team tasks

                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    router.push(
                                        "/manager/tasks"
                                    )
                                }

                                className="
                                    text-indigo-600
                                    text-sm
                                    font-semibold
                                    hover:text-indigo-800
                                "
                            >

                                View All →

                            </button>

                        </div>


                        <div className="
                            divide-y
                            divide-slate-100
                        ">

                            {tasks
                                .slice(0, 5)
                                .map(
                                    task => (

                                        <div
                                            key={
                                                task._id
                                            }

                                            className="
                                                p-5
                                                flex
                                                items-center
                                                justify-between
                                                hover:bg-slate-50
                                                transition
                                            "
                                        >

                                            <div>

                                                <p className="
                                                    font-semibold
                                                    text-slate-800
                                                ">

                                                    {
                                                        task.title
                                                    }

                                                </p>


                                                <p className="
                                                    text-sm
                                                    text-slate-500
                                                    mt-1
                                                ">

                                                    Assigned to{" "}

                                                    <span className="
                                                        font-medium
                                                    ">

                                                        {
                                                            task.assignedTo
                                                                ?.name
                                                        }

                                                    </span>

                                                </p>

                                            </div>


                                            <div className="
                                                flex
                                                items-center
                                                gap-3
                                            ">

                                                <span
                                                    className={`
                                                        ${getPriorityColor(
                                                            task.priority
                                                        )}

                                                        px-3
                                                        py-1
                                                        rounded-full
                                                        text-xs
                                                        font-semibold
                                                        capitalize
                                                    `}
                                                >

                                                    {
                                                        task.priority
                                                    }

                                                </span>


                                                <span
                                                    className={`
                                                        ${getStatusColor(
                                                            task.status
                                                        )}

                                                        px-3
                                                        py-1
                                                        rounded-full
                                                        text-xs
                                                        font-semibold
                                                        capitalize
                                                    `}
                                                >

                                                    {
                                                        task.status
                                                    }

                                                </span>

                                            </div>

                                        </div>

                                    )
                                )}


                            {tasks.length === 0 && (

                                <div className="
                                    text-center
                                    py-12
                                    text-slate-500
                                ">

                                    No tasks found.

                                </div>

                            )}

                        </div>

                    </div>


                    {/* =================================
                        QUICK ACTIONS
                    ================================== */}

                    <div className="
                        bg-white
                        rounded-2xl
                        shadow-sm
                        border
                        border-slate-100
                        p-6
                    ">


                        <h3 className="
                            font-bold
                            text-lg
                            text-slate-800
                        ">

                            Quick Actions

                        </h3>


                        <p className="
                            text-sm
                            text-slate-500
                            mt-1
                            mb-6
                        ">

                            Common manager actions

                        </p>


                        <div className="
                            space-y-3
                        ">


                            {/* ADD EMPLOYEE */}

                            <button
                                onClick={() =>
                                    router.push(
                                        "/manager/employees/create"
                                    )
                                }

                                className="
                                    w-full
                                    bg-indigo-50
                                    hover:bg-indigo-100
                                    text-indigo-700
                                    text-left
                                    px-4
                                    py-4
                                    rounded-xl
                                    transition
                                "
                            >

                                <p className="
                                    font-semibold
                                ">

                                    + Add Employee

                                </p>


                                <p className="
                                    text-xs
                                    mt-1
                                    text-indigo-500
                                ">

                                    Create a new employee account

                                </p>

                            </button>


                            {/* ASSIGN TASK */}

                            <button
                                onClick={() =>
                                    router.push(
                                        "/manager/tasks/create"
                                    )
                                }

                                className="
                                    w-full
                                    bg-blue-50
                                    hover:bg-blue-100
                                    text-blue-700
                                    text-left
                                    px-4
                                    py-4
                                    rounded-xl
                                    transition
                                "
                            >

                                <p className="
                                    font-semibold
                                ">

                                    + Assign Task

                                </p>


                                <p className="
                                    text-xs
                                    mt-1
                                    text-blue-500
                                ">

                                    Assign task to an employee

                                </p>

                            </button>


                            {/* VIEW EMPLOYEES */}

                            <button
                                onClick={() =>
                                    router.push(
                                        "/manager/employees"
                                    )
                                }

                                className="
                                    w-full
                                    bg-green-50
                                    hover:bg-green-100
                                    text-green-700
                                    text-left
                                    px-4
                                    py-4
                                    rounded-xl
                                    transition
                                "
                            >

                                <p className="
                                    font-semibold
                                ">

                                    View Employees

                                </p>


                                <p className="
                                    text-xs
                                    mt-1
                                    text-green-600
                                ">

                                    Manage your team members

                                </p>

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}