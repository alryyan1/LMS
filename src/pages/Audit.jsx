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

function Audit() {
  const [date, setDate] = useState(dayjs( new Date()));
  const [dialog, setDialog] = useState({
    showMoneyDialog:false,
    title:'',
    color:'success',
    open: false,
    openError: false,
    openLabReport: false,
    msg: "تمت الاضافه بنجاح",
  });
  const [shifts, setShifts] = useState([]);
  const [companies, setCompanies] = useState([]);

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
    <div
      style={{
        marginTop: "5px",
        gap: "15px",
        transition: "0.3s all ease-in-out",
        height: "75vh",
        display: "grid",
        direction: "rtl",
        gridTemplateColumns: `1fr  1fr  1fr   1fr     `,
      }}
    >
      <Box>
        {/* <SimpleMediaQuery/> */}
        
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
          sx={{ mt: 2 }}
          size="medium"
          variant="contained"
        >
          بحث
        </Button>
        {shifts.length > 0 && (
          <Box>
            <Typography>الورديات الماليه</Typography>
            <Divider></Divider>
            <Select
              onChange={(e) => {
                setSelectedShift(e.target.value);
                console.log(e.target.value, "selected");
              }}
              label="الورديات الماليه"
            >
              {shifts.map((shift, index) => (
                <MenuItem key={index} value={shift}>
                  {dayjs(Date.parse(shift.created_at)).format(
                    "YYYY-MM-DD H:m A"
                  )}
                </MenuItem>
              ))}
              <MenuItem selected></MenuItem>
            </Select>

            <Divider></Divider>
            {selectedShift && (
              <a href={`${webUrl}clinics/all?shift=${selectedShift.id}`}>
                التقرير العامل للورديه رقم {selectedShift.id}
              </a>
            )}
          </Box>
        )}
        <Divider/>
       {selectedShift && <AddCostForm />}
        <Typography textAlign={"center"}>مصروفات الورديه</Typography>
        {selectedShift && (
          <List  dense>
            {selectedShift.cost.map((cost) => {
              return (
                <ListItem
                  
                  secondaryAction={
                    <MyCustomLoadingButton onClick={(setLoading)=>{
                      setLoading(true)
                      axiosClient.delete(`cost/${cost.id}`).then((
                        {data}
                      ) => {
                        console.log(data);
                        setSelectedShift((prev)=>{
                          const newShift = {...prev };
                          newShift.cost = newShift.cost.filter(
                            (c) => c.id!== cost.id
                          );
                          return newShift;
                        })
                      }).finally(()=>setLoading(true));
                    }}>حذف</MyCustomLoadingButton>
                  }
                  key={cost.id}
                >
                  <ListItemIcon>{cost.amount}</ListItemIcon>
                  <ListItemButton 
                    style={{
                      marginBottom: "2px",
                    }}
                  >
                    <ListItemText>{cost.description}</ListItemText>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
      <Box>
        {selectedShift && (
          <List dense>
            {selectedShift.doctor_shifts.map((doctorShift) => {
              return (
                <ListItem
            
                  sx={{
                    backgroundColor: (theme) =>
                      selectedDoctorShift?.id == doctorShift.id
                        ? theme.palette.primary.main
                        : "",
                  }}
                  secondaryAction={
                    <IconButton
                      title="التقرير الخاص"
                      href={`${webUrl}clinics/doctor/report?doctorshift=${doctorShift.id}`}
                    >
                      <Print />
                    </IconButton>
                  }
                  key={doctorShift.id}
                >
                  <ListItemButton
                    onClick={() => {
                      setSelectedVisit(null)
                      setSelectedDoctorShift(doctorShift);
                    }}
                    style={{
                      marginBottom: "2px",
                    }}
                  >
                    <ListItemText>{doctorShift.doctor.name}  ( {doctorShift.status ? 'مفتوحه':'مغلقه'})</ListItemText>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
      <Box>
        {selectedDoctorShift && (
          <List dense>
            {selectedDoctorShift.visits.map((visit) => {
              return (
                <ListItem
                  sx={{
                    backgroundColor: (theme) =>
                      selectedVisit?.id == visit.id
                        ? theme.palette.primary.main
                        : "",
                  }}
                  secondaryAction=
                   {visit.services.length > 0  && <Button onClick={()=>{
                    setSelectedVisit(visit)
                    setShowServices(true)
                   }} variant="contained">الخدمات</Button>}
                  
                  key={visit.id}
                >
                  <ListItemButton
                    onClick={() => {
                      console.log(visit,'selected visit') 
                      setSelectedVisit(visit);
                    }}
                    style={{
                      marginBottom: "2px",
                    }}
                  >
                    <ListItemText>{visit.patient.name}</ListItemText>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
      <Box>
        {selectedVisit && <PatientDetail activeShift={selectedDoctorShift}   patient={selectedVisit.patient} isLab={true}/>}
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
  );
}

export default Audit;
