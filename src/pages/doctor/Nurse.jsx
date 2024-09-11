import { useEffect, useState } from "react";
import "../Laboratory/addPatient.css";

import {
  Divider,
  Stack,
  Skeleton,
  Card,
  Snackbar,
  Alert,
  List,
  ListItem,
  Box,
  Typography,
} from "@mui/material";
import { ArrowBack, ArrowForward, FormatListBulleted } from "@mui/icons-material";
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
import ProvisionalDiagnosis from "./provisionalDiagnosis";
import AddLabTests from "./AddLabTest";
import AutocompleteSearchPatient from "../../components/AutocompleteSearchPatient";
import AddMedicalService from "./AddService";
import { useStateContext } from "../../appContext";
import Sample from "../Laboratory/Sample";
import Collection from "./Collection";
import LabResults from "./LabResult";

function Nurse() {
  const [value, setValue] = useState(0);
  const [file, setFile] = useState(null);
  const [complains, setComplains] = useState([]);
  const [patients, setPatients] = useState([]);
  const { user } = useStateContext();
  const [showPreviousVisits, setShowPreviousVisits] = useState(false);
  const [layOut, setLayout] = useState({
    patients: "1fr",
    visits: "0.5fr",
     panel: false,
     panelList: "minmax(0,2fr)",
  });
  useEffect(() => {
    // alert('start of use effect')
    axiosClient.get("complains").then(({ data }) => {
      console.log(data);
      setComplains(data.map((c) => c.name));
    });
  }, []);
  const hideVisits = () => {
    setShowPreviousVisits(false);
    setLayout((prev) => {
      return {...prev, visits: "0fr" };
    })
  }
  const showVisits = () => {
    setShowPreviousVisits(true);
    setLayout((prev) => {
      return {...prev, visits: "0.5fr" };
    })
  }
  const { id } = useParams();

  const [dialog, setDialog] = useState({
    showMoneyDialog: false,
    title: "",
    color: "success",
    open: false,
    openError: false,
    openLabReport: false,
    message: "Addition was successfull",
  });
  //   alert(id)
  const [shift, setShift] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [doctor, setDoctor] = useState();
  const [activePatient, setActivePatient] = useState(null);
  const [activeDoctorVisit, setActiveDoctorVisit] = useState(null);
  const [openedDoctors, setOpenedDoctors] = useState([]);
  console.log(activePatient, "active patient from doctor page");
  let visitCount = activePatient?.visit_count;
  console.log(visitCount, "visitCount");
  console.log(shift, "doc shift");
  useEffect(() => {
    document.title = "Nurse page ";
  }, []);

  useEffect(() => {
    axiosClient.get("doctor/openedDoctorsShifts").then(({ data }) => {
      setOpenedDoctors(data);
      console.log(data, "opened doctors");
    });
  }, []);
  console.log(openedDoctors, "opened doctors rendered");
  useEffect(() => {
    // alert('start of use effect')
    axiosClient.get(`file/${activePatient?.id}`).then(({ data }) => {
      setFile(data.data);
      console.log(data, "file");
    });
  }, [activePatient?.id]);
  const handleClose = () => {
    setDialog((prev) => ({ ...prev, open: false }));
  };

  const change = (patient) => {
    console.log(patient, "patient from change method");
    setActivePatient((prev) => {
      return { ...patient };
    });
    setOpenedDoctors((prev) => {
      return prev.map((doctorShift) => {
        return {
          ...doctorShift,
          visits: doctorShift.visits.map((visit) => {
            if (visit.patient_id === patient.id) {
              return { ...visit, patient: patient };
            } else {
              return visit;
            }
          }),
        };
      });
    });
  };
  const changeDoctorVisit = (doctorVisit) => {
    setActiveDoctorVisit((prev) => {
      return { ...doctorVisit };
    });
    setOpenedDoctors((prev) => {
      return prev.map((doctorShift) => {
        return {
          ...doctorShift,
          visits: doctorShift.visits.map((visit) => {
            if (visit.id === doctorVisit.id) {
              return { ...doctorVisit  };
            } else {
              return visit;
            }
          }),
        };
      });
    });
  };
  let count = (shift?.visits.length ?? 0) + 1;
  console.log(file, "is file");
  const shiftDate = new Date(Date.parse(shift?.created_at));
  return (
    <>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Box flexGrow={"1"}>
          <Typography sx={{ml:10}} variant="h3">{activePatient?.name}</Typography>
        </Box>
        <Box>
          <AutocompleteSearchPatient
            setActivePatientHandler={null}
            setActivePatient={setActivePatient}
          />
        </Box>
      </Stack>
      <div
        style={{
          gap: "15px",
          transition: "0.3s all ease-in-out",
          display: "grid",
          gridTemplateColumns: `0.2fr     1fr ${layOut.visits} 2fr 0.5fr   0.2fr   `,
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
          gridTemplateColumns: `0.2fr     1fr  ${layOut.visits} 2fr 0.7fr   0.2fr  `,
        }}
      >
         <Stack  direction={'column'}>
        {activePatient && (
        <LoadingButton
          color="inherit"
          title="show patient previous visits"
          size="small"
        
          onClick={() => {
            showPreviousVisits ? hideVisits() : showVisits();
          }}
          variant="contained"
        >
          <FormatListBulleted
            
          />
        </LoadingButton>
      )}
        </Stack >
        <Card style={{backgroundColor:'#ffffff73'}} sx={{ overflow: "auto", p: 1 }}>
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
            {openedDoctors.map((doctorShift) => {
              return doctorShift.visits.map((visit, i) => {
                return (
                  <DoctorPatient
                    setActiveDoctorVisit={setActiveDoctorVisit}
                    delay={i * 100}
                    activePatient={activePatient}
                    setActivePatient={setActivePatient}
                    index={count--}
                    key={visit.id}
                    hideForm={null}
                    visit={visit}
                 
                    
                  />
                );
              });
            })}
          </Stack>
        </Card>
        <Card style={{backgroundColor:'#ffffff73'}}>
          <List>
            {file &&
              file.patients.map((patient, i) => {
                return (
                  <ListItem onClick={()=>{
                    setActivePatient(patient);
                  }}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: (theme) =>
                        patient.id == activePatient?.id
                          ? theme.palette.warning.light
                          : "",
                    }}
                    key={patient.id}
                  >
                    sheet ({visitCount--}){" "}
                    <span className="text-neutral-500 dark:text-neutral-400 text-xs ml-1">
                      {" "}
                      {dayjs(new Date(Date.parse(patient.created_at))).format(
                        "YYYY/MM/DD"
                      )}
                    </span>
                  </ListItem>
                );
              })}
          </List>
        </Card>
        <Card
          style={{ backgroundColor: "#ffffff73" }}
          key={activePatient?.id}
          sx={{ height: "80vh", overflow: "auto", p: 1 }}
        >
          {activePatient && (
            <>
              <PatientInformationPanel
                index={0}
                value={value}
                patient={activePatient}
              />
              {/* <GeneralTab index={1} value={value}></GeneralTab> */}
              <GeneralExaminationPanel
                setShift={setShift}
                change={change}
                setDialog={setDialog}
                patient={activePatient}
                index={1}
                value={value}
              />
              {!user?.is_nurse == 1 && (
                <PresentingComplain
                  setShift={setShift}
                  complains={complains}
                  change={change}
                  setDialog={setDialog}
                  patient={activePatient}
                  index={2}
                  value={value}
                />
              )}
              {!user?.is_nurse == 1 && (
                <PatientMedicalHistory
                  setShift={setShift}
                  change={change}
                  setDialog={setDialog}
                  patient={activePatient}
                  index={4}
                  value={value}
                />
              )}
              {!user?.is_nurse == 1 && (
                <PatientPrescribedMedsTab
                  setShift={setShift}
                  complains={complains}
                  change={change}
                  setDialog={setDialog}
                  patient={activePatient}
                  index={3}
                  value={value}
                />
              )}
              {!user?.is_nurse == 1 && (
                <ProvisionalDiagnosis
                  setShift={setShift}
                  complains={complains}
                  change={change}
                  setDialog={setDialog}
                  patient={activePatient}
                  index={5}
                  value={value}
                />
              )}

              <AddLabTests
                setShift={setShift}
                complains={complains}
                change={change}
                setDialog={setDialog}
                patient={activePatient}
                index={6}
                value={value}
              />

              <AddMedicalService
                changeDoctorVisit={changeDoctorVisit}
                activeDoctorVisit={activeDoctorVisit}
                setActivePatient={setActivePatient}
                setShift={setShift}
                complains={complains}
                change={change}
                setDialog={setDialog}
                patient={activePatient}
                index={7}
                value={value}
              />
              {user?.is_nurse == 1 && (
                <Collection
                  setActivePatient={setActivePatient}
                  setShift={setShift}
                  complains={complains}
                  change={change}
                  setDialog={setDialog}
                  patient={activePatient}
                  index={8}
                  value={value}
                />
              )}

              <LabResults
                setActivePatient={setActivePatient}
                setShift={setShift}
                complains={complains}
                change={change}
                setDialog={setDialog}
                patient={activePatient}
                index={9}
                value={value}
              />
            </>
          )}
        </Card>

        <PatientPanel value={value} setValue={setValue} />
        <Snackbar
          open={dialog.open}
          autoHideDuration={4000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={dialog.color}
            variant="filled"
            sx={{ width: "100%", color: "black" }}
          >
            {dialog.message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}

export default Nurse;
