import { LoadingButton } from '@mui/lab'
import React, { useState } from 'react'

function MyLoadingButton({children,onClick,active}) {
   const [loading,setLoading] =    useState(false)
   console.log('rendered',loading)
  return (
    <LoadingButton  loading={loading} color={active ? 'primary':'inherit'} variant="contained" onClick={()=>{
        
        onClick(setLoading)
    }} >
        {children}
    </LoadingButton>
  )
}

export default MyLoadingButton