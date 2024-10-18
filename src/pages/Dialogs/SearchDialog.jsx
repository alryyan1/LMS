import {
  Button,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";
import { LoadingButton } from "@mui/lab";
import { Add,  } from "@mui/icons-material";
import MyAutocomepleteHistory from "../../components/MyAutocomepleteHistory";
import MyAutocomepleteHistoryLab from "../../components/MyAutocompleteHistoryLab";
import dayjs from "dayjs";
import ComponyAutocompleteHistory from "./ComponyAutocompleteHistory";
import { MessageCircleDashed } from "lucide-react";

function SearchDialog({lab=false,user}) {
  const {foundedPatients, openedDoctors, setUpdate ,setDialog,doctors,companies} =
    useOutletContext();
  const [doctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const setDoctor = (d) => {
    setSelectedDoctor(d);
  };
  const addPatientByHistory = (id, oldDoctor) => {
    console.log(doctor, oldDoctor,'id - oldDoctor');
    if(doctor == undefined) {
      alert('قم بتحديد الطبيب')
      return;
    }
    setDialog((prev)=>{
      return {...prev,showHistory:false}
    })
    setLoading(true);
  
    const url =    lab ?`patients/add-patient-by-history-lab/${id}/${doctor.id}`  :`patients/add-patient-by-history/${doctor.id}/${id}`

    axiosClient
      .post(
        url,{
          company_id:selectedCompany?.id ?? null
        }
      )
      .then(({ data }) => {
        console.log(data);
        setUpdate((prev) => prev + 1);
      })
      .catch(({response:{data}}) => {
        console.log(data);
       setDialog((prev)=>{
        return {...prev,open:true,message:data.message,color:'error'}


       })
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
        <IconButton variant="contained" size="small" sx={{position:'absolute'}} color="warning" onClick={()=>{
          setDialog((prev)=>{
            return {...prev,showHistory:false}
          })
        }} >
          <CloseIcon/>
        </IconButton>
    
     <TableContainer component={Card} sx={{height:'70vh',overflow:'auto'}}>
        <Table style={{direction:'rtl'}} size="small" >
          <thead>
            <TableRow>
              <TableCell >الاسم</TableCell>
              <TableCell>التاريخ</TableCell>
              <TableCell>  الطبيب السابق</TableCell>
              <TableCell> الطبيب</TableCell>
              <TableCell> الشركه</TableCell>
              <TableCell> اضافه</TableCell>
            </TableRow>
          </thead>
          <TableBody>
            {foundedPatients.map((item) => (
              <TableRow key={item.id}>
                <TableCell  >{item.name}</TableCell>
                <TableCell>
                  {dayjs(new Date(Date.parse(item.created_at))).format('YYYY-MM-DD')}
                </TableCell>
                <TableCell>{item?.doctor?.name}</TableCell>
                <TableCell>
                  {lab  ? <MyAutocomepleteHistoryLab   setDoctor={setDoctor} options={doctors} />  :<MyAutocomepleteHistory
                  user={user}
                   
                    setDoctor={setDoctor}
                    options={openedDoctors}
                   
                  />}
                </TableCell>
                <TableCell>
              
               <ComponyAutocompleteHistory  patientCompany={item.company}  setSelectedCompany={setSelectedCompany} companies={companies} />
          
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
    </>
     
  );
}

export default SearchDialog;
