const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/taskController');
const { authenticateToken } = require("./auth");

router.post("/create-task", authenticateToken, createTask);
router.get("/getall-task", authenticateToken, getAllTasks);
router.delete("/delete-task/:id", authenticateToken, deleteTask);
router.put("/update-task/:id", authenticateToken, updateTask);
router.put("/update-imptask/:id", authenticateToken, updateImportantTask);
router.put("/update-complete-task/:id", authenticateToken, updateCompleteTask);
router.get("/getimp-task", authenticateToken, getImportantTasks);
router.get("/get-completed-tasks", authenticateToken, getCompletedTasks);
router.get("/get-incomplete-task", authenticateToken, getIncompleteTasks);
router.put("/update-status/:taskId", authenticateToken, updateTaskStatus);

module.exports = router;
