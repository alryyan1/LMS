import "./addPatient.css";
import { useEffect, useState } from "react";
import Patient from "./Patient";
import PatientDetail from "./PatientDetail";
import { webUrl } from "../constants";

import {
  List,
  ListItem,
  ListItemButton,
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
  Box,
  Card,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";
import AddDoctorDialog from "../Dialogs/AddDoctorDialog";
import ErrorDialog from "../Dialogs/ErrorDialog";
import MoneyDialog from "../Dialogs/MoneyDialog";
import AutocompleteResultOptions from "../../components/AutocompleteResultOptions";
import MyCheckBoxLab from "../../components/MyCheckBoxLab";
import AutocompleteSearchPatient from "../../components/AutocompleteSearchPatient";
import ResultSidebar from "./ResultSidebar";
import axios from "axios";
import printJS from "print-js";

function Result() {
  const {
    actviePatient,
    setActivePatient,
    searchByName,
    foundedPatients,
    update,
    setDialog,
  } = useOutletContext();

  console.log(searchByName, "searchByname");
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [resultUpdated, setResultUpdated] = useState(0);
  console.log(actviePatient);
  const [shift, setShift] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedReslult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log(selectedReslult, "selected result");

  const [layOut, setLayout] = useState({
    form: "1fr",
    tests: "1fr",
    testWidth: "400px",
    requestedDiv: "minmax(0,1.5fr)",
    showTestPanel: false,
    patientDetails: "0.8fr",
  });
  useEffect(() => {
    document.title = 'تنزيل النتائج';
  }, []);

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

  const setActivePatientHandler = (pat) => {
    // setSelectedTest(null)
    setSelectedResult(null);
    console.log("start active patient clicked");
    const data = shift?.patients.find((p) => p.id === pat.id);
    // axiosClient.get(`patient/${id}`).then(({data})=>{
    console.log(data, "patient from db");
    setActivePatient({ ...pat, active: true });
    setSelectedTest(pat.labrequests[0]);

    setShift((prev) => {
      return {
        ...prev,
        patients: prev.patients.map((patient) => {
          if (patient.id === pat.id) {
            console.log("founded");
            return { ...data, active: true };
          } else {
            return { ...patient, active: false };
          }
        }),
      };
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
          display: "inline-grid",
          gridTemplateColumns: `0.2fr   ${layOut.form}  0.7fr    ${layOut.requestedDiv} ${layOut.patientDetails}  0.2fr  `,
        }}
      >
        <div></div>
        <AutocompleteSearchPatient
        withTests={1}
          setActivePatientHandler={setActivePatientHandler}
        />
      </div>

      <div
        style={{
          gap: "15px",
          transition: "0.3s all ease-in-out",
          height: "80vh",
          display: "grid",
          gridTemplateColumns: `0.2fr   ${layOut.form}  0.7fr    ${layOut.requestedDiv} ${layOut.patientDetails}  0.2fr  `,
        }}
      >
        <div>
          <AddDoctorDialog />

      
        </div>
        <Card sx={{ overflow: "auto",p:1 }}  >
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
            <IconButton
            disabled={shift?.id == 1}
              onClick={() => {
                if (shift.id == 1) {
                  return;
                }

                axiosClient
                  .get(`shiftById/${shift.id - 1}`)
                  .then(({ data }) => {
                    console.log(data.data, "shift left");
                    setShift(data.data);
                  });
              }}
            >
              <ArrowBack />
            </IconButton>
            <IconButton
            disabled={shift?.id == shift?.maxShiftId}
              onClick={() => {
                // if (shift.id == 1) {
                //   return
                // }

                axiosClient
                  .get(`shiftById/${shift.id + 1}`)
                  .then(({ data }) => {
                    console.log(data.data, "shift left");
                    setShift(data.data);
                  });
              }}
            >
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
              shift?.patients
                ?.filter((patient) => patient.labrequests.length > 0)
                .map((p, i) => {
                  let unfinshed_count = 0;
                  let allResultsFinished = true;
                  p.labrequests.forEach((labRequest)=>{
                    unfinshed_count+= labRequest.unfinished_results_count.length
    
                  })
                 return <Patient
                 unfinshed_count = {unfinshed_count}
                    delay={i * 100}
                    key={p.id}
                    patient={p}
                    onClick={() => {
                      setActivePatientHandler(p);
                    }}
                  />
                }
                  
                )
            )}
          </div>
        </Card>
        <Card sx={{height: "80vh", overflow: "auto" }} >
          {console.log(actviePatient, "activve pateint")}
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
                    secondaryAction={
                      <MyCheckBoxLab id={test.id} hideTest={test.hidden} />
                    }
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
                       
                      }}
                    >
                      <ListItemText primary={test.main_test.main_test_name} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Card>
        <Card sx={{height: "80vh", overflow: "auto",p:1 }}  key={selectedTest?.id + resultUpdated} >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell width="80%">Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedTest &&
                selectedTest.requested_results.map((req,i) => {
                  console.log(selectedTest, "req result in table");
                  return (
                    <TableRow key={req.id}>
                      <TableCell sx={{ p: 0.5 }}>
                        {req.child_test.child_test_name}
                      </TableCell>
                      <TableCell sx={{ p: 0.5 }}>
                        <AutocompleteResultOptions
                         index={i}
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
          {selectedReslult && (
            <Box key={selectedReslult.id} sx={{ p: 1, mt: 1 }}>
              <Typography>Normal Range</Typography>
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
        </Card>

        <div>
          {/** add card using material   */}
          {actviePatient && (
            <div>
              {" "}
              <PatientDetail
                key={actviePatient.id}
                patient={actviePatient}
                setShift={setShift}
              />
              <Stack>
                <Button sx={{mb:1}}
                  disabled={actviePatient.result_is_locked == 1}
                  href={`${webUrl}result?pid=${actviePatient.id}`}
                  variant="contained"
                >
                  print
                </Button>
                <Button
                  disabled={actviePatient.result_is_locked == 1}
                  onClick={()=>{
                    const form = new URLSearchParams()
                    axiosClient.get(`result?pid=${actviePatient.id}&base64=1`).then(({data})=>{
                    form.append('data',data)
                    console.log(data,'daa')
                    printJS({
                      printable:data.slice(data.indexOf('JVB')),
                      base64:true,
                      type:'pdf'
                    });

                    // fetch('http://127.0.0.1:3000/',{
                    //   method: 'POST',
                    //   headers: { "Content-Type": "application/x-www-form-urlencoded" },

                    //   body: form
                    // }).then((res)=>{
                      
                    //   });
                    })
                  }}
                  variant="contained"
                >
                  print direct
                </Button>
              </Stack>
            </div>
          )}
          {!actviePatient && foundedPatients.length > 0 && (
            <Slide direction="up" in mountOnEnter unmountOnExit></Slide>
          )}
        </div>
        <ResultSidebar
            actviePatient={actviePatient}
            loading={loading}
            selectedTest={selectedTest}
            setActivePatient={setActivePatient}
            setDialog={setDialog}
            setLoading={setLoading}
            setResultUpdated={setResultUpdated}
            setSelectedTest={setSelectedTest}
          />
        <MoneyDialog />
        <ErrorDialog />
      </div>
    </>
  );
}

export default Result;
