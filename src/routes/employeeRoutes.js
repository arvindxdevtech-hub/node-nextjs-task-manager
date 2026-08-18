import express from "express";
import {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} from "../controllers/employeeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { managerOnly } from "../middleware/managerMiddleware.js";
import { validateRequest } from "../middleware/validationMiddleware.js";

import { createEmployeeValidator } from "../validators/employeeValidator.js";

const router = express.Router();

/*authMiddleware           → User login/token valid hai?
managerOnly                → User manager hai?
createEmployeeValidator    → Request fields valid hain?
validateRequest            → Validation errors hain?
createEmployee             → Actual employee create karo*/

router.use(authMiddleware);
router.use(managerOnly);

router.post(
    "/",
    createEmployeeValidator,
    validateRequest,
    createEmployee
);

router.get("/", getEmployees);

router.get("/:id", getEmployeeById);

router.put("/:id", updateEmployee);

router.delete("/:id", deleteEmployee);

export default router;