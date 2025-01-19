import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import { useSelector } from "react-redux";
const Signup = () => {
    const history=useNavigate()
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
            if(data.username === "" || data.email === "" || data.password === ""){
                alert("All Fields Are Required")
            }else{
                const response=await axios.post("https://taskmanager-backendd.onrender.com/api/v1/sign-in",data);
                setData({username:"",email:"",password:""})
               // console.log(response);
                history("/login")
            }
        }catch(err){
            alert(err.response.data.message);
            
        }
        
        
    }
  return (
    <div className=' h-[98vh] flex items-center justify-center'>
    <div className='p-4 w-2/6 rounded bg-gray-800'>
    <div className='text-2xl font-semibold'> Signup</div>
    <input type="text" placeholder='UserName' className='bg-gray-700 px-3 py-2 my-3 w-full rounded'
    name="username"
    value={data.username}
    onChange={change}
    />
    <input type="email" placeholder='email' 
    className='bg-gray-700 px-3 py-2 my-3 w-full rounded'
    name="email"
    value={data.email}
    required
    onChange={change}
    />
    <input type="password" placeholder='password' 
    className='bg-gray-700 px-3 py-2 my-3 w-full rounded'
    name="password"
    value={data.password}
    required
    onChange={change}
    />
    <div className='w-full flex items-center justify-between'>
    <button className='bg-blue-400 text-xl font-semibold 
    text-black px-3 py-2 rounded'onClick={submit} >
        SignUp 
    </button>
    <Link to="/login" className='text-gray-400 hover:text-gray-200'>Already Having an account? Login Here</Link>
    </div>
    </div>
    </div>
  )
}

export default Signup
