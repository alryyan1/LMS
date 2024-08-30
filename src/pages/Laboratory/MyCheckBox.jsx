import { Checkbox } from "@mui/material";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";

function MyCheckBox({ id, isbankak, setPatients }) {
  // console.log(isbankak, "checked before");
  const [isChecked, setIsChecked] = useState(isbankak);
  // console.log(isChecked, "checked after");
  const { actviePatient ,setActivePatient} = useOutletContext();
  const bankakChangeHandler = (val) => {
    // console.log(val.target.checked, "checked handler");
    setIsChecked(val.target.checked);
    axiosClient
      .patch(`labRequest/bankak/${id}`, {
        id,
        val: val.target.checked,
      })
      .then(({ data }) => {
        
        if (data.status) {
          setActivePatient({...data.patient,active:true})
          setPatients((prev)=>{
            return  prev.map((patient)=>{
              // console.log('patient found',patient)
              if(patient.id === actviePatient.id){
                return{...data.patient,active:true}
              }
              return patient
            })
          })
         
       
        }
        // if (status > 400) {
        // }
      });
  };
  return (
    <Checkbox
      disabled={actviePatient.is_lab_paid === 0}
      key={actviePatient.id}
      onChange={bankakChangeHandler}
      checked={isChecked}
    ></Checkbox>
  );
}

export default MyCheckBox;
