import Task from "../models/Task.js";

// {{url}}employee/tasks/
export const getMyTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({
            assignedTo: req.user.id
        })
            .populate("assignedBy", "name email")
            .sort({ assignDate: -1 });

        return res.status(200).json({
            message: "Assigned tasks fetched successfully",
            tasks
        });

    } catch (error) {
        next(error);
    }
};

// Single Employee Task Detail API
// Employee kisi task par click karega to uski complete details aayengi.
// GET /api/employee/tasks/:id
export const getMyTaskById = async (req, res, next) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            assignedTo: req.user.id
        })
            .populate("assignedBy", "name email")
            .populate("assignedTo", "name email");

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({
            message: "Single Task fetched successfully",
            task
        });

    } catch (error) {
        next(error);
    }
};

//Employee Task Status Update API
// Employee sirf apne assigned task ka status change karega.

export const updateTaskStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        // 1. Allowed statuses
        const allowedStatuses = [
            "pending",
            "working",
            "hold",
            "completed"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid task status"
            });
        }

        // 2. Sirf logged-in employee ka assigned task find karo
        const task = await Task.findOne({
            _id: req.params.id,
            assignedTo: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // 3. Status update
        task.status = status;

        // 4. MongoDB me save
        await task.save();

        // 5. Socket.IO instance lo
        const io = req.app.get("io");

        // 6. Manager ki room banao
        const managerRoom = `manager_${task.assignedBy}`;

        // 7. Manager ko realtime event bhejo
        io.to(managerRoom).emit("task-status-updated", {
            message: "Task status updated",
            taskId: task._id,
            employeeId: req.user.id,
            status: task.status
        });

        // 8. Normal API response
        return res.status(200).json({
            message: "Task status updated successfully",
            task
        });

    } catch (error) {
        next(error);
    }
};

/*export const updateTaskStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "working",
            "hold",
            "completed"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid task status"
            });
        }

        const task = await Task.findOne({
            _id: req.params.id,
            assignedTo: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        task.status = status;

        await task.save();

        return res.status(200).json({
            message: "Task status updated successfully",
            task
        });

    } catch (error) {
        next(error);
    }
};*/