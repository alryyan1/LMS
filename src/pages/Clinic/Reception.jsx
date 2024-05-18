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
  Chip,
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
import ServiceMoneyDialog from "../Dialogs/ServiceMoneyDialog";
import PatientReception from "./PatientReception";
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
  const { setOpenDrawer, openDrawer,user } = useStateContext();

  const [layOut, setLayout] = useState({
    form: "1fr",
    hideForm: false,
    requestedDiv: "minmax(0,2.4fr)",
    showTestPanel: false,
    patientDetails: "0.8fr",
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
      requestedDiv: "minmax(0,2.4fr)",

        patientDetails: "0.8fr",
        patients: "1fr",
      };
    });
  };
  const showFormHandler = () => {
    setActivePatient(null);
    setShowPatientServices(false);
    setShowServicePanel(false);
    setFoundedPatients([]);
    setLayout((prev) => {
      return { ...prev, form: "1fr", hideForm: false,requestedDiv:"minmax(0,1.3fr)" };
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
            <Badge color="secondary" badgeContent={shift.visits.length} key={shift.id}>
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
                  if (shift.visits.length == 0) {
                 showFormHandler()
                  }else{

                    hideForm();
                  }
                  setLayout((prev) => {
                    return {
                      ...prev,
                      patients: "2.4fr",
                    };
                  });
                }}
              >
                {shift.doctor.name}
              </Item>
            </Badge>
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
              <IconButton href={`${webUrl}clinics/report?user=${user.id}`} variant="contained">
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
        <Paper>
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
                      key={visit.id}
                      hideForm={hideForm}
                      visit={visit}
                      index={index}
                    ></PatientReception>
                  );
                })}
            </Stack>
          </div>
        </Paper>

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
        <div>
          {/** add card using material   */}
          {actviePatient && (
            <Slide direction="up" in mountOnEnter unmountOnExit>
              <div>
                <PatientDetail key={actviePatient.id} patient={actviePatient} />
              </div>
            </Slide>
          )}
          {!actviePatient && foundedPatients.length > 0 && (
            <Slide direction="up" in mountOnEnter unmountOnExit>
              <div>
                <SearchDialog />
              </div>
            </Slide>
          )}
        </div>
        <ServiceMoneyDialog />
        <ErrorDialog />
        <ReceptionDoctorsDialog />
      </div>
    </>
  );
}

export default Reception;
