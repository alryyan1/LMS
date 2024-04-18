import { Checkbox } from '@mui/material'
import React from 'react'
import { url } from './constants';

function MyCheckBox({activePatient,id,isbankak}) {
    const [checked, setChecked] = React.useState(isbankak == 0 ? false : true);
    const bankakChangeHandler = (val)=>{
        console.log(val.target.checked)
        setChecked(val.target.checked)
        fetch(`${url}labRequest/bankak/${activePatient.id}`,{
            headers:{'content-type':'application/json'},
            method:"PATCH",body:JSON.stringify({id,val:val.target.checked})}).then((res)=>res.json()).then((data)=>console.log(data))
      }
  return (
    <Checkbox onChange={bankakChangeHandler} checked={checked}></Checkbox>
  )
}

export default MyCheckBox