import { FavoriteBorder } from "@mui/icons-material";
import { Badge, Chip, Grow, Icon, Paper, Stack, styled } from "@mui/material";
import React from "react";
import { useOutletContext } from "react-router-dom";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
function DoctorPatient({ visit, setActivePatient, index,activePatient ,delay,setActiveDoctorVisit,setLayout,showPatients, setShowPatients}) {
  // console.log(activePatient,'active patient')
  return (
    <Grow  style={{ transitionDelay: `${delay}ms` }} timeout={2000} in>
    <Badge
      color="primary"
      badgeContent={
        visit.patient.visit_count
      }
      key={visit.patient.id}
    >
      <Stack
        sx={{ cursor: "pointer" }}
        onClick={() => {
            setActivePatient(visit.patient)
            setActiveDoctorVisit(visit)
            console.log(visit,'selected visit')
            setLayout((prev)=>{
              return {...prev,patients:'0fr',vitals:'0.5fr',visits:'0fr',}
            })
            setShowPatients(false)
   
        }}
        direction={"row"}
      >
        <Item
          style={ activePatient && activePatient.id === visit.patient.id ? {
            borderBottom:"4px solid blue",
            fontWeight:"bolder",
          }:null}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            minWidth: "220px",
            cursor: "pointer",
            
       
          }}
        >
            {`${visit.patient.name.toUpperCase()[0]}${visit.patient.name.slice(1)}`}

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {visit.patient.company_id &&    <Icon>
              <FavoriteBorder />
            </Icon>}
         

            {visit.patient.totalservicebank > 0 && (
            <Chip
              label="bank"
              sx={{
                backgroundColor: (theme) => theme.palette.error.light,
                fontSize: "smaller",
              }}
              size="small"
              />
            )}
          </div>
            

        </Item>
        {/* <Item className="patient-no2">{visit.patient.id}</Item> */}
      </Stack>
    </Badge>
    </Grow>
  );
}

export default DoctorPatient;
