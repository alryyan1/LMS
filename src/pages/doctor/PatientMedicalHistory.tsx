import { Box, Divider, TextField, Typography } from "@mui/material";
import axiosClient from "../../../axios-client";
import { DoctorVisit } from "../../types/Patient";
import { updateHandler } from "../constants";
interface PatientMedicalHistoryProps {
  value: any;
  index: number;
  patient: DoctorVisit
  setDialog: any;
  setActiveDoctorVisit:(data)=>void

}
function PatientMedicalHistory(props:PatientMedicalHistoryProps) {
  const { value, index, patient, setDialog,setActiveDoctorVisit, ...other } =
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
        <Box sx={{ justifyContent: "space-around" }} className="group">
          <Typography sx={{ mb: 1 }}  variant="h5">
        History of Present Illness
      </Typography>
          <TextField 
          sx={{p:2}}
            onChange={(e) => {
              updateHandler(e.target.value, "history_of_present_illness",patient,setActiveDoctorVisit);
            }}
            defaultValue={patient.patient.history_of_present_illness}
            multiline
            fullWidth
            rows={3}
          ></TextField>
            <Typography sx={{ mb: 1 }}  variant="h5">
        Past Medical History
      </Typography>
          <TextField
            onChange={(e) => {
              updateHandler(e.target.value, "family_history",patient,setActiveDoctorVisit);
            }}
            defaultValue={patient.patient.family_history}
            multiline
            sx={{p:2}}
            fullWidth
            rows={3}
          ></TextField>
              <Typography sx={{ mb: 1 }}  variant="h5">
        Drug History
      </Typography>
          <TextField
            
            onChange={(e) => {
              updateHandler(e.target.value, "drug_history",patient,setActiveDoctorVisit);
            }}
            defaultValue={patient.patient.drug_history}
            multiline
            sx={{p:2}}
            fullWidth
            rows={3}
          ></TextField>
        </Box>
      )}
    </div>
  );
}

export default PatientMedicalHistory;
