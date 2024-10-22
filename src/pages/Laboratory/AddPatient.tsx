import "./addPatient.css";
import { useEffect, useState } from "react";
import PatientDetail from "./PatientDetail";
import { Item, webUrl } from "../constants";
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
  Card,
  TextField,
} from "@mui/material";
import { Calculate, PersonAdd, Print, Search } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
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
import { useStateContext } from "../../appContext";
import RequestedTestsLab from "./RequestedTestsLab";
import AddTestAutocompleteLab from "./AddTestAutocompleteLab";
import { LabLayoutPros } from "../../LabLayout";
import { DoctorVisit } from "../../types/Patient";
import { socket } from "../../socket";

function AddPatient() {
  const { user } = useStateContext();

  const {
    actviePatient,
    setActivePatient,
    setOpen,
    setDialog,
    searchByName,
    setFoundedPatients,
    foundedPatients,

    openEdit,
    setOpenEdit,
    dialog,
    patientsLoading,
    setPatientsLoading,
    selectedTests,
    setSelectedTests,
    settings,
    userSettings,
    companies,
  } = useOutletContext<LabLayoutPros>();
  const update = (doctorVisit: DoctorVisit) => {
    setActivePatient(doctorVisit);
    setPatients((prev) => {
      if (prev.map((d) => d.id).find((d) => d == doctorVisit.id)) {
        return prev.map((patient) => {
          if (patient.id === doctorVisit.id) {
            return { ...doctorVisit };
          } else {
            return patient;
          }
        });
      } else {
        return [  doctorVisit,...prev ];
      }
    });
  };
  const [patients, setPatients] = useState<DoctorVisit[]>([]);
  const [layOut, setLayout] = useState({
    form: "minmax(350px,1fr)",
    tests: "1fr",
    hideForm: false,
    testWidth: "400px",
    requestedDiv: "minmax(0,1.5fr)",
    showTestPanel: false,
    patientDetails: "0.7fr",
  });
  const updateHandler = (e, colName) => {
    axiosClient
      .patch(`patients/${actviePatient.id}`, {
        [colName]: e.target.value,
      })
      .then(({ data }) => {
        console.log(data);
        if (data.status) {
          axiosClient
            .get(`doctorvisit/find?pid=${actviePatient.id}`)
            .then(({ data }) => {
              setActivePatient(data.patient);
              setPatients((prePatients) => {
                return prePatients.map((patient) => {
                  if (patient.id === data.patient.id) {
                    // console.log("patient founded");
                    return { ...data.patient, active: true };
                  } else {
                    return { ...patient, active: false };
                  }
                });
              });
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
  //  console.log(setActivePatient, "setActviePatient");
  useEffect(() => {
    setPatientsLoading(true);
    axiosClient.get(`shiftWith?with=patients`).then(({ data }) => {
      // console.log(first)
      console.log(data, "last shift");
      // //add activeProperty to patient object
      // data.data.patients.forEach((patient) => {
      //   // console.log('patients',patient)
      //   patient.active = false;
      // });
      setPatientsLoading(false);

      setPatients(data.patients);
    });
  }, []);
  const setActivePatientHandler = (id) => {
    // console.log(id, "in active patient handler");
    hideForm();

    update(id);
  };

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
      <Stack gap={1} direction={"row"} justifyContent={"space-between"}>
        <Box flexGrow={"1"}>
          {" "}
          {actviePatient && (
            <AddTestAutocompleteLab
              update={update}
              patients={patients}
              actviePatient={actviePatient}
              selectedTests={selectedTests}
              setDialog={setDialog}
              setSelectedTests={setSelectedTests}
            />
          )}
        </Box>
        <Box>
          <AutocompleteSearchPatient
            update={update}
            setDialog={setDialog}
            
          />
        </Box>
      </Stack>

      <div
        style={{
          marginTop: "5px",
          gap: "15px",
          transition: "0.3s all ease-in-out",

          display: "grid",
          // direction:'rtl',
          gridTemplateColumns: `0.1fr   ${layOut.form}  1fr    ${layOut.requestedDiv} ${layOut.patientDetails}   `,
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
            <ReceptionForm update={update} lab={true} hideForm={hideForm} settings={settings} />
          )}
        </div>
        <Card
          sx={{ p: 1 }}
          style={{
            height: "80vh",
            overflow: "auto",
            backgroundColor: "#ffffff73",
          }}
        >
          <div className="patients">
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
                  actviePatient={actviePatient}
                  onClick={setActivePatientHandler}
                />
              ))
            )}
          </div>
        </Card>

        <Card
          style={{ backgroundColor: "#ffffff73" }}
          sx={{ p: 1, height: "80vh", overflow: "auto" }}
        >
          {actviePatient && actviePatient.patient.labrequests.length > 0 && (
            <RequestedTestsLab
              update={update}
              setDialog={setDialog}
              userSettings={userSettings}
              companies={companies}
              actviePatient={actviePatient}
              key={actviePatient.id}
            />
          )}
          {actviePatient?.patient.labrequests.length == 0 && <TestGroups />}
          {actviePatient && (
            <TextField
              sx={{ mt: 1 }}
              defaultValue={actviePatient.patient.discount}
              onChange={(e) => {
                updateHandler(e, "discount");
              }}
              label="Total Discount"
            ></TextField>
          )}
        </Card>
        <div>
          <div style={{ position: "absolute", right: "0", zIndex: "3" }}>
            {!actviePatient && dialog.showHistory && (
              <SearchDialog lab={true} />
            )}
          </div>

          {/** add card using material   */}
          {actviePatient && (
            <PatientDetail
              settings={settings}
              key={actviePatient.id}
              patient={actviePatient}
              update={update}
            />
          )}
          {actviePatient && (
            <Stack sx={{ mt: 1 }} direction={"row"} gap={2}>
              <a
                href={`${webUrl}printLabReceipt/${actviePatient?.id}/${user?.id}`}
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
                  if (settings?.barcode) {
                    axiosClient
                      .get(`patient/barcode/${actviePatient.id}`)
                      .then(({ data }) => {
                        console.log(data, "barcode");
                      });
                  }

                  axiosClient
                    .get(`printLab?pid=${actviePatient.id}&base64=1`)
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
                            "Content-Type": "application/x-www-form-urlencoded",
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
                Print
              </Button>
            </Stack>
          )}
        </div>
        {dialog.showMoneyDialog && <MoneyDialog />}
        <ErrorDialog />
        {actviePatient && (
          <EditPatientDialog
            update={update}
            key={actviePatient?.id}
            setDialog={setDialog}
            open={openEdit}
            isLab={true}
            setOpen={setOpenEdit}
            patient={actviePatient}
            doctorVisitId={actviePatient.id}
            // setPatients={setPatients}
          />
        )}
      </div>
    </>
  );
}

export default AddPatient;
