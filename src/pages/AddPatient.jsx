import "./addPatient.css";
import { useEffect, useState } from "react";
import Patient from "./Patient";
import PatientForm from "./PatientForm";
import PatientDetail from "./PatientDetail";
import {Button} from "@mui/material"

function AddPatient() {
  const [patients, setPatients] = useState([]);
  const [layOut, setLayout] = useState({
    form :"1fr",
    hideForm : false
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
    //set active patient using array map
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
     return {...prev,form:"0fr",hideForm:true}
    })
  }
  const showFormHandler =()=>{
    setLayout((prev)=>{
     return {...prev,form:"1fr",hideForm:false}
    })
  }

  return (
    <div style={{  transition: "0.3s all ease-in-out",
      display: "grid",
      gridTemplateColumns:` 0.1fr ${layOut.form} 0.1fr 1fr 0.1fr 3fr  0.1fr`}} className="container">
      <div>1</div>
      <div>
        <Button variant='contained' sx={{m:1}} onClick={showFormHandler}>Refresh</Button>
       {layOut.hideForm ? "" : <PatientForm hideForm={hideForm} setPatients={setPatients} />}
      </div>
      <div>3</div>
      <div className="patients">
        {patients.map((p) => (
          <Patient patient={p} onClick={setActivePatientHandler} key={p.id} />
        ))}
      </div>
      <div></div>
      <div>
        {/** add card using material   */}
        {actviePatient && <PatientDetail patient={actviePatient} />}
      </div>
    </div>
  );
}

export default AddPatient;
