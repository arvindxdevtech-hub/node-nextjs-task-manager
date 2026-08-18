import express from "express";
import { login, getUsers } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { managerOnly } from "../middleware/managerMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.get("/users", getUsers);
/*router.get(
    "/manager-test",
    authMiddleware,
    managerOnly,
    (req, res) => {
        res.json({
            message: "Manager access granted",
            user: req.user
        });
    }
);*/

export default router;