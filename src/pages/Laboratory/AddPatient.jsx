import "./addPatient.css";
import { useEffect, useState } from "react";
import Patient from "./Patient";
import PatientDetail from "./PatientDetail";
import { webUrl } from "../constants";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";

import {
  Divider,
  IconButton,
  Stack,
  styled,
  Paper,
  Skeleton,
  Slide,
  Box,
  Grid,
  Button,
} from "@mui/material";
import RequestedTests from "./RequestedTests";
import AddTestAutoComplete from "./AddTestAutoComplete";
import { Calculate, PersonAdd, Print, Search } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { useStateContext } from "../../appContext";
import axiosClient from "../../../axios-client";
import AddDoctorDialog from "../Dialogs/AddDoctorDialog";
import ErrorDialog from "../Dialogs/ErrorDialog";
import MoneyDialog from "../Dialogs/MoneyDialog";
import SearchDialog from "../Dialogs/SearchDialog";
import ReceptionForm from "../Clinic/ReceptionForm";
import TestGroups from "../../../TestGroups";
import PatientLab from "./PatientLab";
import AutocompleteSearchPatient from "../../components/AutocompleteSearchPatient";
import EditPatientDialog from "../Dialogs/EditPatientDialog";
import printJS from "print-js";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function AddPatient() {
  const {
    actviePatient,
    setActivePatient,
    setOpen,
    setDialog,
    searchByName,
    setFoundedPatients,
    foundedPatients,
    update,
    setUpdate,
    openEdit,
    setOpenEdit,
  } = useOutletContext();
  console.log(searchByName, "searchByname");
  const [patientsLoading, setPatientsLoading] = useState(false);
  console.log(actviePatient);
  const [patients, setPatients] = useState([]);
  const [layOut, setLayout] = useState({
    form: "1fr",
    tests: "1fr",
    hideForm: false,
    testWidth: "400px",
    requestedDiv: "minmax(0,1.5fr)",
    showTestPanel: false,
    patientDetails: "0.7fr",
  });

  useEffect(() => {
    setPatientsLoading(true);
    axiosClient.get(`shift/last`).then(({ data: data }) => {
      console.log(data.data, "today patients");
      //add activeProperty to patient object
      data.data.patients.forEach((patient) => {
        patient.active = false;
      });
      setPatientsLoading(false);

      setPatients(data.data.patients);
    });
  }, [update]);

  const setActivePatientHandler = (id) => {
    console.log(id, "in active patient handler");
    hideForm();
    console.log("start active patient clicked");
    // const data = patients.find((p) => p.id === id);
    // axiosClient.get(`patient/${id}`).then(({data})=>{
    // console.log(data, "patient from db");
    setActivePatient({ ...id, active: true });
    setPatients((prePatients) => {
      return prePatients.map((patient) => {
        if (patient.id === id.id) {
          console.log("patient founded");
          return { ...patient, active: true };
        } else {
          return { ...patient, active: false };
        }
      });
    });
    //}//).catch((error)=>console.log(error))
    // setActivePatient({...foundedPatient,active:true});
  };

  // useEffect(()=>{
  //   if(foundedPatients.length>0){
  //     setLayout((prev)=>{
  //       return {
  //        ...prev,
  //        form: "1.5fr",

  //       };
  //     })
  //   }

  // },[foundedPatients.length])

  const hideForm = () => {
    setLayout((prev) => {
      return {
        ...prev,
        form: "0fr",
        hideForm: true,
        tests: "2fr",
        testWidth: "500px",
        showTestPanel: false,
        patientDetails: "0.7fr",
      };
    });
  };
  const showFormHandler = () => {
    setActivePatient(null);
    setFoundedPatients([]);
    setLayout((prev) => {
      return { ...prev, form: "1fr", hideForm: false, tests: "1fr" };
    });
  };
  useEffect(() => {
    document.title = "تسجيل مريض للمعمل";
  }, []);

  const showShiftMoney = () => {
    setDialog((prev) => {
      return {
        ...prev,
        showMoneyDialog: true,
      };
    });
  };

  return (
    <>
      <Stack direction={'row'}   justifyContent={'space-between'} >
        <Box flexGrow={'1'}>

        </Box>
        <Box >
          <AutocompleteSearchPatient
            setActivePatientHandler={setActivePatientHandler}
          />
        </Box>
      </Stack>

      <div
        style={{
          marginTop:'5px',
          gap: "15px",
          transition: "0.3s all ease-in-out",
          height: "75vh",
          display: "grid",
          direction:'rtl',
          gridTemplateColumns: `0.1fr   ${layOut.form}  1fr    ${layOut.requestedDiv} ${layOut.patientDetails}    `,
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
              <IconButton variant="contained" onClick={showFormHandler}>
                <CreateOutlinedIcon />
              </IconButton>
            </Item>
            <Item>
              <IconButton
                variant="contained"
                onClick={() => {
                  setOpen(true);
                }}
              >
                <PersonAdd />
              </IconButton>
            </Item>
            <Item>
              <IconButton variant="contained" onClick={showShiftMoney}>
                <Calculate />
              </IconButton>
            </Item>
            <Item>
              <IconButton href={`${webUrl}lab/report`} variant="contained">
                <Print />
              </IconButton>
            </Item>
          </Stack>
        </div>
        <div>
          {layOut.hideForm || actviePatient ? (
            ""
          ) : (
            <ReceptionForm
              lab={true}
              setUpdate={setUpdate}
              hideForm={hideForm}
            />
          )}
        </div>
        <div style={{ overflow: "auto" }}>
          <AddTestAutoComplete setPatients={setPatients} />
          <div className="patients" style={{ padding: "15px" }}>
            {patientsLoading ? (
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={"100%"}
                height={400}
              />
            ) : (
              patients.map((p, i) => (
                <PatientLab
                  delay={i * 100}
                  key={p.id}
                  patient={p}
                  onClick={setActivePatientHandler}
                />
              ))
            )}
          </div>
        </div>

        <Box  style={{height:'80vh',overflow:'auto'}} sx={{ p: 1 }}>
          {actviePatient && actviePatient.labrequests.length > 0 && (
            <RequestedTests key={actviePatient.id} setPatients={setPatients} />
          )}
          {actviePatient?.labrequests.length == 0 && <TestGroups />}
        </Box>
        <div>
          {/** add card using material   */}
          {actviePatient && (
            <PatientDetail
              showBtns
              key={actviePatient.id}
              patient={actviePatient}
              setPatients={setPatients}
            />
          )}
           {actviePatient && <Stack sx={{mt:1}} direction={"row"} gap={2}>
                  <Button size="small"
                    sx={{ flexGrow: 1 }}
                    onClick={() => {
                      setOpenEdit(true);
                    }}
                    variant="contained"
                  >
                    Edit
                  </Button>
                  <Button
                  size="small"
                    sx={{ flexGrow: 1 }}
                    onClick={() => {
                      const form = new URLSearchParams();

                      axiosClient
                        .get(`printLab?pid=${actviePatient.id}&base64=1`)
                        .then(({ data }) => {
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
                          //     "Content-Type":
                          //       "application/x-www-form-urlencoded",
                          //   },

                          //   body: form,
                          // }).then(() => {});
                        });
                    }}
                    color="warning"
                    variant="contained"
                    target="myframe"
                  >
                    Print
                  </Button>
                </Stack>}
          {!actviePatient && foundedPatients.length > 0 && (
            <Slide direction="up" in mountOnEnter unmountOnExit>
              <div style={{ position: "relative" }}>
                <SearchDialog lab={true} />
              </div>
            </Slide>
          )}
        </div>
        <MoneyDialog />
        <ErrorDialog />
        {actviePatient &&<EditPatientDialog
          open={openEdit}
          isLab = {true}
          setOpen={setOpenEdit}
          patient={actviePatient}
          // setPatients={setPatients}
        />}
      </div>
    </>
  );
}

export default AddPatient;
