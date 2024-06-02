import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";
import { LoadingButton } from "@mui/lab";
import { Add, PlusOne } from "@mui/icons-material";
import MyAutocomepleteHistory from "../../components/MyAutocomepleteHistory";

function SearchDialog() {
  const {foundedPatients, openedDoctors, setUpdate ,setDialog} =
    useOutletContext();
  const [doctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);

  const setDoctor = (doctor) => {
    setSelectedDoctor(doctor);
  };
  const addPatientByHistory = (id, oldDoctor) => {
    setLoading(true);

    axiosClient
      .post(
        `patients/add-patient-by-history/${id}/${doctor?.id ?? oldDoctor.id}`
      )
      .then(({ data }) => {
        console.log(data);
        setUpdate((prev) => prev + 1);
      })
      .catch(({data}) => {
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
    <div>
      <TableContainer>
        <Table sx={{ width: "100%" }} size="small" style={{ direction: "rtl" }}>
          <thead>
            <TableRow>
              <TableCell>الاسم</TableCell>
              <TableCell>التاريخ</TableCell>
              <TableCell> الطبيب</TableCell>
              <TableCell> اضافه</TableCell>
            </TableRow>
          </thead>
          <TableBody>
            {foundedPatients.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  {new Date(Date.parse(item.created_at)).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <MyAutocomepleteHistory
                    setDoctor={setDoctor}
                    options={openedDoctors}
                    val={item.doctor}
                  />
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
    </div>
  );
}

export default SearchDialog;
