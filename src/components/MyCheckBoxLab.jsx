import { Checkbox } from "@mui/material";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../axios-client";

function MyCheckBoxLab({ id, hideTest }) {
  const [isChecked, setIsChecked] = useState(hideTest  == 1);
  const { setActivePatient} = useOutletContext();
  const hideTestHandler = (val) => {
    console.log(val.target.checked, "checked handler");
    setIsChecked(val.target.checked);
    axiosClient
      .patch(`hidetest/${id}`, {
        val: val.target.checked,
      }).then(({data})=>{
        setActivePatient(data.data)
      })
      
  };
  return (
    <Checkbox
      onChange={hideTestHandler}
      checked={isChecked}
    ></Checkbox>
  );
}

export default MyCheckBoxLab;
