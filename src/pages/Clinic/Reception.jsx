import "../Laboratory/addPatient.css";
import { useEffect, useState } from "react";
import PatientDetail from "../Laboratory/PatientDetail";
import DescriptionIcon from '@mui/icons-material/Description';
import {
  Stack,
  styled,
  Paper,
  Slide,
  Badge,
  Button,
} from "@mui/material";
import {  useOutletContext } from "react-router-dom";
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
import EditPatientDialog from "../Dialogs/EditPatientDialog";
import printJS from "print-js";
import { webUrl } from "../constants";
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
    openEdit,
    setOpenEdit,
    open,
    update,
    setUpdate,
    showPatientServices,
    setShowPatientServices,
    showServicePanel,
    setShowServicePanel,
   companies,
  } = useOutletContext();
  const { user } = useStateContext();
  const [layOut, setLayout] = useState({
    form: "minmax(350px, 1fr)",
    hideForm: false,
    requestedDiv: "minmax(0,2fr)",
    showTestPanel: false,
    patientDetails: "0.8fr",
    patients: "1fr",
  });
  // console.log(openDrawer, "open drawer");

  // useEffect(() => {
  //   if (foundedPatients.length > 0) {
  //     setLayout((prev) => {
  //       return {
  //         ...prev,
  //         patientDetails: "1fr",
  //       };
  //     });
  //   }
  // }, [foundedPatients.length]);

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
    document.title = "الاستقبال";
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
        {openedDoctors.map((shift) => {
          // console.log(shift, "shift");
          return (
            <Badge
              color="secondary"
              badgeContent={shift.visits.length}
              key={shift.id}
            >
              <Item
                className={
                  activeShift && activeShift.id === shift.id ? "active" : "doctor"
                }
                sx={
                  activeShift && activeShift.id === shift.id
                    ? {
                    
                        cursor: "pointer",
                        flexGrow: 1,
                        minWidth: "200px",
                        borderBottom: "4px solid blue",
                        fontWeight: "bolder",
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
                  setFoundedPatients([])
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
                openedDoctors={openedDoctors}
                activeShift={activeShift}
                  key={actviePatient.id}
                  patient={actviePatient.patient}
                  copyPatient={true}
                />
                <Stack sx={{mt:1}} direction={"row"} gap={2}>
                  <a href={`${webUrl}printReceptionReceipt?doctor_visit=${actviePatient.id}&user=${user?.id}`}>Receipt</a>
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
                        .get(`printReception?doctor_visit=${actviePatient.id}&base64=1`)
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
                </Stack>
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
                  <RequestedServices activeShift={activeShift} setShowServicePanel={setShowServicePanel} setUpdate={setUpdate} companies={companies} setActivePatient={setActivePatient} setDialog={setDialog} setShowPatientServices={setShowPatientServices} actviePatient={actviePatient} />
                </div>
              </Paper>
            </Slide>
          )}
        </div>
        <Paper sx={{ backgroundColor: "#ffffffbb!important" }}>
          <div style={{ overflow: "auto" }}>
            <Stack
              flexDirection={"row"}
              flexWrap={"wrap"}
              gap={2}
              style={{ padding: "15px", display: "flex" }}
            >
              {activeShift &&
                activeShift.visits.map((visit) => {
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
        <CustumSideBar
          setOpen={setOpen}
          showShiftMoney={showShiftMoney}
          showFormHandler={showFormHandler}
          activeShift={activeShift}
          user={user}
          showDoctorsDialog={showDoctorsDialog}
        />

        <ServiceMoneyDialog />
        <ErrorDialog />
        <ReceptionDoctorsDialog />
        {actviePatient && (
          <EditPatientDialog
            doctorVisitId={actviePatient.id}
            open={openEdit}
            setOpen={setOpenEdit}
            patient={actviePatient.patient}
            // setPatients={setPatients}
          />
        )}
      </div>
    </>
  );
}

export default Reception;
