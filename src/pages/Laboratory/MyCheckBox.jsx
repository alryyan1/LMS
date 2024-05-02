import { Checkbox } from '@mui/material'
import React from 'react'
import { useOutletContext } from 'react-router-dom';
import axiosClient from '../../../axios-client';

function MyCheckBox({id,isbankak}) {
  const {actviePatient} =useOutletContext()
  console.log(actviePatient)
    const [checked, setChecked] = React.useState(isbankak == 0 ? false : true);
    const bankakChangeHandler = (val)=>{
        console.log(val.target.checked)
        setChecked(val.target.checked)
        axiosClient.patch(`labRequest/bankak/${actviePatient.id}`,{id,val:val.target.checked}).then((res)=>res.json()).then((data)=>console.log(data))
      }
  return (
    <Checkbox onChange={bankakChangeHandler} checked={checked}></Checkbox>
  )
}

export default MyCheckBox