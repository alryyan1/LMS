import React from 'react'

function Patients() {
  return (
    <div>Patients</div>
  )
}


function loader(){
  return  axios.get("url")
}



export const PatientRouter = {
    element : <Patient/>,
    loader
}