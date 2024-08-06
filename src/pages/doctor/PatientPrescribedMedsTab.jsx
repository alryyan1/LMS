import {
    Box,
    Button,
    Divider,
   
    Table,
   
    TableBody,
   
    TableCell,
   
    TableHead,
   
    TableRow,
   
    TextField,
  } from "@mui/material";
  import axiosClient from "../../../axios-client";
import AddDrugAutocomplete from "../../components/AddDrugAutocomplete";
import AddPrescribedDrugAutocomplete from "./AddPrescribedDrugAutocomplete";
import MyTableCell from "../inventory/MyTableCell"
import { DeleteOutline } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
  function PatientPrescribedMedsTab(props) {
    const { value, index, patient, setDialog,setActivePatient, ...other } = props;
    const [loading,setLoading] =  useState()
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
          <Divider sx={{mb:1}} variant="middle">Prescribed Medicines</Divider>
        {value === index && (
          <Box sx={{ justifyContent: "space-around" ,m:1}} className="">
            <AddPrescribedDrugAutocomplete setActivePatient ={setActivePatient} patient={patient}  setDialog={setDialog}  />
            <Table sx={{mt:1}} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Drug Name</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Days</TableCell>
                  <TableCell>dlt</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patient.prescriptions.map((medicine, i) => (
                  <TableRow key={i}>
                    <TableCell>{medicine.item.market_name}</TableCell>
                    <MyTableCell show colName={'course'} item={medicine} table="prescribedDrugs">{medicine.course}</MyTableCell>
                    <MyTableCell show colName={'days'} item={medicine} table="prescribedDrugs">{medicine.days}</MyTableCell>
                    <TableCell>
                      <LoadingButton loading={loading} onClick={()=>{
                        setLoading(true)
                          axiosClient.delete(`prescribedDrugs/${medicine.id}`).then(({data})=>{
                            console.log(data,'delete prescribed drugs data');
                            if (data.status) {
                              setActivePatient((prev)=>{
                                return {...prev,patient:data.patient}
                              })
                              setDialog((prev) => {
                                return {
                                 ...prev,
                                  open: true,
                                  color: "success",
                                  message: "Medicine deleted successfully"
                                };
                              });
                            }
                          }).finally(()=>setLoading(false))
                      }}><DeleteOutline/></LoadingButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Divider/>
            <TextField   onChange={(e) => {
                        axiosClient
                          .patch(`patients/${patient.id}`, {
                            prescription_notes: e.target.value,
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
                      }} color="info" defaultValue={patient.prescription_notes} sx={{mt:1}}  label='Notes' fullWidth multiline rows={5}></TextField>
          </Box>
        )}
      </div>
    );
  }
  
  export default PatientPrescribedMedsTab;
  