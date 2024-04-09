import { Paper, Typography } from "@mui/material";
import React from "react";

function PatientDetail({ patient }) {
  const date = new Date(patient.created_at)
  return (
    <Paper elevation={3}
     sx={{ padding: "10px" }}>
      <Typography fontWeight={"bold"} sx={{ textAlign: "center", mb: 2 }}>
        تفاصيل المريض
      </Typography>
      {/** add card body   */}
      <div className="form-control">
        <div>{patient.name}</div>
        <div>اسم المريض</div>
      </div>
      <div className="form-control">
        <div>{patient.doctor.name}</div>
        <div>الطبيب</div>
      </div>
      <div className="form-control">
        <div>{
          //print iso date
          date.toLocaleDateString()
          }</div>
        <div>التاريخ</div>
      </div>
      <div className="form-control">
        <div>{
          //print iso date
          date.toLocaleTimeString()
          }</div>
        <div>الزمن</div>
      </div>
    </Paper>
  );
}

export default PatientDetail;
