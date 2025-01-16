import { FavoriteBorder, HeatPumpRounded, Lock } from "@mui/icons-material";
import { Badge, Box, Grow, Stack } from "@mui/material";
import "animate.css";
import { useOutletContext } from "react-router-dom";
import { DoctorVisit } from "../../types/Patient";
interface PatientLabPros {
  patient: DoctorVisit;
  onClick: (patient: DoctorVisit) => void;
  actviePatient: DoctorVisit | null;
  delay: number;
}
function PatientLab({ onClick, patient, actviePatient }: PatientLabPros) {
  return (
    <Grow timeout={2000} in>
      {patient.patient.labrequests.length > 0 ? (
        <Badge
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "bottom",
          }}
          badgeContent={patient.patient.labrequests.length}
          color={patient.patient.labrequests.every((l)=>l.is_paid) == 0 ? "error" : "success"}        >
          <Box
            onClick={() => {
              onClick(patient);
            }}
            style={
              patient.patient.is_lab_paid == 1 &&
              patient.patient.id != actviePatient?.patient?.id
                ? {
                    backgroundColor: "#00e676",
                  }
                : {}
            }
            sx={
              actviePatient?.id == patient.id
                ? {
                    backgroundColor: (theme) => theme.palette.warning.light,
                  }
                : {}
            }
          >
            {patient.patient.visit_number}
            <span>
              {patient.patient.company_id != null ? (
                <FavoriteBorder sx={{ width: "16px" }} />
              ) : (
                ""
              )}
            </span>
          </Box>
        </Badge>
      ) : (
        <Box
          onClick={() => {
            onClick(patient);
          }}
          sx={
            actviePatient?.id == patient.id
              ? {
                  borderBottom: "4px solid blue",
                  fontWeight: "bolder",
                  backgroundColor: (theme) => theme.palette.warning.light,
                }
              : {}
          }
        >
          {patient.patient.visit_number}
          <Stack direction={'column'}>
            {patient.patient.company_id != null ? (
              <FavoriteBorder sx={{ width: "16px" }} />
            ) : (
              ""
            )}
             {patient.patient.labrequests.some((l)) != null ? (
              <FavoriteBorder sx={{ width: "16px" }} />
            ) : (
              ""
            )}
          </Stack>
          <span>{patient.patient.result_is_locked ? <Lock /> : ""}</span>
        </Box>
      )}
    </Grow>
  );
}

export default PatientLab;
