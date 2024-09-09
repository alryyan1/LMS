import {
    Box,
    Divider,
   
    TextField,
  } from "@mui/material";
  import axiosClient from "../../../axios-client";
  
  function PatientMedicalHistory(props) {
    const { value, index, patient, setDialog,setShift,change,  ...other } = props;
      
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
          <Divider sx={{mb:1}} variant="middle">History of Present Illness</Divider>
        {value === index && (
          <Box sx={{ justifyContent: "space-around" }} className="group">
             <TextField  onChange={(e) => {

                        axiosClient
                          .patch(`patients/${patient.id}`, {
                            history_of_present_illness: e.target.value,
                          })
                          .then(({ data }) => {
                            console.log(data);
                            if (data.status) {
                           
                              change(data.patient)
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
                      }} defaultValue={patient.history_of_present_illness} multiline fullWidth rows={17}></TextField>
          </Box>
        )}
      </div>
    );
  }
  
  export default PatientMedicalHistory;
  