const Task = require("../models/task");
const User = require('../models/user');

// Create Task
const createTask = async (req, res) => {
    try {
        const { title, desc } = req.body;
        const { id } = req.headers;
        const newTask = new Task({ title, desc });
        const saveTask = await newTask.save();
        const taskId = saveTask._id;
        await User.findByIdAndUpdate(id, { $push: { task: taskId } });
        res.status(201).json({ message: "Task Created" });
    } catch (err) {
        res.status(400).json({ message: "Internal Server Error" });
    }
};

// Get All Tasks
const getAllTasks = async (req, res) => {
    try {
        const id = req.headers._id;

        if (!id) {
            return res.status(400).json({ message: "User ID is missing from the token." });
        }

        const userData = await User.findById(id).populate({
            path: "task", 
            options: { sort: { createdAt: -1 } }, 
        });

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ data: userData.task });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete Task
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers.id;
        await Task.findByIdAndDelete(id);
        await User.findByIdAndUpdate(userId, { $pull: { task: id } });
        res.status(200).json({ message: "Task Deleted Successfully" });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Internal Server Error" });
    }
};

// Update Task
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, desc } = req.body;
        await Task.findByIdAndUpdate(id, { title, desc });
        res.status(200).json({ message: "Task Updated Successfully" });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Internal Server Error" });
    }
};

// Update Important Task
const updateImportantTask = async (req, res) => {
    try {
        const { id } = req.params;
        const taskData = await Task.findById(id);
        const ImpTask = taskData.important;
        await Task.findByIdAndUpdate(id, { important: !ImpTask });
        res.status(200).json({ message: "Task is important successfully" });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Internal Server Error" });
    }
};

// Update Complete Task
const updateCompleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const taskData = await Task.findById(id);
        const completeTask = taskData.complete;
        await Task.findByIdAndUpdate(id, { complete: !completeTask });
        res.status(200).json({ message: "Task Completed Successfully" });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Internal Server Error" });
    }
};

// Get Important Tasks
const getImportantTasks = async (req, res) => {
    try {
        const id = req.headers._id;

        if (!id) {
            return res.status(400).json({ message: "User ID is required in headers." });
        }

        const user = await User.findById(id).populate({
            path: "task",
            match: { important: true },
            options: { sort: { createdAt: -1 } },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ success: true, message: "Important tasks fetched successfully.", data: user.task });
    } catch (err) {
        console.error("Error fetching important tasks:", err);
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

// Get Completed Tasks
const getCompletedTasks = async (req, res) => {
    try {
        const id = req.headers._id;

        if (!id) {
            return res.status(400).json({ message: "User ID is required in headers." });
        }

        const user = await User.findById(id).populate({
            path: "task",
            match: { complete: true },
            options: { sort: { createdAt: -1 } },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ success: true, message: "Completed tasks fetched successfully.", data: user.task });
    } catch (err) {
        console.error("Error fetching completed tasks:", err);
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

// Get Incomplete Tasks
const getIncompleteTasks = async (req, res) => {
    try {
        const id = req.headers._id;

        if (!id) {
            return res.status(400).json({ message: "User ID is required in headers." });
        }

        const user = await User.findById(id).populate({
            path: "task",
            match: { complete: false },
            options: { sort: { createdAt: -1 } },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ success: true, message: "Incomplete tasks fetched successfully.", data: user.task });
    } catch (err) {
        console.error("Error fetching incomplete tasks:", err);
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

// Update Task Status
const updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { complete } = req.body;

        const task = await Task.findByIdAndUpdate(
            taskId,
            { complete },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        res.status(200).json({ success: true, message: "Task completion status updated successfully", data: task });
    } catch (error) {
        console.error("Error updating task completion status:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    createTask,
    getAllTasks,
    deleteTask,
    updateTask,
    updateImportantTask,
    updateCompleteTask,
    getImportantTasks,
    getCompletedTasks,
    getIncompleteTasks,
    updateTaskStatus
};
