import { Box, Divider, List, ListItem, TextField } from "@mui/material";
import axiosClient from "../../../axios-client";
import { useState } from "react";

function CarePlan(props) {
  const { value, index, patient, setDialog, setShift, change,diagnosis, ...other } =
    props;
  const updateHandler = (val) => {
    axiosClient
      .patch(`patients/${patient.id}`, {
        care_plan: val,
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
        Care Plan
      </Divider>
      {value === index && (
        <Box sx={{ justifyContent: "space-around" }} className="group">
       <TextField sx={{mb:1}}

            onChange={(e) => {

              updateHandler(e.target.value);
            }}
            defaultValue={patient.care_plan}
            multiline
            fullWidth
            rows={13}
          ></TextField>
            
        </Box>
      )}
    </div>
  );
}

export default CarePlan;
