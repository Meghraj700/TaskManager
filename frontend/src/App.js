import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'; // No need for 'Router' import
import { useDispatch, useSelector } from "react-redux";
import Home from './pages/home';
import './App.css';
import Alltasks from './pages/Alltasks';
import CompletedTask from './pages/CompletedTask';
import ImportantTask from './pages/ImportantTask';
import IncompleteTask from './pages/IncompleteTask';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { authActions } from './store/auth';
const App=() =>{
  const nav =useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  //console.log(isLoggedIn);
  const dispatch= useDispatch();
  useEffect(() => {
    if(localStorage.getItem("id") && localStorage.getItem("token")){
      dispatch(authActions.login());
    }else if(isLoggedIn === false) {
        nav("/signup");
      }

    }, []);

  return (
    <div className="bg-gray-900 text-white h-screen p-2">
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Alltasks />} />
          <Route path="/completedtasks" element={<CompletedTask />} />
          <Route path="/importanttasks" element={<ImportantTask />} />
          <Route path="/incompletetasks" element={<IncompleteTask />} />
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
