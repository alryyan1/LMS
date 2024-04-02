import React, { useState } from 'react'

function Patient({ onClick,patient}) {
  return (
    <div onClick={()=>{
        onClick(patient.id)
    } }
    className={patient.active ? 'active' :''} >{patient.id}</div>
  )
}

export default Patient