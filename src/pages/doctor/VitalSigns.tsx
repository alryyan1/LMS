import {
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import axiosClient from "../../../axios-client";
import { DoctorVisit, User } from "../../types/Patient";
import { useStateContext } from "../../appContext";
import TeethModel from "../TeethModel";
import { useState } from "react";
import VitalSignsTable from "./VitalSignsTable";
interface VitalSignsProps {
  patient: DoctorVisit;
  setActiveDoctorVisit: any;
  socket: any;
}


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
function VitalSigns({
  patient,
  setActiveDoctorVisit,
  socket,
  settings
}: VitalSignsProps) {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { user }: { user: User } = useStateContext();

  return (
    <div style={{ padding: "5px" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Teeth" {...a11yProps(0)} />
          <Tab label="Vital Signs" {...a11yProps(1)} />
        </Tabs>
      {value == 0 && <TeethModel settings={settings} setActiveDoctorVisit={setActiveDoctorVisit} actviePatient={patient} user={user}/>}

      
      {value == 1 &&  <VitalSignsTable user={user} patient={patient} setActiveDoctorVisit={setActiveDoctorVisit} socket={socket}/> }
    
    </div>
  );
}

export default VitalSigns;
