import { Checkbox } from '@mui/material';
import React from 'react'
import axiosClient from '../../axios-client';

function CustomCheckboxUserRoute({setUpdater,setDialog,selectedUser,isChecked,route_id,sub_route_id=null,path='routes'}) {
    const [checked, setChecked] = React.useState(isChecked);

    const handleChange = (event) => {
      setChecked(event.target.checked);
      axiosClient.patch(path,{add:event.target.checked,route_id:route_id,user_id:selectedUser.id,sub_route_id}).then(({data})=>{
        setUpdater((prev)=>prev+1)
        setDialog((prev)=>{
          return {
           ...prev,
            open: true,
        
          }
        })
      })
    };
  return (
    <Checkbox  checked={checked}  onChange={handleChange}/>
  )
}

export default CustomCheckboxUserRoute