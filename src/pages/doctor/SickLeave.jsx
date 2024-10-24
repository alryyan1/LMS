import {
  Box,
  Button,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axiosClient from "../../../axios-client";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import MyDateField2 from "../../components/MyDateField2";
import { webUrl } from "../constants";

function SickLeave(props) {
  const { value, index, patient, setDialog, change, setShift,user, ...other } =
    props;
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(patient.sickleave != null);


  const updateSickleave = (e, colName) => {
    axiosClient
      .patch(`sickleave/${patient.sickleave.id}`, {
        [colName]: e.target.value,
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
  };

  const updateHandler = (e, colName) => {
    axiosClient
      .patch(`patients/${patient.id}`, {
        [colName]: e.target.value,
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
        Sick Leave
      </Divider>
      {value === index && (
        <Box sx={{ justifyContent: "space-around", m: 1 }} className="">
          <Stack direction={"row" } alignItems={'center'} gap={2} justifyContent={"space-around"}>
            <Button variant="contained">File </Button>
            <Button variant="contained">Lab </Button>
      <Button variant="contained" href={`${webUrl}attendance?pid=${patient.id}&user=${user?.id}`}>Attendance</Button>

            <LoadingButton
              loading={loading}
              disabled={patient?.sickleave != null}
              onClick={() => {
                setLoading(true);
                axiosClient
                  .post(`generateSickLeave/${patient.id}`)
                  .then(({ data }) => {
                    console.log(data);
                    if (data.status) {
                      setShow(true);
                      change(data.data);
                    }
                  })
                  .finally(() => setLoading(false));
              }}
              variant="contained"
            >
              Generate Sickleave Report
            </LoadingButton>
            
          </Stack>

          {show && (
            <div style={{ margin: "5px" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>From</TableCell>
                    <TableCell>
                      <MyDateField2
                        setDialog={setDialog}
                        colName="from"
                        label="from"
                        item={patient.sickleave}
                        path={`sickleave`}
                        val={patient.sickleave.from}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>To</TableCell>
                    <TableCell>
                      <MyDateField2
                        setDialog={setDialog}
                        colName="to"
                        label="to"
                        item={patient.sickleave}
                        path={`sickleave`}
                        val={patient.sickleave.to}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Job & Place of work</TableCell>
                    <TableCell>
                      <TextField
                      fullWidth
                        inputProps={{
                          style: {
                            padding: 0,
                          },
                        }}
                        onChange={(e) => {
                          updateSickleave(e, "job_and_place_of_work");
                        }}
                        defaultValue={patient.sickleave.job_and_place_of_work}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>O.P Department</TableCell>
                    <TableCell>
                      <TextField
                      fullWidth
                        inputProps={{
                          style: {
                            padding: 0,
                          },
                        }}
                        onChange={(e) => {
                          updateSickleave(e, "o_p_department");
                        }}
                        defaultValue={patient.sickleave.o_p_department}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Hospital No</TableCell>
                    <TableCell>
                      <TextField
                      fullWidth
                        inputProps={{
                          style: {
                            padding: 0,
                          },
                        }}
                        onChange={(e) => {
                          updateSickleave(e, "hospital_no");
                        }}
                        defaultValue={patient.sickleave.hospital_no}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
      <Button sx={{m:1}} variant="contained" href={`${webUrl}sickleave?pid=${patient.id}&user=${user?.id}`}>PDF</Button>

            </div>
          )}
        </Box>
      )}
    </div>
  );
}

export default SickLeave;
