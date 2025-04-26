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
  Skeleton,
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
import { Item, printBarcodeOldWay, updateHandler, webUrl } from "../constants";
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
  const [loadingDoctorPatients, setLoadingDoctorPatients] = useState(false);
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
    dialog,
  } = useOutletContext<ReceptionLayoutProps>();

  const { user } = useStateContext();
  const [showNewShiftWarning, setShowNewShiftWarning] = useState(false);
  const [allMoneyUpdated, setAllMoneyUpdated] = useState(0);
  const [allMoneyUpdatedLab, setAllMoneyUpdatedLab] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [value, setValue] = useState(0);
  const [settings, setSettings] = useState(null);
  const [fileMode, setFileMode] = useState(false);
  const [doctorvisitIsLoading, setDoctorvisitIsLoading] = useState(false);

  const [patients,setPatients] = useState<DoctorVisit[]>([]);
  useEffect(()=>{
    setPatients((prev)=>{
      return prev.map((p)=>{
        if(p.id === actviePatient?.id){
          return {...actviePatient} 
        }
        return p;
      })
    })
  },[actviePatient])
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
    axiosClient.get("settings").then(({ data }) => {
      console.log(data, "data see");
      setSettings(data);
    });
  }, []);
  const showDoctorsDialog = () => {
    setDialog((prev) => {
      return {
        ...prev,
        showDoctorsDialog: true,
      };
    });
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
 
  // console.log(openDrawer, "open drawer");

  const change = (doctorVisit: DoctorVisit) => {
    hideForm();
    setActivePatient(doctorVisit);
    setActiveShift((prevShift: DoctorShift) => {
      return {
        ...prevShift,
        visits: prevShift?.visits?.map((v) => {
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
          visits: shift?.visits?.map((v) => {
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
        patients: "minmax(315px,1.2fr)",
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
        form: "minmax(350px, 400px)",
        hideForm: false,
        requestedDiv:'0fr'
      };
    });
  };
  // console.log("update count", update);

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
    // alert('s')
    console.log(doctorVisit, "doctor visit in update function", doctorVisit.id);
    setActivePatient(doctorVisit);
    hideForm();
   
  };
  const selectDoctorHandler = (shift: DoctorShift) => {
    setActiveShift(shift);
    setFoundedPatients([]);
    setActivePatient(null);
    setShowPatientServices(false);
    setShowServicePanel(false);
    // if (shift.visits.length == 0) {
    //   showFormHandler();
    // } else {
    hideForm();
    setLayout((prev) => {
      return {
        ...prev,
        patients: "minmax(270px,3.2fr)",
      };
    });
    // }
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
           setFileMode={setFileMode}
            setOpenedDoctors={setOpenedDoctors}
            setActiveShift={setActiveShift}
            user={user}
            activeShift={activeShift}
            openedDoctors={openedDoctors}
            selectDoctorHandler={selectDoctorHandler}
            value={value}
            setLoadingDoctorPatients={setLoadingDoctorPatients}
            setValue={setValue}
            setPatients={setPatients}
          />
        </div>
      </Stack>
      <AddDoctorDialog />

      <div
        style={{
          gap: "15px",
          transition: "0.3s all ease-in-out",
          // height: window.innerHeight,
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
                width: `${window.innerWidth - 700}px`,
                overflow: "auto",
                boxShadow: "2px 7px 10px gray"
              }}
            >
              <SearchDialog
                openedDoctors={openedDoctors}
                setActiveShift={setActiveShift}
                isReception={true}
                update={update}
                user={user}
                setPatients={setPatients}
                activeShift={activeShift}
              />
            </div>
          )}

          <Slide direction="up" in mountOnEnter unmountOnExit>
            <div>
              {showDetails && actviePatient ? (
                <PatientDetail
                fileMode={fileMode}
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
                   user={user}
                  setAllMoneyUpdatedLab={setAllMoneyUpdatedLab}
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
                                  "Content-Type": "application/x-www-form-urlencoded",
                                },
      
                                body: form,
                              }).then(() => {});
                            }
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

                       
                        if (settings?.barcode) {
                          try{

                            printBarcodeOldWay(actviePatient)
                          }catch(e){

                          }
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
            <ServiceGroup settings={settings}  setShowServicePanel={setShowServicePanel} activeShift={activeShift} setActivePatient={setActivePatient} actviePatient={actviePatient} setShowPatientServices={setShowPatientServices} socket={socket} />
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
                  doctorvisitIsLoading={doctorvisitIsLoading}
                  setDoctorvisitIsLoading={setDoctorvisitIsLoading}
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
                updateHandler(e.target.value, "discount",actviePatient,setActivePatient);
              }}
              label="Total Discount"
            ></TextField>
          )}
        </Paper>
        <Paper
          sx={{
            overflowY: "auto",
            height: `${window.innerHeight - 100}px`,
            overflowX: "hidden",
            // overflowY: "auto",
        

          }}
        >
            {actviePatient && (
          <div key={actviePatient?.id}>
              <EditPatientDialog
            doctorVisitId={actviePatient.id}
            open={openEdit}
            setOpen={setOpenEdit}
            update={update}
            patient={actviePatient}
            // setPatients={setPatients}
          />
          </div>
        
        )}
            <div
              style={{ overflowX: "hidden", overflowY: "auto", padding: "5px" }}
            >
    {fileMode &&<>
      <Typography fontWeight={"bold"} sx={{ textAlign: "center", mb: 2 }}>
           ملف المريض نشط
        </Typography>
        <Typography fontWeight={"bold"} sx={{ textAlign: "center", mb: 2 }}>
             عدد الزيارات {patients.length}
        </Typography>
    </> }
               {loadingDoctorPatients ?
            <Skeleton  height={"400px"} />  : <Stack
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
              
          
                {
                  patients
                    ?.filter((dcVisit) => dcVisit.only_lab == 0)
                    .map((visit) => {
                      return (
                        <PatientReception
                        setDoctorvisitIsLoading={setDoctorvisitIsLoading}
                        fileMode={fileMode}
                        setFileMode={setFileMode}
                        setPatients={setPatients}
                          showDetails={showDetails}
                          setShowDetails={setShowDetails}
                          change={change}
                          key={visit.id}
                          hideForm={hideForm}
                          patient={visit}
                        ></PatientReception>
                      );
                    })}
              </Stack>}
            </div>
          
        </Paper>
        {!user?.isAccountant ? (
          <div>
            {layOut.hideForm || actviePatient ? (
              ""
            ) : (
              <ReceptionForm
              setShowDetails={setShowDetails}
                socket={socket}
                settings={settings}
                hideForm={hideForm}
                update={update}
                setPatients={setPatients}
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
          showFormHandler={showFormHandler}
          showDoctorsDialog={showDoctorsDialog}
          activeShift={activeShift}
          user={user}
        />

        <ServiceMoneyDialog />
        <ErrorDialog />
        <ReceptionDoctorsDialog />
     
      </div>
    </>
  );
}

export default Reception;
