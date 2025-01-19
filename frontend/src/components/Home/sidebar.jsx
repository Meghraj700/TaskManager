import React, { useEffect, useState } from 'react';
import { CgNotes } from "react-icons/cg";
import { MdLabelImportant } from "react-icons/md";
import { FaCheckDouble } from "react-icons/fa6";
import { TbNotebook } from "react-icons/tb";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/auth';
import axios from 'axios';

const Sidebar = () => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const [userEmail, setUserEmail] = useState('');
    const [username, setUsername]=useState("");

    // Sidebar data with unique id for each item
    const data = [
        {
            id: 1,
            title: "All Task",
            icon: <CgNotes />,
            link: '/'
        },
        {
            id: 2,
            title: "Important Task",
            icon: <MdLabelImportant />,
            link: "/importanttasks"
        },
        {
            id: 3,
            title: "Completed Task",
            icon: <FaCheckDouble />,
            link: "/completedtasks"
        },
        {
            id: 4,
            title: "Incompleted Task",
            icon: <TbNotebook />,
            link: "/incompletetasks"
        },
    ];

    const logout = () => {
        localStorage.clear();
        dispatch(authActions.logout());
        history("/signup");
    }

    // Fetch user data and tasks from API
    const headers = {
        _id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`, // Use "Authorization" header
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log("adkjskfjs"+headers.id,+ " "+headers.authorization)

                const response = await axios.get('https://taskmanager-backendd.onrender.com/api/v2/getall-task', { headers });
                const user = await axios.get(`https://taskmanager-backendd.onrender.com/api/v1/get-user-detail`, { headers });
                
                console.log((user))
                setUserEmail(user.data.result.email);  // Assuming the API returns user info with email
                setUsername(user.data.result.username)
                console.log(response.data); // Log the user data for debugging
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (localStorage.getItem("token") && localStorage.getItem("id")) {
            
        }
        fetchUserData();
    }, []);

    return (
        <>
            <div>
            <h2 className='text-xl font-semibold'>{username}</h2>  {/* Display dynamic username */}
            <h4 className='mb-1 text-gray-400'>{userEmail}</h4>  {/* Display dynamic email */}
            </div>
            <div>
                {data.map((item) => (
                    <Link
                        to={item.link}
                        key={item.id} // Use unique id as key
                        className='my-2 flex items-center hover:bg-gray-500 rounded transition duration-200'
                    >
                        {item.icon} {item.title}
                    </Link>
                ))}
            </div>
            <div>
                <button
                    className='bg-gray-600 w-full p-2 rounded'
                    onClick={logout}
                >
                    Logout
                </button>
            </div>
        </>
    );
};

export default Sidebar;
