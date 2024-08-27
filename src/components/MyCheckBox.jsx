import { Checkbox } from '@mui/material';
import React from 'react'
import axiosClient from '../../axios-client';

function MyCheckbox({path,isChecked,colName, payload={},setSelectedDeposit=null,setDialog  = null,setShift=null,setActiveSell=null}) {
    const [checked, setChecked] = React.useState(isChecked);

    const handleChange = (event) => {
      setChecked(event.target.checked);
      axiosClient.patch(path,{colName, val :   event.target.checked,...payload}).then(({data})=>{
        if (data.status) {
          if (setActiveSell) {
            setActiveSell(data.data)
          }
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
          if (setSelectedDeposit) {
                 setSelectedDeposit((prev)=>{
                return {...prev,items:prev.items.map((depositItem)=>{
                    if(depositItem.id === data.id){
                        return {...data}
                    }
                    return depositItem;
                })}
            })
          }
       
        }
     
      })
    };
  return (
    <Checkbox  checked={checked}  onChange={handleChange}/>
  )
}

export default MyCheckbox