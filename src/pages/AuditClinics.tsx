import { Print } from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  Chip,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { webUrl } from "./constants";
import PatientDetail from "./Laboratory/PatientDetail";
import { DoctorShift, DoctorVisit } from "../types/Patient";
import { Shift, Specialist } from "../types/Shift";
import { Heart, HeartIcon } from "lucide-react";
import axiosClient from "../../axios-client";
interface AuditClincsProps {
  selectedShift: Shift;
  selectedDoctorShift: any;
  setSelectedVisit: any;
  setSelectedDoctorShift: any;
  selectedVisit: DoctorVisit;
  setShowServices: any;

}
function AuditClinics({
  selectedShift,
  selectedDoctorShift,
  setSelectedVisit,
  setSelectedDoctorShift,
  selectedVisit,
  setShowServices,
  
}: AuditClincsProps) {
  console.log(selectedDoctorShift,'selecteddoctorshift')
  const [selectedSpecialist, setSelectedSpecialist] =
    useState<Specialist | null>(null);
    const [loading,setLoading] = useState(false);
    const [patients,setPatients] = useState<DoctorVisit[]>([]);

    useEffect(()=>{
        setLoading(true)
      //update latest patients for doctor
      const controller = new AbortController()
      if(selectedDoctorShift){
  
        axiosClient.get(`getDoctorShiftById?id=${selectedDoctorShift?.id}`,{
          signal: controller.signal,
        }).then(({data})=>{
          console.log(data,'getDoctorShiftById')
       
          setSelectedDoctorShift(data)
          setPatients(data.visits)
        }).finally(()=>{
          setLoading(false)
        })
      }
      return () => controller.abort() // Clean up the abort controller when component unmounts.
     
    },[selectedDoctorShift?.id])
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
        <Typography textAlign={"center"} variant="h4">
          التخصصات الطبيه
        </Typography>
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
                    setSelectedDoctorShift(null);
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
          <Typography textAlign={"center"} variant="h4">
            العيادات
          </Typography>

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
  
          <List dense>
            {patients.map((visit) => {
              return (
                <ListItem
                  sx={{
                    backgroundColor: (theme) =>
                      selectedVisit?.id == visit.id
                        ? theme.palette.warning.light
                        : "",
                  }}
                  secondaryAction={
             
                      <Badge color="secondary" content={visit.services.length}>
                        <Button
                          onClick={() => {
                            setSelectedVisit(visit);
                            setShowServices(true);
                          }}
                          variant="contained"
                        >
                          الخدمات
                        </Button>
                      </Badge>
                    
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
                    <ListItemText>
                      <Stack
                        direction={"row"}
                        justifyContent={"space-between"}
                      >

                        <div>
                        {visit.patient.name}
                        </div>
                        {
                          visit.patient.company && <Chip>تامين</Chip>
                        }
                      </Stack>
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
    
      </Box>
      <Box>
        {selectedVisit && (
          <PatientDetail
            activeShift={selectedDoctorShift}
            patient={selectedVisit}
            isLab={true}
          />
        )}
      </Box>
    </div>
  );
}

export default AuditClinics;
