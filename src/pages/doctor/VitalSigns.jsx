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

function VitalSigns({ patient, setDialog, change }) {
  const updateHandler = (e, colName) => {
    axiosClient
      .patch(`patients/${patient.id}`, {
        [colName]: e.target.value,
      })
      .then(({ data }) => {
        console.log(data);
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
                    fontSize:'28px',
                    padding: 0,
                    minWidth: "66px",
                  },
                }}
                onChange={(e) => {
                  updateHandler(e, "bp");
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
                    fontSize:'28px',

                  },
                }}
                onChange={(e) => {
                updateHandler(e, "temp");
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
                    fontSize:'28px',

                  },
                }}
                onChange={(e) => {
                  updateHandler(e,'weight')
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
                    fontSize:'28px',

                  },
                }}
                onChange={(e) => {
                    updateHandler(e, "height")
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
                    fontSize:'28px',

                  },
                }}
                onChange={(e) => {
                  updateHandler(e, "heart_rate")
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
                    fontSize:'28px',

                  },
                }}
                onChange={(e) => {
                  updateHandler(e, "spo2")
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
                    fontSize:'28px',

                  },
                }}
                onChange={(e) => {
                  updateHandler(e, "rbs")
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
