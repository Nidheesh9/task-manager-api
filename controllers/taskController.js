import { Task } from "../models/index.js";

// Create a new task
async function createTask(req, res) {
  try {
    const { title, description, priority, dueDate } = req.body;

    // validation
    if (!title || !priority || !dueDate) {
      return res.status(400).json({
        message: "title, priority, and dueDate are required",
      });
    }

    const userId = req.user.id;

    if (!["low", "medium", "high"].includes(priority)) {
      return res.status(400).json({
        message: "Invalid priority value",
      });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      userId,
    });

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}

// Get all tasks for the authenticated user
async function getAllTask(req, res) {
  try {
    const userId = req.user.id;

    const tasks = await Task.findAll({
      where: { userId },
    });

    return res.status(200).json({
      message: "Tasks retrieved successfully",
      tasks,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}

export { createTask, getAllTask };
