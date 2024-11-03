import { FavoriteBorder } from "@mui/icons-material";
import { Badge, Chip, Icon, Paper, Stack, styled } from "@mui/material";
import React from "react";
import { useOutletContext } from "react-router-dom";
import { DoctorVisit, Patient } from '../../types/Patient';
import  {Item} from '../constants'
import { ReceptionLayoutProps } from "../../types/CutomTypes";
type PatientReceptinPros  = {
  patient: DoctorVisit;
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
          if (actviePatient) {
            console.log(actviePatient,'active patient')
            setShowTestPanel(false)
            setShowLabTests(true)
            /** this because if was same patient */
            if (actviePatient.id == props.patient.id) {
              console.log("same patient");
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
              setShowPatientServices(true);
            } else {
              setShowServicePanel(false);
              setShowPatientServices(true);
            }
          } else {
            setShowServicePanel(true);
            setShowPatientServices(false);
          }

          props.hideForm();
        }}
        direction={"row"}
      >
        <Item
          className={
            actviePatient && actviePatient.id === props.patient.id ? "active" : ""
          }
          style={
            actviePatient && actviePatient.id === props.patient.id
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
        <Item className="patient-no">
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
