import React, { useState } from "react";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import axiosClient from "../../../axios-client";

const UserMoneyCollectorTypeSelect = ({ value, onChange ,id}) => {
  const options = [
    { label: "Lab", value: "lab" },
    { label: "Company", value: "company" },
    { label: "Clinic", value: "clinic" },
    { label: "All", value: "all" },
  ];

  const [selectedOption, setSelectedOption] = useState(value);

  return (
    <FormControl fullWidth>
      <InputLabel>نوع المستخدم</InputLabel>
      <Select
        value={selectedOption}
        onChange={(e) => {
            setSelectedOption(e.target.value)
          axiosClient.patch(`users-data/${id}`, {
            user_money_collector_type: e.target.value,
          });
        }}
        label="نوع المستخدم"
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default UserMoneyCollectorTypeSelect;
