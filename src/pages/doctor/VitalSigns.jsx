import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import axiosClient from "../../../axios-client";
import { updateHandler } from "../constants";

function VitalSigns({ patient, setDialog, change }) {

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
            <TableCell>Blood Pressure</TableCell>
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
