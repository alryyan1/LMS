import {
  Box,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axiosClient from "../../../axios-client";
import { Delete, DeleteOutline } from "@mui/icons-material";
import { useEffect, useState } from "react";
import AddTestAutoComplete from "../Laboratory/AddTestAutoComplete";
import { t } from "i18next";
function AddLabTests(props) {
  const { value, index, patient, setDialog, setActivePatient,complains,setShift, ...other } =
    props;
  const [selectedTests, setSelectedTests] = useState([]);
  
  const deleteTest = (id) => {
    console.log(id);
    axiosClient.delete(`labRequest/${id}`).then(({ data }) => {
      console.log(data, "data");
      if (data.status) {
        setActivePatient((prev)=>{
          return {...prev,patient:data.data}
        })
       
        setShift((prev)=>{
          return {...prev, visits:prev.visits.map((v)=>{
            if(v.patient_id === data.data.id){
              return {...v,patient:data.data}
            }
            return v;
          })}
        })
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
          <AddTestAutoComplete setClinicPatient={setActivePatient} setShift={setShift}  actviePatient={patient}  setDialog={setDialog}  setSelectedTests={setSelectedTests} selectedTests={selectedTests} />
  
          <TableContainer sx={{ border: "none", textAlign: "left" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell> {t('name')}</TableCell>
            
                  <TableCell align="right">-</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patient.labrequests.map((test) => {
          

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
                          disabled={patient?.is_lab_paid == 1}
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
    </div>
  );
}

export default AddLabTests;
