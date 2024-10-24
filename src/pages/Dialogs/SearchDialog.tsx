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
import MyAutocomepleteHistory from "../../components/MyAutocomepleteHistory.tsx";
import MyAutocomepleteHistoryLab from "../../components/MyAutocompleteHistoryLab";
import dayjs from "dayjs";
import ComponyAutocompleteHistory from "./ComponyAutocompleteHistory";
import { MessageCircleDashed } from "lucide-react";
import { OutletContextType } from "../../types/CutomTypes";
import { Company } from "../../types/Patient";

function SearchDialog({lab=false,user,update}) {
  const {foundedPatients, openedDoctors ,setDialog,doctors,companies,activeShift} =
    useOutletContext<OutletContextType>();
  const [doctor, setSelectedDoctor] = useState<Doctor|null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company|null>(null);

  const setDoctor = (d) => {
    setSelectedDoctor(d);
  };
  const addPatientByHistory = (id) => {
    if(doctor == undefined) {
      alert('قم بتحديد الطبيب')
      return;
    }

    setLoading(true);
  
    const url =    `patients/add-patient-by-history/${doctor.id}/${id}?onlyLab=1`

    axiosClient
      .post(
        url,{
          company_id:selectedCompany?.id ?? null
        }
      )
      .then(({ data }) => {
        console.log(data,'data from history');
        update(data.patient)
      })
      .catch(({response:{data}}) => {
        console.log(data);
       setDialog((prev)=>{
        return {...prev,open:true,message:data.message,color:'error'}


       })
      })
      .finally(() => {
        setDialog((prev)=>{
          return {...prev,showHistory:false}
        })
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
                <TableCell  sx={{width:'20%',textWrap:'nowrap'}} >{item.name}</TableCell>
                <TableCell sx={{textWrap:'nowrap'}}>
                  {dayjs(new Date(Date.parse(item.created_at))).format('YYYY-MM-DD')}
                </TableCell>
                <TableCell sx={{textWrap:'nowrap'}}>{item?.doctor?.name}</TableCell>
                <TableCell>
                  {lab  ? <MyAutocomepleteHistoryLab   setDoctor={setDoctor} options={doctors} />  :<MyAutocomepleteHistory
                  user={user}
                  patient={item}
                    setDoctor={setDoctor}
                    options={openedDoctors}
                    activeShift={activeShift}
                   
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
