import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from '../store/auth';
const Login=()=> {
    const history=useNavigate();
    const dispatch=useDispatch()
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    if(isLoggedIn ===true){
        history("/")
    }
        const [data,setData]=useState({username:"",email:"",password:""});
        
    const change=(e)=>{
        const {name,value}=e.target;
        setData({...data,[name]:value});
    }
    const submit=async()=>{
        try{
            if(data.username === "" || data.password === ""){
                alert("All Fields Are Required")
            }else{
                const response=await axios.post("https://taskmanager-backendd.onrender.com/api/v1/log-in",data);
                setData({username:"",password:""})
                localStorage.setItem("id",response.data.id)
                localStorage.setItem("token",response.data.token)
                dispatch(authActions.login());
                history("/")
            }
        }catch(err){
            console.log(err.response.data.message);
            
        }   
        
    }
    
  return (
    <div className=' h-[98vh] flex items-center justify-center'>
    <div className='p-4 w-2/6 rounded bg-gray-800'>
    <div className='text-2xl font-semibold'> Login</div>
    <input type="text" placeholder='UserName' className='bg-gray-700 px-3 py-2 my-3 w-full rounded'
    name="username"
    value={data.username}
    onChange={change}
    />
     
    <input type="password" placeholder='password' 
    className='bg-gray-700 px-3 py-2 my-3 w-full rounded'
    name="password"
    value={data.password}
    onChange={change}
    required
    />
    <div className='w-full flex items-center justify-between'>
    <button className='bg-blue-400 text-xl font-semibold 
    text-black px-3 py-2 rounded' onClick={submit}>
        Login 
    </button>
    <Link to="/signup" className='text-gray-400 hover:text-gray-200'>Not Having an account? Signup Here</Link>
    </div>
    </div>
    </div>
  )
}

export default Login
