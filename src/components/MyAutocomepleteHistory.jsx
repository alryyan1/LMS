import { Autocomplete, TextField } from "@mui/material";
import React, { useState } from "react";

function MyAutocomepleteHistory({ options,val,setDoctor }) {
  const [selected, setSelected] = useState();

  return (
    <Autocomplete
      sx={{ minWidth: "300px" }}
    
      onChange={(e, data) => {
        setSelected(data);
        setDoctor(data);
      }}
      getOptionDisabled={(option) => {
        //return option.id == item.doctor.id
      }}
      getOptionKey={(op) => op.id}
      getOptionLabel={(option) => option.name}
      options={options.map((shift) => {
        return shift.doctor;
      })}
      //fill isOptionEqualToValue

      isOptionEqualToValue={(option, val) => option.id === val.id}
      renderInput={(params) => {
        // console.log(params)

        return <TextField variant="standard" {...params} label="الطبيب" />;
      }}
    />
  );
}

export default MyAutocomepleteHistory;
