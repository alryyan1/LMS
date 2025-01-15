import "./addPatient.css";
import Patient from "./Patient";
import PatientDetail from "./PatientDetail";
import { newImage, notifyMe, updateHandler, webUrl } from "../constants";

import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
  Skeleton,
  Button,
  Card,
  Typography,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import axiosClient from "../../../axios-client";
import AddDoctorDialog from "../Dialogs/AddDoctorDialog";
import MyCheckBoxLab from "../../components/MyCheckBoxLab";
import AutocompleteSearchPatient from "../../components/AutocompleteSearchPatient";
import ResultSidebar from "./ResultSidebar";
import printJS from "print-js";
import ResultSection from "./ResultSection";
import { LoadingButton } from "@mui/lab";
import { socket } from "../../socket";
import urgentSound from "../../assets/sounds/urgent.mp3";
import useResult from "./useResult";
import { ResultProps } from "../../types/CutomTypes";
import { DoctorShift, DoctorVisit } from "../../types/Patient";
import { Shift } from "../../types/Shift";
import { useOutletContext } from "react-router-dom";
import ShiftNav from "./ShiftNav";
import { useState } from "react";
import dayjs from "dayjs";
import LabHistory from "./LabHistory";
function Result() {
  const {
    shift,
    layOut,
    setActivePatientHandler,
    audioRef,
    loading,
    patientsLoading,
    resultUpdated,
    selectedTest,
    isConnected,
    setShift,
    setLoading,
    setResultUpdated,
    setSelectedTest,
    actviePatient,
    selectedReslult,
    setActivePatient,
    setSelectedResult,
    patients,
    setPatients,
    showSearch,
  } = useResult();
  console.log(selectedTest,'selected Test')
  const shiftDate = new Date(Date.parse(shift?.created_at));
  return (
    <>
      <Stack className="mb-4" direction={"row"} gap={1}>
        <div>
          {actviePatient && (
              <LabHistory
                setActiveDoctorVisit={setActivePatientHandler}
                doctorVisit={actviePatient}
              />
          
          )}
        </div>
        {
          <AutocompleteSearchPatient
            labOnlyPatients={true}
            focusPaitent={setActivePatientHandler}
          />
        }
      </Stack>
      <audio hidden ref={audioRef} controls src={urgentSound}></audio>
      <div
        style={{
          userSelect: "none",
          gap: "15px",
          transition: "0.3s all ease-in-out",
          height:`${ window.innerHeight - 90}px`,
          display: "grid",
          gridTemplateColumns: ` ${layOut.form}  0.7fr    ${layOut.requestedDiv} ${layOut.patientDetails}  0.2fr  `,
        }}
      >
     
        <Card sx={{ overflow: "auto", p: 1 }}>
          <Stack justifyContent={"space-around"} direction={"row"}>
            <div>
              {shift &&
                shiftDate.toLocaleTimeString("en-Eg", {
                  hour12: true,
                  hour: "numeric",
                  minute: "numeric",
                })}
            </div>
            <div>
              {
                shift?.patients?.filter(
                  (patient) => patient.patient.labrequests.length > 0
                ).length
              }
            </div>
            <div>
              {shift &&
                shiftDate.toLocaleDateString("en-Eg", {
                  weekday: "long",
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
            </div>
          </Stack>
          <ShiftNav
            setPatients={setPatients}
            shift={shift}
            setShift={setShift}
          />
          <Divider></Divider>
          <div className="patients">
            {patientsLoading ? (
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={"100%"}
                height={400}
              />
            ) : (
              patients
                ?.filter((patient) => patient.patient.labrequests.length > 0)
                .map((p, i) => {
                  let unfinshed_count = 0;
                  let allResultsFinished = true;
                  p.patient.labrequests.forEach((labRequest) => {
                    unfinshed_count +=
                      labRequest.unfinished_results_count.length;
                  });
                  return (
                    <Patient
                      actviePatient={actviePatient}
                      unfinshed_count={unfinshed_count}
                      delay={i * 100}
                      key={p.id}
                      patient={p}
                      onClick={() => {
                        // setActivePatient(p);
                        setActivePatientHandler(p);
                      }}
                    />
                  );
                })
            )}
          </div>
        </Card>
        <Card sx={{ overflow: "auto",'direction':'rtl' }}>
          <List style={{direction:'rtl'}}>
            {actviePatient?.patient.labrequests.map((test) => {
              return (
                <ListItem title={test.is_paid ? '': "غير مدفوع"}
                  onClick={() => {
                    setSelectedTest(test);
                    setSelectedResult(null);
                  }}
                  style={
                    selectedTest && selectedTest.id == test.id
                      ? {
                          backgroundColor: "lightblue",
                        }
                      : null
                  }
                  sx={{
                    cursor: "pointer",
                    border:!test.is_paid ? '1px dashed red':'',
                    "&:hover": {
                      backgroundColor: "lightblue",
                      color: "white",
                    },
                  }}
                  secondaryAction={
                    <MyCheckBoxLab 
                     disabled={!test.is_paid}
                      setActivePatient={setActivePatient}
                      id={test.id}
                      hideTest={!test.is_paid ? true : test.hidden}
                    />
                  }
                  key={test.id}
                >
                  <ListItemText primary={test.main_test.main_test_name} />
                </ListItem>
              );
            })}
          </List>
        </Card>
        <Card key={actviePatient?.id} sx={{  overflow: "auto", p: 1 }}>
          {actviePatient &&(
            <ResultSection
              patient={actviePatient}
              selectedReslult={selectedReslult}
              selectedTest={selectedTest}
              setActivePatient={setActivePatient}
              setSelectedResult={setSelectedResult}
              resultUpdated={resultUpdated}
            />
          )}
        </Card>

        <div>
          {/** add card using material   */}
          {actviePatient && (
            <div style={{width:'300px'}}>
              {" "}
              <PatientDetail key={actviePatient.id} patient={actviePatient} />
              <Stack>
                {/* <Button
                  sx={{ mb: 1 }}
                  disabled={actviePatient.patient.result_is_locked == 1}
                  href={`${webUrl}result?pid=${actviePatient.id}`}
                  variant="contained"
                >
                  print
                </Button> */}
                {actviePatient.patient.result_auth ? (
                  <Button
                    sx={{ mt: 1 }}
                    onClick={() => {
                      actviePatient.patient.labrequests.map((lr) => {
                        lr.requested_results.map((req) => {
                          if (req.child_test != null) {
                            const low = Number(req.child_test.lowest);
                            const max = Number(req.child_test.max);
                            const result = Number(req.result);

                            if (low > 0 && max > 0) {
                              if (result < low || result > max) {
                                alert(
                                  `abnormal result for  ${req.child_test.child_test_name} `
                                );
                              }
                            }
                          }
                        });
                      });
                      const form = new URLSearchParams();
                      axiosClient
                        .get(`result?pid=${actviePatient.id}&base64=1`)
                        .then(({ data }) => {
                          form.append("data", data);

                          printJS({
                            printable: data.data.slice(data.data.indexOf("JVB")),
                            base64: true,
                            type: "pdf",
                          });

                        setActivePatient(data.patient)                          

                          // fetch('http://127.0.0.1:3000/',{
                          //   method: 'POST',
                          //   headers: { "Content-Type": "application/x-www-form-urlencoded" },

                          //   body: form
                          // }).then((res)=>{

                          //   });
                        });
                    }}
                    variant="contained"
                  >
                    print
                  </Button>
                ) : (
                  <LoadingButton
                    loading={loading}
                    onClick={() => {
                      //authentication event
                      setLoading(true);
                      updateHandler(
                        1,
                        "result_auth",
                        actviePatient,
                        setActivePatient
                      ).then((data) => {
                        console.log("after update", data);
                        setActivePatient(data);
                        setLoading(false);
                      });
                    }}
                    sx={{ mt: 1 }}
                    color="warning"
                    variant="contained"
                  >
                    Authenticate
                  </LoadingButton>
                )}
              </Stack>
            </div>
          )}
        </div>
        <ResultSidebar
          socket={socket}
          //  key={actviePatient?.id}
          isConnected={isConnected}
          setShift={setShift}
          actviePatient={actviePatient}
          loading={loading}
          selectedTest={selectedTest}
          setActivePatient={setActivePatient}
          setLoading={setLoading}
          setResultUpdated={setResultUpdated}
          setSelectedTest={setSelectedTest}
        />
      </div>
    </>
  );
}

export default Result;
