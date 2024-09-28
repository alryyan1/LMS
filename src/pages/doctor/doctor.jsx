import { useEffect, useState } from "react";
import "../Laboratory/addPatient.css";
import io from 'socket.io-client'
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
  NotificationAdd,
  NotificationImportantSharp,
  Notifications,
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
import { finishedImg, newImage } from "../constants";
import { socket } from "../../socket";

function Doctor() {
  const [value, setValue] = useState(0);
  const [file, setFile] = useState(null);
  const [complains, setComplains] = useState([]);
  const [diagnosis, setDiagnosis] = useState([]);
  const { user } = useStateContext();
  const [showPatients, setShowPatients] = useState(true);
  const [isConnected, setIsConnected] = useState(socket.connected);
  function onConnect() {
    setIsConnected(true);
  }

  function onDisconnect() {
    setIsConnected(false);
  }

  const [showPreviousVisits, setShowPreviousVisits] = useState(false);
  const [layOut, setLayout] = useState({
    patients: "1.6fr",
    visits: "0fr",
    vitals: "0fr",
    panel: false,
    panelList: "minmax(0,2fr)",
  });
  useEffect(()=>{
  //  const socket =  io('ws://localhost:3000')
   
  socket.on('connect', onConnect);
  socket.on('disconnect', onDisconnect);
  socket.on('disconnect',()=>{
    console.log('socket disconnected')
  })
   socket.on('connect',(args)=>{
    console.log('doctor connected succfully with id'+socket.id,args)
   })
   socket.on('greeting',(data)=>{
    console.log('received greeting from server '+data)
   })
   socket.on('authenticatedResult',(pid)=>{
    console.log('received result from server for patient '+pid)
    checkResults(focusPatientDeleteNotfication,pid)
   })


   return ()=>{
    socket.off('connect', onConnect);
    socket.off('disconnect', onDisconnect);
    socket.off('authenticatedResult')
   }
  },[])
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
  const focusPatientDeleteNotfication = (data) =>{
    setLayout((prev)=>{
      return {...prev,patients:'0fr',vitals:'0.5fr',visits:'0fr',}
    })
    setShowPatients(false)
    changeDoctorVisit(data)
    change(data.patient)
    axiosClient.get(`removeLabFinishedNotifications/${data.patient.id}`)
    setValue(9)
  }
  const focusTheNewPAtient = (data) =>{
    setLayout((prev)=>{
      return {...prev,patients:'0fr',vitals:'0.5fr',visits:'0fr',}
    })
    setShowPatients(false)
    changeDoctorVisit(data)
    change(data.patient)
    axiosClient.get(`removeNewPatient/${data.patient.id}`)
    // setValue(9)
  }
  const checkResults = (action,pid)=>{
    
       axiosClient.get(`doctorvisit/find?pid=${pid}`).then(({data})=>{
         console.log(data,'patient data')
        if (data != '') {
          
          notifyMe(`Lab Results just finished for patient '${data.patient.name}'`,data,finishedImg,action)
        }
      
      
    })
  }
  const checkNewPatients = (action)=>{
    axiosClient.get('NewPatients').then(({data})=>{
      data.map((d)=>{
       axiosClient.get(`doctorvisit/find?pid=${d.patient_id}`).then(({data})=>{
         console.log(data,'patient data')
        notifyMe(`A new  patient '${data.patient.name}' has just booked`,data,newImage,action)
      
        })
      })
    })
  }
  // useEffect(()=>{
  //  const timer =  setInterval(() => {
  //   checkResults(focusPatientDeleteNotfication)
  //   checkNewPatients(focusTheNewPAtient)
  //   }, 15000);
  //   return ()=>{
  //     clearInterval(timer)
  //   }
  // },[])
  const notifyMe = (title,data,address,action) => {
    // alert(Notification.permission)
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      const notification = new Notification(title,{icon:address});
      notification.onclick = function () {
        
        console.log(action,'action')
        if (action) {
          // alert('ss')
          action(data)
        }
   
      }
     
      // …
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          const notification = new Notification(title,{icon:address});
          
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
          <Divider />
          <LoadingButton 
            sx={{ mt: 1 }}
            color="inherit"
            title="show patient list"
            size="small"
            onClick={() => {
              isConnected ?  socket.disconnect() : socket.connect()
             
            }}
            variant="contained"
          >
            <Notifications color={isConnected ? 'success' : 'error'} />
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
