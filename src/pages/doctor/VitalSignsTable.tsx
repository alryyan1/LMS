import React from 'react'
import {
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography,
  } from "@mui/material";
import { DoctorVisit } from '../../types/Patient';
import axiosClient from '../../../axios-client';
import dayjs from 'dayjs';

function VitalSignsTable({socket,patient,setActiveDoctorVisit,user}) {
    const updateHandler = (
        val,
        colName,
        patient: DoctorVisit,
        setActiveDoctorVisit
      ) => {
        console.log("called update handler");
        return new Promise((resolve, reject) => {
          axiosClient
            .patch(`patients/${patient.patient.id}`, {
              [colName]: val,
            })
            .then(({ data }) => {
              console.log(data, "updated patient ");
              if (data.status) {
                if (!user.doctor_id) {
                  socket.emit("patientUpdated", data.data);
                  setActiveDoctorVisit(data.data);
                }
    
                resolve(data.data);
              }
            })
    
            .catch(({ response: { data } }) => {
              console.log(data);
              (prev) => {
                return {
                  ...prev,
                  message: data.message,
                  open: true,
                  color: "error",
                };
              };
            });
        });
      };
  return (
    
     <>
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
               disabled={dayjs(patient.created_at).startOf("day").isBefore(dayjs().startOf("day"))}
                autoComplete="off"
                inputProps={{
                  style: {
                    fontSize: "22px",
                    padding: 0,
                    minWidth: "66px",
                  },
                }}
                onChange={(e) => {
                  console.log(patient.id, "active doctor visit id");
                  updateHandler(
                    e.target.value,
                    "bp",
                    patient,
                    setActiveDoctorVisit
                  );
                }}
                defaultValue={patient.patient.bp}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Temperature</TableCell>
            <TableCell>
              <TextField
                             disabled={dayjs(patient.created_at).startOf("day").isBefore(dayjs().startOf("day"))}

                autoComplete="off"
                inputProps={{
                  style: {
                    padding: 0,
                    fontSize: "22px",
                  },
                }}
                onChange={(e) => {
                  updateHandler(
                    e.target.value,
                    "temp",
                    patient,
                    setActiveDoctorVisit
                  );
                }}
                defaultValue={patient.patient.temp}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Weight</TableCell>
            <TableCell>
              {" "}
              <TextField
                             disabled={dayjs(patient.created_at).startOf("day").isBefore(dayjs().startOf("day"))}

                autoComplete="off"
                inputProps={{
                  style: {
                    padding: 0,
                    fontSize: "22px",
                  },
                }}
                onChange={(e) => {
                  updateHandler(
                    e.target.value,
                    "weight",
                    patient,
                    setActiveDoctorVisit
                  );
                }}
                defaultValue={patient.patient.weight}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Height</TableCell>
            <TableCell>
              {" "}
              <TextField
                             disabled={dayjs(patient.created_at).startOf("day").isBefore(dayjs().startOf("day"))}

                autoComplete="off"
                inputProps={{
                  style: {
                    padding: 0,
                    fontSize: "22px",
                  },
                }}
                onChange={(e) => {
                  updateHandler(
                    e.target.value,
                    "height",
                    patient,
                    setActiveDoctorVisit
                  );
                }}
                defaultValue={patient.patient.height}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Pulse</TableCell>
            <TableCell>
              <TextField
                             disabled={dayjs(patient.created_at).startOf("day").isBefore(dayjs().startOf("day"))}

                autoComplete="off"
                inputProps={{
                  style: {
                    padding: 0,
                    fontSize: "22px",
                  },
                }}
                onChange={(e) => {
                  updateHandler(
                    e.target.value,
                    "heart_rate",
                    patient,
                    setActiveDoctorVisit
                  );
                }}
                defaultValue={patient.patient.heart_rate}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Spo2</TableCell>
            <TableCell>
              <TextField
                             disabled={dayjs(patient.created_at).startOf("day").isBefore(dayjs().startOf("day"))}

                autoComplete="off"
                inputProps={{
                  style: {
                    padding: 0,
                    fontSize: "22px",
                  },
                }}
                onChange={(e) => {
                  updateHandler(
                    e.target.value,
                    "spo2",
                    patient,
                    setActiveDoctorVisit
                  );
                }}
                defaultValue={patient.patient.spo2}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>RBS</TableCell>
            <TableCell>
              <TextField
                             disabled={dayjs(patient.created_at).startOf("day").isBefore(dayjs().startOf("day"))}

                autoComplete="off"
                inputProps={{
                  style: {
                    padding: 0,
                    fontSize: "22px",
                  },
                }}
                onChange={(e) => {
                  updateHandler(
                    e.target.value,
                    "rbs",
                    patient,
                    setActiveDoctorVisit
                  );
                }}
                defaultValue={patient.patient.rbs}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table> 
     </>
  )
}

export default VitalSignsTable