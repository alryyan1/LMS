import "./addPatient.css";
import { useEffect, useState } from "react";
import Patient from "./Patient";
import PatientForm from "./PatientForm";
import PatientDetail from "./PatientDetail";
import { url } from "./constants";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import TestGroups from "./TestGroups";
import RequestedTests from "./RequestedTests";
import AddTestAutoComplete from "./AddTestAutoComplete";

function AddPatient() {
  const [tests, setTests] = useState([]);

  const [requestedTests, setRequestedTests] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState({
    open: false,
    msg: "تمت الاضافه بنجاح",
  });
  const [error, setError] = useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setOpenSuccessDialog(false);
  };

  const [patients, setPatients] = useState([]);
  const [layOut, setLayout] = useState({
    form: "1fr",
    tests: "1fr",
    hideForm: false,
    testWidth: "400px",
    requestedDiv: "1fr",
    showTestPanel: false,
  });
  const [actviePatient, setActivePatient] = useState(null);
  const [packages, setPackages] = useState([]);

  console.log(actviePatient, "active patient");
  useEffect(() => {
    fetch(`${url}packages/all`)
      .then((res) => res.json())
      .then((dataPacks) => {
        dataPacks.forEach((element) => {
          element.tests.forEach((t) => {
            tests.forEach((requested) => {
              if (t.id == requested.id) {
                t.selected = true;
              }
            });
            return t;
          });
        });
        setPackages(dataPacks);
      });
  }, [tests]);
  useEffect(() => {
    fetch(`${url}patients`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "today patients");
        //add activeProperty to patient object
        data.forEach((patient) => {
          patient.active = false;
        });
        console.log(data);
        setPatients(data);
      });
  }, []);

  const setActivePatientHandler = (id) => {
    hideForm();
    setPatients(
      patients.map((patient) => {
        if (patient.id === id) {
          setActivePatient(patient);
          patient.active = true;
        } else {
          patient.active = false;
        }
        return patient;
      })
    );
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
      };
    });
  };
  const showFormHandler = () => {
    setActivePatient(null);
    setLayout((prev) => {
      return { ...prev, form: "1fr", hideForm: false, tests: "1fr" };
    });
  };
  const fetchTests = () => {
    fetch(`${url}labRequest/${actviePatient.id}`, {
      headers: { "content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setTests(data.labrequests);
      });
  };

  return (
    <>
      <div
        style={{
          transition: "0.3s all ease-in-out",
          display: "grid",
          gridTemplateColumns: ` 0.1fr ${layOut.form} 0.1fr 1fr 0.1fr ${layOut.tests}  ${layOut.requestedDiv} 0.1fr  1fr 0.1fr`,
        }}
        className="container"
      >
        <div>1</div>
        <div>
          <Dialog open={open}>
            <DialogTitle color={"error"}>Info</DialogTitle>
            {error}
            <DialogActions>
              <Button onClick={handleClose}>ok</Button>
            </DialogActions>
          </Dialog>
          <Button
            className="refresh"
            variant="contained"
            sx={{ m: 1 }}
            onClick={showFormHandler}
          >
            Refresh
          </Button>
          {layOut.hideForm || actviePatient ? (
            ""
          ) : (
            <PatientForm
              setOpenSuccessDialog={setOpenSuccessDialog}
              hideForm={hideForm}
              setPatients={setPatients}
            />
          )}
        </div>
        <div>3</div>
        <div className="patients">
          {patients.map((p) => (
            <Patient patient={p} onClick={setActivePatientHandler} key={p.id} />
          ))}
        </div>
        <div></div>
        {layOut.showTestPanel == false && (
          <div className="add-tests" style={{ maxWidth: layOut.testWidth }}>
            {" "}
            {actviePatient && !actviePatient.is_lab_paid && (
              <>
                <AddTestAutoComplete
                  setOpen={setOpen}
                  setError={setError}
                  fetchTests={fetchTests}
                  actviePatient={actviePatient}
                />
                <TestGroups
                  fetchTests={fetchTests}
                  packages={packages}
                  setPackages={setPackages}
                  key={actviePatient.id}
                  setTests={setTests}
                  setOpen={setOpen}
                  setError={setError}
                  actviePatient={actviePatient}
                  setRequestedTests={setRequestedTests}
                />
              </>
            )}
          </div>
        )}
        <div>
          {actviePatient && (
            <RequestedTests
            setActivePatient={setActivePatient}
              setOpenSuccessDialog={setOpenSuccessDialog}
              setLayOout={setLayout}
              tests={tests}
              setTests={setTests}
              actviePatient={actviePatient}
            />
          )}
        </div>
        <div>5</div>
        <div>
          {/** add card using material   */}
          {actviePatient && (
            <PatientDetail
              setActivePatient={setActivePatient}
              patients={patients}
              setPatients={setPatients}
              key={actviePatient.id}
              patient={actviePatient}
            />
          )}
          <Snackbar
            open={openSuccessDialog.open}
            autoHideDuration={2000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              {openSuccessDialog.msg}{" "}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </>
  );
}

export default AddPatient;
