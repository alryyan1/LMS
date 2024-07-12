import { LoadingButton } from '@mui/lab'
import React, { useState } from 'react'

function MyCustomLoadingButton({children,onClick,disabled=false}) {
   const [loading,setIsLoading] =   useState()
  return (
    <LoadingButton variant='contained' disabled={disabled} onClick={()=>{
        onClick(setIsLoading)
    }} loading={loading}>
        {children}
    </LoadingButton>
  )
}

export default MyCustomLoadingButton