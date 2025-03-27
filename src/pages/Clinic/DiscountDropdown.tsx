import React, { useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axiosClient from "../../../axios-client";

const DiscountDropdown = ({ value ,id,update}) => {
  const discountOptions = Array.from({ length: 10 }, (_, i) => (i + 1) * 10); // 10% to 100%

  return (
    <FormControl fullWidth>
      <InputLabel></InputLabel>
      <Select size="small" value={value} onChange={(e) => {
        axiosClient.patch(`requestedService/discountPerc/${id}`,{
          perc:e.target.value
        }).then(({data})=>{
          console.log(data)
          update(data.patient)
        })
      }}>
             <MenuItem key={'0'} value={0}>
            0%
          </MenuItem>
        {discountOptions.map((discount) => (
          <MenuItem key={discount} value={discount}>
            {discount}%
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};



export default DiscountDropdown;
