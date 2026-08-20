"use client";

import {
    useEffect,
    useState
} from "react";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { API_URL } from "@/lib/api";

import ConfirmDeleteModal
    from "@/app/components/ConfirmDeleteModal";

import { socket } from "@/lib/socket";

// ==========================================
// TYPES
// ==========================================

type Employee = {
    _id: string;
    name: string;
    email: string;
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
};


export default function TaskListPage() {
    useEffect(() => {

    const handleTaskStatusUpdate = (data: any) => {

        console.log(
            "TASK PAGE SOCKET EVENT:",
            data
        );

        setTasks((previousTasks) => {

            console.log(
                "CURRENT TASKS:",
                previousTasks
            );

            const updatedTasks =
                previousTasks.map((task) => {

                    console.log(
                        "Compare:",
                        task._id,
                        data.taskId
                    );

                    if (
                        task._id === data.taskId
                    ) {

                        console.log(
                            "MATCH FOUND - updating status"
                        );

                        return {
                            ...task,
                            status: data.status
                        };
                    }

                    return task;
                });

            return updatedTasks;
        });

    };


    socket.on(
        "task-status-updated",
        handleTaskStatusUpdate
    );


    return () => {

        socket.off(
            "task-status-updated",
            handleTaskStatusUpdate
        );

    };

}, []);

    const router = useRouter();


    // ==========================================
    // STATES
    // ==========================================

    const [tasks, setTasks] =
        useState<Task[]>([]);


    const [employees, setEmployees] =
        useState<Employee[]>([]);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    // Filter states
    const [
        selectedEmployee,
        setSelectedEmployee
    ] = useState("");


    const [
        selectedDate,
        setSelectedDate
    ] = useState("");


    // Pagination
    const [page, setPage] =
        useState(1);


    const [totalPages, setTotalPages] =
        useState(1);


    const [totalTasks, setTotalTasks] =
        useState(0);


    // Delete
    const [
        selectedTask,
        setSelectedTask
    ] = useState<Task | null>(null);


    const [
        deleteLoading,
        setDeleteLoading
    ] = useState(false);


    // ==========================================
    // FETCH EMPLOYEES
    // ==========================================

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


            if (response.ok) {

                setEmployees(
                    data.employees || []
                );

            }

        } catch (error) {

            console.error(
                "Employee API error:",
                error
            );

        }

    };


    // ==========================================
    // FETCH TASKS
    // ==========================================

    const fetchTasks = async () => {

        try {

            setLoading(true);

            setError("");


            const token =
                localStorage.getItem("token");


            // --------------------------------------
            // Query Params
            // --------------------------------------

            const params =
                new URLSearchParams();


            params.set(
                "page",
                page.toString()
            );


            params.set(
                "limit",
                "5"
            );


            if (selectedEmployee) {

                params.set(
                    "employeeId",
                    selectedEmployee
                );

            }


            if (selectedDate) {

                params.set(
                    "date",
                    selectedDate
                );

            }


            const response = await fetch(

                `${API_URL}/tasks?${params.toString()}`,

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


            setTotalPages(
                data.pagination?.totalPages || 1
            );


            setTotalTasks(
                data.pagination?.totalTasks || 0
            );


        } catch (error) {

            console.error(
                "Task API error:",
                error
            );


            setError(
                "Unable to connect to server"
            );


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // FIRST LOAD
    // ==========================================

    useEffect(() => {

        fetchEmployees();

    }, []);


    // ==========================================
    // TASK LOAD
    // Page / Filter change
    // ==========================================

    useEffect(() => {

        fetchTasks();

    }, [
        page,
        selectedEmployee,
        selectedDate
    ]);


    // ==========================================
    // DELETE
    // ==========================================

    const handleDelete =
        async (id: string) => {

        try {

            setDeleteLoading(true);


            const token =
                localStorage.getItem("token");


            const response = await fetch(

                `${API_URL}/tasks/${id}`,

                {
                    method: "DELETE",

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
                    "Unable to delete task"
                );

                return;

            }


            setSelectedTask(null);


            toast.success(
                "Task deleted successfully"
            );


            fetchTasks();


        } catch (error) {

            console.error(error);


            toast.error(
                "Unable to connect to server"
            );


        } finally {

            setDeleteLoading(false);

        }

    };


    // ==========================================
    // CLEAR FILTER
    // ==========================================

    const clearFilters = () => {

        setSelectedEmployee("");

        setSelectedDate("");

        setPage(1);

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
                            Tasks
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            Manage employee assigned tasks.
                        </p>

                    </div>


                    <button
                        onClick={() =>
                            router.push(
                                "/manager/tasks/create"
                            )
                        }
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold transition"
                    >

                        + Assign Task

                    </button>

                </div>

            </div>


            {/* CONTENT */}

            <div className="p-8">


                {/* ================================
                    FILTER SECTION
                ================================= */}

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">

                    <div className="flex flex-wrap items-end gap-4">


                        {/* EMPLOYEE FILTER */}

                        <div className="min-w-[220px]">

                            <label className="block text-sm font-semibold text-slate-600 mb-2">

                                Employee

                            </label>


                            <select
                                value={selectedEmployee}

                                onChange={(e) => {

                                    setSelectedEmployee(
                                        e.target.value
                                    );

                                    setPage(1);

                                }}

                                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 bg-white outline-none focus:border-indigo-500"
                            >

                                <option value="">
                                    All Employees
                                </option>


                                {employees.map(
                                    (employee) => (

                                        <option
                                            key={
                                                employee._id
                                            }
                                            value={
                                                employee._id
                                            }
                                        >

                                            {
                                                employee.name
                                            }

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* DATE FILTER */}

                        <div className="min-w-[200px]">

                            <label className="block text-sm font-semibold text-slate-600 mb-2">

                                Assign Date

                            </label>


                            <input
                                type="date"

                                value={selectedDate}

                                onChange={(e) => {

                                    setSelectedDate(
                                        e.target.value
                                    );

                                    setPage(1);

                                }}

                                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:border-indigo-500"
                            />

                        </div>


                        {/* CLEAR FILTER */}

                        <button
                            onClick={clearFilters}

                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-lg font-medium"
                        >

                            Clear Filters

                        </button>


                        {/* TOTAL */}

                        <div className="ml-auto text-sm text-slate-500">

                            Total Tasks:

                            <span className="font-bold text-slate-800 ml-1">

                                {totalTasks}

                            </span>

                        </div>

                    </div>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">

                        {error}

                    </div>

                )}


                {/* LOADING */}

                {loading ? (

                    <div className="text-slate-500">

                        Loading tasks...

                    </div>

                ) : (

                    <>


                        {/* ================================
                            TASK TABLE
                        ================================= */}

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                            <table className="w-full">


                                <thead className="bg-slate-50 border-b border-slate-200">

                                    <tr>

                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">

                                            Task

                                        </th>


                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">

                                            Employee

                                        </th>


                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">

                                            Priority

                                        </th>


                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">

                                            Status

                                        </th>


                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">

                                            Assign Date

                                        </th>


                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">

                                            Due Date

                                        </th>


                                        <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">

                                            Actions

                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-slate-100">


                                    {tasks.map(
                                        (task) => (

                                            <tr
                                                key={
                                                    task._id
                                                }
                                                className="hover:bg-slate-50"
                                            >


                                                {/* TASK */}

                                                <td className="px-6 py-4">

                                                    <p className="font-semibold text-slate-800">

                                                        {
                                                            task.title
                                                        }

                                                    </p>


                                                    <p className="text-xs text-slate-400 mt-1 max-w-[150px] truncate">

                                                        {
                                                            task.description
                                                        }

                                                    </p>

                                                </td>


                                                {/* EMPLOYEE */}

                                                <td className="px-6 py-4">

                                                    <p className="font-medium text-slate-700">

                                                        {
                                                            task.assignedTo
                                                                ?.name
                                                        }

                                                    </p>


                                                    <p className="text-xs text-slate-400">

                                                        {
                                                            task.assignedTo
                                                                ?.email
                                                        }

                                                    </p>

                                                </td>


                                                {/* PRIORITY */}

                                                <td className="px-6 py-4">

                                                    <span className={`
                                                        px-3
                                                        py-1
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
                                                    `}>

                                                        {
                                                            task.priority
                                                        }

                                                    </span>

                                                </td>


                                                {/* STATUS */}

                                                <td className="px-6 py-4">

                                                    <span className={`
                                                        px-3
                                                        py-1
                                                        rounded-full
                                                        text-xs
                                                        font-semibold
                                                        capitalize

                                                        ${
                                                            task.status === "completed"

                                                                ? "bg-green-100 text-green-700"

                                                                : task.status === "working"

                                                                ? "bg-blue-100 text-blue-700"

                                                                : task.status === "hold"

                                                                ? "bg-yellow-100 text-yellow-700"

                                                                : "bg-orange-100 text-orange-700"
                                                        }
                                                    `}>

                                                        {
                                                            task.status
                                                        }

                                                    </span>

                                                </td>


                                                {/* ASSIGN DATE */}

                                                <td className="px-6 py-4 text-sm text-slate-600">

                                                    {
                                                        new Date(
                                                            task.assignDate
                                                        )
                                                            .toLocaleDateString()
                                                    }

                                                </td>


                                                {/* DUE DATE */}

                                                <td className="px-6 py-4 text-sm text-slate-600">

                                                    {
                                                        task.dueDate

                                                            ? new Date(
                                                                task.dueDate
                                                            )
                                                                .toLocaleDateString()

                                                            : "-"
                                                    }

                                                </td>


                                                {/* ACTIONS */}
                                                <td className="px-6 py-4">

                                                    <div className="flex justify-end gap-1.5">

                                                        {/* VIEW */}
                                                        <button
                                                            onClick={() =>
                                                                router.push(`/manager/tasks/${task._id}`)
                                                            }
                                                            title="View Task"
                                                            className="w-8 h-8 flex items-center justify-center
                                                                      bg-blue-50 text-blue-600 rounded-md
                                                                      hover:bg-blue-100 transition"
                                                        >
                                                            {/* Eye Icon */}
                                                            <svg
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                            >
                                                                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                                                                <circle cx="12" cy="12" r="3" />
                                                            </svg>
                                                        </button>


                                                        {/* EDIT */}
                                                        <button
                                                            onClick={() =>
                                                                router.push(`/manager/tasks/${task._id}/edit`)
                                                            }
                                                            title="Edit Task"
                                                            className="w-8 h-8 flex items-center justify-center
                                                                      bg-indigo-50 text-indigo-600 rounded-md
                                                                      hover:bg-indigo-100 transition"
                                                        >
                                                            {/* Pencil Icon */}
                                                            <svg
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                            >
                                                                <path d="M12 20h9" />
                                                                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                                                            </svg>
                                                        </button>


                                                        {/* DELETE */}
                                                        <button
                                                            onClick={() => setSelectedTask(task)}
                                                            title="Delete Task"
                                                            className="w-8 h-8 flex items-center justify-center
                                                                      bg-red-50 text-red-600 rounded-md
                                                                      hover:bg-red-100 transition"
                                                        >
                                                            {/* Trash Icon */}
                                                            <svg
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                            >
                                                                <path d="M3 6h18" />
                                                                <path d="M8 6V4h8v2" />
                                                                <path d="M19 6l-1 14H6L5 6" />
                                                                <path d="M10 11v5" />
                                                                <path d="M14 11v5" />
                                                            </svg>
                                                        </button>

                                                    </div>

                                                </td>
                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>


                            {tasks.length === 0 && (

                                <div className="text-center py-12 text-slate-500">

                                    No tasks found.

                                </div>

                            )}

                        </div>


                        {/* ================================
                            PAGINATION
                        ================================= */}

                        {totalPages > 1 && (

                            <div className="flex items-center justify-between mt-6">


                                <p className="text-sm text-slate-500">

                                    Page {page} of {totalPages}

                                </p>


                                <div className="flex gap-2">


                                    {/* PREVIOUS */}

                                    <button
                                        disabled={
                                            page <= 1
                                        }

                                        onClick={() =>
                                            setPage(
                                                page - 1
                                            )
                                        }

                                        className="px-4 py-2 bg-white border border-slate-300 rounded-lg disabled:opacity-40 hover:bg-slate-50"
                                    >

                                        ← Previous

                                    </button>


                                    {/* CURRENT PAGE */}

                                    <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg">

                                        {page}

                                    </div>


                                    {/* NEXT */}

                                    <button
                                        disabled={
                                            page >= totalPages
                                        }

                                        onClick={() =>
                                            setPage(
                                                page + 1
                                            )
                                        }

                                        className="px-4 py-2 bg-white border border-slate-300 rounded-lg disabled:opacity-40 hover:bg-slate-50"
                                    >

                                        Next →

                                    </button>

                                </div>

                            </div>

                        )}

                    </>

                )}

            </div>


            {/* ================================
                DELETE CONFIRMATION
            ================================= */}

            <ConfirmDeleteModal

                isOpen={
                    selectedTask !== null
                }

                title="Delete Task"

                message={
                    selectedTask

                        ? `Are you sure you want to delete "${selectedTask.title}"?`

                        : ""
                }

                loading={
                    deleteLoading
                }

                onCancel={() =>
                    setSelectedTask(null)
                }

                onConfirm={() => {

                    if (selectedTask) {

                        handleDelete(
                            selectedTask._id
                        );

                    }

                }}

            />

        </div>

    );
}