import { LoadingButton } from '@mui/lab'
import React, { useState } from 'react'

function MyLoadingButton({children,onClick,active,onDouble,disabled= false}) {
   const [loading,setLoading] =    useState(false)
   console.log('rendered',loading)
  return (
    <LoadingButton onDoubleClick={onDouble} size='small' disabled={disabled} loading={loading} color={active ? 'primary':'inherit'} onClick={()=>{
        
        onClick(setLoading)
    }} >
        {children}
    </LoadingButton>
  )
}

export default MyLoadingButton