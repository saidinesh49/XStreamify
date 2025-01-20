import React, { useEffect, useState } from 'react'
import { useUserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';

function AuthLayout({children}) {
  const {userData}=useUserContext();
  const [loading, setloading]=useState(true);
  const navigate=useNavigate();
  
  useEffect(()=>{
    try {
        setloading(true);
        if(userData?.username){
            navigate('/');
        }
        setloading(false);
    } catch (error) {
        setloading(false);
        console.log("Error: from at Auth-Layout",error);
    }
  },[]);

  return loading? <Loading/>: <>{children}</>;
}

export default AuthLayout
