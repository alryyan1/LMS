import {
  Box,
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
import PatientEditSelect from "./PatientEditSelect";

function GeneralExaminationPanel(props) {
  const { value, index, patient, setDialog,setActivePatient,setShift, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
        <Divider sx={{mb:1}} variant="middle">General Examination</Divider>
      {value === index && (
        <Box sx={{ justifyContent: "space-around" }} className="group">
          <Stack direction={"row"} gap={2} justifyContent={"space-around"}>
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
                      onChange={(e) => {
                        axiosClient
                          .patch(`patients/${patient.id}`, {
                            bp: e.target.value,
                          })
                          .then(({ data }) => {
                            console.log(data);
                            if (data.status) {

                              setActivePatient((prev) => {
                                return {...prev, patient: data.patient };
                              });
                              setShift((prev)=>{
                                return {...prev, visits:prev.visits.map((v)=>{
                                  if(v.patient_id === patient.id){
                                    return {...v,patient:data.patient}
                                  }
                                  return v;
                                })}
                              })
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
                      onChange={(e) => {
                        axiosClient
                          .patch(`patients/${patient.id}`, {
                            temp: e.target.value,
                          })
                          .then(({ data }) => {
                            console.log(data);
                            if (data.status) {
                              setActivePatient((prev) => {
                                return {...prev, patient: data.patient };
                              });
                              setShift((prev)=>{
                                return {...prev, visits:prev.visits.map((v)=>{
                                  if(v.patient_id === patient.id){
                                    return {...v,patient:data.patient}
                                  }
                                  return v;
                                })}
                              })
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
                  <TableCell>      <TextField
                      onChange={(e) => {
                        axiosClient
                          .patch(`patients/${patient.id}`, {
                            weight: e.target.value,
                          })
                          .then(({ data }) => {
                            console.log(data);
                            if (data.status) {
                              setActivePatient((prev) => {
                                return {...prev, patient: data.patient };
                              });
                              setShift((prev)=>{
                                return {...prev, visits:prev.visits.map((v)=>{
                                  if(v.patient_id === patient.id){
                                    return {...v,patient:data.patient}
                                  }
                                  return v;
                                })}
                              })
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
                    /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Height</TableCell>
                  <TableCell>   <TextField
                      onChange={(e) => {
                        axiosClient
                          .patch(`patients/${patient.id}`, {
                            height: e.target.value,
                          })
                          .then(({ data }) => {

                            console.log(data);
                            if (data.status) {
                              setActivePatient((prev) => {
                                return {...prev, patient: data.patient };
                              });
                              setShift((prev)=>{
                                return {...prev, visits:prev.visits.map((v)=>{
                                  if(v.patient_id === patient.id){
                                    return {...v,patient:data.patient}
                                  }
                                  return v;
                                })}
                              })
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
                    /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Juandice</TableCell>
                  <PatientEditSelect setActivePatient={setActivePatient} setShift ={setShift} colName={'juandice'} myVal={patient.juandice} patient={patient} setDialog={setDialog}/>
                </TableRow>
                <TableRow>
                  <TableCell>Pallor</TableCell>
                  <PatientEditSelect setActivePatient={setActivePatient} setShift ={setShift} colName={'pallor'} myVal={patient.pallor} patient={patient} setDialog={setDialog}/>
                </TableRow>
              </TableBody>
            </Table>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Clubbing</TableCell>
                  <PatientEditSelect setActivePatient={setActivePatient} setShift ={setShift} colName={'clubbing'} myVal={patient.clubbing} patient={patient} setDialog={setDialog}/>
                </TableRow>
                <TableRow>
                  <TableCell>Cyanosis</TableCell>
                  <PatientEditSelect setActivePatient={setActivePatient} setShift ={setShift} colName={'cyanosis'} myVal={patient.cyanosis} patient={patient} setDialog={setDialog}/>
                </TableRow>
                <TableRow>
                  <TableCell>Edema Feet</TableCell>
                  <PatientEditSelect setActivePatient={setActivePatient} setShift ={setShift} colName={'edema_feet'} myVal={patient.edema_feet} patient={patient} setDialog={setDialog}/>
                </TableRow>
                <TableRow>
                  <TableCell>Dehydration</TableCell>
                  <PatientEditSelect setActivePatient={setActivePatient} setShift ={setShift} colName={'dehydration'} myVal={patient.dehydration} patient={patient} setDialog={setDialog}/>
                </TableRow>
                <TableRow>
                  <TableCell>Lymphadenopathy</TableCell>
                  <PatientEditSelect setActivePatient={setActivePatient} setShift ={setShift} colName={'lymphadenopathy'} myVal={patient.lymphadenopathy} patient={patient} setDialog={setDialog}/>
                </TableRow>
                <TableRow>
                  <TableCell>Peripheral pulses</TableCell>
                  <PatientEditSelect setActivePatient={setActivePatient} setShift ={setShift} colName={'peripheral_pulses'} myVal={patient.peripheral_pulses} patient={patient} setDialog={setDialog}/>
                </TableRow>
                <TableRow>
                  <TableCell>Feet ulcer</TableCell>
                  <PatientEditSelect setActivePatient={setActivePatient} setShift ={setShift} colName={'feet_ulcer'} myVal={patient.feet_ulcer} patient={patient} setDialog={setDialog}/>
                </TableRow>
              </TableBody>
            </Table>
          </Stack>
        </Box>
      )}
    </div>
  );
}

export default GeneralExaminationPanel;
