import { Checkbox } from "@mui/material";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";
import { DoctorVisit } from "../../types/Patient";

interface MyCheckBoxLabProps {
  id: number;
  isbankak: boolean;
  activePatient: DoctorVisit;
  update: (doctorVisit: DoctorVisit) => void;
}
function MyCheckBoxLab({
  id,
  isbankak,
  update,
  activePatient,
}: MyCheckBoxLabProps) {
  const [isChecked, setIsChecked] = useState(isbankak);
  const disabled = activePatient.patient.is_lab_paid === 0;
  const bankakChangeHandler = (val) => {
    // console.log(val.target.checked, "checked handler");
    setIsChecked(val.target.checked);
    axiosClient
      .patch(`labRequest/bankak/${id}/${activePatient.id}`, {
        val: val.target.checked,
      })
      .then(({ data }) => {
        if (data.status) {
          update(data.data);
        }
        // if (status > 400) {
        // }
      });
  };
  return (
    <Checkbox
      disabled={disabled}
      key={activePatient.id}
      onChange={bankakChangeHandler}
      checked={isChecked}
    ></Checkbox>
  );
}

export default MyCheckBoxLab;
