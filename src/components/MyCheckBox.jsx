import { Checkbox } from '@mui/material';
import React from 'react'
import axiosClient from '../../axios-client';

function MyCheckbox({path,isChecked,colName, payload={},change=null,setAllMoneyUpdated,setDialog  = null,setShift=null,evalToZeroOrOne = false}) {
    const [checked, setChecked] = React.useState(isChecked);

    const handleChange = (event) => {
       let result = event.target.checked
       if (evalToZeroOrOne) {
         result = result? 1 : 0
       }
      setChecked(event.target.checked);
      axiosClient.patch(path,{colName, val : result  ,...payload}).then(({data})=>{
         if(setAllMoneyUpdated){
            // alert('s')
            setAllMoneyUpdated((prev)=>prev+1)
          }
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