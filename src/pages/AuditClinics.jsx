import { Print } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { webUrl } from "./constants";
import PatientDetail from "./Laboratory/PatientDetail";

function AuditClinics({
  selectedShift,
  selectedDoctorShift,
  setSelectedVisit,
  setSelectedDoctorShift,
  selectedVisit,
  setShowServices,
}) {
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);

  return (
    <div
      style={{
        marginTop: "5px",
        gap: "15px",
        transition: "0.3s all ease-in-out",

        display: "grid",
        direction: "rtl",
        gridTemplateColumns: `1fr  1fr  1fr   1fr     `,
      }}
    >
      <Box>
        <Typography textAlign={'center'} variant="h4">التخصصات الطبيه</Typography>
        <List dense>
          {selectedShift.specialists.map((specialist) => {
            return (
              <ListItem
                sx={{
                  backgroundColor: (theme) =>
                    selectedSpecialist?.id == specialist.id
                      ? theme.palette.primary.main
                      : "",
                }}
                key={specialist.id}
              >
                <ListItemButton
                  onClick={() => {
                    setSelectedVisit(null);
                    setSelectedSpecialist(specialist);
                  }}
                  style={{
                    marginBottom: "2px",
                  }}
                >
                  <ListItemText>{specialist.name}</ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
      
      {selectedSpecialist && (
        <Box>
        <Typography textAlign={'center'} variant="h4">العيادات</Typography>

          <List dense>
            {selectedShift.doctor_shifts
              .filter(
                (doctorShift) =>
                  doctorShift.doctor.specialist_id == selectedSpecialist.id
              )
              .map((doctorShift) => {
                return (
                  <ListItem
                
                    sx={{
                      backgroundColor: (theme) =>
                        selectedDoctorShift?.id == doctorShift.id
                          ? theme.palette.secondary.light
                          : "",
                    }}
                    secondaryAction={
                      <IconButton
                        title="التقرير الخاص"
                        href={`${webUrl}clinics/doctor/report?doctorshift=${doctorShift.id}`}
                      >
                        <Print />
                      </IconButton>
                    }
                    key={doctorShift.id}
                  >
                    <ListItemButton
                      onClick={() => {
                        setSelectedVisit(null);
                        setSelectedDoctorShift(doctorShift);
                      }}
                      style={{
                        marginBottom: "2px",
                      }}
                    >
                      <ListItemText>
                        {doctorShift.doctor.name} ({" "}
                        {doctorShift.status ? "مفتوحه" : "مغلقه"})
                      </ListItemText>
                    </ListItemButton>
                  </ListItem>
                );
              })}
          </List>
        </Box>
      )}
      <Box>
        {selectedDoctorShift && (
          <List dense>
            {selectedDoctorShift.visits.map((visit) => {
              return (
                <ListItem
                  sx={{
                    backgroundColor: (theme) =>
                      selectedVisit?.id == visit.id
                        ? theme.palette.warning.light
                        : "",
                  }}
                  secondaryAction={
                    visit.services.length > 0 && (
                      <Button
                        onClick={() => {
                          setSelectedVisit(visit);
                          setShowServices(true);
                        }}
                        variant="contained"
                      >
                        الخدمات
                      </Button>
                    )
                  }
                  key={visit.id}
                >
                  <ListItemButton
                    onClick={() => {
                      console.log(visit, "selected visit");
                      setSelectedVisit(visit);
                    }}
                    style={{
                      marginBottom: "2px",
                    }}
                  >
                    <ListItemText>{visit.patient.name}</ListItemText>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
      <Box>
        {selectedVisit && (
          <PatientDetail
            activeShift={selectedDoctorShift}
            patient={selectedVisit.patient}
            isLab={true}
          />
        )}
      </Box>
    </div>
  );
}

export default AuditClinics;
