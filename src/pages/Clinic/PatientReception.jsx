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
function PatientReception({ visit, hideForm, index,change }) {
  const {
    actviePatient,
    setActivePatient,
    setShowPatientServices,
    showServicePanel,
    setShowServicePanel,
    activeShift,
    setShowTestPanel,
    setShowLabTests
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
            setShowTestPanel(false)
            setShowLabTests(true)
            /** this because if was same patient */
            if (actviePatient.id == visit.id) {
              console.log("same patient");
            } else {
              change(visit);
            }
          } else {
            change(visit);
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
          style={
            actviePatient && actviePatient.id === visit.id
              ? {
                  borderBottom: "4px solid blue",
                  fontWeight: "bolder",
                }
              : null
          }
          sx={{
            display: "flex",
            justifyContent: "space-between",
            minWidth: "215px",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
          

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
        <Item className="patient-no">
          {index - 1}
          {visit.patient.company && <span
            style={{
              position: "absolute",
              top: "-6px",
              right: "3px",
              width: "10px",
            }}
          >
            {" "}
            <Icon>
              <FavoriteBorder />
            </Icon>
          </span>}
        </Item>
      </Stack>
    </Badge>
  );
}

export default PatientReception;
