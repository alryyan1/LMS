import { Checkbox } from '@mui/material';
import React from 'react'
import axiosClient from '../../axios-client';

function CustomCheckboxUserRoute({setUpdater,setDialog,selectedUser,isChecked,route_id}) {
    const [checked, setChecked] = React.useState(isChecked);

    const handleChange = (event) => {
      setChecked(event.target.checked);
      axiosClient.patch(`routes`,{add:event.target.checked,route_id:route_id,user_id:selectedUser.id}).then(({data})=>{
        setUpdater((prev)=>prev+1)
        setDialog((prev)=>{
          return {
           ...prev,
            open: true,
            msg: data.msg
          }
        })
      })
    };
  return (
    <Checkbox  checked={checked}  onChange={handleChange}/>
  )
}

export default CustomCheckboxUserRoute