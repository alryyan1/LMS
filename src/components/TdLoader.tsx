import React, { useEffect, useState } from 'react'
import axiosClient from '../../axios-client'
import { CircularProgress, TableCell } from '@mui/material'

function TdLoader({api}) {
   const [loading,setLoading] = useState(false)
   const [val,setVal] = useState(0)
   useEffect(()=>{
     setLoading(true)
     axiosClient.get(api).then(({data})=>{
        setVal(data.val)
        setLoading(false)
     })
   },[])
  return (
   <TableCell>{loading ? <CircularProgress/> : val}</TableCell>
  )
}

export default TdLoader