import React, { useEffect, useState } from 'react'
import axiosClient from '../../../axios-client'
import { LoadingButton } from '@mui/lab'

function CalculateInventory({item_id}) {
    const [loading, setLoading] = useState(true)

   const [data,setData] =  useState()
    useEffect(()=>{
        setLoading(true)
        axiosClient(`calculateInventory/${item_id}`).then(({data})=>{
            setData(data)
        }).finally(()=>setLoading(false))
    },[])
  return (
    <LoadingButton sx={{color:'black'}} variant='outlined' color='success' loading={loading}>{data}</LoadingButton>
  )
}

export default CalculateInventory