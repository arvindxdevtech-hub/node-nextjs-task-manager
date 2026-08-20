"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

import { socket } from "@/lib/socket";


export default function ManagerLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    useEffect(() => {

    // -----------------------------------------
    // Logged-in manager localStorage se lo
    // -----------------------------------------
    const storedUser =
        localStorage.getItem("user");


    if (!storedUser) {
        return;
    }


    // String → Object
    const user =
        JSON.parse(storedUser);


    // -----------------------------------------
    // Socket server se connect
    // -----------------------------------------
    socket.connect();


    // -----------------------------------------
    // Connection successful
    // -----------------------------------------
    socket.on("connect", () => {

        console.log(
            "Manager socket connected:",
            socket.id
        );


        // Manager apni ID backend ko bhej raha hai.
        //
        // Frontend sender hai → emit()
        //
        // Backend:
        // socket.on("join-manager")
        socket.emit(
            "join-manager",
            user.id
        );

    });


    // -----------------------------------------
    // Employee status update event
    //
    // Backend sender:
    // emit("task-status-updated")
    //
    // Manager frontend receiver:
    // on("task-status-updated")
    // -----------------------------------------
    socket.on(
        "task-status-updated",
        (data) => {

            console.log(
                "Realtime task status update:",
                data
            );


             toast.success(
                `Emp: ${data.employeeName}, Status Changed - Task: "${data.title}", Status: ${data.status}`,
                {
                    duration: 5000,
                }
            );

        }
    );


    // -----------------------------------------
    // Cleanup
    // -----------------------------------------
    return () => {

        socket.off("connect");

        socket.off(
            "task-status-updated"
        );

        socket.disconnect();

    };

}, []);
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-slate-100 flex">

            {/* SIDEBAR */}
            <aside className="w-64 bg-gradient-to-b from-indigo-700 to-blue-700 text-white min-h-screen fixed left-0 top-0">

                {/* LOGO */}
                <div className="h-20 flex items-center px-6 border-b border-indigo-500">
                    <div className="w-10 h-10 bg-white text-indigo-700 rounded-xl flex items-center justify-center font-bold text-xl">
                        T
                    </div>

                    <div className="ml-3">
                        <h1 className="font-bold text-xl">
                            TaskFlow
                        </h1>

                        <p className="text-xs text-indigo-200">
                            Manager Panel
                        </p>
                    </div>
                </div>


                {/* MENU */}
                <nav className="px-4 py-6 space-y-2">

                    <button
                        onClick={() =>
                            router.push("/manager/dashboard")
                        }
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10"
                    >
                        🏠 Dashboard
                    </button>

                    <button
                        onClick={() =>
                            router.push("/manager/employees")
                        }
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10"
                    >
                        👥 Employees
                    </button>

                    <button
                        onClick={() =>
                            router.push("/manager/tasks")
                        }
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10"
                    >
                        ➕ Assign Task
                    </button>

                </nav>


                {/* LOGOUT */}
                <div className="absolute bottom-6 left-4 right-4">

                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500/20 hover:bg-red-500 px-4 py-3 rounded-lg"
                    >
                        Logout
                    </button>

                </div>

            </aside>


            {/* MAIN CONTENT */}
            <main className="ml-64 flex-1">

                {children}

            </main>


            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 5000,
                }}
            />

        </div>
    );
}