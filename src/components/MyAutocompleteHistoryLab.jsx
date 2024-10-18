import { Autocomplete, TextField } from "@mui/material";
import React, { useState } from "react";

function MyAutocomepleteHistoryLab({ options,val,setDoctor}) {
  const [selected, setSelected] = useState(val);
  return (
    <Autocomplete
    size="small"
      // sx={{width:'200px'}}
  
      onChange={(e, data) => {
        setSelected(data);
        setDoctor(data);
      }}
      getOptionDisabled={(option) => {
        //return option.id == item.doctor.id
      }}
      
      getOptionKey={(op) => op.id}
      getOptionLabel={(option) => option.name}
      options={options}
      //fill isOptionEqualToValue

      isOptionEqualToValue={(option, val) => option.id === val.id}
      renderInput={(params) => {
        // console.log(params)

        return <TextField {...params} label="الطبيب" />;
      }}
    />
  );
}

export default MyAutocomepleteHistoryLab;
