import "./addPatient.css";
import { useEffect, useState } from "react";
import Patient from "./Patient";
import PatientForm from "./PatientForm";
import PatientDetail from "./PatientDetail";
import {Button,List,ListItem,ListItemButton,ListItemIcon,ListItemText,Dialog,DialogTitle, DialogActions} from "@mui/material"
import TestGroups from "./TestGroups";
import RequestedTests from "./RequestedTests";

function AddPatient() {
  const [packages, setPackages] = useState([]);
  const [requestedTests, setRequestedTests] = useState([]);
  const [open, setOpen] = useState(false);
  const [error,setError] = useState('')
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/packages/all`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "packagess");
        data.forEach((element) => {
          element.tests.forEach((t) => {
            // add selected property to t
            t.selected = false;
            return t;
          });
        });
        setPackages(data);
      });
  }, []);
  const [patients, setPatients] = useState([]);
  const [layOut, setLayout] = useState({
    form :"1fr",
    tests :"1fr",
    hideForm : false,
    testWidth : "400px"
  });
  const [actviePatient, setActivePatient] = useState(null);
  console.log(actviePatient, "active patient");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/patients`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data,'today patients');
        //add activeProperty to patient object
        data.forEach((patient) => {
          patient.active = false;
        });
        console.log(data);
        setPatients(data);
      });
  }, []);

  const setActivePatientHandler = (id) => {
    hideForm()
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

  const hideForm =()=>{
    setLayout((prev)=>{
     return {...prev,form:"0fr",hideForm:true,tests:"2fr",testWidth:"500px"}
    })
  }
  const showFormHandler =()=>{
    setActivePatient(null)
    setLayout((prev)=>{
     return {...prev,form:"1fr",hideForm:false,tests:"1fr"}
    })
  }

  return (
    <div style={{  transition: "0.3s all ease-in-out",
      display: "grid",
      gridTemplateColumns:` 0.1fr ${layOut.form} 0.1fr 1fr 0.1fr ${layOut.tests} 1fr 1fr  0.1fr`}} className="container">
      <div>1</div>
      <div>
        <Dialog  open={open} >
          <DialogTitle  color={'error'}>Info</DialogTitle>
          {error}
          <DialogActions>
          <Button onClick={handleClose}>ok</Button>
        </DialogActions>
        </Dialog>
        <Button className="refresh" variant='contained' sx={{m:1}} onClick={showFormHandler}>Refresh</Button>
       {layOut.hideForm 
       || actviePatient ? "" :  <PatientForm  hideForm={hideForm} setPatients={setPatients} />}
      </div>
      <div>3</div>
      <div className="patients">
        {patients.map((p) => (
          <Patient patient={p} onClick={setActivePatientHandler} key={p.id} />
        ))}
      </div>
      <div></div>
      <div className="add-tests" style={{maxWidth:layOut.testWidth }}> {actviePatient &&<TestGroups setOpen={setOpen} error={error} setError={setError}  actviePatient={actviePatient} setRequestedTests ={setRequestedTests} setPackages={setPackages} packages={packages}/>}</div>
      <div>    
       {actviePatient && <RequestedTests actviePatient={actviePatient}/>}  
      </div>
      <div>
        {/** add card using material   */}
        {actviePatient && <PatientDetail patient={actviePatient} />}
   
     
      </div>
    </div>
  );
}

export default AddPatient;
