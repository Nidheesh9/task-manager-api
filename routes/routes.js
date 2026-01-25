import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createTask, getAllTask } from "../controllers/taskController.js";

const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);

router.get("/tasks", authMiddleware, getAllTask);
router.post("/tasks", authMiddleware, createTask);
router.get("/tasks/:id", authMiddleware);
router.put("/tasks/:id", authMiddleware);
router.delete("/tasks/:id", authMiddleware);

export default router;
