const router=require("express").Router();
const Task=require("../models/task");
const User=require('../models/user');
const { authenticateToken } = require("./auth");

router.post("/create-task",authenticateToken,async(req,res)=>{
    try{
        const {title,desc}=req.body;
        const {id}=req.headers;
        const newTask=new Task({title:title,desc:desc});
        const saveTask= await newTask.save();
        const taskId=saveTask._id;
        await User.findByIdAndUpdate(id, { $push: { task: taskId } });
        res.status(201).json({message: "Task Created"});
    }catch(err){
        res.status(400).json({message:"Internal Server Error "});
    }
})

router.get("/getall-task", authenticateToken, async (req, res) => {
  try {
    const id=req.headers._id;
    const ID=id;

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

    // Return the populated user data (tasks in this case)
    const repor= res.status(200).json({ data: userData.task }); // Return tasks
    
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/delete-task/:id", authenticateToken, async (req, res) => {
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
});

router.put("/update-task/:id", authenticateToken, async (req, res) => {
    try {
    const { id } = req.params;
    const {title ,desc} = req.body;
    await Task.findByIdAndUpdate(id,{title:title, desc:desc})
      res.status(200).json({ message: "Task Updated Successfully" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Internal Server Error" });
    }
});

router.put("/update-imptask/:id", authenticateToken, async (req, res) => {
    try {
    const { id } = req.params;
    const taskData = await Task.findById(id);
    const ImpTask=taskData.important;
    await Task.findByIdAndUpdate(id,{important:!ImpTask})
      res.status(200).json({ message: "Task Is important Successfully" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Internal Server Error" });
    }
});

router.put("/update-complete-task/:id", authenticateToken, async (req, res) => {
    try {
    const { id } = req.params;
    const taskData = await Task.findById(id);
    const completeTask=taskData.important;
    await Task.findByIdAndUpdate(id,{important:!completeTask})
      res.status(200).json({ message: "Task Completed Successfully" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Internal Server Error" });
    }
});
router.get("/getimp-task",authenticateToken,async(req,res)=>{
  try {
    const  id  = req.headers._id;

    // Validate `id`
    if (!id) {
        return res.status(400).json({ message: "User ID is required in headers." });
    }

    // Find the user and populate completed tasks
    const user = await User.findById(id).populate({
        path: "task",
        match: { important: true }, // Filter tasks where complete is true
        options: { sort: { createdAt: -1 } }, // Sort by creation date (descending)
    });

    // Check if user exists
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    const completedTasks = user.task;

    res.status(200).json({
        success: true,
        message: "Completed tasks fetched successfully.",
        data: completedTasks,
    });
} catch (err) {
    console.error("Error fetching completed tasks:", err);
    res.status(500).json({ success: false, message: "Internal Server Error." });
}
})  

router.get("/get-completed-tasks", authenticateToken, async (req, res) => {
  try {
      const  id  = req.headers._id;

      // Validate `id`
      if (!id) {
          return res.status(400).json({ message: "User ID is required in headers." });
      }

      // Find the user and populate completed tasks
      const user = await User.findById(id).populate({
          path: "task",
          match: { complete: true }, // Filter tasks where complete is true
          options: { sort: { createdAt: -1 } }, // Sort by creation date (descending)
      });

      // Check if user exists
      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }

      const completedTasks = user.task;

      res.status(200).json({
          success: true,
          message: "Completed tasks fetched successfully.",
          data: completedTasks,
      });
  } catch (err) {
      console.error("Error fetching completed tasks:", err);
      res.status(500).json({ success: false, message: "Internal Server Error." });
  }
});


router.get("/get-incomplete-task",authenticateToken,async(req,res)=>{
  try {
    const  id  = req.headers._id;

    // Validate `id`
    if (!id) {
        return res.status(400).json({ message: "User ID is required in headers." });
    }

    // Find the user and populate completed tasks
    const user = await User.findById(id).populate({
        path: "task",
        match: { complete: false }, // Filter tasks where complete is true
        options: { sort: { createdAt: -1 } }, // Sort by creation date (descending)
    });

    // Check if user exists
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    const completedTasks = user.task;

    res.status(200).json({
        success: true,
        message: "Completed tasks fetched successfully.",
        data: completedTasks,
    });
} catch (err) {
    console.error("Error fetching completed tasks:", err);
    res.status(500).json({ success: false, message: "Internal Server Error." });
}
})  


// Update task completion status
router.put("/update-status/:taskId", authenticateToken, async (req, res) => {
  try {
      const { taskId } = req.params;
      const { complete } = req.body;

      // Update the `complete` status of the task
      const task = await Task.findByIdAndUpdate(
          taskId,
          { complete },
          { new: true } // Return the updated task
      );

      if (!task) {
          return res.status(404).json({ success: false, message: "Task not found" });
      }

      res.status(200).json({
          success: true,
          message: "Task completion status updated successfully",
          data: task,
      });
  } catch (error) {
      console.error("Error updating task completion status:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports=router;
