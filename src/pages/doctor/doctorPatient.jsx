import { FavoriteBorder } from "@mui/icons-material";
import { Badge, Chip, Grow, Icon, Paper, Stack, styled } from "@mui/material";
import React from "react";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
function DoctorPatient({change, visit, setActivePatient, index,activePatient ,delay,setActiveDoctorVisit,setLayout,showPatients, setShowPatients,changeDoctorVisit}) {
  // console.log(activePatient,'active patient')
  return (
    <Grow  style={{ transitionDelay: `${delay}ms` }} timeout={2000} in>
    <Badge
      color="secondary"
      badgeContent={
        visit.patient.visit_count == 1 ? undefined :  visit.patient.visit_count
      }
      key={visit.patient.id}
    >
      <Stack 
        sx={{ cursor: "pointer",gap:1 }}
        onClick={() => {
             axiosClient.get(`patient/visit/${visit.id}`).then(({data})=>{
              console.log(data,'data from fresh doctor visit')
              changeDoctorVisit(data)
              change(data.patient)
             })
            setActivePatient(visit.patient)
            setActiveDoctorVisit(visit)
            console.log(visit,'selected visit')
            setLayout((prev)=>{
              return {...prev,patients:'0fr',vitals:'0.7fr',visits:'0fr',}
            })
            setShowPatients(false)
   
        }}
        direction={"row"}
      >
        <Item sx={visit.patient.doctor_finish ? {backgroundColor:(theme)=>theme.palette.success.main} :  {backgroundColor:(theme)=>theme.palette.primary.main}} className="patient-no2 text-white">{index}</Item>

        <Item className={`head ${visit.is_new == 1 ? 'animate__animated  animate__bounce   animate__infinite animate__slower':''} `}
          style={ activePatient && activePatient.id === visit.patient.id ? {
            borderBottom:"4px solid blue",
            fontWeight:"bolder",
          }:null}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            minWidth: "360px",
            cursor: "pointer",
            
       
          }}
        >
            {`${visit.patient.name.toUpperCase()[0]}${visit.patient.name.slice(1)}`}

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {visit.patient.company_id &&    <Icon>
              <FavoriteBorder />
            </Icon>}
         

            {visit?.is_new ==1  &&   <Chip
              label="new"
              
              size="small"
              />}
           {visit.patient.labrequests.length > 0 &&   <Chip
              label="Lab"
              sx={{
                backgroundColor: (theme) => visit.patient.result_auth == 1 ?  theme.palette.success.light :  theme.palette.error.light,
                fontSize: "smaller",
              }}
              size="small"
              />}
            
          </div>
            

        </Item>
      </Stack>
    </Badge>
    </Grow>
  );
}

export default DoctorPatient;
