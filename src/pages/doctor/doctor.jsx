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
import CarePlan from "./CarePlan";

function Doctor() {
  const [value, setValue] = useState(0);
  const [file, setFile] = useState(null);
  const [complains, setComplains] = useState([]);
  const [diagnosis, setDiagnosis] = useState([]);
  const { user } = useStateContext();
  const [showPatients, setShowPatients] = useState(true);

  const [showPreviousVisits, setShowPreviousVisits] = useState(false);
  const [layOut, setLayout] = useState({
    patients: "1.6fr",
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
      // console.log(data);
      setComplains(data.map((c) => c.name));
    });
  }, []);
  useEffect(() => {
    // alert('start of use effect')
    axiosClient.get("diagnosis").then(({ data }) => {
      // console.log(data);
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
  useEffect(()=>{
   const timer =  setInterval(() => {
       axiosClient.get('labFinishedNotifications').then(({data})=>{
         data.map((d)=>{
          axiosClient.get(`doctorvisit/find?pid=${d.patient_id}`).then(({data})=>{
            console.log(data,'patient data')
           notifyMe(`Lab Results just finished for patient '${data.patient.name}'`,data)
         
           })
         })
       })
    }, 15000);
    return ()=>{
      clearInterval(timer)
    }
  },[])
  const notifyMe = (title,data) => {
    // alert(Notification.permission)
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      const notification = new Notification(title,{icon:'data:image/png;base64,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'});
      notification.onclick = function () {
        setLayout((prev)=>{
          return {...prev,patients:'0fr',vitals:'0.5fr',visits:'0fr',}
        })
        setShowPatients(false)
         changeDoctorVisit(data)
         change(data.patient)
         axiosClient.get(`removeLabFinishedNotifications/${data.patient.id}`)
         setValue(9)
      }
     
      // …
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          const notification = new Notification(title,{icon:'data:image/png;base64,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'});
          
          // …
        }
      });
    }
  
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
  }
  
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
  // console.log(activePatient, "active patient from doctor page");
  let visitCount = activePatient?.visit_count;
  // console.log(visitCount, "visitCount");
  // console.log(shift, "doc shift");
  useEffect(() => {
    document.title = "صفحه الطبيب";
  }, []);

  useEffect(() => {
    // console.log(id, "doctor id from router");

    if (id == undefined) {
      // alert("id is null");
      axiosClient
        .get("/user")
        .then(({ data }) => {
          // console.log(data, "user data");
          axiosClient.get(`doctors/find/${data.doctor_id}`).then(({ data }) => {
            console.log(data, "finded doctor");
            setDoctor(data);
            setShift(data.shifts[0]);
            setShifts(data.shifts);
            // console.log(data.shifts, "data shifts");
            // console.log(data.shifts[0]);
          });
        })
        .catch((err) => {});
    } else {
      axiosClient.get(`doctors/find/${id}`).then(({ data }) => {
        // console.log(data, "finded doctor");
        setDoctor(data);
        setShift(data.shifts[0]);
        setShifts(data.shifts);
        // console.log(data.shifts, "data shifts");
        // console.log(data.shifts[0]);
      });
    }
  }, [activePatient?.id]);
  useEffect(() => {
    // alert('start of use effect')
    if (activePatient) {
      axiosClient.get(`file/${activePatient?.id}`).then(({ data }) => {
        setFile(data.data);
        // console.log(data, "file");
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
  let count = (shift?.visits.length ?? 0) 
  // console.log(file, "is file");
  const shiftDate = new Date(Date.parse(shift?.created_at));
  return (
    <>
      <Stack  direction={"row"} gap={1} justifyContent={"space-between"}>
       {activePatient &&  <Stack sx={{border:'1px dashed grey',borderRadius:'5px',p:1}} direction={'row'} gap={2} flexGrow={"1"}>
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
            changeDoctorVisit={changeDoctorVisit}
            change={change}
          />
        </Box>
      </Stack>
      <div
        style={{
          gap: "15px",
          transition: "0.3s all ease-in-out",
          display: "grid",
          gridTemplateColumns: `70px    ${layOut.patients} ${layOut.visits} ${layOut.vitals} 2fr 0.5fr   70px  `,
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
          gridTemplateColumns: `70px    ${layOut.patients}  ${layOut.visits} ${layOut.vitals} 2fr 0.7fr   70px `,
        }}
      >
        <Stack  direction={"column"}>
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
                  patients: "1.6fr",
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
            style={{ backgroundColor: "#ffffffeb" }}
            sx={{ overflow: "auto", p: 1,ml:1 }}
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
                    // console.log(
                    //   shifts.map((s) => s.id).indexOf(shift.id),
                    //   "index of current shift"
                    // );
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
                  // console.log(visit, "visit in doctor page");
                  return (
                    <DoctorPatient
                      changeDoctorVisit={changeDoctorVisit}
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
          <Card style={{ backgroundColor: "#ffffffeb" }}>
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
        <Card style={{ backgroundColor: "#ffffffeb" }}>
          {activePatient && (
            <VitalSigns
              key={activePatient?.id}
              change={change}
              patient={activePatient}
              setDialog={setDialog}
            />
          )}
        </Card>
        {activePatient ?   <Card
          style={{ backgroundColor: "#ffffffeb" }}
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
                  index={3}
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
                  index={4}
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
                changeDoctorVisit={changeDoctorVisit}

              activeDoctorVisit={activeDoctorVisit}
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
                   {user?.is_nurse == 0 && (
                <CarePlan
                  setActivePatient={setActivePatient}
                  setShift={setShift}
                  complains={complains}
                  change={change}
                  setDialog={setDialog}
                  patient={activePatient}
                  index={11}
                  value={value}
                />
              )}
            </>
          )}
        </Card>  : ''}

        {activePatient && <PatientPanel change={change} setDialog={setDialog} patient={activePatient} value={value} setValue={setValue} />}
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
