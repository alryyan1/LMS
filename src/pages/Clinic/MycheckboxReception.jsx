import { Checkbox } from "@mui/material";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";

function MyCheckboxReception({ id, isbankak,disabled ,checked,url = 'bank'}) {
  console.log(isbankak, "checked before");
  const [isChecked, setIsChecked] = useState(checked);
  console.log(isChecked, "checked after");
  const { actviePatient ,setUpdate} = useOutletContext();
  const changeHandler = (val) => {
    setIsChecked(val.target.checked);
    axiosClient.patch(`requestedService/bank/${id}?val=${Number(val.target.checked)}`).then(({data}) => {
        setUpdate((prev)=>prev+1)
    });
 
  };
  return (
    <Checkbox
      disabled={disabled}
      key={id}
      onChange={changeHandler}
      checked={isChecked}
    ></Checkbox>
  );
}

export default MyCheckboxReception;
