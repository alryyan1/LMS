import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";

function VitalSigns({ patient, setDialog, change,socket }) {
 
 
  const updateHandler = (val, colName,patient,change,setDialog) => {
    console.log('called update handler')
    return new Promise((resolve,reject)=>{
      axiosClient
      .patch(`patients/${patient.id}`, {
        [colName]: val,
      })
      .then(({ data }) => {
        console.log(data);
        if (data.status) {
          socket.emit('patientUpdated',patient.id)
          if (change) {
            
            change(data.patient);
          }
          resolve(data.patient,data);
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
    })
  
  };
  return (
    <div style={{ padding: "5px" }}>
      <Typography textAlign={"center"} variant="h6">
        Vital Signs
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>B.Pressure</TableCell>
            <TableCell className="vital">
              <TextField 
                inputProps={{
                  style: {
                    fontSize:'22px',
                    padding: 0,
                    minWidth: "66px",
                  },
                }}
                onChange={(e) => {
                  updateHandler(e.target.value, "bp",patient,change,setDialog);
                }}
                defaultValue={patient.bp}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Temperature</TableCell>
            <TableCell>
              <TextField
                inputProps={{
                  style: {
                    padding: 0,
                    fontSize:'22px',

                  },
                }}
                onChange={(e) => {
                updateHandler(e.target.value, "temp",patient,change,setDialog);
                }}
                defaultValue={patient.temp}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Weight</TableCell>
            <TableCell>
              {" "}
              <TextField
                inputProps={{
                  style: {
                    padding: 0,
                    fontSize:'22px',

                  },
                }}
                onChange={(e) => {
                  updateHandler(e.target.value,'weight',patient,change,setDialog)
                }}
                defaultValue={patient.weight}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Height</TableCell>
            <TableCell>
              {" "}
              <TextField
                inputProps={{
                  style: {
                    padding: 0,
                    fontSize:'22px',

                  },
                }}
                onChange={(e) => {
                    updateHandler(e.target.value, "height",patient,change,setDialog)
                }}
                defaultValue={patient.height}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Pulse</TableCell>
            <TableCell>
              <TextField
                inputProps={{
                  style: {
                    padding: 0,
                    fontSize:'22px',

                  },
                }}
                onChange={(e) => {
                  updateHandler(e.target.value, "heart_rate",patient,change,setDialog)
                }}
                defaultValue={patient.heart_rate}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Spo2</TableCell>
            <TableCell>
              <TextField
                inputProps={{
                  style: {
                    padding: 0,
                    fontSize:'22px',

                  },
                }}
                onChange={(e) => {
                  updateHandler(e.target.value, "spo2",patient,change,setDialog)
                }}
                defaultValue={patient.spo2}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>RBS</TableCell>
            <TableCell>
              <TextField
                inputProps={{
                  style: {
                    padding: 0,
                    fontSize:'22px',

                  },
                }}
                onChange={(e) => {
                  updateHandler(e.target.value, "rbs",patient,change,setDialog)
                }}
                defaultValue={patient.rbs}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default VitalSigns;
