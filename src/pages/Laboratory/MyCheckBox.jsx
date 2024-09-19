import { Checkbox } from "@mui/material";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";

function MyCheckBox({ id, isbankak, change ,isLabPage}) {
  // console.log(isbankak, "checked before");
  const [isChecked, setIsChecked] = useState(isbankak);
  // console.log(isChecked, "checked after");
  const { actviePatient } = useOutletContext();
  const disabled = isLabPage  ? actviePatient.is_lab_paid === 0 :actviePatient.patient.is_lab_paid === 0
  const bankakChangeHandler = (val) => {
    // console.log(val.target.checked, "checked handler");
    setIsChecked(val.target.checked);
    axiosClient
      .patch(`labRequest/bankak/${id}/${actviePatient.id}`, {
        id,
        val: val.target.checked,
      })
      .then(({ data }) => {
        
        if (data.status) {
          change(data.data)
         
       
        }
        // if (status > 400) {
        // }
      });
  };
  return (
    <Checkbox
      disabled={disabled}
      key={actviePatient.id}
      onChange={bankakChangeHandler}
      checked={isChecked}
    ></Checkbox>
  );
}

export default MyCheckBox;
