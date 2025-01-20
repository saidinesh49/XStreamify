import React from 'react'
import { logoutUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

function LogoutBtn() {
    const navigate=useNavigate();
    const handleLogout=async()=>{
        try {
            await logoutUser();
            navigate('/');
        } catch (error) {
            console.log("Error: while logging out");
        }
    };
  return (
    <button 
      onClick={handleLogout()} 
      className='bg-sky-800 text-slate-950 px-4 py-2 dark:bg-sky-300 rounded'>
      Logout
    </button>
  )
}

export default LogoutBtn
