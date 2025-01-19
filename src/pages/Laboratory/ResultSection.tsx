import {
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  Stack,
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
import React, { useEffect, useState } from "react";
import AutocompleteResultOptions from "../../components/AutocompleteResultOptions";
import OrganismPanel from "./OrganismPanel";
import axiosClient from "../../../axios-client";
import { DoctorVisit, Labrequest, RequestedResult } from "../../types/Patient";
import EmptyDialog from "../Dialogs/EmptyDialog";
import DeviceChildNormalRange from "./DeviceChildNormalRange";
interface ResultSectionProps {
  selectedTest: Labrequest;
  setSelectedResult: (prev: any) => void;
  selectedReslult: RequestedResult;
  disabled: boolean;
  resultUpdated: number;
  setActivePatient: (patient: DoctorVisit) => void;
  is_doctor: boolean; // true for doctor, false for patient
}
function ResultSection({
  selectedTest,
  setSelectedResult,
  selectedReslult,
  disabled = false,
  is_doctor = false,
  setActivePatient,
  resultUpdated,
  patient,
  handleKeyDown,
  setResultUpdated,
  addRef,
}: ResultSectionProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [devices, setDivices] = useState([]);
  const [deviceName, setDeviceName] = useState("");
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceNormalRange, setDeviceNormalRange] = useState('');

  useEffect(() => {
    axiosClient("devices").then(({ data }) => {
      setDivices(data);
    });
  }, []);
  return (
    <>
      <Tabs
        sx={{ mb: 1 }}
        textColor="secondary"
        indicatorColor="secondary"
        value={value}
        onChange={handleChange}
        variant="standard"
      >
        <Tab label="Main"></Tab>
        <Tab label="Other"></Tab>
      </Tabs>
      <div
        key={patient.id}
        role="tabpanel"
        hidden={value !== 0}
        id={`simple-tabpanel-${0}`}
        aria-labelledby={`simple-tab-${0}`}
      >
        {value === 0 && (
          <>
            <Table
              style={{ direction: "ltr" }}
              className="table-small"
              key={resultUpdated + selectedTest?.id}
              size="small"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell width="70%">Result</TableCell>
                  {/* <TableCell>Normal Range</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedTest &&
                  selectedTest.requested_results.map((req, i) => {
                    if (req.child_test == null) {
                      return;
                    }
                    const low = Number(req.child_test.lowest);
                    const max = Number(req.child_test.max);
                    const result = Number(req.result);
                    let type = "";
                    if (result != "") {
                      if (low > 0 && max > 0) {
                        if (result < low || result > max) {
                          // alert('err')
                          type = "error";
                        }
                      }
                    }

                    return (
                      <TableRow>
                        <TableCell
                          className=""
                          sx={{
                            p: 0.5,
                            textAlign: "right",
                            backgroundColor: (theme) =>
                              type == "error" ? theme.palette.error.light : "",
                          }}
                        >
                          {req.child_test?.child_test_name}
                        </TableCell>
                        <TableCell sx={{ p: 0.5 }}>
                          {is_doctor ? (
                            <Typography textAlign={"center"}>
                              {req.result}
                            </Typography>
                          ) : (
                            <AutocompleteResultOptions
                              handleKeyDown={handleKeyDown}
                              addRef={addRef}
                              setActivePatient={setActivePatient}
                              disabled={disabled}
                              type={type}
                              index={i}
                              setSelectedDevice={setSelectedDevice}
                              setSelectedResult={setSelectedResult}
                              result={req.result}
                              id={req.id}
                              req={req}
                              child_test={req.child_test}
                            />
                          )}
                        </TableCell>
                        {/* <TableCell sx={{ p: 0.5 }}> */}
                        {/* {req.normal_range} */}
                        {/* </TableCell> */}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            {selectedReslult && (
              <Box key={selectedReslult.id} sx={{ p: 1, mt: 1 }}>
                <Button
                  onClick={() => {
                    setShow(true);
                  }}
                >
                  Normal Range
                </Button>
                <TextField
                  onChange={(val) => {
                    axiosClient.patch(
                      `requestedResult/normalRange/${selectedReslult.id}`,
                      { val: val.target.value }
                    );
                  }}
                  multiline
                  fullWidth
                  defaultValue={selectedReslult.normal_range}
                />
              </Box>
            )}
            <Divider />

            {selectedTest && (
              <Box sx={{ p: 1, mt: 1 }}>
                <Typography>Comment</Typography>
                <TextField
                  onChange={(val) => {
                    axiosClient.patch(`comment/${selectedTest.id}`, {
                      val: val.target.value,
                    });
                  }}
                  multiline
                  fullWidth
                  defaultValue={selectedTest.comment}
                />
              </Box>
            )}
          </>
        )}
      </div>
      <div
        role="tabpanel"
        hidden={value !== 1}
        id={`simple-tabpanel-${1}`}
        aria-labelledby={`simple-tab-${1}`}
      >
        {value === 1 && (
          <>
            {" "}
            {selectedTest && (
              <div>
                <OrganismPanel
                  setActivePatient={setActivePatient}
                  selectedTest={selectedTest}
                ></OrganismPanel>
              </div>
            )}
          </>
        )}
      </div>
      {selectedReslult && (
        <EmptyDialog show={show} setShow={setShow}>
          <Stack  gap={2} direction={"row"}>
            
              {selectedDevice &&  <DeviceChildNormalRange setDeviceNormalRange={setDeviceNormalRange} deviceNormalRange={deviceNormalRange} setResultUpdated={setResultUpdated} setShow={setShow} selectedDevice={selectedDevice} selectedReslult={selectedReslult} selectedTest={selectedTest} setLoading={setLoading}/>}
             
            
            <Stack direction="column">
              <Stack direction="column">
                <TextField
                  value={deviceName}
                  onChange={(e) => {
                    setDeviceName(e.target.value);
                  }}
                  label="اسم الجهاز"
                ></TextField>
                <Button
                  onClick={() => {
                    // setShow(false)
                    axiosClient
                      .post("devices", {
                        name: deviceName,
                      })
                      .then(({ data }) => {
                        setDivices([...devices, data]);
                        setDeviceName("");
                      });
                  }}
                >
                  حفظ
                </Button>
              </Stack>
              <Divider></Divider>
              <List>
                {devices.map((d) => {
                  return (
                    <ListItem
                      className={d.id == selectedDevice?.id ? "active" : ""}
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedDevice(d);
                        // alert(d.name)

                        axiosClient
                          .post(`deviceChildTest`, {
                            device_id: d.id,
                            child_test_id: selectedReslult.child_test_id,
                          })
                          .then(({ data }) => {
                            setDeviceNormalRange(data);
                          });
                      }}
                      key={d.id}
                    >
                      {d.name}
                    </ListItem>
                  );
                })}
              </List>
            </Stack>
          </Stack>
        </EmptyDialog>
      )}
    </>
  );
}

export default ResultSection;
