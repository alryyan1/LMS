import {
  Button,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import EditPatientDialog from "../Dialogs/EditPatientDialog";
import axiosClient from "../../../axios-client";

function PatientDetail({ patient,setPatients }) {
  console.log(patient, "patient in patient details");
  const [open, setOpen] = useState();
  const date = new Date(patient.created_at);
  const handleEdit = () =>
     {
    setOpen(true);
  };
  return (
    <>
      <Paper elevation={3} sx={{ padding: "10px" , }}>
        <Typography fontWeight={"bold"} sx={{ textAlign: "center", mb: 2 }}>
          تفاصيل المريض
        </Typography>
        {/** add card body   */}
           <div className="patientId">{patient.id}</div>
        <div className="form-control">
          <div>{patient.name}</div>
          <div>اسم </div>
        </div>
        <Divider />
        <div className="form-control">
          <div>{patient.doctor.name}</div>
          <div>الطبيب</div>
        </div>
        <Divider />

        <div className="form-control">
          <div>
            {
              //print iso date
              date.toLocaleDateString()
            }
          </div>
          <div>التاريخ</div>
        </div>
        <Divider />
        <div className="form-control">
          <div>
            {
              //print iso date
              patient.phone
            }
          </div>
          <div>الهاتف</div>
        </div>
        <Divider />
        <div className="form-control">
          <div>
            {
              //print iso date
              date.toLocaleTimeString()
            }
          </div>
          <div>الزمن</div>
        </div>
        <Divider />
        <div className="form-control">
          <div>
            {
              //print iso date
              patient.gender
            }
          </div>
          <div>النوع</div>
        </div>
        <Divider />
        <div className="form-control">
          <div>
            {
              //print iso date
              patient.age_year
            }
          </div>
          <div>العمر</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:"repeat(auto-fit,minmax(50px,1fr))",justifyContent:'space-around'}}>
          <div>
            <Button onClick={handleEdit} variant="contained">
              Edit
            </Button>
          </div>
          <div>
            <Button onClick={()=>{
              axiosClient.get(`print`, {})
            }} color="warning" variant="contained">
              Print
            </Button>
          </div>
        </div>
       
       <EditPatientDialog open={open} setOpen={setOpen} patient={patient} setPatients={setPatients} />
      </Paper>
    </>
  );
}

export default PatientDetail;
