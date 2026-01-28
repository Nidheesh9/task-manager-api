import { Op } from "sequelize";
import { Task } from "../models/index.js";
import { scheduleTaskReminder } from "../utils/utils.js";
import CustomError from "../utils/customError.js";
import catchAsync from "../utils/catchAsync.js";

// Create a new task
const createTask = catchAsync(async (req, res, next) => {
  const { title, description, priority, dueDate } = req.body;

  // validation
  if (!title || !priority || !dueDate) {
    return next(
      new CustomError("title, priority, and dueDate are required", 400),
    );
  }

  const userId = req.user.id;

  if (!["low", "medium", "high"].includes(priority)) {
    return next(new CustomError("Invalid priority value", 400));
  }

  const task = await Task.create({
    title,
    description,
    priority,
    dueDate,
    userId,
  });

  scheduleTaskReminder(task);

  return res.status(201).json({
    message: "Task created successfully",
    task,
  });
});

// Get all tasks for the authenticated user
const getAllTask = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const {
    priority,
    status,
    startDate,
    endDate,
    sortBy = "dueDate",
    order = "asc",
    page = 1,
    limit = 10,
  } = req.query;

  const offset = (Number(page) - 1) * Number(limit);
  // WHERE conditions
  const where = { userId };

  if (priority) {
    where.priority = priority; // low | medium | high
  }

  if (status) {
    where.status = status; // pending | completed
  }

  if (startDate && endDate) {
    where.dueDate = {
      [Op.between]: [startDate, endDate],
    };
  }

  // SORTING
  let orderBy = [];

  if (sortBy === "priority") {
    // custom priority order
    orderBy = [["priority", order.toLowerCase() === "desc" ? "DESC" : "ASC"]];
  } else {
    // dueDate sorting
    orderBy = [[sortBy, order.toUpperCase()]];
  }

  const tasks = await Task.findAll({
    where,
    order: orderBy,
    limit: Number(limit),
    offset: Number(offset),
  });

  return res.status(200).json({
    message: "Tasks retrieved successfully",
    tasks,
  });
});

// Get a single task by ID
const getTaskById = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const taskId = req.params.id;

  const task = await Task.findOne({
    where: { id: taskId, userId },
  });

  if (!task) {
    return next(new CustomError("Task not found", 404));
  }

  return res.status(200).json({
    message: "Task retrieved successfully",
    task,
  });
});

// Update a task by ID
const updateTask = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const taskId = req.params.id;
  const { title, description, priority, dueDate } = req.body;
  const task = await Task.findOne({
    where: { id: taskId, userId },
  });

  if (!task) {
    return next(new CustomError("Task not found", 404));
  }

  await task.update({
    title,
    description,
    priority,
    dueDate,
  });

  return res.status(200).json({
    message: "Task updated successfully",
    task,
  });
});

// Delete a task by ID
const deleteTask = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const taskId = req.params.id;

  const task = await Task.findOne({
    where: { id: taskId, userId },
  });

  if (!task) {
    return next(new CustomError("Task not found", 404));
  }

  await task.destroy();

  return res.status(200).json({
    message: "Task deleted successfully",
  });
});

export { createTask, getAllTask, updateTask, deleteTask, getTaskById };
