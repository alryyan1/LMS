import "./addPatient.css";
import { useEffect, useState } from "react";
import Patient from "./Patient";
import PatientDetail from "./PatientDetail";
import { webUrl } from "../constants";
import pic1 from "../../assets/images/1.png";
import pic2 from "../../assets/images/2.png";
import pic3 from "../../assets/images/3.png";
import pic4 from "../../assets/images/4.png";
import pic5 from "../../assets/images/5.png";
import pic6 from "../../assets/images/6.png";
import pic7 from "../../assets/images/7.png";

const images = [pic1, pic2, pic3, pic4, pic5, pic6, pic7];
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  IconButton,
  Stack,
  Skeleton,
  Paper,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";
import AddDoctorDialog from "../Dialogs/AddDoctorDialog";
import MyCheckBoxLab from "../../components/MyCheckBoxLab";
import AutocompleteSearchPatient from "../../components/AutocompleteSearchPatient";
import { LoadingButton } from "@mui/lab";
import printJS from "print-js";
import { LabLayoutPros } from "../../LabLayout";
import { Shift } from "../../types/Shift";
import { DoctorVisit, Labrequest } from "../../types/Patient";
import { socket } from "../../socket";
import ShiftNav from "./ShiftNav";

function Sample() {
  const { searchByName } = useOutletContext<LabLayoutPros>();

  console.log(searchByName, "searchByname");
  const [isConnected, setIsConnected] = useState(socket.connected);

  const [patientsLoading, setPatientsLoading] = useState(false);
  const [activePatient, setActivePatient] = useState<DoctorVisit | null>(null);
  const [shift, setShift] = useState<Shift | null>(null);
  const [patients, setPatients] = useState<DoctorVisit[]>([]);
  const [selectedTest, setSelectedTest] = useState<Labrequest | null>(null);
  const [selectedReslult, setSelectedResult] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const update = (patient: DoctorVisit) => {
    console.log("method update run");
    setPatientsLoading(true);
    if (patient.id == activePatient?.id) {
      // setActiveDoctorVisit(()=>{
      //   return {...patient }
      // })
    }
    setPatients((prev) => {
      if (!prev.find((p) => p.id == patient.id)) {
        console.log("the patient is new");
        return [patient, ...prev];
      }
      return prev.map((p) => {
        if (p.id === patient?.id) {
          return { ...patient };
        }
        return p;
      });
    });
    setPatientsLoading(false);
  };
  console.log(selectedReslult, "selected result");
  function onConnect() {
    setIsConnected(true);
  }

  function onDisconnect() {
    setIsConnected(false);
  }
  const [layOut, setLayout] = useState({
    form: "1fr",
    tests: "1fr",
    testWidth: "400px",
    requestedDiv: "minmax(0,1.5fr)",
    showTestPanel: false,
    patientDetails: "0.8fr",
  });

  useEffect(() => {
    document.title = "سحب العينات";
    
    document.addEventListener("keydown", SearchHandler);

    return () => {
      document.removeEventListener("keydown", SearchHandler);
    };
  }, []);
  const SearchHandler = (e) => {
    console.log(e.key);
    if (e.key == "F9") {
      setShowSearch(true);
    }
  };
  useEffect(() => {
    setPatientsLoading(true);
    axiosClient.get(`shift/last`).then(({ data: data }) => {
      setShift(data.data);
      setPatients(data.data.patients);
      setPatientsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (shift) {
      setPatients(shift?.patients);
    }
  }, [shift]);
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
    socket.on("labPaymentFromServer", (docvisit) => {
      console.log("labPaymentFromServer ", docvisit);
      update(docvisit);
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
      socket.off("newDoctorPatientFromServer");
      socket.off("labPaymentFromServer");
    };
  }, []);
  //لو مافي ضيفو ولو في بدلو بالجديد الشديد

  useEffect(() => {
    socket.on("patientUpdatedFromServer", (doctorVisit) => {
      patientUpdatedFromServerHandler(doctorVisit);
    });
    return () => {
      socket.off("patientUpdatedFromServer");
    };
  }, [activePatient]);

  const patientUpdatedFromServerHandler = (doctorVisit) => {
    update(doctorVisit);
    if (doctorVisit.id == activePatient?.id) {
      // alert('same')
      console.log("saaaaaaaaaaame");
      setActivePatient(doctorVisit);
    }
  };
  const setActivePatientHandler = (pat: DoctorVisit) => {
    setSelectedResult(null);
    const data = patients.find((p) => p.id === pat.id);
    setActivePatient({ ...pat, active: true });
    // setSelectedTest(pat.patient.labrequests[0]);
  };
  const shiftDate = new Date(Date.parse(shift?.created_at));
  const containers = activePatient?.patient.labrequests.map((req) => {
    return req.main_test.container;
  });
  //سبحان الله
  const filteredContainers = containers?.filter(
    (item, index, array) => array.map((i) => i.id).indexOf(item.id) == index
  );
  console.log(filteredContainers, "filtered containers");

  console.log(containers, "containerss");
  return (
    <> 
             {showSearch && <Stack direction={"row"} sx={{mb:1}} gap={1}>
        <AutocompleteSearchPatient
          update={setActivePatientHandler}
          setActivePatientHandler={setActivePatientHandler}
        />
      </Stack>}
      <div
        style={{
          gap: "15px",
          transition: "0.3s all ease-in-out",
          height: "80vh",
          display: "grid",
          gridTemplateColumns: `10px ${layOut.form} 0.7fr    ${layOut.requestedDiv} ${layOut.patientDetails}  50px `,
        }}
      >
        <div></div>
        <Paper style={{ overflow: "auto" }} sx={{ p: 1 }}>
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
          <ShiftNav shift={shift} setShift={setShift} />
          <Divider></Divider>
          <Grid container>
            <Grid item xs={6}>
              <Typography textAlign={"center"}>Not Collect</Typography>
              <div className="patients" style={{ padding: "15px" }}>
                {patientsLoading ? (
                  <Skeleton
                    animation="wave"
                    variant="rectangular"
                    width={"100%"}
                    height={400}
                  />
                ) : (
                  patients
                    .filter((p) => p.patient.labrequests.length > 0)
                    .filter((p) => p.patient.sample_collected == 0)
                    .map((p, i) => (
                      <Patient
                        delay={i * 100}
                        key={p.id}
                        patient={p}
                        actviePatient={activePatient}
                        onClick={() => {
                          setActivePatientHandler(p);
                        }}
                      />
                    ))
                )}
              </div>
            </Grid>
            <Grid item xs={6}>
              <Typography textAlign={"center"}> Collected</Typography>
              <div className="patients" style={{ padding: "15px" }}>
                {patientsLoading ? (
                  <Skeleton
                    animation="wave"
                    variant="rectangular"
                    width={"100%"}
                    height={400}
                  />
                ) : (
                  patients
                    .filter((p) => p.patient.sample_collected == 1)
                    .map((p, i) => (
                      <Patient
                        delay={i * 100}
                        key={p.id}
                        patient={p}
                        actviePatient={activePatient}
                        onClick={() => {
                          setActivePatientHandler(p);
                        }}
                      />
                    ))
                )}
              </div>
            </Grid>
          </Grid>
        </Paper>
        <Paper style={{ height: "80vh", overflow: "auto" }}>
          {activePatient && activePatient.patient.labrequests.length > 0 && (
            <List>
              {activePatient.patient.labrequests.map((test) => {
                return (
                  <ListItem
                    sx={{
                      "&:hover": {
                        backgroundColor: "lightblue",
                        color: "white",
                      },
                    }}
                    key={test.main_test.id}
                  >
                    <ListItemButton
                      sx={
                        selectedTest && selectedTest.id == test.id
                          ? {
                              backgroundColor: (theme) =>
                                theme.palette.primary.main,
                            }
                          : null
                      }
                      onClick={() => {
                        setSelectedTest(test);
                        console.log(test, "selected test");
                      }}
                      style={{
                        marginBottom: "2px",
                        color: "black",
                      }}
                    >
                      <ListItemText primary={test.main_test.main_test_name} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Paper>
        <Paper sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
          {filteredContainers?.map((c) => {
            return (
              <img key={c.id} height={300} src={images[c.id - 1]} alt="" />
            );
          })}
        </Paper>

        <div>
          {/** add card using material   */}
          {activePatient && (
            <div>
              {" "}
              <PatientDetail
                key={activePatient.id}
                patient={activePatient}
                setShift={setShift}
              />
              <Divider />
              <LoadingButton
                onClick={() => {
                  axiosClient
                    .get(`patient/barcode/${activePatient.id}`)
                    .then(({ data }) => {
                      console.log(data, "barcode");
                    });

                  fetch("http://127.0.0.1:5000/", {
                    method: "POST",
                    headers: {
                      "Content-Type": "APPLICATION/JSON",
                    },

                    body: JSON.stringify(activePatient),
                  }).then(() => {});

                  axiosClient
                    .get(`patient/sampleCollected/${activePatient.patient.id}`)
                    .then(({ data }) => {
                      setPatients((prev)=>{
                        return prev?.map((p)=>{
                          if(p.id == data.data.id){
                            return data.data
                          }else{
                            return p
                          }
                        })
                      });
                    });

                  axiosClient
                    .get(`printBarcode/${activePatient.id}?base64=1`)
                    .then(({ data }) => {
                      const form = new URLSearchParams();

                      form.append("data", data);
                      console.log(data, "daa");
                      printJS({
                        printable: data.slice(data.indexOf("JVB")),
                        base64: true,
                        type: "pdf",
                      });

                      // fetch("http://127.0.0.1:4000/", {
                      //   method: "POST",
                      //   headers: {
                      //     "Content-Type": "application/x-www-form-urlencoded",
                      //   },

                      //   body: form,
                      // }).then(() => {});
                    });
                }}
                sx={{ mt: 1 }}
                fullWidth
                variant="contained"
              >
                Print Barcode
              </LoadingButton>
              {activePatient && activePatient.patient.sample_collected && (
                <Box>
                  <Divider />
                  <div style={{ marginTop: "10px" }} className="form-control">
                    <div>{activePatient.patient.sample_collect_time}</div>
                    <div>زمن سحب العينه </div>
                  </div>
                  <Divider />
                </Box>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Sample;
