import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { employeeOnly } from "../middleware/employeeMiddleware.js";
import { getMyTasks, getMyTaskById, updateTaskStatus } from "../controllers/employeeTaskController.js";

const router = express.Router();

router.use(authMiddleware);
router.use(employeeOnly);

// router.get("/:id", (req, res, next) => {
//     console.log("Route hit:", req.params.id);
//     next();
// }, getMyTaskById);

router.get("/", getMyTasks);
router.get("/:id", getMyTaskById);
router.patch("/:id/status", updateTaskStatus);

export default router;