import { Box, Divider, Stack, TextField, Typography } from "@mui/material";
import axiosClient from "../../../axios-client";
import { DoctorVisit } from "../../types/Patient";
import { updateHandler } from "../constants";
interface PatientMedicalHistoryProps {
  value: any;
  index: number;
  patient: DoctorVisit;
  setDialog: any;
  setActiveDoctorVisit: (data) => void;
}
function PatientMedicalHistory(props: PatientMedicalHistoryProps) {
  const { value, index, patient, setDialog, setActiveDoctorVisit, ...other } =
    props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ justifyContent: "space-around" }} className="">
          <Stack direction={"row"} gap={1}>
            <Box sx={{flex:1}}>
              <Typography sx={{ mb: 1 }} variant="h5">
                History of Present Illness
              </Typography>
              <TextField
                sx={{ p: 1 }}
                onChange={(e) => {
                  updateHandler(
                    e.target.value,
                    "history_of_present_illness",
                    patient,
                    setActiveDoctorVisit
                  );
                }}
                defaultValue={patient.patient.history_of_present_illness}
                multiline
                fullWidth
                rows={2}
              ></TextField>
            </Box>
            <Box sx={{flex:1}}>
              <Typography sx={{ mb: 1 }} variant="h5">
                Past Medical History
              </Typography>
              <TextField
                onChange={(e) => {
                  updateHandler(
                    e.target.value,
                    "patient_medical_history",
                    patient,
                    setActiveDoctorVisit
                  );
                }}
                defaultValue={patient.patient.patient_medical_history}
                multiline
                sx={{ p: 1 }}
                fullWidth
                rows={2}
              ></TextField>
            </Box>
          </Stack>
          <Stack direction={"row"} gap={1}>
            <Box sx={{flex:1}}>
              <Typography sx={{ mb: 1 }} variant="h5">
                Drug History
              </Typography>
              <TextField
                onChange={(e) => {
                  updateHandler(
                    e.target.value,
                    "drug_history",
                    patient,
                    setActiveDoctorVisit
                  );
                }}
                defaultValue={patient.patient.drug_history}
                multiline
                sx={{ p: 1 }}
                fullWidth
                rows={2}
              ></TextField>
            </Box>
            <Box sx={{flex:1}}>
              <Typography sx={{ mb: 1 }} variant="h5">
                Social History
              </Typography>
              <TextField
                onChange={(e) => {
                  updateHandler(
                    e.target.value,
                    "social_history",
                    patient,
                    setActiveDoctorVisit
                  );
                }}
                defaultValue={patient.patient.social_history}
                multiline
                sx={{ p: 1 }}
                fullWidth
                rows={2}
              ></TextField>
            </Box>
          </Stack>
          <Stack direction={"row"} gap={1}>
            <Box sx={{flex:1}}>
              <Typography sx={{ mb: 1 }} variant="h5">
                Allergies
              </Typography>
              <TextField
                onChange={(e) => {
                  updateHandler(
                    e.target.value,
                    "allergies",
                    patient,
                    setActiveDoctorVisit
                  );
                }}
                defaultValue={patient.patient.allergies}
                multiline
                sx={{ p: 1 }}
                fullWidth
                rows={2}
              ></TextField>
            </Box>
          
          </Stack>
        </Box>
      )}
    </div>
  );
}

export default PatientMedicalHistory;
