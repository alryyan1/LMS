import { TableCell, TextField } from '@mui/material'
import { useState } from 'react'
import { url } from '../constants'

function MyTableCell({children,setOpenSuccessDialog,item,colName,table='items'}) {

   const [edited , setEdited] =  useState(false)
   const [val , setVal] =  useState(children)
   const clickHandler = ()=>{
     setEdited(true)
   }
   const changeHandler = (e)=>{
    console.log(e.target.value)
    setVal(e.target.value)
   }

   const updateItemName = (val) => {
     fetch(`${url}${table}/${item.id}`,{
       headers:{'content-type':'application/json'},
       method:"PATCH",body:JSON.stringify({colName:colName ,val})}).then((res)=>res.json()).then((data)=>{
        if (data.status) {
            setOpenSuccessDialog((prev)=>{
                return {...prev,open:true,msg:'تم التعديل بنجاح'}
            })
        }
       })
   }

//    const inputHandler = (e)=>{
//     console.log(e)
//     console.log('called')
//         //check key code 
//         if(e.keyCode === 13){
         
//         }
//    }
   const blurHandler = ()=>{
    setEdited(false)
    updateItemName(val)
    setEdited(false)
   
   }

  return (
    <TableCell  onClick={clickHandler}>
        {edited ? <TextField autoFocus onBlur={blurHandler} onChange={changeHandler} value={val}></TextField> : val}
    </TableCell>
  )
}

export default MyTableCell