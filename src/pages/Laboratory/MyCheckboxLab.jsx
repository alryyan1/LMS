import { Checkbox } from "@mui/material";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";

function MyCheckBoxLab({ id, isbankak, setPatients,setActivePatient }) {
  // console.log(isbankak, "checked before");
  const [isChecked, setIsChecked] = useState(isbankak);
  // console.log(isChecked, "checked after");
  const { actviePatient } = useOutletContext();
  const disabled =  actviePatient.is_lab_paid === 0 
  const bankakChangeHandler = (val) => {
    // console.log(val.target.checked, "checked handler");
    setIsChecked(val.target.checked);
    axiosClient
      .patch(`lab/bank/${id}`, {
      
        val: val.target.checked,
      })
      .then(({ data }) => {
        
        if (data.status) {
            setActivePatient((prev)=>{
                return {...prev,...data.patient}
              })
          setPatients((prevPatients) => {
            return prevPatients.map((p) => {
              if (p.id === actviePatient.id) {
                return { ...data.patient, active: true };
              } else {
                return p;
              }
            });
          });
       
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

export default MyCheckBoxLab;
