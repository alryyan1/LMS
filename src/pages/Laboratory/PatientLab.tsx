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
  const allPaid =    patient.patient.labrequests.every((l) => l.is_paid);
  const count = patient.patient.labrequests.length ;
  let color = undefined ;
  if (count > 0)  {
    if (allPaid)  {
      color = "success";
    } else {
      color = "error";
    }
  }
  return (
    <Grow timeout={2000} in>
      <Badge
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "bottom",
        }}
        badgeContent={
          count == 0
            ? undefined
            : count
        }
        color={ color}
      >
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
    </Grow>
  );
}

export default PatientLab;
