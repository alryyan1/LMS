import { FavoriteBorder } from "@mui/icons-material";
import { Badge, Chip, Icon, Paper, Stack, styled } from "@mui/material";
import React from "react";
import { useOutletContext } from "react-router-dom";
import { DoctorVisit, Patient } from '../../types/Patient';
import  {Item} from '../constants'
import { ReceptionLayoutProps } from "../../types/CutomTypes";
type PatientReceptinPros  = {
  patient: DoctorVisit;
  setShowDetails:()=>void;
  showDetails:boolean;
  hideForm: ()=>void;
  change: (doctorVisit: DoctorVisit) => void;
}

function PatientReception(props:PatientReceptinPros) {
  const {
    actviePatient,
    setActivePatient,
    setShowPatientServices,
    showServicePanel,
    setShowServicePanel,
    activeShift,
    setShowTestPanel,
    setShowLabTests
  } = useOutletContext<ReceptionLayoutProps>();
  return (
    <Badge
      color="primary"
      badgeContent={
        props.patient.services.filter((service) => {
          
          return service.doctor_id == activeShift?.doctor.id;
        }).length
      }
      key={props.patient.id}
    >
      <Stack
        sx={{ cursor: "pointer" }}
        onClick={() => {
          // setShowLabTests(false)
          if (actviePatient) {
            setShowTestPanel(false)
            /** this because if was same patient */
            if (actviePatient.id == props.patient.id) {
            } else {
              props.change(props.patient);
            }
          } else {
            props.change(props.patient);
          }
          if (
            props.patient.services.filter((service) => {
              return service.doctor_id == activeShift.doctor.id;
            }).length > 0
          ) {
            if (!showServicePanel) {
              // setShowPatientServices(true);
            } else {
              setShowServicePanel(false);
              // setShowPatientServices(true);
            }
          } else {
            setShowServicePanel(true);
            setShowPatientServices(false);
          }

        //  props.hideForm();
        }}
        direction={"row"}
      >
        <Item
          className={
          actviePatient?.id === props.patient.id ? "active" : ""
          }
        
          sx={{
            display: "flex",
            justifyContent: "space-between",
            minWidth: "230px",
            cursor: "pointer",
            color:'black'
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
        <Item onDoubleClick={()=>{
          props.setShowDetails(! props.showDetails)
        }} className="patient-no">
          {props.patient.number }
          {props.patient.patient.company && <span
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
