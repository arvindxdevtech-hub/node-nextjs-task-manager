import express from "express";

import { createTask, getTasks, getTaskById, updateTask, deleteTask } from "../controllers/taskController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { managerOnly } from "../middleware/managerMiddleware.js";
import { validateRequest } from "../middleware/validationMiddleware.js";

import { createTaskValidator, updateTaskValidator } from "../validators/taskValidator.js";

const router = express.Router();

router.use(authMiddleware);
router.use(managerOnly);

router.post(
    "/",
    createTaskValidator,
    validateRequest,
    createTask
);

router.get("/", getTasks);
router.get("/:id", getTaskById);

router.put(
    "/:id",
    updateTaskValidator,
    validateRequest,
    updateTask
);

router.delete("/:id", deleteTask);

export default router;