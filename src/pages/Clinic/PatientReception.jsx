import { FavoriteBorder } from "@mui/icons-material";
import { Badge, Chip, Icon, Paper, Stack, styled } from "@mui/material";
import React from "react";
import { useOutletContext } from "react-router-dom";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
function PatientReception({ visit, hideForm, index }) {
  const {
    actviePatient,
    setActivePatient,
    setShowPatientServices,
    showServicePanel,
    setShowServicePanel,
    activeShift,
  } = useOutletContext();
  return (
    <Badge
      color="primary"
      badgeContent={
        visit.services.filter((service) => {
          return service.doctor_id == activeShift.doctor.id;
        }).length
      }
      key={visit.id}
    >
      <Stack
        sx={{ cursor: "pointer" }}
        onClick={() => {
          if (actviePatient) {
            /** this because if was same patient */
            if (actviePatient.id == visit.id) {
              console.log("same patient");
            } else {
              setActivePatient(visit);
            }
          } else {
            setActivePatient(visit);
          }
          if (
            visit.services.filter((service) => {
              return service.doctor_id == activeShift.doctor.id;
            }).length > 0
          ) {
            if (!showServicePanel) {
              setShowPatientServices(true);
            } else {
              setShowServicePanel(false);
              setShowPatientServices(true);
            }
          } else {
            setShowServicePanel(true);
            setShowPatientServices(false);
          }

          hideForm();
        }}
        direction={"row"}
      >
        <Item
          className={
            actviePatient && actviePatient.id === visit.id ? "active" : ""
          }
          style={ actviePatient && actviePatient.id === visit.id ? {
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
  );
}

export default PatientReception;
