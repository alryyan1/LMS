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
  Typography,
  Tooltip,
  IconButton,
  Card,
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
import AutocompleteSearchPatient from "../../components/AutocompleteSearchPatient";
import warningLottie from "./../../lotties/warning.json";
import Lottie from "react-lottie";
import { PanelBottom, PrinterIcon, Settings } from "lucide-react";
import bloodTest from "../../assets/images/blood-test.png";
import services from "../../assets/images/medical-report.png";
import AllMoneyDetails from "../Dialogs/AllMoneyDetails";
import { Print } from "@mui/icons-material";

function Reception() {
  const boxesOptions = {
    loop: true,
    autoplay: true,
    animationData: warningLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
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
  const [showNewShiftWarning, setShowNewShiftWarning] = useState(false);
  const [allMoneyUpdated, setAllMoneyUpdated] = useState(0);
  const [allMoneyUpdatedLab, setAllMoneyUpdatedLab] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);
    const [value, setValue] = useState(0);
  
  function onConnect() {
    setIsConnected(true);
  }

  function onDisconnect() {
    setIsConnected(false);
  }

  const SearchHandler = (e) => {
    console.log(e.key);
    if (e.key == "F9") {
      setShowSearch(true);
    }
  };
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
  const patientUpdatedFromServerHandler = (doctorVisit) => {
    // alert('patient updated')
    console.log(
      doctorVisit,
      "doc visit from server update",
      "active docvisit id ",
      actviePatient?.id
    );
    update(doctorVisit);
    if (doctorVisit.id == actviePatient?.id) {
      // alert('same')
      console.log("saaaaaaaaaaame");
      setActivePatient(doctorVisit);
    }
  };
  useEffect(() => {
    socket.on("patientUpdatedFromServer", (doctorVisit) => {
      //patientUpdatedFromServerHandler(doctorVisit)
    });
    socket.on("newShiftOpenedFromServer", (doctorVisit) => {
      //patientUpdatedFromServerHandler(doctorVisit)
      setShowNewShiftWarning(true);
    });
    return () => {
      socket.off("patientUpdatedFromServer");
      socket.off("newShiftOpenedFromServer");
    };
  }, [actviePatient]);

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
    hideForm();
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
        patients: "minmax(297px,1.2fr)",
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
    document.addEventListener("keydown", SearchHandler);

    return () => {
      document.removeEventListener("keydown", SearchHandler);
    };
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

  const focusPaitent = (doctorVisit) => {
    setActivePatient(doctorVisit);
    hideForm();
  };
  const update = (doctorVisit: DoctorVisit) => {
    console.log(doctorVisit, "doctor visit in update function", doctorVisit.id);
    setActivePatient(doctorVisit);
    hideForm();
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
        if (doctorVisit.patient.shift_id != doctorVisit.patient.lastShift)
          return prev;
        //new patietn added
        setShowServicePanel(true);
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
  const [showSearch, setShowSearch] = useState(false);
  const AllTestsArePaid = actviePatient?.patient.labrequests.every(
    (t) => t.is_paid
  )
    ? "success"
    : "error";
  const testsCount =
    actviePatient?.patient.labrequests.length == 0
      ? undefined
      : actviePatient?.patient.labrequests.length;
  return (
    <>
      <Stack sx={{ mb: 1 }} direction={"row"} gap={1}>
        {showNewShiftWarning && (
          <Stack sx={{ position: "absolute" }} direction={"column"} gap={2}>
            <Typography variant="h6">تم فتح ورديه ماليه جديده</Typography>
            <Lottie options={boxesOptions} height={100} width={100} />
          </Stack>
        )}
        <div>
          <AutocompleteSearchPatient
            setShowDetails={setShowDetails}
            autofocus={user?.isAcountant}
            width={250}
            hideForm={hideForm}
            withTests={1}
            focusPaitent={focusPaitent}
            activeShift={activeShift}
            setActiveShift={setActiveShift}
            openedDoctors={openedDoctors}
            setShowServicePanel={setShowServicePanel}
            setValue={setValue}
            setShowPatientServices={setShowPatientServices}

          />
        </div>

        <div style={{ width: `${window.innerWidth - 360}px` }}>
          <OpenDoctorTabs
            user={user}
            activeShift={activeShift}
            openedDoctors={openedDoctors}
            selectDoctorHandler={selectDoctorHandler}
            value={value}
             setValue={setValue}
          />
        </div>
      </Stack>
      <AddDoctorDialog />

      <div
        style={{
          gap: "15px",
          transition: "0.3s all ease-in-out",
          height: "75vh",
          display: "grid",
          gridTemplateColumns: `    ${layOut.patientDetails}   ${layOut.requestedDiv}  ${layOut.patients}   ${layOut.form} 0.1fr   `,
        }}
      >
        <Paper sx={{ p: 1, m: 1 }}>
          {!actviePatient && dialog.showHistory > 0 && (
            <div
              style={{
                position: "absolute",
                zIndex: 3,
                width: "60vw",
                overflow: "auto",
              }}
            >
              <SearchDialog
                openedDoctors={openedDoctors}
                setActiveShift={setActiveShift}
                isReception={true}
                update={update}
                user={user}
              />
            </div>
          )}

          <Slide direction="up" in mountOnEnter unmountOnExit>
            <div>
              {showDetails && actviePatient ? (
                <PatientDetail
                  user={user}
                  settings={settings}
                  openedDoctors={openedDoctors}
                  activeShift={activeShift}
                  key={actviePatient.id}
                  patient={actviePatient}
                  copyPatient={true}
                />
              ) : (
                <div style={{ width: "300px" }}>
                  <AllMoneyDetails
                    allMoneyUpdated={allMoneyUpdated}
                    allMoneyUpdatedLab={allMoneyUpdatedLab}
                  />
                </div>
              )}
            </div>
          </Slide>
        </Paper>

        <Paper key={actviePatient?.id} sx={{ p: 2 }}>
          {actviePatient && (
            <>
              <Stack sx={{ mb: 1 }} direction={"row"} gap={1}>
                <Stack sx={{ p: 0 }} direction={"row"} gap={1}>
                  <Tooltip title="الخدمات">
                    <Badge
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "bottom",
                      }}
                      color={
                        actviePatient.services.every((s) => s.is_paid)
                          ? "success"
                          : "error"
                      }
                      badgeContent={actviePatient.services.length}
                    >
                      <Button
                        className={showPatientServices ? "active" : ""}
                        sx={{ m: 1 }}
                        onDoubleClick={() => {
                          setShowTestPanel(false);
                          setShowLabTests(false);

                          setShowServicePanel(true);
                          setShowPatientServices(false);
                        }}
                        onClick={() => {
                          setShowTestPanel(false);
                          setShowLabTests(false);

                          setShowPatientServices(true);

                          setShowServicePanel(false);
                        }}
                      >
                        <img width={25} src={services} />
                      </Button>
                    </Badge>
                  </Tooltip>
                  <Tooltip title="التحاليل">
                    <Badge
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "bottom",
                      }}
                      color={testsCount ? AllTestsArePaid : ""}
                      badgeContent={testsCount}
                    >
                      <Button
                        //  sx={{border:'1px solid lightblue'}}
                        className={showLabTests ? "active" : ""}
                        onDoubleClick={() => {
                          setShowTestPanel(true);
                          setShowLabTests(false);
                        }}
                        onClick={() => {
                          setShowLabTests(true);
                          setShowTestPanel(false);

                          setShowPatientServices(false);
                          // showServicePanel(false);
                          setShowServicePanel(false);
                        }}
                        color="info"
                        title="Lab tests"
                        // variant="contained"
                      >
                        <img width={25} src={bloodTest} />
                      </Button>
                    </Badge>
                  </Tooltip>
                  <IconButton
                    disabled={user?.isAccountant}
                    title="تعديل بيانات المريض"
                    size="small"
                    sx={{ flexGrow: 1 }}
                    onClick={() => {
                      setOpenEdit(true);
                    }}
                    variant="contained"
                  >
                    <Settings />
                  </IconButton>
                  {showPatientServices && (
                    <IconButton
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
                      <PrinterIcon />
                    </IconButton>
                  )}
                  {showLabTests && (
                    <IconButton
                      size="small"
                      sx={{ flexGrow: 1 }}
                      onClick={() => {
                        const form = new URLSearchParams();

                        fetch("http://127.0.0.1:5000/", {
                          method: "POST",
                          headers: {
                            "Content-Type": "APPLICATION/JSON",
                          },

                          body: JSON.stringify(actviePatient),
                        }).then(() => {});
                        if (settings?.barcode) {
                          axiosClient
                            .get(`patient/barcode/${actviePatient.id}`)
                            .then(({ data }) => {
                              console.log(data, "barcode");
                            });
                        }

                        axiosClient
                          .get(`printLab/${actviePatient.id}?base64=1`)
                          .then(({ data }) => {
                            form.append("data", data);
                            // console.log(data, "daa");
                            if (userSettings?.web_dialog) {
                              printJS({
                                printable: data.slice(data.indexOf("JVB")),
                                base64: true,
                                type: "pdf",
                              });
                            }
                            if (userSettings?.node_dialog) {
                              fetch("http://127.0.0.1:4000/", {
                                method: "POST",
                                headers: {
                                  "Content-Type":
                                    "application/x-www-form-urlencoded",
                                },

                                body: form,
                              }).then(() => {});
                            }
                          });
                      }}
                      color="warning"
                      variant="contained"
                      target="myframe"
                    >
                      <PrinterIcon />
                    </IconButton>
                  )}

                  <IconButton
                    title=" A5  فاتوره"
                    href={`${webUrl}printLabAndClinicReceipt?doctor_visit=${actviePatient.id}&user=${user?.id}`}
                  >
                    <Print />
                  </IconButton>
                </Stack>

                <a
                  href={`${webUrl}printReceptionReceipt?doctor_visit=${actviePatient.id}&user=${user?.id}`}
                >
                  ايصال
                </a>
              </Stack>
            </>
          )}
          {actviePatient && showServicePanel && (
            <ServiceGroup socket={socket} />
          )}
          {actviePatient && showTestPanel && (
            <AddTestAutoComplete
              setShowTestPanel={setShowTestPanel}
              setShowLabTests={setShowLabTests}
              setActiveDoctorVisit={change}
              actviePatient={actviePatient}
              selectedTests={selectedTests}
              setDialog={setDialog}
              setSelectedTests={setSelectedTests}
            />
          )}
          {showLabTests && actviePatient && (
            <RequestedTestsLab
              setAllMoneyUpdatedLab={setAllMoneyUpdatedLab}
              actviePatient={actviePatient}
              companies={companies}
              setDialog={setDialog}
              update={update}
              userSettings={userSettings}
            />
          )}
          {actviePatient && showTestPanel && <TestGroups />}
          {actviePatient &&
            showPatientServices &&
            actviePatient.services.length > 0 && (
              <Slide direction="up" in mountOnEnter unmountOnExit>
                <div>
                  <RequestedServices
                    setAllMoneyUpdated={setAllMoneyUpdated}
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
            // overflow: "auto",
            height: "77vh",
            overflowX: "hidden",
            overflowY: "auto",
          }}
        >
          <div
            style={{ overflowX: "hidden", overflowY: "auto", padding: "5px" }}
          >
            <Stack
              flexDirection={"row"}
              flexWrap={"wrap"}
              gap={2}
              justifyContent={"center"}
              style={{
                padding: "5px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {activeShift &&
                activeShift.visits
                  .filter((dcVisit) => dcVisit.only_lab == 0)
                  .map((visit) => {
                    return (
                      <PatientReception
                        showDetails={showDetails}
                        setShowDetails={setShowDetails}
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
        {!user?.isAccountant ? (
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
        ) : (
          <div></div>
        )}
        <CustumSideBar
          setAllMoneyUpdatedLab={setAllMoneyUpdatedLab}
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
