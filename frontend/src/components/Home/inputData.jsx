import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { RxCross2 } from "react-icons/rx";

const InputData = ({ InputDiv, setInputDiv }) => {
  const [text, setText] = useState("");  // For description
  const [title, setTitle] = useState(""); // For title
  const [loading, setLoading] = useState(false);

  // Submit the form to the backend
  const onClickSubmit = async () => {
    if (title.trim() === "" || text.trim() === "") {
      alert("Title and description are required!");
      return;
    }

    // Data to be sent to the server
    const taskData = {
      title: title,
      desc: text
    };

    setLoading(true);  // Set loading to true before making the API call

    const headers = {
      id: localStorage.getItem("id"),
      authorization: `Bearer ${localStorage.getItem("token")}`, // Use "Authorization" header
  };
  try {
    const response = await axios.post(
      'http://localhost:3001/api/v2/create-task', 
      taskData, 
      { headers }
    );
      //console.log(response.data); 
      alert('Task created successfully!');

      setTitle("");
      setText("");
      setInputDiv("hidden");  
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task, please try again!');
    } finally {
      setLoading(false); 
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/v2/create-task');
        console.log(response.data); // Log fetched tasks for debugging
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchData();
    
  }, []); 

  
  return (
    <>
      <div className={`${InputDiv} top-0 bg-gray-800 opacity-80 h-screen w-full fixed`}></div>
      <div className={`${InputDiv} top-0 left-0 flex items-center justify-center h-screen w-full fixed`}>
        <div className='w-2/6 bg-gray-900 p-4 rounded'>
          <div className='flex justify-end'>
            <button
              className='text-2xl'
              onClick={() => setInputDiv("hidden")}  
            >
              <RxCross2 />
            </button>
          </div>
          <input
            type='text'
            placeholder='Title'
            name="title"
            className='px-3 py-2 rounded w-full text-black text-xl font-semibold'
            value={title}
            onChange={(e) => setTitle(e.target.value)} 
          />
          <textarea
            name='desc'
            cols="30"
            rows="10"
            placeholder='Description ...'
            className='px-3 py-2 rounded w-full bg-gray-700 my-3'
            value={text}
            onChange={(e) => setText(e.target.value)} // Bind description to state
          ></textarea>
          <button
            className='px-3 py-2 bg-blue-400 rounded text-black text-xl font-semibold'
            onClick={onClickSubmit}  // Trigger form submission
            disabled={loading}  // Disable button while loading
          >
            {loading ? 'Submitting...' : 'Submit'} 
          </button>
        </div>
      </div>
    </>
  );
};

export default InputData;
