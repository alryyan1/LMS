import "../Laboratory/addPatient.css";
import { useEffect, useState } from "react";
import PatientDetail from "../Laboratory/PatientDetail";
import DescriptionIcon from "@mui/icons-material/Description";
import {
  Stack,
  styled,
  Paper,
  Slide,
  Badge,
  Button,
  TextField,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
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
import { Item, webUrl } from "../constants";
import TestGroups from "../../../TestGroups";
import AddTestAutoComplete from "../Laboratory/AddTestAutoComplete";
import { socket } from "../../socket";
import { DoctorShift, DoctorVisit, Patient } from "../../types/Patient";
import RequestedTestsLab from "../Laboratory/RequestedTestsLab";
import { ReceptionLayoutProps } from "../../types/CutomTypes";
import OpenDoctorTabs from "./OpenDoctorsTabs";

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
    userSettings,
    showPatientServices,
    setShowPatientServices,
    showServicePanel,
    setShowServicePanel,
    companies,
    showTestPanel,
    setShowTestPanel,
    selectedTests,
    setSelectedTests,
    showLabTests,
    setShowLabTests,
    settings,
    dialog,
  } = useOutletContext<ReceptionLayoutProps>();

  const { user } = useStateContext();
  const [isConnected, setIsConnected] = useState(socket.connected);
  function onConnect() {
    setIsConnected(true);
  }

  function onDisconnect() {
    setIsConnected(false);
  }

  useEffect(() => {
    socket.on("disconnect", onDisconnect);
    socket.on("connect", onConnect);

    socket.on("connect", (args) => {
      console.log("reception connected succfully with id" + socket.id, args);
    });
    
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onConnect);
    };
  });
  const patientUpdatedFromServerHandler = (doctorVisit)=>{
    // alert('patient updated')
    console.log(doctorVisit,'doc visit from server update','active docvisit id ',actviePatient?.id)
    update(doctorVisit)
    if (doctorVisit.id == actviePatient?.id) {
     // alert('same')
     console.log('saaaaaaaaaaame')
      setActivePatient(doctorVisit);
    }
     }
  useEffect(()=>{
    socket.on("patientUpdatedFromServer", (doctorVisit) => {
      //patientUpdatedFromServerHandler(doctorVisit)
    });
    return ()=>{
      socket.off("patientUpdatedFromServer");
    }
  },[actviePatient])

  const [layOut, setLayout] = useState({
    form: "minmax(350px, 1fr)",
    hideForm: false,
    requestedDiv: "minmax(0,2fr)",
    showTestPanel: false,
    patientDetails: "0.8fr",
    patients: "minmax(270px,1fr)",
  });
  const updateHandler = (e, colName) => {
    axiosClient
      .patch(`patients/${actviePatient.patient.id}`, {
        [colName]: e.target.value,
      })
      .then(({ data }) => {
        console.log(data);
        if (data.status) {
          axiosClient
            .get(`doctorvisit/find?pid=${actviePatient.patient.id}`)
            .then(({ data }) => {
              change(data);
            });
          setDialog((prev) => {
            return {
              ...prev,
              message: "Saved",
              open: true,
              color: "success",
            };
          });
        }
      })
      .catch(({ response: { data } }) => {
        console.log(data);
        setDialog((prev) => {
          return {
            ...prev,
            message: data.message,
            open: true,
            color: "error",
          };
        });
      });
  };
  // console.log(openDrawer, "open drawer");

  const change = (doctorVisit: DoctorVisit) => {
    setActivePatient(doctorVisit);
    setActiveShift((prevShift: DoctorShift) => {
      return {
        ...prevShift,
        visits: prevShift.visits.map((v) => {
          if (v.id === doctorVisit.id) {
            console.log(doctorVisit, "doctor visit in side change");
            // alert('founded')
            return { ...doctorVisit };
          }
          return v;
        }),
      };
    });
    setOpenedDoctors((prev: DoctorShift[]) => {
      return prev.map((shift) => {
        return {
          ...shift,
          visits: shift.visits.map((v) => {
            if (v.id === doctorVisit.id) {
              console.log(doctorVisit, "doctor visit in side change");
              // alert('founded')
              return { ...doctorVisit };
            }
            return v;
          }),
        };
      });
    });
  };
  const hideForm = () => {
    setLayout((prev) => {
      return {
        ...prev,
        form: "0fr",
        hideForm: true,
        requestedDiv: "minmax(0,2.4fr)",

        patientDetails: "0.8fr",
        patients: "minmax(267px,1.2fr)",
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
        form: "minmax(350px, 1fr)",
        hideForm: false,
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
      console.log(data, "opened doctors");
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
  }, []);
  // console.log(actviePatient, "active patient");
  const update = (doctorVisit: DoctorVisit) => {
    console.log(doctorVisit, "doctor visit in update function", doctorVisit.id);
    setActivePatient(doctorVisit);
    setActiveShift((prev) => {
      if (prev.visits.map((v) => v.id).find((v) => v == doctorVisit.id)) {
        // alert('patient found')
        //existing
        //update patient
        const ActiveDoctorShiftUpdated = {
          ...prev,
          visits: [
            ...prev.visits.map((visit) => {
              if (visit.id === doctorVisit.id) {
                console.log(doctorVisit, "doctor visit in side change");
                // alert('founded')
                return { ...doctorVisit };
              }
              return visit;
            }),
          ],
        };
        //update openedDoctos
        setOpenedDoctors((prev) => {
          return prev.map((shift) => {
            if (shift.id === ActiveDoctorShiftUpdated.id) {
              console.log(doctorVisit, "doctor visit in side change");
              // alert('founded')
              return { ...ActiveDoctorShiftUpdated };
            }
            return shift;
          });
        });
        //return the updated ActiveDoctorShiftUpdated
        return ActiveDoctorShiftUpdated;
      } else {
        // alert('new patient')
        console.log("new patient");
        //new patietn added
        const ActiveDoctorShiftUpdated = {
          ...prev,
          visits: [{ ...doctorVisit }, ...prev.visits],
        };
        // update opened doctors state
        setOpenedDoctors((prev) => {
          return prev.map((shift) => {
            if (shift.id === ActiveDoctorShiftUpdated.id) {
              console.log(doctorVisit, "doctor visit in side change");
              // alert('founded')
              return { ...ActiveDoctorShiftUpdated };
            }
            return shift;
          });
        });
        //return the updated ActiveDoctorShiftUpdated
        return ActiveDoctorShiftUpdated;
      }
    });
  };
  const selectDoctorHandler = (shift: DoctorShift) => {
    setActiveShift(shift);
    setFoundedPatients([]);
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
          patients: "minmax(270px,3.2fr)",
        };
      });
    }
  };
  return (
    <>
      <Stack sx={{ m: 1 }} direction={"row"} gap={5}>
        <OpenDoctorTabs
          user={user}
          activeShift={activeShift}
          openedDoctors={openedDoctors}
          selectDoctorHandler={selectDoctorHandler}
        />
        {/* {openedDoctors
          // .filter((shift) => shift.user_id == user?.id)
          .map((shift) => {
            // console.log(shift, "shift");
            return (
              <Badge
                color="secondary"
                badgeContent={shift.visits.length}
                key={shift.id}
              >
                <Item
                  className={
                    activeShift && activeShift.id === shift.id
                      ? "activeDoctor doctor"
                      : "doctor"
                  }
                  onClick={selectDoctorHandler}
                >
                  {shift.doctor.name}
                </Item>
              </Badge>
            );
          })} */}
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
          {!actviePatient && dialog.showHistory > 0 && (
            <div
              style={{
                position: "absolute",
                zIndex: 3,
                width: "60vw",
                overflow: "auto",
              }}
            >
              <SearchDialog isReception={true} update={update} user={user} />
            </div>
          )}
          {actviePatient && (
            <Slide direction="up" in mountOnEnter unmountOnExit>
              <div>
                <PatientDetail
                  user={user}
                  settings={settings}
                  openedDoctors={openedDoctors}
                  activeShift={activeShift}
                  key={actviePatient.id}
                  patient={actviePatient}
                  copyPatient={true}
                />
                <Stack sx={{ mt: 1 }} direction={"row"} gap={2}>
                  <a
                    href={`${webUrl}printLabAndClinicReceipt?doctor_visit=${actviePatient.id}&user=${user?.id}`}
                  >
                    Receipt
                  </a>
                  <Button
                    size="small"
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
                        .get(
                          `printReception?doctor_visit=${actviePatient.id}&base64=1`
                        )
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

        <Paper sx={{ p: 1, backgroundColor: "#ffffffbb!important" }}>
          {actviePatient && showServicePanel && <ServiceGroup socket={socket} />}
          {actviePatient && showTestPanel && (
            <AddTestAutoComplete
              setShowTestPanel={setShowTestPanel}
              setShowLabTests={setShowLabTests}
              change={change}
              actviePatient={actviePatient}
              selectedTests={selectedTests}
              setActivePatient={setActivePatient}
              setDialog={setDialog}
              setSelectedTests={setSelectedTests}
            />
          )}
          {actviePatient &&
            showLabTests &&
            actviePatient.patient.labrequests.length > 0 && (
              <RequestedTestsLab
                actviePatient={actviePatient}
                companies={companies}
                setDialog={setDialog}
                update={update}
                userSettings={userSettings}
              />
            )}
          {actviePatient && showTestPanel && <TestGroups />}
          {showPatientServices && actviePatient.services.length > 0 && (
            <Slide direction="up" in mountOnEnter unmountOnExit>
              <div>
                <RequestedServices
                  update={update}
                  user={user}
                  activeShift={activeShift}
                  setShowServicePanel={setShowServicePanel}
                  companies={companies}
                  setActivePatient={setActivePatient}
                  setDialog={setDialog}
                  setShowPatientServices={setShowPatientServices}
                  actviePatient={actviePatient}
                />
              </div>
            </Slide>
          )}
          {actviePatient && (
            <TextField
              hidden
              sx={{ mt: 1 }}
              defaultValue={actviePatient.patient.discount}
              onChange={(e) => {
                updateHandler(e, "discount");
              }}
              label="Total Discount"
            ></TextField>
          )}
        </Paper>
        <Paper
          sx={{
            backgroundColor: "#ffffffbb!important",
            overflow: "auto",
            height: "77vh",
          }}
        >
          <div style={{ overflow: "auto", padding: "5px" }}>
            <Stack
              flexDirection={"row"}
              flexWrap={"wrap"}
              gap={2}
              justifyContent={"center"}
              style={{ padding: "5px", display: "flex" }}
            >
              {activeShift &&
                activeShift.visits
                  .filter((dcVisit) => dcVisit.only_lab == 0)
                  .map((visit) => {
                    return (
                      <PatientReception
                        change={change}
                        key={visit.id}
                        hideForm={hideForm}
                        patient={visit}
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
            <ReceptionForm
              socket={socket}
              settings={settings}
              hideForm={hideForm}
              update={update}
            />
          )}
        </div>
        <CustumSideBar
          activePatient={actviePatient}
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
            update={update}
            patient={actviePatient}
            // setPatients={setPatients}
          />
        )}
      </div>
    </>
  );
}

export default Reception;
