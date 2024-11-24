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
import Collection from "./Collection";
import LabResults from "./LabResult";
import VitalSigns from "./VitalSigns";
import SickLeave from "./SickLeave";
import CarePlan from "./CarePlan";
import { finishedImg, newImage, notifyMe } from "../constants";
import { socket } from "../../socket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CodeEditor from "./CodeMirror";
import {
  DoctorShift,
  DoctorVisit,
} from "../../types/Patient";
import ReviewOfSystems from "./ReviewOfSystems";

function Doctor() {
  const audioRef = useRef();
  const notify = (doctorVisit: DoctorVisit) =>
    toast("Lab result has just finished", {
      onClick: () => {
        focusPatientafterLabResultAuthAction(doctorVisit);
      },
    });

  const [value, setValue] = useState(0);
  const [complains, setComplains] = useState([]);
  const [diagnosis, setDiagnosis] = useState([]);
  const [patients,setPatients] = useState([])
  const [currentDate,setCurrentDate] = useState(null)
  const { user } = useStateContext();
  const [showPatients, setShowPatients] = useState(true);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [showSearch, setShowSearch] = useState(false);
  const [userSettings, setUserSettings] = useState(null);
  const [shift, setShift] = useState<DoctorShift | null>(null);
  const [doctor, setDoctor] = useState();
  const [activeDoctorVisit, setActiveDoctorVisit] =
    useState<DoctorVisit | null>(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.title = "صفحه الطبيب";

    document.addEventListener("keydown", SearchHandler);

    return () => {
      document.removeEventListener("keydown", SearchHandler);
    };
  }, []);
  useEffect(() => {
    axiosClient.get("userSettings").then(({ data }) => {
      // console.log(data, "user settings from axios");
      setUserSettings(data);
    });
  }, []);
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
  useEffect(() => {
    if (id == undefined) {
      // alert("id is null");
      setLoading(true)
      axiosClient
        .get("/user")
        .then(({ data }) => {
          console.log(data, "user data");
          axiosClient.get(`doctors/find/${data.doctor_id}`).then(({ data }) => {
            console.log(data, "finded doctor");
            setDoctor(data.doctor);
            setShift(data);
            setPatients(data.visits)
            setLoading(false)
          });
        })
        .catch((err) => {});
    } else {
      axiosClient.get(`doctors/find/${id}`).then(({ data }) => {
        console.log(data, "finded doctor");
        setDoctor(data.doctor);
        setShift(data);
        setPatients(data.visits)
        setLoading(false)

      });
    }
  }, []);

  const handleClose = () => {
    setDialog((prev) => ({ ...prev, open: false }));
  };
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
    socket.on("connect", () => {
      console.log("doctor connected succfully with id" + socket.id);
    });

    socket.on("authenticatedResult", (doctorVisit) => {
      console.log("received result from server for patient " + pid);
      notify(doctorVisit);
      socketEventHandler(
        focusPatientafterLabResultAuthAction,
        doctorVisit,
        "Lab Results just finished for patient",
        finishedImg
      );
    });
    socket.on("newDoctorPatientFromServer", (doctorVisit) => {
      console.log("newDoctorPatientFromServer " + doctorVisit);
      // alert('new patient')
      update(doctorVisit);
      // showDocPatients();
      // socketEventHandler(null, doctorVisit, " has just booked", newImage);
    });

 
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("authenticatedResult");
      socket.off("newDoctorPatientFromServer");
    };
  }, []);
    useEffect(()=>{
      socket.on("patientUpdatedFromServer", (doctorVisit) => {
        patientUpdatedFromServerHandler(doctorVisit)
      });
      return ()=>{
        socket.off("patientUpdatedFromServer");
      }
    },[activeDoctorVisit])

  const patientUpdatedFromServerHandler = (doctorVisit)=>{
 // alert('patient updated')
 console.log(doctorVisit,'doc visit from server update','active docvisit id ',activeDoctorVisit?.id)
 update(doctorVisit)
 if (doctorVisit.id == activeDoctorVisit?.id) {
  // alert('same')
  console.log('saaaaaaaaaaame')
   setActiveDoctorVisit(doctorVisit);
 }
  }

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

  const getDoctorShift = (id: number, currentShiftId: number) => {
    return new Promise((resolve, reject) => {
      axiosClient
        .get(`doctorShift/find?id=${id}&currentShiftId=${currentShiftId}`)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const focusPatientafterLabResultAuthAction = (doctorVisit: DoctorVisit) => {
    setLayout((prev) => {
      return { ...prev, patients: "0fr", vitals: "0.7fr", visits: "0fr" };
    });
    setShowPatients(false);
    setActiveDoctorVisit(doctorVisit);
    setValue(9);
  };

  const socketEventHandler = (
    action: (doctorVisit: DoctorVisit) => void,
    patientData: DoctorVisit,
    title: string,
    img: string
  ) => {
    if (patientData != null) {
      notifyMe(
        `${patientData.patient.name} ${title} `,
        patientData,
        img,
        action
      );
    }
  };

  const SearchHandler = (e) => {
    console.log(e.key);
    if (e.key == "F9") {
      setShowSearch(true);
    }
  };

  const showDocPatients = () => {
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



  const update = (patient:DoctorVisit)=>{
    if(patient.id == activeDoctorVisit?.id){
      // setActiveDoctorVisit(()=>{
      //   return {...patient }
      // })
    }
    setPatients((prev)=>{
      
      if(!prev.find((p)=>p.id == patient.id)) return [patient,...prev]
      return prev.map((p)=>{
        if(p.id === patient?.id){
          return {...patient }
        }
        return p
      })
    })
  }
  //update doctor visit whenever change is made to doctorVisit state variable
  useEffect(() => {
    if (activeDoctorVisit) {
      if (activeDoctorVisit?.is_new == 1) {
        axiosClient.patch(`doctorVisit/${activeDoctorVisit?.id}`, {
          is_new: false,
        });
      }
      update(activeDoctorVisit)
    }
    //update patient when user click it to remove animation
  }, [activeDoctorVisit]);

  // console.log(file, "is file");
  const shiftDate = new Date(Date.parse(shift?.created_at));
  return (
    <>
      <div></div>
      <Stack direction={"row"} gap={1} alignItems={'center'} justifyContent={"space-between"}>
        {activeDoctorVisit && (
          <Stack
            sx={{ border: "1px dashed grey", borderRadius: "5px", p: 1 }}
            direction={"row"}
            gap={2}
            flexGrow={"1"}
            justifyContent={"space-between"}
          >
            <Stack direction={'row'} gap={1}>
              <Stack direction={'column'} gap={1}>
              <Typography variant="h6">
                <Box sx={{ display: "inline-block" }}>
                  Code : {activeDoctorVisit.id}
                </Box>
              </Typography>
              <Typography variant="h6">
                <Box sx={{ display: "inline-block" }}>
                  Visit : {activeDoctorVisit.number}
                </Box>
              </Typography>
                </Stack>
              <Typography sx={{ mr: 1 }} variant="h4">
              {activeDoctorVisit?.patient.name}
            </Typography>
            </Stack>
           
            <div>
              <Stack direction={"row"} gap={1}>
                <Typography variant="h6">
                  <Box sx={{ display: "inline-block", ml: 1 }}>
                    Age :{" "}
                    {
                      //print iso date
                      ` ${activeDoctorVisit?.patient.age_year ?? 0} Y ${
                        activeDoctorVisit?.patient.age_month == null
                          ? ""
                          : " / " + activeDoctorVisit?.patient.age_month + " M "
                      } ${
                        activeDoctorVisit?.patient.age_day == null
                          ? ""
                          : " / " + activeDoctorVisit?.patient.age_day + " D "
                      } `
                    }
                  </Box>
                </Typography>
                <Typography variant="h6">
                  <Box sx={{ display: "inline-block" }}>
                    Nationality : {activeDoctorVisit.patient?.country?.name}
                  </Box>
                </Typography>
              </Stack>

              <Typography variant="h6">
                <Box sx={{ display: "inline-block" }}>
                  Date :{" "}
                  {new Date(activeDoctorVisit.created_at).toLocaleString()}
                </Box>
              </Typography>
            
            </div>
          </Stack>
        )}

        {showSearch && (
          <Stack gap={1} direction={'row'} flexWrap={'wrap'}>
            <AutocompleteSearchPatient update={setActiveDoctorVisit} />
            <input  className="bg-transparent" onChange={(e)=>{
              axiosClient.post('patient/search/date',{date:e.target.value}).then(({data})=>{
                console.log(data,'search by date ')
                setPatients(data)
              })
            }} type="date" />
          </Stack>
        )}
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
          {activeDoctorVisit && (
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

            
              <Divider></Divider>
              <Stack
                direction={"column"}
                gap={1}
                alignItems={"center"}
                style={{ padding: "15px" }}
              >
                {patients.map((visit, i) => {
                  // console.log(visit, "visit in doctor page");
                  return (
                    <DoctorPatient
                      showPatients={showPatients}
                      setShowPatients={setShowPatients}
                      setLayout={setLayout}
                      setActiveDoctorVisit={setActiveDoctorVisit}
                      delay={i * 100}
                      activeDoctorVisit={activeDoctorVisit}
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
              {
                activeDoctorVisit.file?.patients?.map((patient: DoctorVisit, i) => {
                  return (
                    <ListItem
                      onClick={() => {
                        console.log(patient,'patient doc visit')
                        setActiveDoctorVisit({...patient,file:activeDoctorVisit.file});
                      }}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: (theme) =>
                          patient.id == activeDoctorVisit?.id
                            ? theme.palette.warning.light
                            : "",
                      }}
                      key={patient.id}
                    >
                      <Stack gap={2} flexWrap={'wrap'} direction="row">
                        <Typography>sheet ({i+1})</Typography>
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
        <Card key={activeDoctorVisit?.patient.updated_at} style={{ backgroundColor: "#ffffff40" }}>
          {activeDoctorVisit && (
            <VitalSigns 
              setActiveDoctorVisit={setActiveDoctorVisit}
              key={activeDoctorVisit.updated_at}
              socket={socket}
              patient={activeDoctorVisit}
            />
          )}
        </Card>
        {activeDoctorVisit ? (
          <Card
            style={{ backgroundColor: "#ffffff40" }}
            key={activeDoctorVisit?.id}
            sx={{ height: "80vh", overflow: "auto", p: 1 }}
          >
            {activeDoctorVisit && (
              <>
                <PatientInformationPanel
                  index={0}
                  value={value}
                  patient={activeDoctorVisit}
                />
                {/* <GeneralTab index={1} value={value}></GeneralTab> */}
                <GeneralExaminationPanel
                  setActiveDoctorVisit={setActiveDoctorVisit}
                  patient={activeDoctorVisit}
                  index={1}
                  value={value}
                />
                <ReviewOfSystems
                  setActiveDoctorVisit={setActiveDoctorVisit}
                  patient={activeDoctorVisit}
                  index={12}
                  setComplains={setComplains}
                  complains={complains}
                  value={value}
                />
                {!user?.is_nurse == 1 && (
                  <PresentingComplain
                    setComplains={setComplains}
                    complains={complains}
                    setDialog={setDialog}
                    patient={activeDoctorVisit}
                    setActiveDoctorVisit={setActiveDoctorVisit}
                    index={2}
                    value={value}
                  />
                )}
                {!user?.is_nurse == 1 && (
                  <PatientMedicalHistory
                    setActiveDoctorVisit={setActiveDoctorVisit}
                    setShift={setShift}
                    setDialog={setDialog}
                    patient={activeDoctorVisit}
                    index={3}
                    value={value}
                  />
                )}
                {!user?.is_nurse == 1 && (
                  <PatientPrescribedMedsTab
                    userSettings={userSettings}
                    items={items}
                    setActiveDoctorVisit={setActiveDoctorVisit}
                    user={user}
                    patient={activeDoctorVisit}
                    index={4}
                    value={value}
                  />
                )}
                {!user?.is_nurse == 1 && (
                  <ProvisionalDiagnosis
                    setDiagnosis={setDiagnosis}
                    diagnosis={diagnosis}
                    setActiveDoctorVisit={setActiveDoctorVisit}
                    patient={activeDoctorVisit}
                    index={5}
                    value={value}
                  />
                )}

                <AddLabTests
                  socket={socket}
                  setActiveDoctorVisit={setActiveDoctorVisit}
                  complains={complains}
                  patient={activeDoctorVisit}
                  index={6}
                  value={value}
                />

                <AddMedicalService
                  setActiveDoctorVisit={setActiveDoctorVisit}
                  patient={activeDoctorVisit}
                  index={7}
                  value={value}
                  socket={socket}
                />
                {user?.is_nurse == 1 && (
                  <Collection
                    setActiveDoctorVisit={setActiveDoctorVisit}
                    setShift={setShift}
                    complains={complains}
                    setDialog={setDialog}
                    patient={activeDoctorVisit}
                    index={8}
                    value={value}
                  />
                )}

                <LabResults
                  setActiveDoctorVisit={setActiveDoctorVisit}
                  setShift={setShift}
                  complains={complains}
                  setDialog={setDialog}
                  patient={activeDoctorVisit}
                  index={9}
                  value={value}
                />
                <SickLeave
                  setActiveDoctorVisit={setActiveDoctorVisit}
                  user={user}
                  patient={activeDoctorVisit}
                  index={10}
                  value={value}
                />
                {user?.is_nurse == 0 && (
                  <CarePlan
                    setActiveDoctorVisit={setActiveDoctorVisit}
                    setShift={setShift}
                    complains={complains}
                    setDialog={setDialog}
                    patient={activeDoctorVisit}
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

        {activeDoctorVisit && (
          <PatientPanel
            setActiveDoctorVisit={setActiveDoctorVisit}
            patient={activeDoctorVisit}
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
