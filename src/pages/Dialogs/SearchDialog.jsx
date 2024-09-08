import {
  Box,
  Card,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";
import { LoadingButton } from "@mui/lab";
import { Add } from "@mui/icons-material";
import MyAutocomepleteHistory from "../../components/MyAutocomepleteHistory";
import MyAutocomepleteHistoryLab from "../../components/MyAutocompleteHistoryLab";

function SearchDialog({lab=false}) {
  const {foundedPatients, openedDoctors, setUpdate ,setDialog,doctors} =
    useOutletContext();
  const [doctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);

  const setDoctor = (d) => {
    setSelectedDoctor(d);
  };
  const addPatientByHistory = (id, oldDoctor) => {
    console.log(doctor, oldDoctor,'id - oldDoctor');
    if(doctor == undefined) {
      alert('قم بتحديد الطبيب')
      return;
    }
    setLoading(true);
  
    const url =    lab ?`patients/add-patient-by-history-lab/${id}/${doctor.id}`  :`patients/add-patient-by-history/${doctor.id}/${id}`

    axiosClient
      .post(
        url
      )
      .then(({ data }) => {
        console.log(data);
        setUpdate((prev) => prev + 1);
      })
      .catch(({response:{data}}) => {
        console.log(data);
       setDialog((prev)=>{
        return {...prev,open:true,msg:data.message,color:'error'}


       })
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Card  >
      <TableContainer sx={{height:'70vh',overflow:'auto'}}>
        <Table sx={{ width: "90%" ,mr:1}} size="small" >
          <thead>
            <TableRow>
              <TableCell width={'20%'}>الاسم</TableCell>
              <TableCell>التاريخ</TableCell>
              <TableCell>  الطبيب السابق</TableCell>
              <TableCell> الطبيب</TableCell>
              <TableCell> اضافه</TableCell>
            </TableRow>
          </thead>
          <TableBody>
            {foundedPatients.map((item) => (
              <TableRow key={item.id}>
                <TableCell  width={'20%'}>{item.name}</TableCell>
                <TableCell>
                  {new Date(Date.parse(item.created_at)).toLocaleDateString()}
                </TableCell>
                <TableCell>{item?.doctor?.name}</TableCell>
                <TableCell>
                  {lab  ? <MyAutocomepleteHistoryLab  setDoctor={setDoctor} options={doctors} />  :<MyAutocomepleteHistory
                    setDoctor={setDoctor}
                    options={openedDoctors}
                   
                  />}
                </TableCell>
                <TableCell>
                  <LoadingButton
                    loading={loading}
                    onClick={() => {
                      addPatientByHistory(item.id, item.doctor);
                    }}
                    variant="contained"
                  >
                    <Add />
                  </LoadingButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default SearchDialog;
