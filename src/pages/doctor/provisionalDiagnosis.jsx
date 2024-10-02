import { Box, Divider, List, ListItem, TextField } from "@mui/material";
import axiosClient from "../../../axios-client";
import { useState } from "react";
import CodeEditor from "./CodeMirror";

function ProvisionalDiagnosis(props) {
  const { value, index, patient, setDialog, setShift, change,diagnosis,setDiagnosis, ...other } =
    props;
  const updateHandler = (val) => {
    axiosClient
      .patch(`patients/${patient.id}`, {
        provisional_diagnosis: val,
      })
      .then(({ data }) => {
        // console.log(data);
        if (data.status) {
    
          change(data.patient);
          setDialog((prev) => {
            return {
              ...prev,
              message: "Saved",
              open: true,
              color: "success",
            };
          });
        }
      })
      .catch(({ response: { data } }) => {
        console.log(data);
        setDialog((prev) => {
          return {
            ...prev,
            message: data.message,
            open: true,
            color: "error",
          };
        });
      });
  };
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
          
          <CodeEditor  tableName={'diagnosis'} setOptions={setDiagnosis} options={diagnosis} init={patient.provisional_diagnosis} patient={patient} change={change} setDialog={setDialog} colName={'provisional_diagnosis'}/>
       
       </Box>
            
        </Box>
      )}
    </div>
  );
}

export default ProvisionalDiagnosis;
