import "../Laboratory/addPatient.css";
import { useEffect, useState } from "react";
import PatientDetail from "../Laboratory/PatientDetail";
import { webUrl } from "../constants";

import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  styled,
  Paper,
  Slide,
  Badge,
  Chip,
} from "@mui/material";
import {
  Mail,
} from "@mui/icons-material";
import { Link, useOutletContext } from "react-router-dom";
import { useStateContext } from "../../appContext";
import axiosClient from "../../../axios-client";
import AddDoctorDialog from "../Dialogs/AddDoctorDialog";
import ErrorDialog from "../Dialogs/ErrorDialog";
import SearchDialog from "../Dialogs/SearchDialog";
import ReceptionForm from "./ReceptionForm";
import ReceptionDoctorsDialog from "../Dialogs/ReceptionDoctorsDialog";
import ServiceGroup from "./ServiceGroups";
import RequestedServices from "./RequestedServices";
import ServiceMoneyDialog from "../Dialogs/ServiceMoneyDialog";
import PatientReception from "./PatientReception";
import CustumSideBar from "../../components/CustumSideBar";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Reception() {
  const {
    actviePatient,
    setActivePatient,
    setOpen,
    setDialog,
    setFoundedPatients,
    foundedPatients,
    openedDoctors,
    setOpenedDoctors,
    activeShift,
    setActiveShift,
    update,
    setUpdate,
    showPatientServices,
    setShowPatientServices,
    showServicePanel,
    setShowServicePanel,
  } = useOutletContext();
  // console.log(activeShift, "active doctor");
  // console.log(searchByName, "searchByname");
  const { setOpenDrawer, openDrawer, user } = useStateContext();

  const [layOut, setLayout] = useState({
    form: "1fr",
    hideForm: false,
    requestedDiv: "minmax(0,2fr)",
    showTestPanel: false,
    patientDetails: "0.8fr",
    patients: "1fr",
  });
  // console.log(openDrawer, "open drawer");


  useEffect(() => {
    if (foundedPatients.length > 0) {
      setLayout((prev) => {
        return {
          ...prev,
          patientDetails: "1fr",
        };
      });
    }
  }, [foundedPatients.length]);

  const hideForm = () => {
    setLayout((prev) => {
      return {
        ...prev,
        form: "0fr",
        hideForm: true,
        requestedDiv: "minmax(0,2.4fr)",

        patientDetails: "0.8fr",
        patients: "0.5fr",
      };
    });
  };
  const showFormHandler = () => {
    setActivePatient(null);
    setShowPatientServices(false);
    setShowServicePanel(false);
    setFoundedPatients([]);
    setLayout((prev) => {
      return {
        ...prev,
        form: "1fr",
        hideForm: false,
        requestedDiv: "minmax(0,1.3fr)",
        patients: "1fr",
      };
    });
  };
  // console.log("update count", update);
  const showShiftMoney = () => {
    setDialog((prev) => {
      return {
        ...prev,
        showMoneyDialog: true,
      };
    });
  };
  const showDoctorsDialog = () => {
    setDialog((prev) => {
      return {
        ...prev,
        showDoctorsDialog: true,
      };
    });
  };
  useEffect(() => {
    document.title = 'الاستقبال' ;
  }, []);
  //get opened doctors
  useEffect(() => {
    axiosClient.get("doctor/openShifts").then(({ data }) => {
      setOpenedDoctors(data);
      if (activeShift) {
        const findedActiveDoctorShift = data.find(
          (shift) => shift.id == activeShift.id
        );
        setActiveShift(findedActiveDoctorShift);

        // console.log(findedActiveDoctorShift, "findedActiveDoctorShift");
      }
      // setActiveShift()
      // console.log(data, "opened doctors");
    });
  }, [update]);
  // console.log(actviePatient, "active patient");
  let count = (activeShift?.visits?.length ?? 0) + 1;
  return (
    <>
      <Stack sx={{ m: 1 }} direction={"row"} gap={5}>
        {openedDoctors.map((shift, index) => {
          // console.log(shift, "shift");
          return (
            <Badge
              color="secondary"
              badgeContent={shift.visits.length}
              key={shift.id}
            >
              <Item
                className={
                  activeShift && activeShift.id === shift.id ? "active" : ""
                }
                sx={
                  activeShift && activeShift.id === shift.id
                    ? {
                        color: "black",
                        cursor: "pointer",
                        flexGrow: 1,
                        minWidth: "200px",
                        borderBottom:"4px solid blue",
                        fontWeight:"bolder",
                      }
                    : {
                        minWidth: "200px",
                        cursor: "pointer",
                        transition: "0.3s all ease-in-out",
                        transform: "scale(1.1)",
                      }
                }
                onClick={() => {
                  // console.log('activeShift',doctor.id);

                  setActiveShift(shift);
                  setActivePatient(null);
                  setShowPatientServices(false);
                  setShowServicePanel(false);
                  if (shift.visits.length == 0) {
                    showFormHandler();
                  } else {
                    hideForm();
                    setLayout((prev) => {
                      return {
                        ...prev,
                        patients: "2.4fr",
                      };
                    });
                  }
                }}
              >
                {shift.doctor.name}
              </Item>
            </Badge>
          );
        })}
      </Stack>
      <AddDoctorDialog />

      {/* <Drawer open={openDrawer}>{DrawerList}</Drawer> */}
      <div
        style={{
          gap: "15px",
          transition: "0.3s all ease-in-out",
          height: "75vh",
          display: "grid",
          gridTemplateColumns: `    ${layOut.patientDetails}   ${layOut.requestedDiv}  ${layOut.patients}   ${layOut.form} 0.1fr   `,
        }}
      >
        <div>
        {!actviePatient && foundedPatients.length > 0 && (
            <Slide
              style={{ position: "absolute", left: "0px" }}
              direction="up"
              in
              mountOnEnter
              unmountOnExit
            >
              <div>
                <SearchDialog />
              </div>
            </Slide>
          )}
          {actviePatient && (
            <Slide direction="up" in mountOnEnter unmountOnExit>
              <div>

                <PatientDetail
                  key={actviePatient.id}
                  patient={actviePatient.patient}
                  copyPatient={true}
                />
              </div>
            </Slide>
          )}
        </div>

        <div>
          {actviePatient && showServicePanel && <ServiceGroup />}
          {showPatientServices && (
            <Slide direction="up" in mountOnEnter unmountOnExit>
              <Paper sx={{ p: 1 }}>
                <div>
                  <RequestedServices />
                </div>
              </Paper>
            </Slide>
          )}
        </div>
        <Paper sx={{backgroundColor: '#ffffffbb!important'}}>
          <div style={{ overflow: "auto" }}>
            <Stack
              flexDirection={"row"}
              flexWrap={"wrap"}
              gap={2}
              style={{ padding: "15px", display: "flex" }}
            >
              {activeShift &&
                activeShift.visits.map((visit, index) => {
                  return (
                    <PatientReception
                      index={count--}
                      key={visit.id}
                      hideForm={hideForm}
                      visit={visit}
                    ></PatientReception>
                  );
                })}
            </Stack>
          </div>
        </Paper>
        <div>
          {layOut.hideForm || actviePatient ? (
            ""
          ) : (
            <ReceptionForm setUpdate={setUpdate} hideForm={hideForm} />
          )}
         
        </div>
        <CustumSideBar setOpen={setOpen} showShiftMoney={showShiftMoney} showFormHandler={showFormHandler} activeShift={activeShift} user={user} showDoctorsDialog={showDoctorsDialog}/>

        <ServiceMoneyDialog />
        <ErrorDialog />
        <ReceptionDoctorsDialog />
      </div>
    </>
  );
}

export default Reception;
