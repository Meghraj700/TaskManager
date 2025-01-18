import React, { useState } from 'react'
import Cards from '../components/Home/cards'
import { IoMdAddCircle } from "react-icons/io";
import InputData from '../components/Home/inputData';
const Alltasks = () => {
   const[InputDiv,setInputDiv]= useState('hidden')
  return (
    <>
    <div>
        <div className='w-full flex justify-end py-2'>
            <button onClick={()=>setInputDiv("fixed")}>
            <IoMdAddCircle className='text-4xl text-gray-400 hover:text-gray-100 transition-all duration-300'/>
            </button>
        </div> 
        <Cards home={"false"} setInputDiv={setInputDiv}/>
    </div>
    <InputData InputDiv={InputDiv} setInputDiv={setInputDiv}/>
    </>
    
  );
};

export default Alltasks