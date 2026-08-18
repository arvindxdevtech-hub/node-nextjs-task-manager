import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        priority: {
            type: String,
            enum: ["high", "medium", "low"],
            default: "medium"
        },

        status: {
            type: String,
            enum: ["pending", "working", "hold", "completed"],
            default: "pending"
        },

        assignDate: {
            type: Date,
            default: Date.now
        },

        dueDate: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;