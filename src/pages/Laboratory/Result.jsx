import "./addPatient.css";
import { useEffect, useState } from "react";
import Patient from "./Patient";
import PatientDetail from "./PatientDetail";
import { Item, webUrl } from "../constants";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";

import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Stack,
  Skeleton,
  Slide,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  makeStyles,
} from "@mui/material";
import RequestedTests from "./RequestedTests";
import {
  ArrowBack,
  ArrowForward,
  Calculate,
  CheckBox,
  Delete,
  Download,
  FilterTiltShift,
  Mail,
  PersonAdd,
  Print,
  Search,
} from "@mui/icons-material";
import { Link, useOutletContext } from "react-router-dom";
import { useStateContext } from "../../appContext";
import axiosClient from "../../../axios-client";
import AddDoctorDialog from "../Dialogs/AddDoctorDialog";
import ErrorDialog from "../Dialogs/ErrorDialog";
import MoneyDialog from "../Dialogs/MoneyDialog";
import SearchDialog from "../Dialogs/SearchDialog";
import TestGroups from "../../../TestGroups";
import AutocompleteResultOptions from "../../components/AutocompleteResultOptions";

function Result() {
  const {
    actviePatient,
    setActivePatient,
    setOpen,
    searchByName,
    foundedPatients,
    update,
  } = useOutletContext();

  console.log(searchByName, "searchByname");
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [resultUpdated, setResultUpdated] = useState(0);
  console.log(actviePatient);
  const { setOpenDrawer, openDrawer } = useStateContext();
  const [patients, setPatients] = useState([]);
  const [shift, setShift] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [layOut, setLayout] = useState({
    form: "1fr",
    tests: "1fr",
    testWidth: "400px",
    requestedDiv: "minmax(0,1.5fr)",
    showTestPanel: false,
    patientDetails: "0.8fr",
  });
  console.log(openDrawer, "open drawer");

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {[
          { title: "تسجيل مريض", to: "/laboratory/add" },
          { title: "ادخال النتائج ", to: "" },
          { title: "سحب العينات", to: "" },
          { title: " اداره التحاليل", to: "/laboratory/tests" },
          { title: "قائمه الاسعار", to: "/laboratory/price" },
        ].map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton
              onClick={() => setOpenDrawer(false)}
              LinkComponent={Link}
              to={item.to}
            >
              <ListItemIcon>
                <Mail />
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

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

      setPatients(data.data.patients);
    });
  }, [update]);
  console.log(patients, "patients");

  const setActivePatientHandler = (id) => {
    setSelectedTest(null)
    console.log("start active patient clicked");
    const data = patients.find((p) => p.id === id);
    // axiosClient.get(`patient/${id}`).then(({data})=>{
    console.log(data, "patient from db");
    setActivePatient({ ...data, active: true });
    setPatients((prePatients) => {
      return prePatients.map((patient) => {
        if (patient.id === id) {
          console.log("founded");
          return { ...data, active: true };
        } else {
          return { ...patient, active: false };
        }
      });
    });
    //}//).catch((error)=>console.log(error))
    // setActivePatient({...foundedPatient,active:true});
  };
  const shiftDate = new Date(Date.parse(shift?.created_at));
  return (
    <>
      <Drawer open={openDrawer}>{DrawerList}</Drawer>
      <div
        style={{
          gap: "15px",
          transition: "0.3s all ease-in-out",
          height: "90vh",
          display: "grid",
          gridTemplateColumns: `0.1fr   ${layOut.form}  0.7fr    ${layOut.requestedDiv} ${layOut.patientDetails}    `,
        }}
      >
        <div>
          <AddDoctorDialog />

          <Stack
            sx={{ mr: 1 }}
            gap={"5px"}
            divider={<Divider orientation="vertical" flexItem />}
            direction={"column"}
          >
            <Item>
                <IconButton
                
                  variant="contained"
                >
                  <FilterTiltShift />
                </IconButton>
  
            </Item>
            {selectedTest && (
              <Item>
                <IconButton
                  onClick={() => {
                    axiosClient
                      .post(`requestedResult/default/${selectedTest.id}`)
                      .then(({ data }) => {
                        console.log(data, "labrequest data");
                        setSelectedTest((prev) => {
                          console.log(prev, "previous selected test");
                          return data.labrequest;
                        });
                        setResultUpdated((prev) => {
                          return prev + 1;
                        });
                        setPatients((prev) => {
                          return prev.map((patient) => {
                            if (patient.id === actviePatient.id) {
                              return {
                                ...patient,
                                labrequest: data.labrequest,
                              };
                            }
                            return patient;
                          });
                        });
                      });
                  }}
                  variant="contained"
                >
                  <Download />
                </IconButton>
              </Item>
            )}
          </Stack>
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
            <IconButton>
              <ArrowBack />
            </IconButton>
            <IconButton>
              <ArrowForward />
            </IconButton>
          </Stack>
          <Divider></Divider>
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
                .filter((patient) => patient.labrequests.length > 0)
                .map((p, i) => (
                  <Patient
                    delay={i * 100}
                    key={p.id}
                    patient={p}
                    onClick={setActivePatientHandler}
                  />
                ))
            )}
          </div>
        </Paper>
        <Paper style={{ height: "85vh", overflow: "auto" }}>
          {actviePatient && actviePatient.labrequests.length > 0 && (
            <List>
              {actviePatient.labrequests.map((test) => {
                return (
                  <ListItem
                    sx={{
                      "&:hover": {
                        backgroundColor: "transparent",
                        color: "white",
                      },
                    }}
                    secondaryAction={<CheckBox />}
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
        <Paper>
          <Table  key={selectedTest?.id + resultUpdated} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell width="80%">Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedTest &&
                selectedTest.requested_results.map((req) => {
                  console.log(selectedTest, "req result in table");
                  return (
                    <TableRow key={req.id}>
                      <TableCell sx={{p:0.5}}>{req.child_test.child_test_name}</TableCell>
                      <TableCell sx={{p:0.5}}>
                        <AutocompleteResultOptions
                          result={req.result}
                          id={req.id}
                          child_id={req.child_test_id}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Paper>

        <div>
          {/** add card using material   */}
          {actviePatient && (
            <PatientDetail
              key={actviePatient.id}
              patient={actviePatient}
              setPatients={setPatients}
            />
          )}
          {!actviePatient && foundedPatients.length > 0 && (
            <Slide direction="up" in mountOnEnter unmountOnExit></Slide>
          )}
        </div>
        <MoneyDialog />
        <ErrorDialog />
      </div>
    </>
  );
}

export default Result;
