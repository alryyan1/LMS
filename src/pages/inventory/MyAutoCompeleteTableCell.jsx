import { Autocomplete, TableCell, TextField } from '@mui/material'
import React, { useState } from 'react'
import { url } from '../constants'

function MyAutoCompeleteTableCell({children,setOpenSuccessDialog,item,sections,colName}) {

   const [edited , setEdited] =  useState(false)
   const [selectedSection , setSelectedSection] =  useState(item.section)
   const clickHandler = ()=>{
     setEdited(true)
   }
   const changeHandler = (e,newVal)=>{
    console.log(newVal,"new val")
    setSelectedSection(newVal)
    console.log(e.target.value,'section id is ')
  
   }

   const updateItemSectionId = (val) => {
     fetch(`${url}items/${item.id}`,{
       headers:{'content-type':'application/json'},
       method:"PATCH",body:JSON.stringify({colName:colName , val:selectedSection.id })}).then((res)=>res.json()).then((data)=>console.log(data))
   }

  //  const inputHandler = (e)=>{
  //   console.log(e)
  //   console.log('called')
  //       //check key code 
  //       if(e.keyCode === 13){
           
  //       }
  //  }
   const blurHandler = ()=>{
    setEdited(false)
    setEdited(false)
    setOpenSuccessDialog((prev)=>{
        return {...prev,open:true,msg:'تم التعديل بنجاح'}
    })
    updateItemSectionId(selectedSection.id)

   }

  return (
    <TableCell   onClick={clickHandler}>
        {edited ?  <Autocomplete fullWidth
                    isOptionEqualToValue={(option, value) =>{
                     // console.log(option,'option',value,"value")
                      return option.id === value.id;
                    }}

          onBlur={blurHandler}
          value={selectedSection}
                        sx={{ mb: 1 }}
                        options={sections}
                        onChange={changeHandler}
                        getOptionLabel={(option) => option.name || ""}
                        renderInput={(params) => {
                          return (
                            <TextField
                          
                              {...params}
                              label="القسم"
                              variant="filled"
                            />
                          );
                        }}
                      ></Autocomplete> : selectedSection?.name}
    </TableCell>
  )
}

export default MyAutoCompeleteTableCell