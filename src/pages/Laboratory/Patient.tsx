import { Delete, Lock, LockOpen } from "@mui/icons-material";
import { Badge, Box, Grow, Icon, breadcrumbsClasses } from "@mui/material";
import "animate.css";
import { DoctorVisit } from "../../types/Patient";

interface PatientProps {
  onClick: (patient: number) => void;
  patient: DoctorVisit;
  delay: number;
  unfinshed_count: number;
  actviePatient: DoctorVisit | null;
}
function Patient({
  onClick,
  patient,
  delay,
  unfinshed_count,
  actviePatient,
}: PatientProps) {
  console.log(unfinshed_count,'unfinshed_count');
  let patientState = "";
  if (patient.patient.result_print_date == null) {
    switch (unfinshed_count) {
      case 0:
        patientState =
          "animate__animated  animate__bounce   animate__infinite animate__slower";
        break;
      case 1:
        patientState =
          "animate__animated animate__heartBeat animate__infinite animate__slower";
        break;
    }
  }

  return (
    <Grow
      className={patientState}
      style={{ transitionDelay: `${delay}ms` }}
      timeout={2000}
      in
    >
      <Badge
       
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "bottom",
        }}
        badgeContent={patient.patient.labrequests.length == 0 ? undefined :patient.patient.labrequests.length }
        color={patient.patient.labrequests.every((l)=>l.is_paid) == 0 ? "error" : "success"}
      >
        <Box
          style={
            patient.patient.result_print_date != null && actviePatient?.id != patient.id
              ? {
                  backgroundColor: "#00b0ff",
                }
              : null
          }
          onClick={() => {
            onClick(patient.id);
          }}
          sx={
            patient.id == actviePatient?.id
              ? {
                  backgroundColor: (theme) => theme.palette.warning.light,
                }
              : null
          }
        >
          {patient.patient.visit_number}
          <span>
            {patient.patient.result_is_locked ? <Lock sx={{ width: "16px" }} /> : ""}
          </span>
        </Box>
      </Badge>
    </Grow>
  );
}

export default Patient;
