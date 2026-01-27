import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { loginUser, registerUser } from "../controllers/authController.js";
import {
  createTask,
  deleteTask,
  getAllTask,
  getTaskById,
  updateTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);

router.get("/tasks", authMiddleware, getAllTask);
router.post("/tasks", authMiddleware, createTask);
router.get("/tasks/:id", authMiddleware, getTaskById);
router.put("/tasks/:id", authMiddleware, updateTask);
router.delete("/tasks/:id", authMiddleware, deleteTask);

export default router;
