import { Badge, Chip, Paper, Stack, styled } from '@mui/material';
import React from 'react'
import { useOutletContext } from 'react-router-dom';
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
function PatientReception({visit,hideForm,index}) {
    const {
        actviePatient,
        setActivePatient,
        setShowPatientServices,
        showServicePanel,
        setShowServicePanel,
      } = useOutletContext();
  return (
    <Badge
    color="primary"
    badgeContent={visit.services.length}
    key={visit.id}
  >
    <Stack  sx={{cursor:'pointer'}}  onClick={() => {
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
          if (visit.services.length > 0) {
            if (!showServicePanel) {
              setShowPatientServices(true);
            }else{
              setShowServicePanel(false);
              setShowPatientServices(true);
            }
          } else {
            setShowServicePanel(true);
            setShowPatientServices(false);

          }
          
          hideForm();
        }} direction={'row'} gap={1}>
      <Item
      
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minWidth: "185px",
          cursor: "pointer",
          color: () => {
            return actviePatient &&
              actviePatient.id === visit.id
              ? "white"
              : "black";
          },
          backgroundColor: (theme) => {
            return actviePatient &&
              actviePatient.id === visit.id
              ? theme.palette.primary.light
              : "";
          },
        }}
      >
        {visit.totalservicebank > 0 && (
          <Chip
          
            label="bank"
            sx={{ backgroundColor:(theme)=>theme.palette.error.light}}
            size="small"
          />
        )}

        {visit.name}
      </Item>
      <Item sx={{width:"26px"}}>
        {index+1}
      </Item>
    </Stack>
  </Badge>
  )
}

export default PatientReception