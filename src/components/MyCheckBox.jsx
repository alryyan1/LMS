import { Checkbox } from '@mui/material';
import React from 'react'
import axiosClient from '../../axios-client';

function MyCheckbox({path,isChecked,colName, payload={},change=null,setDialog  = null,setShift=null}) {
    const [checked, setChecked] = React.useState(isChecked);

    const handleChange = (event) => {
      setChecked(event.target.checked);
      axiosClient.patch(path,{colName, val :   event.target.checked,...payload}).then(({data})=>{
        if (data.status) {
          if (setDialog) {
            setDialog((prev) => {
              return {
                ...prev,
                color: "success",

                open: true,
                message: 'تم التعديل',
              };
            });
          }
          if (setShift) {
            setShift(data.shift)
          }
          if (change) {
               change(data.deposit)
          }
       
        }
     
      })
    };
  return (
    <Checkbox  checked={checked}  onChange={handleChange}/>
  )
}

export default MyCheckbox