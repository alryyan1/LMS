import { useEffect, useRef, useState } from "react";
import "../Laboratory/addPatient.css";
import {
  Divider,
  Stack,
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
import { finishedImg, newImage, notifyMe } from "../constants";
import { socket } from "../../socket";
import urgentSound from "../../assets/sounds/urgent.mp3";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CodeEditor from "./CodeMirror";

function Doctor() {
  const audioRef = useRef();
  const notify = (data) =>
    toast("Lab result has just finished", {
      onClick: () => {
        focusPatientafterLabResultAuthAction(data);
      },
    });

  const [value, setValue] = useState(0);
  const [file, setFile] = useState(null);
  const [complains, setComplains] = useState([]);
  const [diagnosis, setDiagnosis] = useState([]);
  const { user } = useStateContext();
  const [showPatients, setShowPatients] = useState(true);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [showSearch , setShowSearch] = useState(false)
  const [userSettings, setUserSettings] = useState(null);
  useEffect(() => {


    axiosClient.get("userSettings").then(({ data }) => {
      // console.log(data, "user settings from axios");
      setUserSettings(data);
    });
  }, []);
  function onConnect() {
    setIsConnected(true);
  }

  function onDisconnect() {
    setIsConnected(false);
  }

  const [showPreviousVisits, setShowPreviousVisits] = useState(false);
  const [layOut, setLayout] = useState({
    patients: "2.3fr",
    visits: "0fr",
    vitals: "0fr",
    panel: false,
    panelList: "minmax(0,2fr)",
  });
  useEffect(() => {
    //  const socket =  io('ws://localhost:3000')

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });
    socket.on("connect", (args) => {
      console.log("doctor connected succfully with id" + socket.id, args);
    });
  
    socket.on("authenticatedResult", (pid) => {
      console.log("received result from server for patient " + pid);

      getDoctorVisit(pid).then((patientData) => {
        notify(patientData);
        socketEventHandler(
          focusPatientafterLabResultAuthAction,
          patientData,
          "Lab Results just finished for patient",
          finishedImg
        );
      });
    });
    socket.on("newDoctorPatientFromServer", (pid) => {
      console.log("newDoctorPatientFromServer " + pid);
      getDoctorVisit(pid).then((patientData) => {
        updateDoctorPatients(patientData);
        showDocPatients();
        socketEventHandler(null, patientData, " has just booked", newImage);
      });
    });

    socket.on("patientUpdatedFromServer", (pid) => {
      console.log(pid,'patient updated from server')
      // console.log("newDoctorPatientFromServer " + pid);
      getDoctorVisit(pid).then((patientData) => {
        console.log(patientData,'doctorVisit Data fetched from paitent Id triggered by patiet update visit from vital signs')
          change(patientData.patient)
        // updateDoctorPatients(patientData);
        // showDocPatients();
      });
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("authenticatedResult");
      socket.off("newDoctorPatientFromServer");
      socket.off("patientUpdatedFromServer");
    };
  }, []);
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
      setComplains(data.map((c) => ({ label: c.name, type: c.name })));
    });
  }, []);
  useEffect(() => {
    // alert('start of use effect')
    axiosClient.get("diagnosis").then(({ data }) => {
      // console.log(data);
      setDiagnosis(data.map((c) => ({ label: c.name, type: c.name })));
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
  const [doctor, setDoctor] = useState();
  const [activePatient, setActivePatient] = useState(null);
  const [activeDoctorVisit, setActiveDoctorVisit] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDoctorShift = (id,currentShiftId)=>{
    return new Promise((resolve,reject)=>{
      axiosClient.get(`doctorShift/find?id=${id}&currentShiftId=${currentShiftId}`).then(({ data }) => {
        resolve(data)
      }).catch((err)=>{
      reject(err)
      });
    })
   
  }
  const alaram = () => {
    const audio = new Audio(urgentSound);
    setTimeout(() => {
      audio.play();
      audioRef.current.play();
    }, 3000);
  };
  const getDoctorVisit = (pid) => {
    return new Promise((resolve, reject) => {
      axiosClient.get(`doctorvisit/find?pid=${pid}`).then(({ data }) => {
        resolve(data);
      });
    });
  };
  const focusPatientafterLabResultAuthAction = (data) => {
    setLayout((prev) => {
      return { ...prev, patients: "0fr", vitals: "0.7fr", visits: "0fr" };
    });
    setShowPatients(false);
    changeDoctorVisit(data);
    change(data.patient);
    setValue(9);
  };

  const socketEventHandler = (action, patientData, title, img) => {
    if (patientData != "") {
      notifyMe(
        `${patientData.patient.name} ${title} `,
        patientData,
        img,
        action
      );
    }
  };

  // console.log('AddPrescribedDrugAutocomplete rendered',selectedDrugs)
  useEffect(() => {
    axiosClient.get(`items/all`).then(({ data: data }) => {
      setItems(data);
      if (data.status == false) {
        setDialog((prev) => {
          return { ...prev, open: true, msg: data.message };
        });
      }
    });
  }, []);
  // console.log(activePatient, "active patient from doctor page");
  let visitCount = activePatient?.visit_count;
  // console.log(visitCount, "visitCount");
  // console.log(shift, "doc shift");
  const SearchHandler = (e)=>{
    console.log(e.key)
    if (e.key == 'F9') {
      setShowSearch(true)
    }
  }
  useEffect(() => {
    document.title = "صفحه الطبيب";

      document.addEventListener('keydown',SearchHandler)

      return ()=>{
        document.removeEventListener('keydown',SearchHandler)
      }

  }, []);

  const showDocPatients = () => {
    setActivePatient(null);
    setActiveDoctorVisit(null);
    setLayout((prev) => {
      return {
        ...prev,
        patients: "2.4fr",
        vitals: "0fr",
        visits: "0fr",
      };
    });
    setShowPatients(true);
  };

  useEffect(() => {
    // console.log(id, "doctor id from router");

    if (id == undefined) {
      // alert("id is null");
      axiosClient
        .get("/user")
        .then(({ data }) => {
          console.log(data, "user data");
          axiosClient.get(`doctors/find/${data.doctor_id}`).then(({ data }) => {
            console.log(data, "finded doctor");
            setDoctor(data.doctor);
            setShift(data);
            // setShifts(data.shifts);
            // console.log(data.shifts, "data shifts");
            // console.log(data.shifts[0]);
          });
        })
        .catch((err) => {});
    } else {
      axiosClient.get(`doctors/find/${id}`).then(({ data }) => {
        console.log(data, "finded doctor");
        setDoctor(data.doctor);
        setShift(data);
        // setShifts(data.shifts);
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
    console.log('change function called')
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

  const updateDoctorPatients = (docVisit) => {
    console.log("start patient update");

    console.log("start adding patient");

    setShift((prev) => {
      return { ...prev, visits: [{ ...docVisit }, ...prev.visits] };
    });
  };
  const changeDoctorVisit = (doctorVisit) => {
    if (doctorVisit.is_new == 1) {
      axiosClient.patch(`doctorVisit/${doctorVisit.id}`, { is_new: false });
    }
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
  let count = shift?.visits.length ?? 0;
  // console.log(file, "is file");
  const shiftDate = new Date(Date.parse(shift?.created_at));
  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <Stack direction={"row"} gap={1} justifyContent={"space-between"}>
        {activePatient && (
          <Stack
            sx={{ border: "1px dashed grey", borderRadius: "5px", p: 1 }}
            direction={"row"}
            gap={2}
            flexGrow={"1"}
          >
            <Typography sx={{ mr: 1 }} variant="h4">
              {activePatient?.name}
            </Typography>
            <Typography variant="h6">
              <Box sx={{ display: "inline-block", ml: 1 }}>
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
              <Box sx={{ display: "inline-block", ml: 1 }}>
                Date : {new Date(activePatient.created_at).toLocaleString()}
              </Box>
            </Typography>
            <Typography variant="h6">
              <Box sx={{ display: "inline-block", ml: 1 }}>
                Nationality : {activePatient?.country?.name}
              </Box>
            </Typography>
          </Stack>
        )}
        <audio hidden ref={audioRef} controls src={urgentSound}></audio>

        {showSearch && <Box>
          <AutocompleteSearchPatient
            changeDoctorVisit={changeDoctorVisit}
            change={change}
          />
        </Box> }
      </Stack>

      {/* <CodeMirrorComponent/> */}

      <div
        style={{
          gap: "15px",
          transition: "0.3s all ease-in-out",
          display: "grid",
          gridTemplateColumns: `70px    ${layOut.patients} ${layOut.visits} ${layOut.vitals} 2fr 0.5fr     `,
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
          gridTemplateColumns: `70px    ${layOut.patients}  ${layOut.visits} ${layOut.vitals} 2fr 1fr    `,
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
              showDocPatients();
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
              isConnected ? socket.disconnect() : socket.connect();
            }}
            variant="contained"
          >
            <Notifications color={isConnected ? "success" : "error"} />
          </LoadingButton>
        </Stack>
        {showPatients ? (
          <Card
            style={{ backgroundColor: "#ffffff40" }}
            sx={{ overflow: "auto", p: 1, ml: 1 }}
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
                 loading={loading}
                  disabled={shift?.id == 1}
                  onClick={() => {
                    if (shift?.id == 1) {
                      return;
                    }
                    // console.log(
                    //   shifts.map((s) => s.id).indexOf(shift.id),
                    //   "index of current shift"
                    // );

                    setLoading(true)

                    
                    getDoctorShift(doctor.id,shift.id).then((data)=>{
                      console.log(data,'last shift is')
                      setShift(data)
                    }).finally(()=>setLoading(false))
                  }}
                >
                  <ArrowBack />
                </LoadingButton>
                <LoadingButton
                  // disabled={shift?.id == shifts[0]?.id}
                  onClick={() => {
                    // if (shift?.id == shifts[0]?.id) {
                    //   return;
                    // }
                    // setShift(
                    //   shifts[shifts.map((s) => s.id).indexOf(shift.id) - 1]
                    // );
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
                    change={change}
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
          <Card style={{ backgroundColor: "ffffff40" }}>
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
                      <Stack gap={2} direction='row'>
                        <Typography>sheet ({visitCount--})</Typography>
                        <Typography className="text-neutral-500 dark:text-neutral-400  ">
                          {dayjs(
                            new Date(Date.parse(patient.created_at))
                          ).format("YYYY/MM/DD")}
                        </Typography>
                      </Stack>
                    </ListItem>
                  );
                })}
            </List>
          </Card>
        ) : (
          <div></div>
        )}
        <Card style={{ backgroundColor: "#ffffff40" }}>
          {activePatient && (
            <VitalSigns
             key={activePatient.updated_at}
            socket={socket}
              change={change}
              patient={activePatient}
              setDialog={setDialog}
            />
          )}
        </Card>
        {activePatient ? (
          <Card
            style={{ backgroundColor: "#ffffff40" }}
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
                    setComplains={setComplains}
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
                 userSettings={userSettings}
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
                    setDiagnosis={setDiagnosis}
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
                  socket={socket}
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
          </Card>
        ) : (
          ""
        )}

        {activePatient && (
          <PatientPanel
            change={change}
            setDialog={setDialog}
            patient={activePatient}
            value={value}
            setValue={setValue}
          />
        )}
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
