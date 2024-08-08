import { useEffect, useState } from "react";
import "../Laboratory/addPatient.css";

import { Divider, Stack, Skeleton, Card, Snackbar, Alert, List, ListItem } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import axiosClient from "../../../axios-client";
import { LoadingButton } from "@mui/lab";
import { useParams } from "react-router-dom";
import DoctorPatient from "./doctorPatient";
import PatientPanel from "./PatientPanel";
import PatientInformationPanel from "./PatientInformationPanel";
import GeneralExaminationPanel from "./generalExaminationPanel";
import PresentingComplain from "./PresentingComplain";
import PatientMedicalHistory from "./PatientMedicalHistory";
import PatientPrescribedMedsTab from "./PatientPrescribedMedsTab";
import dayjs from "dayjs";

function Doctor() {
  const [value, setValue] = useState(0);
  const [file, setFile] = useState(null);
  const [complains, setComplains] = useState([]);

  useEffect(()=>{
    // alert('start of use effect')
    axiosClient.get('complains').then(({data})=>{
      console.log(data)
      setComplains(data.map((c)=>c.name))
    })
  },[])
 
  const { id } = useParams();
  
  const [dialog, setDialog] = useState({
    showMoneyDialog: false,
    title: "",
    color: "success",
    open: false,
    openError: false,
    openLabReport: false,
    message: "تمت الاضافه بنجاح",
  });
  //   alert(id)
  const [shift, setShift] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [doctor, setDoctor] = useState();
  const [activePatient, setActivePatient] = useState(null);
  let visitCount = activePatient?.patient.visit_count;
  console.log(visitCount,'visitCount')
   console.log(shift,'doc shift')
  useEffect(() => {
    document.title = "صفحه الطبيب";
  }, []);
  useEffect(() => {
    axiosClient.get(`doctors/find/${id}`).then(({ data }) => {
      console.log(data, "finded doctor");
      setDoctor(data);
      setShift(data.shifts[0]);
      setShifts(data.shifts);
      console.log(data.shifts, "data shifts");
      console.log(data.shifts[0]);
    });
  }, [activePatient?.id]);
  useEffect(()=>{
    // alert('start of use effect')
    axiosClient.get(`file/${activePatient?.patient?.id}`).then(({data})=>{
      setFile(data.data)
      console.log(data,'file')
    })
  },[activePatient?.patient?.id])
  const handleClose = () => {
    setDialog((prev) => ({ ...prev, open: false }));
  };
  //   useEffect(() => {
  //     setPatientsLoading(true);
  //     axiosClient.get(`shift/last`).then(({ data: data }) => {
  //       console.log(data.data, "today patients");
  //       //add activeProperty to patient object
  //       data.data.patients.forEach((patient) => {
  //         patient.active = false;
  //       });
  //       setShift(data.data);
  //       setPatientsLoading(false);
  //     });
  //   }, []);
  let count = (shift?.visits.length ?? 0) + 1;
  console.log(file,'is file')
  const shiftDate = new Date(Date.parse(shift?.created_at));
  return (
    <>
      <div
        style={{
          gap: "15px",
          transition: "0.3s all ease-in-out",
          display: "grid",
          gridTemplateColumns: `0.2fr     1fr 0.5fr 2fr 0.5fr   0.2fr   `,
        }}
      >
        <div></div>
        <div></div>
        <Card sx={{ mb: 1 }}></Card>
        <div></div>
        <div></div>
      </div>

      <div
        style={{
          gap: "15px",
          transition: "0.3s all ease-in-out",
          height: "80vh",
          display: "grid",
          gridTemplateColumns: `0.2fr     1fr  0.5fr 2fr 0.5fr   0.2fr  `,
        }}
      >
        <div></div>
        <Card sx={{ overflow: "auto", p: 1 }}>
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
              disabled={shift?.id == 1}
              onClick={() => {
                if (shift?.id == 1) {
                  return;
                }
                console.log(
                  shifts.map((s) => s.id).indexOf(shift.id),
                  "index of current shift"
                );
                setShift(shifts[shifts.map((s) => s.id).indexOf(shift.id) + 1]);
              }}
            >
              <ArrowBack />
            </LoadingButton>
            <LoadingButton
              disabled={shift?.id == shifts[0]?.id}
              onClick={() => {
                if (shift?.id == shifts[0]?.id) {
                  return;
                }
                setShift(shifts[shifts.map((s) => s.id).indexOf(shift.id) - 1]);
              }}
            >
              <ArrowForward />
            </LoadingButton>
          </Stack>
          <Divider></Divider>
          <Stack
            direction={"column"}
            gap={1}
            alignItems={"center"}
            style={{ padding: "15px" }}
          >
            {shift?.visits.map((visit,i) => {
              return (
                <DoctorPatient
                delay={i * 100}
                  activePatient={activePatient}
                  setActivePatient={setActivePatient}
                  index={count--}
                  key={visit.id}
                  hideForm={null}
                  visit={visit}
                />
              );
            })}
          </Stack>
        </Card>
        <Card>
            <List >
              {
             
               file && file.patients.map((patient,i ) => {
                  return <ListItem sx={{
                    cursor:'pointer',
                    backgroundColor:(theme)=>patient.id == activePatient?.patient.id ? theme.palette.warning.light : ''
                  }} key={patient.id}>sheet ({visitCount--}) {dayjs(new Date(Date.parse(patient.created_at))).format('YYYY/MM/DD')}</ListItem>
                })
              }
            </List>
        </Card>

        <Card key={activePatient?.patient?.id} sx={{ height: "80vh", overflow: "auto", p: 1 }}>
          {activePatient && (
            <>
              <PatientInformationPanel
                index={0}
                value={value}
                patient={activePatient.patient}
              />
              {/* <GeneralTab index={1} value={value}></GeneralTab> */}
              <GeneralExaminationPanel setShift={setShift}  setActivePatient={setActivePatient}  setDialog={setDialog} patient={activePatient.patient}  index={1} value={value} />
              <PresentingComplain setShift={setShift} complains={complains} setActivePatient={setActivePatient}  setDialog={setDialog} patient={activePatient.patient}  index={2} value={value} />
              <PatientMedicalHistory setShift={setShift}  setActivePatient={setActivePatient}  setDialog={setDialog} patient={activePatient.patient}  index={4} value={value} />
              <PatientPrescribedMedsTab setShift={setShift} complains={complains} setActivePatient={setActivePatient} setDialog={setDialog} patient={activePatient.patient}  index={3} value={value} />
            </>
          )}
        </Card>

        <div>
          <PatientPanel value={value} setValue={setValue} />
        </div>
        <Snackbar
        open={dialog.open}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={dialog.color}
          variant="filled"
          
          sx={{ width: "100%" ,color: "black" }}
        >
          {dialog.message}
        </Alert>
      </Snackbar>
      </div>
    </>
  );
}

export default Doctor;
