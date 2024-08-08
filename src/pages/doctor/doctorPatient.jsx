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
function DoctorPatient({ visit, setActivePatient, index,activePatient ,delay}) {

  return (
    <Grow  style={{ transitionDelay: `${delay}ms` }} timeout={2000} in>
    <Badge
      color="primary"
      badgeContent={
        visit.patient.visit_count
      }
      key={visit.id}
    >
      <Stack
        sx={{ cursor: "pointer" }}
        onClick={() => {
            setActivePatient(visit)
            console.log(visit,'selected visit')

   
        }}
        direction={"row"}
      >
        <Item
          style={ activePatient && activePatient.id === visit.id ? {
            borderBottom:"4px solid blue",
            fontWeight:"bolder",
          }:null}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            minWidth: "200px",
            cursor: "pointer",
            
       
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {visit.company_id &&    <Icon>
              <FavoriteBorder />
            </Icon>}
         

            {visit.totalservicebank > 0 && (
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
            

          {visit.patient.name}
        </Item>
        <Item className="patient-no">{index - 1}</Item>
      </Stack>
    </Badge>
    </Grow>
  );
}

export default DoctorPatient;
