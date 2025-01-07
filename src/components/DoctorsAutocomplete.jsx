import { Autocomplete, TextField } from '@mui/material';
import React from 'react'
import { Controller } from 'react-hook-form';
import { t } from 'i18next';
import axiosClient from '../../axios-client';
function DoctorsAutocomplete({doctors,val,user,setDialog}) {
  return (
  
        <Autocomplete
        size='small'
        onInputChange={(e,v,reson)=>{
            if (reson =='clear') {
                axiosClient.patch(`update/${user.id}`, { 'colName':'doctor_id', 'val': null }).then(({ data }) =>{
                    if (data.status) {
                       setDialog((prev) => {
                        return {
                          ...prev,
                          color: "success",
          
                          open: true,
                          message: 'تم التعديل',
                        };
                      }); 
                    }
                    
                  })
            }
        }}
          onChange={(e, newVal) => {
              axiosClient.patch(`update/${user.id}`, { 'colName':'doctor_id', 'val': newVal.id }).then(({ data }) =>{
                if (data.status) {
                   setDialog((prev) => {
                    return {
                      ...prev,
                      color: "success",
      
                      open: true,
                      message: 'تم التعديل',
                    };
                  }); 
                }
                
              })
          }}
          defaultValue={val}
          getOptionKey={(op) => op.id}
          getOptionLabel={(option) => option.name}
          options={doctors}
          renderInput={(params) => {
            // console.log(params)

            return (
              <TextField
                {...params}
                label={'الطبيب'}
              />
            );
          }}
        ></Autocomplete>
      );
    
  
  
}

export default DoctorsAutocomplete