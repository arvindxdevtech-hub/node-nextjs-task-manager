import Task from "../models/Task.js";
import User from "../models/User.js";

/*
POST    /api/tasks       → Create / Assign
GET     /api/tasks       → All Tasks
GET     /api/tasks/:id   → Single Task
PUT     /api/tasks/:id   → Update / Reassign
DELETE  /api/tasks/:id   → Delete
*/



// url - POST http://localhost:3000/api/tasks

// Body 
/*{
  "title": "Create Employee Dashboard",
  "description": "Create task list and task detail screen",
  "assignedTo": "EMPLOYEE_MONGODB_ID",
  "priority": "high",
  "dueDate": "2026-08-20"
}*/
/*export const createTask = async (req, res, next) => {
    try {
        const {
            title,
            description,
            assignedTo,
            priority,
            dueDate
        } = req.body;

        const employee = await User.findOne({
            _id: assignedTo,
            role: "employee",
            isActive: true
        });

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found or inactive"
            });
        }

        const task = await Task.create({
            title,
            description,
            assignedTo,
            assignedBy: req.user.id,
            priority,
            status: "pending",
            assignDate: new Date(),
            dueDate
        });

        return res.status(201).json({
            message: "Task assigned successfully",
            task
        });

    } catch (error) {
        next(error);
    }
};*/

export const createTask = async (req, res, next) => {
    try {
        const {
            title,
            description,
            assignedTo,
            priority,
            dueDate
        } = req.body;

        // 1. Check employee valid + active hai
        const employee = await User.findOne({
            _id: assignedTo,
            role: "employee",
            isActive: true
        });

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found or inactive"
            });
        }

        // 2. Task MongoDB me create
        const task = await Task.create({
            title,
            description,
            assignedTo,
            assignedBy: req.user.id,
            priority,
            status: "pending",
            assignDate: new Date(),
            dueDate
        });

        // 3. Express app se Socket.IO instance lo
        const io = req.app.get("io");

        // 4. Assigned employee ki room name banao
        const employeeRoom = `employee_${assignedTo}`;

        // 5. Sirf us employee ko realtime event bhejo
        io.to(employeeRoom).emit("new-task", {
            message: "New task assigned",
            task
        });

        // 6. Normal API response
        return res.status(201).json({
            message: "Task assigned successfully",
            task
        });

    } catch (error) {
        next(error);
    }
};

/**
 * 
 * @url GET http://localhost:3000/api/tasks 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */


export const getTasks = async (req, res, next) => {
    try {
        // populate() kya karta hai? MySQL me tum JOIN use karte:
        /**
         * MySQL me tum JOIN use karte:
            SELECT tasks.*, users.name
            FROM tasks
            JOIN users ON tasks.assigned_to = users.id;

            MongoDB/Mongoose me conceptually:

            .populate("assignedTo", "name email")

            "name email isActive"=> ye fields select karne ke liye hai, baki fields ko ignore karne ke liye hai.
         */
        const tasks = await Task.find()
            .populate("assignedTo", "name email isActive")
            .populate("assignedBy", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Tasks fetched successfully",
            tasks
        });

    } catch (error) {
        next(error);
    }
};

// GET single task by ID banate hain, populate ke saath. Isse manager kisi ek task ki full details dekh sakega.
// GET http://localhost:3000/api/tasks/<TASK_ID>
export const getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("assignedTo", "name email isActive")
            .populate("assignedBy", "name email");

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({
            message: "Task fetched successfully",
            task
        });

    } catch (error) {
        next(error);
    }
};

/**
 * 
 * Update Task API banate hain. Manager task ki details update karega, employee ko reassign bhi kar sakega, lekin status ko manager API se update nahi karenge.
 * 
 * if (assignedTo && assignedTo !== task.assignedTo.toString()) => Matlab employee change hua hai tabhi naya employee verify karo.
 * 
 * url - PUT http://localhost:3000/api/tasks/<TASK_ID>
 * 
 * Body
 * 
 * {
        "title": "Create Employee Dashboard Updated",
        "priority": "medium",
        "dueDate": "2026-08-25"
    }

    Ab ek important cheez aur karni chahiye: update validation. Create validator use nahi karenge, kyunki update me saare fields optional hote hain.
 */

export const updateTask = async (req, res, next) => {
    try {
        const {
            title,
            description,
            assignedTo,
            priority,
            dueDate
        } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Agar employee change ho raha hai to validate karo
        if (assignedTo && assignedTo !== task.assignedTo.toString()) {
            const employee = await User.findOne({
                _id: assignedTo,
                role: "employee",
                isActive: true
            });

            if (!employee) {
                return res.status(404).json({
                    message: "Employee not found or inactive"
                });
            }

            task.assignedTo = assignedTo;

            // Re-assign hua hai to assign date bhi update
            task.assignDate = new Date();
        }

        if (title !== undefined) {
            task.title = title;
        }

        if (description !== undefined) {
            task.description = description;
        }

        if (priority !== undefined) {
            task.priority = priority;
        }

        if (dueDate !== undefined) {
            task.dueDate = dueDate;
        }

        await task.save();

        await task.populate("assignedTo", "name email isActive");
        await task.populate("assignedBy", "name email");

        return res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        next(error);
    }
};

// DELETE http://localhost:3000/api/tasks/<TASK_ID>

export const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};