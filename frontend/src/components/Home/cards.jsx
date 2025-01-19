import React, { useState, useEffect } from 'react';
import { CiHeart } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import axios from 'axios';

const Cards = ({ home, setInputDiv, fetchCompleted }) => {
    const [tasks, setTasks] = useState([]); // State to store tasks data
    const [loading, setLoading] = useState(true); // Loading state
    const [editTask, setEditTask] = useState(null); // Task being edited
    const [editForm, setEditForm] = useState({ title: "", desc: "" }); // Form data

    const headers = {
        _id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`, // Use "Authorization" header
    };

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const endpoint = fetchCompleted == "CompletedTasks"
                    ? 'https://taskmanager-backendd.onrender.com/api/v2/get-completed-tasks'
                    : fetchCompleted == "IncompletedTasks" ? 'https://taskmanager-backendd.onrender.com/api/v2/get-incomplete-task'
                        : fetchCompleted == "ImportantTasks" ? 'https://taskmanager-backendd.onrender.com/api/v2/getimp-task' : 'https://taskmanager-backendd.onrender.com/api/v2/getall-task';

                //console.log("ID=" + headers._id);

                const response = await axios.get(endpoint, { headers });
                setTasks(response.data.data); // Set fetched data to state
                setLoading(false); // Turn off loading
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setLoading(false);
            }
        };

        fetchTasks();
    }, [fetchCompleted]); // Refetch tasks when `fetchCompleted` changes

    const handleImportant = async (taskId) => {
        try {
            const task = tasks.find((t) => t._id === taskId);
            const updatedStatus = !task.important;

            const response = await axios.put(
                `https://taskmanager-backendd.onrender.com/api/v2/update-imptask/${taskId}`,
                { important: updatedStatus },
                { headers }
            );

            if (response.status === 200) {
                setTasks((prevTasks) =>
                    prevTasks.map((t) =>
                        t._id === taskId ? { ...t, important: updatedStatus } : t
                    )
                );
                console.log("Task importance updated successfully:", response.data.message);
            }
        } catch (error) {
            console.error("Error updating task importance:", error);
        }
    };

    const handleEdit = (task) => {
        setEditTask(task._id);
        setEditForm({ title: task.title, desc: task.desc });
    };

    const submitEdit = async (e) => {
      //  e.preventDefault();
        try {
            const response = await axios.put(
                `https://taskmanager-backendd.onrender.com/api/v2/update-task/${editTask}`,
                editForm,
                { headers }
            );

            if (response.status === 200) {
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === editTask ? { ...task, ...editForm } : task
                    )
                );
                console.log("Task updated successfully:", response.data.message);
                setEditTask(null);
            }
            
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleDelete = async (taskId) => {
        try {
            const response = await axios.delete(`https://taskmanager-backendd.onrender.com/api/v2/delete-task/${taskId}`, {
                headers,
            });

            if (response.status === 200) {
                setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
                console.log("Task deleted successfully:", response.data.message);
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    if (loading) {
        return <div>Loading tasks...</div>;
    }



    const toggleComplete = async (taskId) => {
        try {
            // Find the task in the local state
            const task = tasks.find((t) => t._id === taskId);
            const updatedStatus = !task.complete; // Toggle the `complete` status
    
            // Make API call to update task status
            const response = await axios.put(
                `http://localhost:3001/api/v2/update-status/${taskId}`,
                { complete: updatedStatus },
                { headers }
            );
    
            if (response.status === 200) {
                // Update the local state to reflect the change
                setTasks((prevTasks) =>
                    prevTasks.map((t) =>
                        t._id === taskId ? { ...t, complete: updatedStatus } : t
                    )
                );
                console.log("Task completion status updated successfully:", response.data.message);
            }
        } catch (error) {
            console.error("Error updating task completion status:", error);
        }
    };
    

    return (
        <>
            {editTask && (
                <div className="modal fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <form onSubmit={submitEdit} className="bg-gray-800 p-4 rounded-sm shadow-lg w-1/3">
                        <h2 className="text-2xl mb-4 text-white font-semibold">Edit Task</h2>
                        <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full mb-2 p-2 rounded text-black font-semibold"
                            placeholder="Title"
                        />
                        <textarea
                            value={editForm.desc}
                            onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                            className="w-full mb-4 p-2 rounded text-black font-semibold"
                            placeholder="Description"
                        ></textarea>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded mr-2">
                                Save Changes
                            </button>
                            <button onClick={() => setEditTask(null)} className="bg-red-600 text-white px-4 py-2 rounded">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-3 gap-4 p-4">
                {tasks.length > 0 ? (
                    tasks.map((item, i) => (
                        <div key={i} className="flex flex-col justify-between bg-gray-800 rounded-sm p-4">
                            <div>
                                <h3 className="text-xl font-semibold">{item.title}</h3>
                                <p className="text-gray-300 my-2">{item.desc}</p>
                            </div>
                            <div className="mt-4 w-full flex items-center">
                                <button
                                    onClick={() => toggleComplete(item._id)}
                                    className={`${item.complete ? "bg-green-600" : "bg-red-400"} rounded p-2 w-3/6`}
                                >
                                    {item.complete ? "Complete" : "Pending"}
                                </button>


                                <div className="text-white p-2 w-3/6 text-2xl font-semibold flex justify-around">
                                    <button
                                        onClick={() => handleImportant(item._id)}
                                        className={`${item.important ? "text-red-500 " : "text-gray-500"}`}
                                    >
                                        <CiHeart />
                                    </button>
                                    <button onClick={() => handleEdit(item)}>
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDelete(item._id)}>
                                        <MdDelete />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No tasks found.</div>
                )}

                {home === "false" && (
                    <button
                        className="flex flex-col justify-center items-center bg-gray-800 rounded-sm p-4 hover:scale-105 hover:cursor-pointer transition-all duration-300"
                        onClick={() => setInputDiv("fixed")}
                    >
                        <IoMdAddCircle className="text-5xl" />
                        <h2 className="text-2xl text-gray-300">Add Task</h2>
                    </button>
                )}
            </div>
        </>
    );
};

export default Cards;
