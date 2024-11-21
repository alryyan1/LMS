import { Box, Divider, List, ListItem, TextField } from "@mui/material";
import axiosClient from "../../../axios-client";
import { useState } from "react";
import CodeEditor from "./CodeMirror";
import { DoctorVisit } from "../../types/Patient";
interface ProvisionalDiagnosisProbs{
  patient: DoctorVisit;
  setActiveDoctorVisit: React.Dispatch<React.SetStateAction<DoctorVisit|null>>;
  diagnosis: string[];
  setDiagnosis: React.Dispatch<React.SetStateAction<any>>;
  value: number;
  index: number;
  other: any;
}
function ProvisionalDiagnosis(props:ProvisionalDiagnosisProbs) {

  const { value, index, patient, setActiveDoctorVisit,diagnosis,setDiagnosis, ...other } =
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
          
          <CodeEditor  tableName={'diagnosis'} setOptions={setDiagnosis} options={diagnosis} init={patient.patient.provisional_diagnosis} patient={patient} setActiveDoctorVisit={setActiveDoctorVisit}  colName={'provisional_diagnosis'}/>
       
       </Box>
            
        </Box>
      )}
    </div>
  );
}

export default ProvisionalDiagnosis;
