import { useEffect, useState } from "react";
import "../Laboratory/addPatient.css";

import { Divider, Stack, Skeleton, Card, Snackbar, Alert } from "@mui/material";
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

function Doctor() {
  const [value, setValue] = useState(0);

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
  }, []);

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

  const shiftDate = new Date(Date.parse(shift?.created_at));
  return (
    <>
      <div
        style={{
          gap: "15px",
          transition: "0.3s all ease-in-out",
          display: "grid",
          gridTemplateColumns: `0.2fr     1fr 2fr 0.5fr   0.2fr   `,
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
          gridTemplateColumns: `0.2fr     1fr 2fr 0.5fr   0.2fr  `,
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
            {shift?.visits.map((visit) => {
              return (
                <DoctorPatient
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

        <Card key={activePatient?.patient?.id} sx={{ height: "80vh", overflow: "auto", p: 1 }}>
          {activePatient && (
            <>
              <PatientInformationPanel
                index={0}
                value={value}
                patient={activePatient.patient}
              />
              {/* <GeneralTab index={1} value={value}></GeneralTab> */}
              <GeneralExaminationPanel setDialog={setDialog} patient={activePatient.patient}  index={1} value={value} />
              <PresentingComplain setDialog={setDialog} patient={activePatient.patient}  index={2} value={value} />
              <PatientMedicalHistory setDialog={setDialog} patient={activePatient.patient}  index={4} value={value} />
              <PatientPrescribedMedsTab setActivePatient={setActivePatient} setDialog={setDialog} patient={activePatient.patient}  index={3} value={value} />
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
