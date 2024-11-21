import { MenuItem, Select, TableCell, TextField } from "@mui/material";
import { useState } from "react";
import { url } from "../constants";
import axiosClient from "../../../axios-client";
import { DoctorVisit } from "../../types/Patient";

interface PatientEditSelectProps {
  myVal: string;
  patient: DoctorVisit;
  colName: string;
  setActiveDoctorVisit:()=>void
}
function PatientEditSelect({
  myVal,
  patient,
  colName,
  setActiveDoctorVisit,
}: PatientEditSelectProps) {
  const [iniVal, setInitVal] = useState(myVal);

  const changeHandler = (e) => {
    console.log("val", e.target.value, "init val", iniVal);

    console.log(e.target.value);
    setInitVal(e.target.value);
    updateItemName(e.target.value);
  };

  const updateItemName = (val) => {
    console.log("val", val, "init val", iniVal);
    if (val != iniVal) {
      console.log("diffent value");
      axiosClient
        .patch(`patients/${patient.patient.id}`, { [colName]: val })
        .then(({ data }) => {
          if (data.status) {
            try {
              setActiveDoctorVisit(data.data);
            } catch (error) {
              console.log(error);
            }
          }
        });
    }
  };

  return (
    <TableCell>
      <Select
        onChange={changeHandler}
        value={iniVal}
        sx={{
          "& .MuiSelect-select": {
            paddingRight: 0.5,
            paddingLeft: 0.5,
            paddingTop: 0.5,
            paddingBottom: 0.5,
          },
        }}
      >
        <MenuItem value={null}>indeterminate</MenuItem>
        <MenuItem value={1}>Yes</MenuItem>
        <MenuItem value={0}>No</MenuItem>
      </Select>
    </TableCell>
  );
}

export default PatientEditSelect;
