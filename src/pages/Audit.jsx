import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  ListItemButton,
  Badge,
  Typography,
  Divider,
  Snackbar,
  Alert,
  ListItemIcon,
  Stack,
} from "@mui/material";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { Delete, Print } from "@mui/icons-material";
import { webUrl } from "./constants";
import PatientServicesDialog from "./Dialogs/PatientServicesDialog";
import SimpleMediaQuery from "./MediaQuery";
import MyCustomLoadingButton from "../components/MyCustomLoadingButton";
import PatientDetail from "./Laboratory/PatientDetail";
import AddCostForm from "../components/AddCostForm";
import AuditPanel from "../components/AuditPanel";
import AuditClinics from "./AuditClinics";
import AuditCost from "./AuditCost";
import AuditLab from "./AuditLab";

function Audit() {
  const [date, setDate] = useState(dayjs( new Date()));
  const [dialog, setDialog] = useState({
    showMoneyDialog:false,
    title:'',
    color:'success',
    open: false,
    openError: false,
    openLabReport: false,
    message: "تمت الاضافه بنجاح",
  });
  const [shifts, setShifts] = useState([]);
  const [companies, setCompanies] = useState([]);
  useEffect(() => {
    document.title = "المراجعه";
  }, []);
  const [selectedShift, setSelectedShift] = useState(null);
  const [showServices, setShowServices] = useState(false);
  const [selectedDoctorShift, setSelectedDoctorShift] = useState(null);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const searchShiftByDateHandler = () => {
    axiosClient
      .get(`getShiftByDate?date=${date.format("YYYY-MM-DD")}`)
      .then(({ data }) => {
        console.log(data);
        setShifts(data);
      });
  };
  useEffect(() => {
    axiosClient.get("company/all").then(({ data }) => {
      console.log(data, "comapnies");
      setCompanies(data);
    });
  }, []);
  return (
    <>
    <div
    
    >
      <Box sx={{direction:'ltr'}}> 
        {/* <SimpleMediaQuery/> */}
        <Stack direction={'row'} alignContent={'center'} alignItems={'center'} display={'inline-flex'}>
       
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateField
            onChange={(val) => {
              setDate(val);
            }}
            value={date}
            defaultValue={dayjs(new Date())}
            sx={{ m: 1 }}
            label="تاريخ"
          />
        </LocalizationProvider>
        <Button
          onClick={searchShiftByDateHandler}
          size="medium"
          variant="contained"
        >
          بحث
        </Button>
        </Stack>
       
      
        {shifts.length > 0 && (
         
           
           
             <Stack  textAlign={'center'} alignItems={'center'} justifyContent={'center'}  gap={1} direction={'column'}>
             {shifts.map((shift, index) => (
                <Button variant="contained" onClick={()=>{
                  setSelectedShift(shift)
                }}  key={index} >
                  {dayjs(Date.parse(shift.created_at)).format(
                    "YYYY-MM-DD H:m A"
                  )}

                </Button>
              ))}

            {selectedShift && (
              <a href={`${webUrl}clinics/all?shift=${selectedShift.id}`}>
                التقرير العام للورديه رقم {selectedShift.id}
              </a>
            )}
             </Stack>
      
        )}
     
      </Box>
    
    
      <Snackbar
        open={dialog.open}
        autoHideDuration={2000}
        onClose={() => setDialog((prev) => ({ ...prev, open: false }))}
      >
        <Alert  severity={dialog.color} variant="filled" sx={{ width: "100%" ,direction:'rtl'}}>
          {dialog.message}
        </Alert>
      </Snackbar>
    {showServices &&  <PatientServicesDialog setDialog={setDialog} activeShift={selectedDoctorShift}  setActivePatient={setSelectedVisit} companies={companies}  patient={selectedVisit} showServices={showServices} setShowServices={setShowServices} />}
    </div>
   {selectedShift && <AuditPanel lab={<AuditLab/>} cost={<AuditCost selectedShift={selectedShift} setSelectedShift={setSelectedShift}  />} clinics={<AuditClinics selectedDoctorShift={selectedDoctorShift} setSelectedVisit={setSelectedVisit} setShowServices={setShowServices} setSelectedDoctorShift={setSelectedDoctorShift} selectedShift={selectedShift} selectedVisit={selectedVisit} />}/>}
    
    </>
  );
}

export default Audit;
