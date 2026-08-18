import { body } from "express-validator";

export const createTaskValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required"),

    body("assignedTo")
        .notEmpty()
        .withMessage("Employee is required"),

    body("priority")
        .optional()
        .isIn(["high", "medium", "low"])
        .withMessage("Priority must be high, medium or low"),

    body("status")
        .optional()
        .isIn(["pending", "working", "hold", "completed"])
        .withMessage("Invalid status"),

    body("dueDate")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage("Due date must be a valid date")
];

export const updateTaskValidator = [
    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty"),

    body("assignedTo")
        .optional()
        .notEmpty()
        .withMessage("Employee is required"),

    body("priority")
        .optional()
        .isIn(["high", "medium", "low"])
        .withMessage("Priority must be high, medium or low"),

    body("dueDate")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage("Due date must be a valid date")
];