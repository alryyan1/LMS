import {
  Box,
  Divider,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axiosClient from "../../../axios-client";
import { Delete, DeleteOutline } from "@mui/icons-material";
import { useEffect, useState } from "react";
import AddTestAutoComplete from "../Laboratory/AddTestAutoComplete";
import { t } from "i18next";
import { LoadingButton } from "@mui/lab";
import { updateHandler } from "../constants";
import { DoctorVisit } from "../../types/Patient";
interface AddLabTestsProbs{
  value: number;
  index: number;
  patient: DoctorVisit;
  setActiveDoctorVisit: (data)=>void;
  complains: any;
  socket: any;

}
function AddLabTests(props:AddLabTestsProbs) {


  const { value, index, patient, setActiveDoctorVisit,complains,socket, ...other } =
    props;
  const [selectedTests, setSelectedTests] = useState([]);
    console.log(patient,'active patient in add lab')
  const deleteTest = (id) => {
    console.log(id);
    axiosClient.delete(`labRequest/${id}/${patient.id}`).then(({ data }) => {
      console.log(data, "data");
      if (data.status) {
        console.log(data,'data')
        setActiveDoctorVisit(data.data)
      }
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
      <Divider sx={{ mb: 1 }} variant="middle">
       Request Lab Tests
      </Divider>
      {value === index && (
        <Box sx={{ justifyContent: "space-around", m: 1 }} className="">
       <Typography variant="h5" >Lab number is {patient.patient.visit_number}</Typography>

          <AddTestAutoComplete   setActiveDoctorVisit={setActiveDoctorVisit}   actviePatient={patient}    setSelectedTests={setSelectedTests} selectedTests={selectedTests} />
  
          <TableContainer >
            <Table sx={{mt:1}} size="small">
              <TableHead>
                <TableRow>
                  <TableCell> {t('name')}</TableCell>
            
                  <TableCell align="right">-</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patient.patient.labrequests.map((test) => {
          

                  return (
                    <TableRow
                      sx={{
                        borderBottom: "1px solid rgba(224, 224, 224, 1)",
                      }}
                      key={test.id}
                    >
                      <TableCell sx={{ border: "none" }} scope="row">
                        {test.main_test.main_test_name}
                      </TableCell>
                      <TableCell sx={{ border: "none" }} align="right">
                        <IconButton
                          disabled={patient?.patient.is_lab_paid == 1}
                          aria-label="delete"
                          onClick={() => deleteTest(test.id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
               
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
          </TableContainer>

          <Divider />
        
         
         
        </Box>
      )}
       <Divider/>
        <Stack direction="row" justifyContent={'space-around'} gap={2}>
            <LoadingButton disabled={patient.patient.doctor_lab_request_confirm == 1 } onClick={()=>{
              updateHandler(1,'doctor_lab_request_confirm',patient,setActiveDoctorVisit).then((data)=>{
                console.log(data,'data from handler')
                  socket.emit('lab_request_confirm',data.id)
              })
            }} variant="contained">Confirm</LoadingButton>
            <LoadingButton disabled={patient.patient.doctor_lab_urgent_confirm == 1} onClick={()=>{
              updateHandler(1,'doctor_lab_urgent_confirm',patient,setActiveDoctorVisit)

            }} variant="contained">Urgent</LoadingButton>
          </Stack>
    </div>
  );
}

export default AddLabTests;
