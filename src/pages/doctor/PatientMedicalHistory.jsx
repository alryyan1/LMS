import { Box, Divider, TextField, Typography } from "@mui/material";
import axiosClient from "../../../axios-client";

function PatientMedicalHistory(props) {
  const { value, index, patient, setDialog, setShift, change, ...other } =
    props;
  const updateHandler = (e, colName) => {
    axiosClient
      .patch(`patients/${patient.id}`, {
        [colName]: e.target.value,
      })
      .then(({ data }) => {
        console.log(data);
        if (data.status) {
          change(data.patient);
          setDialog((prev) => {
            return {
              ...prev,
              message: "Saved",
              open: true,
              color: "success",
            };
          });
        }
      })
      .catch(({ response: { data } }) => {
        console.log(data);
        setDialog((prev) => {
          return {
            ...prev,
            message: data.message,
            open: true,
            color: "error",
          };
        });
      });
  };
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
              updateHandler(e, "history_of_present_illness");
            }}
            defaultValue={patient.history_of_present_illness}
            multiline
            fullWidth
            rows={5}
          ></TextField>
            <Typography sx={{ mb: 1 }}  variant="h5">
        Past Medical History
      </Typography>
          <TextField
            onChange={(e) => {
              updateHandler(e, "family_history");
            }}
            defaultValue={patient.family_history}
            multiline
            sx={{p:2}}
            fullWidth
            rows={5}
          ></TextField>
              <Typography sx={{ mb: 1 }}  variant="h5">
        Drug History
      </Typography>
          <TextField
            onChange={(e) => {
              updateHandler(e, "drug_history");
            }}
            defaultValue={patient.drug_history}
            multiline
            sx={{p:2}}
            fullWidth
            rows={5}
          ></TextField>
        </Box>
      )}
    </div>
  );
}

export default PatientMedicalHistory;
