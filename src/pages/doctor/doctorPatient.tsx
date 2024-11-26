import { FavoriteBorder } from "@mui/icons-material";
import { Badge, Chip, Grow, Icon, Paper, Stack, styled } from "@mui/material";
import React from "react";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";
import { Item } from "../constants";
import { DoctorVisit, Patient } from "../../types/Patient";

interface DoctorPatientProps {
  visit: DoctorVisit;
  activeDoctorVisit: DoctorVisit|null;
  delay: number;
  setActiveDoctorVisit: (visit: DoctorVisit) => void;
  setLayout: (layout) => void;
  showPatients: boolean;
  setShowPatients: (show: boolean) => void;
  changeDoctorVisit: (visit: DoctorVisit) => void;
  useIndex:boolean;
  index:number;
  focusPaitent: (visit: DoctorVisit) => void;
}
//add type inference to DoctorPatient

const  DoctorPatient = ({
  visit,
  activeDoctorVisit,
  delay,
  setActiveDoctorVisit,
  setLayout,
  setShowPatients,
  useIndex,
  index,
  focusPaitent,
}:DoctorPatientProps) => {
  // console.log(activePatient,'active patient')
  return (
    <Grow style={{ transitionDelay: `${delay}ms` }} timeout={2000} in>
      <Badge
        color="secondary"
        badgeContent={
          visit.file?.patients?.length == 1 ? undefined : visit.file?.patients?.length
        }
        key={visit.id}
      >
        <Stack
          sx={{ cursor: "pointer", gap: 1 }}
          onClick={() => {
          focusPaitent(visit);
          }}
          direction={"row"}
        >
          <Item
            sx={
              visit.patient.doctor_finish
                ? { backgroundColor: (theme) => theme.palette.success.main }
                : { backgroundColor: (theme) => theme.palette.primary.main }
            }
            className="patient-no2 text-white"
          >
            {index }
          </Item>

          <Item
            className={`head ${
              visit.is_new == 1
                ? ""
                : ""
            } `}
            style={
              
              activeDoctorVisit && activeDoctorVisit.id === visit.id
                ? {
                    borderBottom: "4px solid blue",
                    fontWeight: "bolder",
                  }
                : null
            }
            sx={{
              display: "flex",
              justifyContent: "space-between",
              minWidth: "360px",
              cursor: "pointer",
            }}
          >
            {`${visit.patient.name.toUpperCase()[0]}${visit.patient.name.slice(
              1
            )}`}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {visit.patient.company_id && (
                <Icon>
                  <FavoriteBorder />
                </Icon>
              )}

              {visit?.is_new == 1 && <Chip label="new" size="small" />}
              {visit.patient.labrequests.length > 0 && (
                <Chip
                  label="Lab"
                  sx={{
                    backgroundColor: (theme) =>
                      visit.patient.result_auth == 1
                        ? theme.palette.success.light
                        : theme.palette.error.light,
                    fontSize: "smaller",
                  }}
                  size="small"
                />
              )}
            </div>
          </Item>
        </Stack>
      </Badge>
    </Grow>
  );
}

export default DoctorPatient;
