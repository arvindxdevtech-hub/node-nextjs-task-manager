"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

import { socket } from "@/lib/socket";


// ==========================================
// TYPES
// ==========================================

type LoggedInUser = {
    id: string;
    name: string;
    email: string;
    role: string;
};


type EmployeeNotification = {

    // Temporary notification unique ID
    id: string;

    // Notification heading
    title: string;

    // Notification message
    message: string;

    // Task detail open karne ke liye
    taskId?: string;

    // Notification create hone ka exact time
    createdAt: string;

    // false = unread
    // true = read
    read: boolean;
};


// ==========================================
// EMPLOYEE LAYOUT
// ==========================================

export default function EmployeeLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const router = useRouter();


    // ==========================================
    // USER STATE
    // ==========================================

    const [user, setUser] =
        useState<LoggedInUser | null>(null);


    // ==========================================
    // NOTIFICATION STATES
    // ==========================================

    const [
        notifications,
        setNotifications
    ] = useState<EmployeeNotification[]>([]);


    const [
        showNotifications,
        setShowNotifications
    ] = useState(false);


    // Ye ensure karega ki localStorage se
    // notification load hone ke baad hi
    // wapas storage me save ho.
    const [
        notificationsLoaded,
        setNotificationsLoaded
    ] = useState(false);


    // ==========================================
    // UNREAD COUNT
    // ==========================================

    // Bell badge me sirf unread count dikhayenge.
    const unreadCount =
        notifications.filter(
            notification =>
                !notification.read
        ).length;


    // ==========================================
    // CURRENT EMPLOYEE NOTIFICATION KEY
    // ==========================================

    const getNotificationKey = () => {

        // Logged-in user localStorage se lo
        const storedUser =
            localStorage.getItem("user");


        if (!storedUser) {
            return null;
        }


        try {

            const currentUser =
                JSON.parse(storedUser);


            // ======================================
            // IMPORTANT
            // ======================================
            //
            // Har employee ki unique localStorage key.
            //
            // Example:
            //
            // Kiran:
            // employee_notifications_123
            //
            // Rahul:
            // employee_notifications_456
            //
            // Isliye ek employee ki notification
            // dusre employee ko nahi dikhegi.

            return `employee_notifications_${currentUser.id}`;


        } catch (error) {

            console.error(
                "Unable to create notification key:",
                error
            );


            return null;

        }

    };


    // ==========================================
    // LOAD LOGGED-IN EMPLOYEE
    // ==========================================

    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");


        if (!storedUser) {

            // Login user nahi hai
            router.push("/login");

            return;

        }


        try {

            const parsedUser =
                JSON.parse(storedUser);


            setUser(parsedUser);


        } catch (error) {

            console.error(
                "Unable to parse employee:",
                error
            );

        }

    }, [router]);


    // ==========================================
    // LOAD CURRENT EMPLOYEE NOTIFICATIONS
    // LOCAL STORAGE → REACT STATE
    // ==========================================

    useEffect(() => {

        try {

            // Current logged-in employee ki
            // unique notification key.
            const notificationKey =
                getNotificationKey();


            if (!notificationKey) {

                setNotificationsLoaded(true);

                return;

            }


            // ======================================
            // Current employee ki notifications
            // ======================================

            const savedNotifications =
                localStorage.getItem(
                    notificationKey
                );


            if (savedNotifications) {

                const parsedNotifications =
                    JSON.parse(
                        savedNotifications
                    );


                // Safety check:
                // Notifications array honi chahiye.
                if (
                    Array.isArray(
                        parsedNotifications
                    )
                ) {

                    setNotifications(
                        parsedNotifications
                    );

                }

            } else {

                // Is employee ki old notification
                // nahi mili to empty array.
                setNotifications([]);

            }


        } catch (error) {

            console.error(
                "Unable to load employee notifications:",
                error
            );


        } finally {

            // Loading complete
            setNotificationsLoaded(true);

        }

    }, []);


    // ==========================================
    // SAVE CURRENT EMPLOYEE NOTIFICATIONS
    // REACT STATE → LOCAL STORAGE
    // ==========================================

    useEffect(() => {

        // Pehle old notifications load honi chahiye.
        if (!notificationsLoaded) {
            return;
        }


        try {

            const notificationKey =
                getNotificationKey();


            if (!notificationKey) {
                return;
            }


            // ======================================
            // Sirf current employee ki
            // notification save hogi.
            // ======================================

            localStorage.setItem(
                notificationKey,
                JSON.stringify(
                    notifications
                )
            );


        } catch (error) {

            console.error(
                "Unable to save employee notifications:",
                error
            );

        }

    }, [
        notifications,
        notificationsLoaded
    ]);


    // ==========================================
    // SOCKET.IO
    // ==========================================

    useEffect(() => {

        // ======================================
        // 1. LOGGED-IN EMPLOYEE
        // ======================================

        const storedUser =
            localStorage.getItem("user");


        if (!storedUser) {
            return;
        }


        const currentUser =
            JSON.parse(storedUser);


        // ======================================
        // 2. SOCKET CONNECT HANDLER
        // ======================================

        const handleConnect = () => {

            console.log(
                "Employee socket connected:",
                socket.id
            );


            // Employee backend ko apni ID bhejega.
            //
            // Frontend sender = emit()
            //
            // Backend:
            // socket.on("join-employee")
            socket.emit(
                "join-employee",
                currentUser.id
            );

        };


        // ======================================
        // 3. NEW TASK REALTIME HANDLER
        // ======================================

        // Manager employee ko task assign karega.
        //
        // Backend:
        // emit("new-task")
        //
        // Employee frontend:
        // on("new-task")
        const handleNewTask =
            (data: any) => {

                console.log(
                    "Realtime new task:",
                    data
                );


                // ==================================
                // CREATE NOTIFICATION
                // ==================================

                const notification:
                    EmployeeNotification = {

                    // Temporary unique ID
                    id:
                        `${Date.now()}-${Math.random()}`,


                    // Heading
                    title:
                        "New Task Assigned",


                    // Task title
                    message:
                        data.task?.title ||
                        "New Task",


                    // Notification click par
                    // same task detail open hoga.
                    taskId:
                        data.task?._id,


                    // Exact date/time
                    createdAt:
                        new Date()
                            .toISOString(),


                    // New notification unread hogi.
                    read:
                        false,

                };


                // ==================================
                // ADD NOTIFICATION
                // ==================================

                // Latest notification top par.
                setNotifications(
                    previousNotifications => [

                        notification,

                        ...previousNotifications

                    ]
                );


                // ==================================
                // TOAST
                // ==================================

                toast.success(
                    `New task assigned: ${
                        data.task?.title ||
                        "New Task"
                    }`,
                    {
                        duration: 5000,
                    }
                );

            };


        // ======================================
        // 4. EVENT LISTENERS
        // ======================================

        socket.on(
            "connect",
            handleConnect
        );


        socket.on(
            "new-task",
            handleNewTask
        );


        // ======================================
        // 5. SOCKET CONNECT
        // ======================================

        socket.connect();


        // ======================================
        // 6. CLEANUP
        // ======================================

        return () => {

            socket.off(
                "connect",
                handleConnect
            );


            socket.off(
                "new-task",
                handleNewTask
            );


            // IMPORTANT:
            //
            // socket.disconnect() yahan nahi karna.
            //
            // Employee dashboard aur task pages
            // bhi same common socket use karte hain.

        };


    }, []);


    // ==========================================
    // NOTIFICATION CLICK
    // ==========================================

    const handleNotificationClick = (
        notification: EmployeeNotification
    ) => {

        // ======================================
        // SIRF CLICKED NOTIFICATION READ
        // ======================================

        setNotifications(
            previousNotifications =>

                previousNotifications.map(
                    item =>

                        item.id ===
                        notification.id

                            ? {
                                ...item,

                                // Clicked notification read
                                read: true
                            }

                            : item
                )
        );


        // Dropdown close
        setShowNotifications(false);


        // Task detail open
        if (notification.taskId) {

            router.push(
                `/employee/tasks/${notification.taskId}`
            );

        }

    };


    // ==========================================
    // CLEAR ALL NOTIFICATIONS
    // ==========================================

    const handleClearNotifications =
        () => {

            // Current employee ki
            // saari notifications remove.
            setNotifications([]);


            // Dropdown close
            setShowNotifications(false);


            // useEffect automatically
            // current employee ki localStorage
            // key me [] save kar dega.

        };


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        // ======================================
        // AUTH DATA REMOVE
        // ======================================

        localStorage.removeItem("token");

        localStorage.removeItem("user");


        // ======================================
        // NOTIFICATION STORAGE REMOVE NAHI KARNA
        // ======================================
        //
        // Employee-specific notification key:
        //
        // employee_notifications_USER_ID
        //
        // localStorage me safe rahegi.
        //
        // Same employee dobara login karega to
        // uski old notification history wapas aa jayegi.
        //
        // Dusra employee login karega to uski
        // alag key load hogi.


        router.push("/login");

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="
            min-h-screen
            bg-slate-100
        ">


            {/* =====================================
                TOP HEADER
            ====================================== */}

            <header className="
                h-20
                bg-white
                border-b
                border-slate-200
                flex
                items-center
                justify-between
                px-8
            ">


                {/* =================================
                    LEFT
                ================================== */}

                <div className="
                    flex
                    items-center
                    gap-8
                ">


                    {/* =================================
                        LOGO
                    ================================== */}

                    <div
                        onClick={() =>
                            router.push(
                                "/employee/dashboard"
                            )
                        }

                        className="
                            flex
                            items-center
                            gap-3
                            cursor-pointer
                        "
                    >

                        <div className="
                            w-10
                            h-10
                            bg-gradient-to-br
                            from-indigo-600
                            to-blue-500
                            text-white
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            font-bold
                            text-xl
                        ">

                            T

                        </div>


                        <div>

                            <h1 className="
                                font-bold
                                text-xl
                                text-slate-900
                            ">

                                TaskFlow

                            </h1>


                            <p className="
                                text-xs
                                text-slate-400
                            ">

                                Employee Portal

                            </p>

                        </div>

                    </div>


                    {/* =================================
                        MENU
                    ================================== */}

                    <nav className="
                        hidden
                        md:flex
                        items-center
                        gap-2
                    ">


                        {/* DASHBOARD */}

                        <button
                            onClick={() =>
                                router.push(
                                    "/employee/dashboard"
                                )
                            }

                            className="
                                px-4
                                py-2
                                rounded-lg
                                text-sm
                                font-semibold
                                text-slate-600
                                hover:bg-indigo-50
                                hover:text-indigo-600
                                transition
                            "
                        >

                            🏠 Dashboard

                        </button>


                        {/* MY TASKS */}

                        <button
                            onClick={() =>
                                router.push(
                                    "/employee/tasks"
                                )
                            }

                            className="
                                px-4
                                py-2
                                rounded-lg
                                text-sm
                                font-semibold
                                text-slate-600
                                hover:bg-indigo-50
                                hover:text-indigo-600
                                transition
                            "
                        >

                            📋 My Tasks

                        </button>

                    </nav>

                </div>


                {/* =================================
                    RIGHT
                ================================== */}

                <div className="
                    flex
                    items-center
                    gap-4
                ">


                    {/* =================================
                        NOTIFICATION
                    ================================== */}

                    <div className="relative">


                        {/* =============================
                            BELL
                        ============================== */}

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


                            {/* =========================
                                UNREAD COUNT
                            ========================== */}

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
                                    DROPDOWN HEADER
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
                                    NOTIFICATION LIST
                                ====================== */}

                                <div className="
                                    max-h-96
                                    overflow-y-auto
                                ">


                                    {/* EMPTY */}

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
                                                                // Light gray
                                                                ? "bg-slate-50 hover:bg-slate-100"

                                                                // UNREAD
                                                                // Light blue
                                                                : "bg-blue-50 hover:bg-blue-100"
                                                        }
                                                    `}
                                                >

                                                    <div className="
                                                        flex
                                                        items-start
                                                        gap-3
                                                    ">


                                                        {/* =================
                                                            ICON
                                                        ================== */}

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

                                                            📋

                                                        </div>


                                                        {/* =================
                                                            CONTENT
                                                        ================== */}

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


                                                            {/* DATE + TIME */}

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
                        EMPLOYEE PROFILE
                    ================================== */}

                    <div className="
                        hidden
                        sm:block
                        text-right
                    ">

                        <p className="
                            text-sm
                            font-semibold
                            text-slate-800
                        ">

                            {user?.name ||
                                "Employee"}

                        </p>


                        <p className="
                            text-xs
                            text-slate-400
                        ">

                            Team Member

                        </p>

                    </div>


                    {/* =================================
                        LOGOUT
                    ================================== */}

                    <button
                        onClick={
                            handleLogout
                        }

                        className="
                            bg-red-50
                            hover:bg-red-100
                            text-red-600
                            px-4
                            py-2
                            rounded-lg
                            text-sm
                            font-semibold
                            transition
                        "
                    >

                        Logout

                    </button>

                </div>

            </header>


            {/* =====================================
                PAGE CONTENT
            ====================================== */}

            <main>

                {children}

            </main>


            {/* =====================================
                GLOBAL TOASTER
            ====================================== */}

            <Toaster
                position="top-right"

                toastOptions={{
                    duration: 5000,
                }}
            />

        </div>

    );

}