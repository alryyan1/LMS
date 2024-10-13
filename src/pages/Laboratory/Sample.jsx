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
function uniqe(val, index, array) {
  return array.indexOf(val) === index;
}
function Sample() {
  const { actviePatient, setActivePatient, searchByName, update } =
    useOutletContext();

  console.log(searchByName, "searchByname");
  const [patientsLoading, setPatientsLoading] = useState(false);
  console.log(actviePatient);
  const [shift, setShift] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedReslult, setSelectedResult] = useState(null);
  console.log(selectedReslult, "selected result");

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
  }, []);

  useEffect(() => {
    setPatientsLoading(true);
    axiosClient.get(`shift/last`).then(({ data: data }) => {
      console.log(data.data, "today patients");
      //add activeProperty to patient object
      data.data.patients.forEach((patient) => {
        patient.active = false;
      });
      setShift(data.data);
      setPatientsLoading(false);
    });
  }, [update]);
  console.log(shift, "selected shift");

  const setActivePatientHandler = (pat) => {
    // setSelectedTest(null)
    setSelectedResult(null);
    console.log("start active patient clicked");
    const data = shift?.patients.find((p) => p.id === pat.id);
    // axiosClient.get(`patient/${id}`).then(({data})=>{
    console.log(data, "patient from db");
    setActivePatient({ ...pat, active: true });
    setSelectedTest(pat.labrequests[0]);

    setShift((prev) => {
      return {
        ...prev,
        patients: prev.patients.map((patient) => {
          if (patient.id === pat.id) {
            console.log("founded");
            return { ...data, active: true };
          } else {
            return { ...patient, active: false };
          }
        }),
      };
    });
    //}//).catch((error)=>console.log(error))
    // setActivePatient({...foundedPatient,active:true});
  };
  const shiftDate = new Date(Date.parse(shift?.created_at));
  const containers = actviePatient?.labrequests.map((req) => {
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
      
      <div
        style={{
          gap: "15px",
          transition: "0.3s all ease-in-out",
          display: "inline-grid",
          gridTemplateColumns: `0.2fr   ${layOut.form}  0.7fr    ${layOut.requestedDiv} ${layOut.patientDetails}  0.2fr  `,
        }}
      >
        <div></div>
        <AutocompleteSearchPatient
          setActivePatientHandler={setActivePatientHandler}
        />
      </div>
      <div
        style={{
          gap: "15px",
          transition: "0.3s all ease-in-out",
          height: "80vh",
          display: "grid",
          gridTemplateColumns: `0.2fr   ${layOut.form}  0.7fr    ${layOut.requestedDiv} ${layOut.patientDetails}  0.2fr  `,
        }}
      >
        <div>
          <AddDoctorDialog />
        </div>
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
          <Stack justifyContent={"space-around"} direction={"row"}>
            <IconButton
              disabled={shift?.id == 1}
              onClick={() => {
                if (shift.id == 1) {
                  return;
                }

                axiosClient
                  .get(`shiftById/${shift.id - 1}`)
                  .then(({ data }) => {
                    console.log(data.data, "shift left");
                    setShift(data.data);
                  });
              }}
            >
              <ArrowBack />
            </IconButton>
            <IconButton
              disabled={shift?.id == shift?.maxShiftId}
              onClick={() => {
                // if (shift.id == 1) {
                //   return
                // }

                axiosClient
                  .get(`shiftById/${shift.id + 1}`)
                  .then(({ data }) => {
                    console.log(data.data, "shift left");
                    setShift(data.data);
                  });
              }}
            >
              <ArrowForward />
            </IconButton>
          </Stack>
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
                  shift?.patients
                    .filter((p) => p.sample_collected == 0)
                    .map((p, i) => (
                      <Patient
                        delay={i * 100}
                        key={p.id}
                        patient={p}
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
                  shift?.patients
                    .filter((p) => p.sample_collected == 1)
                    .map((p, i) => (
                      <Patient
                        delay={i * 100}
                        key={p.id}
                        patient={p}
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
          {console.log(actviePatient, "activve pateint")}
          {actviePatient && actviePatient.labrequests.length > 0 && (
            <List>
              {actviePatient.labrequests.map((test) => {
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
          {actviePatient && (
            <div>
              {" "}
              <PatientDetail
                key={actviePatient.id}
                patient={actviePatient}
                setShift={setShift}
              />
              <Divider />
              <LoadingButton
                onClick={() => {
                  axiosClient.get(`patient/barcode/${actviePatient.id}`).then(({data})=>{
                  console.log(data,'barcode')
                  })
  
                  fetch("http://127.0.0.1:5000/", {
                    method: "POST",
                    headers: {
                      "Content-Type": "APPLICATION/JSON",
                    },

                    body: JSON.stringify(actviePatient),
                  }).then(() => {});
                  
                  axiosClient
                    .get(`patient/sampleCollected/${actviePatient.id}`)
                    .then(({ data }) => {
                      setShift(data.shift);
                    });

                  axiosClient
                    .get(`printBarcode?pid=${actviePatient.id}&base64=1`)
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
              {    actviePatient && actviePatient.sample_collected && <Box>
            <Divider />
                <div style={{marginTop:'10px'}} className="form-control">
                  <div>{actviePatient.sample_collect_time}</div>
                  <div>زمن سحب العينه </div>
                </div>
                <Divider />
               
              </Box>}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Sample;
