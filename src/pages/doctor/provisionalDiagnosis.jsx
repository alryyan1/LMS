import { Box, Divider, List, ListItem, TextField } from "@mui/material";
import axiosClient from "../../../axios-client";
import { useState } from "react";
import CodeEditor from "./CodeMirror";

function ProvisionalDiagnosis(props) {
  const { value, index, patient, setDialog, setShift, setActiveDoctorVisit,diagnosis,setDiagnosis, ...other } =
    props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Divider sx={{ mb: 1 }} variant="middle">
        Provisional Diagnosis
      </Divider>
      {value === index && (
        <Box sx={{ justifyContent: "space-around" }} className="">
       <Box sx={{ justifyContent: "space-around" }} className="">
          
          <CodeEditor  tableName={'diagnosis'} setOptions={setDiagnosis} options={diagnosis} init={patient.provisional_diagnosis} patient={patient} setActiveDoctorVisit={setActiveDoctorVisit} setDialog={setDialog} colName={'provisional_diagnosis'}/>
       
       </Box>
            
        </Box>
      )}
    </div>
  );
}

export default ProvisionalDiagnosis;
