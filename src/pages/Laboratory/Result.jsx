import "./addPatient.css";
import { useEffect, useState } from "react";
import Patient from "./Patient";
import PatientDetail from "./PatientDetail";
import { Item, webUrl } from "../constants";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Stack,
  Skeleton,
  Slide,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  Download,
  FilterTiltShift,
  FormatListBulleted,
} from "@mui/icons-material";
import { Link, useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";
import AddDoctorDialog from "../Dialogs/AddDoctorDialog";
import ErrorDialog from "../Dialogs/ErrorDialog";
import MoneyDialog from "../Dialogs/MoneyDialog";
import AutocompleteResultOptions from "../../components/AutocompleteResultOptions";
import MyCheckBoxLab from "../../components/MyCheckBoxLab";
import { LoadingButton } from "@mui/lab";

function Result() {
  const {
    actviePatient,
    setActivePatient,
    setOpen,
    searchByName,
    foundedPatients,
    update,
    setDialog
  } = useOutletContext();

  console.log(searchByName, "searchByname");
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [resultUpdated, setResultUpdated] = useState(0);
  console.log(actviePatient);
  const [shift, setShift] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedReslult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log(selectedReslult,'selected result')
  
  const [layOut, setLayout] = useState({
    form: "1fr",
    tests: "1fr",
    testWidth: "400px",
    requestedDiv: "minmax(0,1.5fr)",
    showTestPanel: false,
    patientDetails: "0.8fr",
  });


  useEffect(() => {
    setPatientsLoading(true);
    axiosClient.get(`shift/last`).then(({ data: data }) => {
      console.log(data.data, "today patients");
      //add activeProperty to patient object
      data.data.patients.forEach((patient) => {
        patient.active = false;
      });
      setShift(data.data);
      setPatientsLoading(false);

    });
  }, [update]);
  console.log(shift, "selected shift");

  const setActivePatientHandler = (id) => {
    setSelectedTest(null)
    setSelectedResult(null)
    console.log("start active patient clicked");
    const data = shift?.patients.find((p) => p.id === id);
    // axiosClient.get(`patient/${id}`).then(({data})=>{
    console.log(data, "patient from db");
    setActivePatient({ ...data, active: true });
    setShift((prev) => {
      return {...prev,patients:prev.patients.map((patient) => {
        if (patient.id === id) {
          console.log("founded");
          return { ...data, active: true };
        } else {
          return { ...patient, active: false };
        }
      })}
    });
    //}//).catch((error)=>console.log(error))
    // setActivePatient({...foundedPatient,active:true});
  };
  const shiftDate = new Date(Date.parse(shift?.created_at));
  return (
    <>
      <div
        style={{
          gap: "15px",
          transition: "0.3s all ease-in-out",
          height: "90vh",
          display: "grid",
          gridTemplateColumns: `0.1fr   ${layOut.form}  0.7fr    ${layOut.requestedDiv} ${layOut.patientDetails}    `,
        }}
      >
        <div>
          <AddDoctorDialog />
          123

          <Stack
            sx={{ mr: 1 }}
            gap={"5px"}
            divider={<Divider orientation="vertical" flexItem />}
            direction={"column"}
          >
            <Item>
            <IconButton
            size="small"
                
                variant="contained"
              >
                <FilterTiltShift />
              </IconButton>
            </Item>
               
  
            {selectedTest && (
                <LoadingButton
                size="small"
                 loading={loading}
                  onClick={() => {
                    setLoading(true)
                    axiosClient
                      .post(`requestedResult/default/${selectedTest.id}`)
                      .then(({ data }) => {
                        console.log(data, "labrequest data");
                        setSelectedTest((prev) => {
                          console.log(prev, "previous selected test");
                          return data.patient.labrequests.find((labr)=>labr.id == prev.id)
                        });
                        setResultUpdated((prev) => {
                          return prev + 1;
                        });
                        setActivePatient(data.patient)
                        ?.map((prev) => {
                          return prev.map((patient) => {
                            if (patient.id === actviePatient.id) {
                              return {
                                ...data.patient,
                                active:true
                              };
                            }
                            return patient;
                          });
                        });
                      }).finally(()=>
                      setLoading(false));
                  }}
                  variant="contained"
                >
                  <Download />
                </LoadingButton>
            )}
               {selectedTest?.main_test_id == 1 && (
                <LoadingButton
                size="small"
                loading={loading}
                  onClick={() => {
                    setLoading(true)
                    axiosClient
                      .post(`populatePatientCbcData/${actviePatient.id}`)
                      .then(({ data }) => {
                        if(data.status == false){
                          setDialog((prev)=>{
                            return {
                             ...prev,
                              open:true,
                              color:'error',
                              message:data.message
                            }
                          })


                          return
                        }
                        if(data.status)
                          {
                            console.log(data,'patient cbc')
                            setSelectedTest((prev) => {
                              console.log(prev, "previous selected test");
                              return data.patient.labrequests.find((labr)=>labr.id == prev.id)
                            });
                            setResultUpdated((prev) => {
                              return prev + 1;
                            });
                            setActivePatient(data.patient)
                            ?.map((prev) => {
                              return prev.map((patient) => {
                                if (patient.id === actviePatient.id) {
                                  return {
                                    ...data.patient,
                                    active:true
                                  };
                                }
                                return patient;
                              });
                            });
                          }
                    
                       
                      }).finally(()=> 
                      setLoading(false));
                  }}
                  variant="contained"
                >
                  <FormatListBulleted />
                </LoadingButton>
            )}
          </Stack>
        </div>
        <Paper style={{ overflow: "auto" }} sx={{ p: 1 }}>
          <Stack justifyContent={"space-around"} direction={"row"}>
            <div>
              {shift &&
                shiftDate.toLocaleTimeString("ar-Eg", {
                  hour12: true,
                  hour: "numeric",
                  minute: "numeric",
                })}
            </div>
            <div>
              {shift &&
                shiftDate.toLocaleDateString("ar-Eg", {
                  weekday: "long",
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
            </div>
          </Stack>
          <Stack justifyContent={"space-around"} direction={"row"}>
            <IconButton  onClick={()=>{
              if (shift.id == 1) {
                return 
              }

              axiosClient.get(`shiftById/${shift.id - 1}`).then(({data})=>{
                console.log(data.data,'shift left')
                setShift(data.data)
              })
            }} >
              <ArrowBack />
            </IconButton>
            <IconButton onClick={()=>{
              // if (shift.id == 1) {
              //   return 
              // }

              axiosClient.get(`shiftById/${shift.id + 1}`).then(({data})=>{
                console.log(data.data,'shift left')
                setShift(data.data)
              })
            }}>
              <ArrowForward />
            </IconButton>
          </Stack>
          <Divider></Divider>
          <div className="patients" style={{ padding: "15px" }}>
            {patientsLoading ? (
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={"100%"}
                height={400}
              />
            ) : (
              shift?.patients?.filter((patient) => patient.labrequests.length > 0)
                .map((p, i) => (
                  <Patient
                    delay={i * 100}
                    key={p.id}
                    patient={p}
                    onClick={setActivePatientHandler}
                  />
                ))
            )}
          </div>
        </Paper>
        <Paper style={{ height: "85vh", overflow: "auto" }}>
          {actviePatient && actviePatient.labrequests.length > 0 && (
            <List>
              {actviePatient.labrequests.map((test) => {
                return (
                  <ListItem
                    sx={{
                      "&:hover": {
                        backgroundColor: "lightblue",
                        color: "white",
                      },
                    }}
                    secondaryAction={<MyCheckBoxLab id={test.id} hideTest={test.hidden} />}
                    key={test.main_test.id}
                  >
                    <ListItemButton
                      sx={
                        selectedTest && selectedTest.id == test.id
                          ? {
                              backgroundColor: (theme) =>
                                theme.palette.primary.main,
                            }
                          : null
                      }
                      onClick={() => {
                        setSelectedTest(test);
                        console.log(test, "selected test");
                      }}
                      style={{
                        marginBottom: "2px",
                        color: "black",
                      }}
                    >
                      <ListItemText primary={test.main_test.main_test_name} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Paper>
        <Paper>
          <Table  key={selectedTest?.id + resultUpdated} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell width="80%">Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedTest &&
                selectedTest.requested_results.map((req) => {
                  console.log(selectedTest, "req result in table");
                  return (
                    <TableRow key={req.id}>
                      <TableCell sx={{p:0.5}}>{req.child_test.child_test_name}</TableCell>
                      <TableCell sx={{p:0.5}}>
                        <AutocompleteResultOptions
                        setShift={setShift}
                        setActivePatient={setActivePatient}
                        setSelectedResult={setSelectedResult}
                          result={req.result}
                          id={req.id}
                          req={req}
                          child_test={req.child_test}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          {
            selectedReslult && <Paper sx={{p:1}}>
              <Typography>Normal Range</Typography>
              <TextField onChange={(val)=>{
                axiosClient.patch(`requestedResult/normalRange/${selectedReslult.id}`,{val:val.target.value})
              }} multiline fullWidth defaultValue={selectedReslult.normal_range}/>
            </Paper>
          }
        </Paper>

        <div>
          {/** add card using material   */}
          {actviePatient && (
           <div> <PatientDetail
              key={actviePatient.id}
              patient={actviePatient}
              setShift={setShift}
            />
             <Stack>
                <Button href={`${webUrl}result?pid=${actviePatient.id}`} variant="contained">print</Button>
                </Stack>
            </div>
           
          )}
          {!actviePatient && foundedPatients.length > 0 && (
            <Slide direction="up" in mountOnEnter unmountOnExit></Slide>
          )}
        </div>
        <MoneyDialog />
        <ErrorDialog />
      </div>
    </>
  );
}

export default Result;
