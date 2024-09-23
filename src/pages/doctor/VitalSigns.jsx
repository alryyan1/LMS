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
            <TableCell>
              <TextField
                inputProps={{
                  style: {
                    padding: 0,
                    minWidth: "66px",
                  },
                }}
                onChange={(e) => {
                  axiosClient
                    .patch(`patients/${patient.id}`, {
                      bp: e.target.value,
                    })
                    .then(({ data }) => {
                      console.log(data);
                      if (data.status) {
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
                  },
                }}
                onChange={(e) => {
                  axiosClient
                    .patch(`patients/${patient.id}`, {
                      temp: e.target.value,
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
                  },
                }}
                onChange={(e) => {
                  axiosClient
                    .patch(`patients/${patient.id}`, {
                      weight: e.target.value,
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
                  },
                }}
                onChange={(e) => {
                  axiosClient
                    .patch(`patients/${patient.id}`, {
                      height: e.target.value,
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
                  },
                }}
                onChange={(e) => {
                  axiosClient
                    .patch(`patients/${patient.id}`, {
                      heart_rate: e.target.value,
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
                  },
                }}
                onChange={(e) => {
                  axiosClient
                    .patch(`patients/${patient.id}`, {
                      spo2: e.target.value,
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
                }}
                defaultValue={patient.spo2}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default VitalSigns;
