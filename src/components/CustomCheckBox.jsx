import { Checkbox } from '@mui/material';
import React from 'react'
import axiosClient from '../../axios-client';

function CustomCheckBox({setUpdater,setDialog,selectedRole,isChecked,permission_id}) {
    const [checked, setChecked] = React.useState(isChecked);

    const handleChange = (event) => {
      setChecked(event.target.checked);
      axiosClient.patch(`roles/${selectedRole.id}`,{add:event.target.checked,permission_id:permission_id}).then(({data})=>{
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
    <Checkbox   checked={checked}  onChange={handleChange}/>
  )
}

export default CustomCheckBox