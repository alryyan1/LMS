import { Checkbox } from "@mui/material";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";

function MyCheckboxReception({ id, isbankak, setPatients,disabled ,checked}) {
  console.log(isbankak, "checked before");
  const [isChecked, setIsChecked] = useState(checked);
  console.log(isChecked, "checked after");
  const { actviePatient ,setActivePatient} = useOutletContext();
  const bankakChangeHandler = (val) => {
    setIsChecked(val.target.checked);
    axiosClient.patch(`patient/service/bank/${actviePatient.id}?service_id=${id}&val=${Number(val.target.checked)}`).then(({data}) => {
        console.log(data)
    });
 
  };
  return (
    <Checkbox
      disabled={disabled}
      key={id}
      onChange={bankakChangeHandler}
      checked={isChecked}
    ></Checkbox>
  );
}

export default MyCheckboxReception;
