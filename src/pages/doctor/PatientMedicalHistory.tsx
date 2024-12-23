import { Box, Divider, Stack, TextField, Typography } from "@mui/material";
import axiosClient from "../../../axios-client";
import { DoctorVisit } from "../../types/Patient";
import { updateHandler } from "../constants";
import CodeEditor from "./CodeMirror";
interface PatientMedicalHistoryProps {
  value: any;
  index: number;
  patient: DoctorVisit;
  setDialog: any;
  setActiveDoctorVisit: (data) => void;
  complains: string[];
  setComplains: (value: string) => void;
}
function PatientMedicalHistory(props: PatientMedicalHistoryProps) {
  const {
    value,
    index,
    patient,
    setDialog,
    setActiveDoctorVisit,
    complains,
    setComplains,
    ...other
  } = props;

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
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ mb: 1 }} variant="h5">
                History of Present Illness
              </Typography>

              <CodeEditor
                tableName={"chief_complain"}
                setOptions={setComplains}
                options={complains}
                colName="history_of_present_illness"
                init={patient.patient.history_of_present_illness}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ mb: 1 }} variant="h5">
                Past Medical History
              </Typography>

              <CodeEditor
                tableName={"chief_complain"}
                setOptions={setComplains}
                options={complains}
                colName="patient_medical_history"
                init={patient.patient.patient_medical_history}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
              />
            </Box>
          </Stack>
          <Stack direction={"row"} gap={1}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ mb: 1 }} variant="h5">
                Drug History
              </Typography>
        
              <CodeEditor
                tableName={"chief_complain"}
                setOptions={setComplains}
                options={complains}
                colName="drug_history"
                init={patient.patient.drug_history}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ mb: 1 }} variant="h5">
                Social History
              </Typography>
       
              <CodeEditor
                tableName={"chief_complain"}
                setOptions={setComplains}
                options={complains}
                colName="social_history"
                init={patient.patient.social_history}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
              />
            </Box>
          </Stack>
          <Stack direction={"row"} gap={1}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ mb: 1 }} variant="h5">
                Allergies
              </Typography>
          
              <CodeEditor
                tableName={"chief_complain"}
                setOptions={setComplains}
                options={complains}
                colName="allergies"
                init={patient.patient.allergies}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ mb: 1 }} variant="h5">
                Family History
              </Typography>
          
              <CodeEditor
                tableName={"chief_complain"}
                setOptions={setComplains}
                options={complains}
                colName="family_history"
                init={patient.patient.family_history}
                patient={patient}
                setActiveDoctorVisit={setActiveDoctorVisit}
              />
            </Box>
          </Stack>
        </Box>
      )}
    </div>
  );
}

export default PatientMedicalHistory;
