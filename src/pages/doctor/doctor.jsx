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
import {
  ArrowBack,
  ArrowForward,
  FormatListBulleted,
  RemoveRedEyeSharp,
} from "@mui/icons-material";
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
import VitalSigns from "./VitalSigns";
import SickLeave from "./SickLeave";

function Doctor() {
  const [value, setValue] = useState(0);
  const [file, setFile] = useState(null);
  const [complains, setComplains] = useState([]);
  const [diagnosis, setDiagnosis] = useState([]);
  const { user } = useStateContext();
  const [showPatients, setShowPatients] = useState(true);

  const [showPreviousVisits, setShowPreviousVisits] = useState(false);
  const [layOut, setLayout] = useState({
    patients: "1fr",
    visits: "0fr",
    vitals: "0fr",
    panel: false,
    panelList: "minmax(0,2fr)",
  });
  const hideVisits = () => {
    setShowPreviousVisits(false);
    setLayout((prev) => {
      return { ...prev, visits: "0fr" };
    });
  };
  const showVisits = () => {
    setShowPreviousVisits(true);
    setLayout((prev) => {
      return { ...prev, visits: "0.5fr" };
    });
  };
  useEffect(() => {
    // alert('start of use effect')
    axiosClient.get("complains").then(({ data }) => {
      console.log(data);
      setComplains(data.map((c) => c.name));
    });
  }, []);
  useEffect(() => {
    // alert('start of use effect')
    axiosClient.get("diagnosis").then(({ data }) => {
      console.log(data);
      setDiagnosis(data.map((c) => c.name));
    });
  }, []);
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
  const [items, setItems] = useState([]);

  // console.log('AddPrescribedDrugAutocomplete rendered',selectedDrugs)
   useEffect(()=>{
    axiosClient.get(`items/all`).then(({ data: data }) => {
        setItems(data);
        if (data.status == false) {
          setDialog((prev)=>{
            return {...prev,open: true, msg: data.message}
          })
        }
  
    });
   },[])
  console.log(activePatient, "active patient from doctor page");
  let visitCount = activePatient?.visit_count;
  console.log(visitCount, "visitCount");
  console.log(shift, "doc shift");
  useEffect(() => {
    document.title = "صفحه الطبيب";
  }, []);

  useEffect(() => {
    console.log(id, "doctor id from router");

    if (id == undefined) {
      // alert("id is null");
      axiosClient
        .get("/user")
        .then(({ data }) => {
          console.log(data, "user data");
          axiosClient.get(`doctors/find/${data.doctor_id}`).then(({ data }) => {
            console.log(data, "finded doctor");
            setDoctor(data);
            setShift(data.shifts[0]);
            setShifts(data.shifts);
            console.log(data.shifts, "data shifts");
            console.log(data.shifts[0]);
          });
        })
        .catch((err) => {});
    } else {
      axiosClient.get(`doctors/find/${id}`).then(({ data }) => {
        console.log(data, "finded doctor");
        setDoctor(data);
        setShift(data.shifts[0]);
        setShifts(data.shifts);
        console.log(data.shifts, "data shifts");
        console.log(data.shifts[0]);
      });
    }
  }, [activePatient?.id]);
  useEffect(() => {
    // alert('start of use effect')
    if (activePatient) {
      axiosClient.get(`file/${activePatient?.id}`).then(({ data }) => {
        setFile(data.data);
        console.log(data, "file");
      });
    }
  }, [activePatient?.id]);
  const handleClose = () => {
    setDialog((prev) => ({ ...prev, open: false }));
  };

  const change = (patient) => {
    setActivePatient((prev) => {
      return { ...patient };
    });
    setShift((prev) => {
      return {
        ...prev,
        visits: prev.visits.map((v) => {
          if (v.patient_id === patient.id) {
            return { ...v, patient: patient };
          }
          return v;
        }),
      };
    });
  };
  const changeDoctorVisit = (doctorVisit) => {
    setActiveDoctorVisit((prev) => {
      return { ...doctorVisit };
    });
    setShift((prev) => {
      return {
        ...prev,
        visits: prev.visits.map((v) => {
          if (v.id === doctorVisit.id) {
            return { ...doctorVisit };
          }
          return v;
        }),
      };
    });
  };
  let count = (shift?.visits.length ?? 0) + 1;
  console.log(file, "is file");
  const shiftDate = new Date(Date.parse(shift?.created_at));
  return (
    <>
      <Stack direction={"row"} justifyContent={"space-between"}>
       {activePatient &&  <Stack direction={'row'} gap={2} flexGrow={"1"}>
          <Typography sx={{mr:1}} variant="h3">
            {activePatient?.name}

  
        
          </Typography>
          <Typography variant="h6">
          <Box sx={{display:'inline-block',ml:1}}>
              Age :{" "}
              {
                //print iso date
                ` ${activePatient?.age_year ?? 0} Y ${
                  activePatient?.age_month == null
                    ? ""
                    : " / " + activePatient?.age_month + " M "
                } ${
                  activePatient?.age_day == null
                    ? ""
                    : " / " + activePatient?.age_day + " D "
                } `
              }
            </Box>
          </Typography>
          <Typography variant="h6">
          <Box sx={{display:'inline-block',ml:1}}>
              Date :{" "}
              {new Date(activePatient.created_at).toLocaleString()}
            </Box>
          </Typography>
          <Typography variant="h6">
          <Box sx={{display:'inline-block',ml:1}}>
              Nationality :{" "}
            {    activePatient?.country?.name}
            </Box>
          </Typography>
        </Stack>}

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
          gridTemplateColumns: `0.2fr     ${layOut.patients} ${layOut.visits} ${layOut.vitals} 2fr 0.5fr   0.2fr   `,
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
          gridTemplateColumns: `0.2fr     ${layOut.patients}  ${layOut.visits} ${layOut.vitals} 2fr 0.7fr   0.2fr  `,
        }}
      >
        <Stack direction={"column"}>
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
              <FormatListBulleted />
            </LoadingButton>
          )}
          <Divider />
          <LoadingButton
            sx={{ mt: 1 }}
            color="inherit"
            title="show patient list"
            size="small"
            onClick={() => {
              setActivePatient(null);
              setActiveDoctorVisit(null);
              setLayout((prev) => {
                return {
                  ...prev,
                  patients: "1fr",
                  vitals: "0fr",
                  visits: "0fr",
                };
              });
              setShowPatients(true);
            }}
            variant="contained"
          >
            <RemoveRedEyeSharp />
          </LoadingButton>
        </Stack>
        {showPatients ? (
          <Card
            style={{ backgroundColor: "#ffffff73" }}
            sx={{ overflow: "auto", p: 1 }}
          >
            <div>
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
                    setShift(
                      shifts[shifts.map((s) => s.id).indexOf(shift.id) + 1]
                    );
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
                    setShift(
                      shifts[shifts.map((s) => s.id).indexOf(shift.id) - 1]
                    );
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
                {shift?.visits.map((visit, i) => {
                  console.log(visit, "visit in doctor page");
                  return (
                    <DoctorPatient
                      showPatients={showPatients}
                      setShowPatients={setShowPatients}
                      setLayout={setLayout}
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
                })}
              </Stack>
            </div>
          </Card>
        ) : (
          <div></div>
        )}
        {activeDoctorVisit ? (
          <Card style={{ backgroundColor: "#ffffff73" }}>
            {/* file visits */}
            <List>
              {file &&
                file.patients.map((patient, i) => {
                  return (
                    <ListItem
                      onClick={() => {
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
        ) : (
          <div></div>
        )}
        <Card style={{ backgroundColor: "#ffffff73" }}>
          {activePatient && (
            <VitalSigns
              key={activePatient?.id}
              change={change}
              patient={activePatient}
              setDialog={setDialog}
            />
          )}
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
                  items={items}
                  user={user}
                  activeDoctorVisit={activeDoctorVisit}
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
                diagnosis={diagnosis}
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
              <SickLeave
              user={user}
                setActivePatient={setActivePatient}
                setShift={setShift}
                complains={complains}
                change={change}
                setDialog={setDialog}
                patient={activePatient}
                index={10}
                value={value}
              />
            </>
          )}
        </Card>

        {activePatient && <PatientPanel value={value} setValue={setValue} />}
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

export default Doctor;
