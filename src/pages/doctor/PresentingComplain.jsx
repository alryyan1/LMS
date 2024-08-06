import {
    Box,
    Divider,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
  } from "@mui/material";
  import axiosClient from "../../../axios-client";
  import PatientEditSelect from "./PatientEditSelect";
  
  function PresentingComplain(props) {
    const { value, index, patient, setDialog, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
          <Divider sx={{mb:1}} variant="middle">Presenting Complain</Divider>
        {value === index && (
          <Box sx={{ justifyContent: "space-around" }} className="group">
             <TextField  onChange={(e) => {
                        axiosClient
                          .patch(`patients/${patient.id}`, {
                            present_complains: e.target.value,
                          })
                          .then(({ data }) => {
                            console.log(data);
                            if (data.status) {
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
                      }} defaultValue={patient.present_complains} multiline fullWidth rows={17}></TextField>
          </Box>
        )}
      </div>
    );
  }
  
  export default PresentingComplain;
  