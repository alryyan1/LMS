import { Checkbox } from '@mui/material';
import React from 'react'
import axiosClient from '../../axios-client';

function MyCheckbox({path,isChecked,colName, payload={},setSelectedDeposit=null}) {
    const [checked, setChecked] = React.useState(isChecked);

    const handleChange = (event) => {
      setChecked(event.target.checked);
      axiosClient.patch(path,{colName, val :   event.target.checked,...payload}).then(({data})=>{
        if (data.status) {
            setSelectedDeposit((prev)=>{
                return {...prev,items:prev.items.map((depositItem)=>{
                    if(depositItem.id === data.id){
                        return {...data}
                    }
                    return depositItem;
                })}
            })
        }
     
      })
    };
  return (
    <Checkbox  checked={checked}  onChange={handleChange}/>
  )
}

export default MyCheckbox