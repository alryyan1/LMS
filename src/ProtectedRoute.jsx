import React, { useEffect } from 'react'
import { useStateContext } from './appContext';
import { Navigate, useLocation } from 'react-router-dom';
import axiosClient from '../axios-client';

function ProtectedRoute({children}) {
    const { token ,setUser,setToken} = useStateContext();
    const location = useLocation()
    console.log(token,'from protected route');
  
 
    useEffect(()=>{
    // console.log(location,'location')
    axiosClient.get('/user').then(({data})=>{
      console.log(data,'setting user data')
      setUser(data)
    }).catch(({response})=>{
      if (response.status == 401) {
        setUser(null)
        setToken(null)
      }
    })
     const token = localStorage.getItem('ACCESS_TOKEN')
     if (token == null) {
        setToken(null)
     }
    },[location])
    console.log(token,'token')
    console.log("lab layout rendered");
    if (!token) {
      console.log("redirect to login");
      return <Navigate to={'/login'}/>
    }
   
  return (
    children
  )
}

export default ProtectedRoute