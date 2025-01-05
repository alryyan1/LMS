import { Autocomplete, TextField } from '@mui/material';
import { t } from 'i18next';
import React, { useState } from 'react'

function ComponyAutocompleteHistory({companies,setSelectedCompany,patientCompany}) {
    const [val, setVal] = useState(patientCompany);
    

  return (
    <Autocomplete
    
    onInputChange={(e,s,r)=>{
        if (r =='clear') {
            setVal(null)
            setSelectedCompany(null)
        }
    }}
    // sx={{width:'200px'}}
    sx={{width:'180px'}}

     size="small"
      value={val}
     onChange={(e, newVal) => {
        setVal(newVal)
        setSelectedCompany(newVal)
     }}
     getOptionKey={(op) => op.id}
     getOptionLabel={(option) => option.name}
     options={companies}
     renderInput={(params) => {
       // console.log(params)

       return (
         <TextField
        //  variant='standard'
           {...params}
           label={t("company")}
         />
       );
     }}
   ></Autocomplete>
  )
}

export default ComponyAutocompleteHistory