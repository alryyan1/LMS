import { Checkbox } from '@mui/material';
import React from 'react'
import axiosClient from '../../axios-client';

function CustomCheckBoxUser({setUpdater,setDialog,selectedUser,isChecked,role_id}) {
    const [checked, setChecked] = React.useState(isChecked);

    const handleChange = (event) => {
      setChecked(event.target.checked);
      axiosClient.patch(`user/roles/${selectedUser.id}`,{add:event.target.checked,role_id:role_id}).then(({data})=>{
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

export default CustomCheckBoxUser