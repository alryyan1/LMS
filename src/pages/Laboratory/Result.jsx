import "./addPatient.css";
import { useEffect, useState } from "react";
import Patient from "./Patient";
import PatientDetail from "./PatientDetail";
import { webUrl } from "../constants";

import {
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Stack,
  Skeleton,
  Slide,
  Button,
  Card,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";
import AddDoctorDialog from "../Dialogs/AddDoctorDialog";
import ErrorDialog from "../Dialogs/ErrorDialog";
import MoneyDialog from "../Dialogs/MoneyDialog";
import MyCheckBoxLab from "../../components/MyCheckBoxLab";
import AutocompleteSearchPatient from "../../components/AutocompleteSearchPatient";
import ResultSidebar from "./ResultSidebar";
import printJS from "print-js";
import ResultSection from "./ResultSection";
import { LoadingButton } from "@mui/lab";

function Result() {
  const {
    actviePatient,
    setActivePatient,
    searchByName,
    foundedPatients,
    update,
    setUpdate,
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
    // setSelectedResult(null)
    setSelectedResult(null);
    console.log("start active patient clicked");
    const data = shift?.patients.find((p) => p.id === pat.id);
    // axiosClient.get(`patient/${id}`).then(({data})=>{
    console.log(data, "patient from db");
    // alert(shift.id)
    if (pat.shift_id == shift.maxShiftId) {
        axiosClient.get(`shift/last`).then(({ data: data }) => {
      console.log(data.data, "today patients");
      //add activeProperty to patient object
      data.data.patients.forEach((patient) => {
        patient.active = false;
      });
      setShift(data.data);
      setPatientsLoading(false);
    });
    }
  
    setActivePatient({ ...pat, active: true });
    setSelectedTest(pat.labrequests[0]);
    
  
  };
  const shiftDate = new Date(Date.parse(shift?.created_at));
  return (
    <>
      <div
        style={{
          gap: "15px",
          transition: "0.3s all ease-in-out",
          display: "inline-grid",
          gridTemplateColumns: `0.1fr   ${layOut.form}  0.7fr    ${layOut.requestedDiv} ${layOut.patientDetails}  0.1fr  `,
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
            <LoadingButton
            loading={loading}
            disabled={shift?.id == 1}
              onClick={() => {
                if (shift.id == 1) {
                  return;
                }
                setLoading(true)
                axiosClient
                  .get(`shiftById/${shift.id - 1}`)
                  .then(({ data }) => {
                    console.log(data.data, "shift left");
                    setShift(data.data);
                  }).finally(()=>setLoading(false));
              }}
            >
              <ArrowBack />
            </LoadingButton>
            <LoadingButton
            loading={loading}
            disabled={shift?.id == shift?.maxShiftId}
              onClick={() => {
                // if (shift.id == 1) {
                //   return
                // }
                setLoading(true)
                axiosClient
                  .get(`shiftById/${shift.id + 1}`)
                  .then(({ data }) => {
                    console.log(data.data, "shift left");
                    setShift(data.data);
                  }).finally(()=>setLoading(false));
              }}
            >
              <ArrowForward />
            </LoadingButton>
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
                ?.filter((patient) => patient.labrequests.length > 0).reverse()
                .map((p, i) => {
                  let unfinshed_count = 0;
                  let allResultsFinished = true;
                  p.labrequests.forEach((labRequest)=>{
                    unfinshed_count+= labRequest.unfinished_results_count.length
    
                  })
                 return <Patient
                 actviePatient={actviePatient}
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
        <Card sx={{height: "80vh", overflow: "auto"}} >
          {console.log(actviePatient, "activve pateint")}
          {actviePatient && actviePatient.labrequests.length > 0 && (
            <List  sx={{direction:'ltr'}}>
              {actviePatient.labrequests.map((test) => {
                return (
                  <ListItem
                  onClick={() => {
                    setSelectedTest(test);
                    setSelectedResult(null);
                    console.log(test, "selected test");
                  }}
                  style={selectedTest && selectedTest.id == test.id
                    ? {
                        backgroundColor: 'lightblue'
                      }
                    : null}
                    sx={{
                      cursor:'pointer',
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
                      <ListItemText primary={test.main_test.main_test_name} />
                  </ListItem>
                );
              })}
            </List>
          )}
        </Card>
        <Card sx={{height: "80vh", overflow: "auto",p:1 }}  key={selectedTest?.id + resultUpdated} >
         {actviePatient && <ResultSection selectedReslult={selectedReslult} selectedTest={selectedTest} setActivePatient={setActivePatient} setSelectedResult={setSelectedResult} setShift={setShift} />}
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
                {/* <Button sx={{mb:1}}
                  disabled={actviePatient.result_is_locked == 1}
                  href={`${webUrl}result?pid=${actviePatient.id}`}
                  variant="contained"
                >
                  print
                </Button> */}
                <Button
                
                sx={{mt:1}}
                  disabled={actviePatient.result_is_locked == 1 || actviePatient.is_lab_paid == 0}
                  onClick={()=>{

                     actviePatient.labrequests.map((lr)=>{
                       lr.requested_results.map((req)=>{
                        if (req.child_test != null) {
                          const low = Number( req.child_test.lowest)
                          const max =  Number(req.child_test.max)
                          const result =  Number(req.result)
                          console.log(low)
                          console.log(max)
                          if (low > 0 && max > 0) {
                             if (result < low || result > max) {
                               alert(`abnormal result for  ${req.child_test.child_test_name} `)
                             }
                          }
                        }
                       
                       })
                     })
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
                  print 
                </Button>
              </Stack>
            </div>
          )}
          {!actviePatient && foundedPatients.length > 0 && (
            <Slide direction="up" in mountOnEnter unmountOnExit></Slide>
          )}
        </div>
        <ResultSidebar
        setShift={setShift}
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
