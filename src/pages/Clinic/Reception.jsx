import "../Laboratory/addpatient.css";
import { useEffect, useState } from "react";
import PatientDetail from "../Laboratory/PatientDetail";
import { webUrl } from "../constants";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
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
  styled,
  Paper,
  Skeleton,
  Slide,
  Badge,
} from "@mui/material";
import { Calculate, Group, Mail, PersonAdd, Print } from "@mui/icons-material";
import { Link, useOutletContext } from "react-router-dom";
import { useStateContext } from "../../appContext";
import axiosClient from "../../../axios-client";
import AddDoctorDialog from "../Dialogs/AddDoctorDialog";
import ErrorDialog from "../Dialogs/ErrorDialog";
import MoneyDialog from "../Dialogs/MoneyDialog";
import SearchDialog from "../Dialogs/SearchDialog";
import ReceptionForm from "./ReceptionForm";
import ReceptionDoctorsDialog from "../Dialogs/ReceptionDoctorsDialog";
import ServiceGroup from "./ServiceGroups";
import RequestedServices from "./RequestedServices";
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
    searchByName,
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
  console.log(activeShift, "active doctor");
  console.log(searchByName, "searchByname");
  const { setOpenDrawer, openDrawer } = useStateContext();

  const [layOut, setLayout] = useState({
    form: "1fr",
    tests: "1fr",
    hideForm: false,
    testWidth: "400px",
    requestedDiv: "1.5fr",
    showTestPanel: false,
    patientDetails: "0.7fr",
    patients: "1fr",
  });
  // console.log(openDrawer, "open drawer");

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {[
          { title: "تسجيل مريض", to: "/laboratory/add" },
          { title: "ادخال النتائج ", to: "" },
          { title: "سحب العينات", to: "" },
          { title: " اداره التحاليل", to: "" },
        ].map((item, index) => (
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
    if (foundedPatients.length > 0) {
      setLayout((prev) => {
        return {
          ...prev,
          patientDetails: "2fr",
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
        patientDetails: "0.7fr",
      };
    });
  };
  const showFormHandler = () => {
    setActivePatient(null);
    setShowPatientServices(false);
    setShowServicePanel(false);
    setFoundedPatients([]);
    setLayout((prev) => {
      return { ...prev, form: "1fr", hideForm: false };
    });
  };
  console.log("update count", update);
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
  //get opened doctors
  useEffect(() => {
    axiosClient.get("doctor/openShifts").then(({ data }) => {
      setOpenedDoctors(data);
      console.log(data, "opened doctors");
    });
  }, [update]);
  console.log(actviePatient, "active patient");

  return (
    <>
      <Stack sx={{ m: 1 }} direction={"row"} gap={5}>
        {openedDoctors.map((shift, index) => {
          console.log(shift, "shift");
          return (
            <Item
              sx={
                activeShift && activeShift.id === shift.id
                  ? {
                      backgroundColor: (theme) => {
                        console.log(theme, "theme");
                        return theme.palette.primary.main;
                      },
                      color: "white",
                      cursor: "pointer",
                      flexGrow: 1,
                    }
                  : {
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
                hideForm();
              }}
              key={index}
            >
              {shift.doctor.name}
            </Item>
          );
        })}
      </Stack>

      <Drawer open={openDrawer}>{DrawerList}</Drawer>
      <div
        style={{
          gap: "15px",
          transition: "0.3s all ease-in-out",
          height: "90vh",
          display: "grid",
          gridTemplateColumns: `0.1fr   ${layOut.form}  ${layOut.patients}    ${layOut.requestedDiv} ${layOut.patientDetails}    `,
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
                <RemoveRedEyeIcon />
              </IconButton>
            </Item>
            <Item>
              <IconButton variant="contained" onClick={showDoctorsDialog}>
                <Group />
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
            <ReceptionForm setUpdate={setUpdate} hideForm={hideForm} />
          )}
        </div>
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
                  <Badge
                    color="primary"
                    badgeContent={index + 1}
                    key={visit.id}
                  >
                    {" "}
                    <Item
                      onClick={() => {
                        if (actviePatient) {
                          /** this because if was same patient */
                          if (actviePatient.id == visit.id) {
                            console.log("same patient");
                          } else {
                            setActivePatient(visit);
                          }
                        } else {
                          setActivePatient(visit);
                        }
                        if (visit.services.length > 0) {
                          if (!showServicePanel) {
                            setShowPatientServices(true);
                          }
                        } else {
                          setShowServicePanel(true);
                        }
                        hideForm();
                      }}
                      sx={{
                        minWidth: "185px",
                        cursor: "pointer",
                        color: () => {
                          return actviePatient && actviePatient.id === visit.id
                            ? "white"
                            : "black";
                        },
                        backgroundColor: (theme) => {
                          return actviePatient && actviePatient.id === visit.id
                            ? theme.palette.primary.main
                            : "";
                        },
                      }}
                    >
                      {visit.name}
                    </Item>
                  </Badge>
                );
              })}
          </Stack>
        </div>

        <div>
          {actviePatient && showServicePanel && <ServiceGroup />}
          {showPatientServices && <RequestedServices />}
        </div>
        <div>
          {/** add card using material   */}
          {actviePatient && (
            <PatientDetail key={actviePatient.id} patient={actviePatient} />
          )}
          {!actviePatient && foundedPatients.length > 0 && (
            <Slide direction="up" in mountOnEnter unmountOnExit>
              <div>
                <SearchDialog />
              </div>
            </Slide>
          )}
        </div>
        <MoneyDialog />
        <ErrorDialog />
        <ReceptionDoctorsDialog />
      </div>
    </>
  );
}

export default Reception;
