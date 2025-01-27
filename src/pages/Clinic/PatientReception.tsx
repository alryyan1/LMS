import { CopyAll, FavoriteBorder } from "@mui/icons-material";
import { Badge, Chip, Icon, Paper, Stack, styled } from "@mui/material";
import React from "react";
import { useOutletContext } from "react-router-dom";
import { DoctorVisit, Patient } from "../../types/Patient";
import { Item } from "../constants";
import { ReceptionLayoutProps } from "../../types/CutomTypes";
type PatientReceptinPros = {
  patient: DoctorVisit;
  setShowDetails: () => void;
  showDetails: boolean;

  hideForm: () => void;
  change: (doctorVisit: DoctorVisit) => void;

};

function PatientReception(props: PatientReceptinPros) {
  const {
    actviePatient,
    setActivePatient,
    setShowPatientServices,
    showServicePanel,
    setShowServicePanel,
    activeShift,
    setShowTestPanel,
    setShowLabTests,
    
  } = useOutletContext<ReceptionLayoutProps>();
  return (
    <Badge
      color="primary"
      badgeContent={
        props.patient.services.filter((service) => {
          return service.doctor_id == activeShift?.doctor?.id;
        }).length
      }
      key={props.patient.id}
    >
      <Stack
        sx={{ cursor: "pointer" }}
        onClick={() => {
          // setShowLabTests(false)
          
            props.change(props.patient);
          
          if (
            props.patient.services.filter((service) => {
              return service.doctor_id == activeShift?.doctor?.id;
            }).length > 0
          ) {
        
              setShowPatientServices(true);
              setShowServicePanel(false);
           
          } else {
            setShowServicePanel(true);
            setShowPatientServices(false);
          }

          //  props.hideForm();
        }}
        direction={"row"}
      >
        <Item
          className={actviePatient?.id === props.patient.id ? "active" : ""}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            minWidth: "230px",
            cursor: "pointer",
            color: "black",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {props.patient.totalservicebank > 0 && (
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

          {props.patient.patient.name}
        </Item>
        <Item
          onDoubleClick={() => {
            props.setShowDetails(!props.showDetails);
          }}
          className="patient-no"
        >
          {props.patient.number}
         
              <Stack sx={{ position: "absolute" ,top:'-10px',right:'0px',fontSize:'5px',alignContent:'center',justifyContent:'center'}} direction={"column"}>
                {props.patient.patient.company &&  <Icon >
                  <FavoriteBorder titleAccess="تامين" fontSize="small" />
                </Icon>}
                {props.patient.patient?.doctor?.id != props.patient.doctor_shift.doctor_id &&  <Icon>
                  <CopyAll titleAccess="منسوخ" fontSize="small"/>
                </Icon>}
              </Stack>
           
   
        </Item>
      </Stack>
    </Badge>
  );
}

export default PatientReception;
