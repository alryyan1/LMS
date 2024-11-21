import {
  Box,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axiosClient from "../../../axios-client";
import PatientEditSelect from "./PatientEditSelect";
import { DoctorVisit } from "../../types/Patient";
import { updateHandler } from "../constants";
import React, { SetStateAction } from "react";
interface GeneralExaminationProps {
  value: number;
  index: number;
  patient: DoctorVisit;
  setActiveDoctorVisit:React.Dispatch<SetStateAction<DoctorVisit|null>>;
}
function GeneralExaminationPanel(props:GeneralExaminationProps) {

  const { value, index, patient,setActiveDoctorVisit, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
        <Divider sx={{mb:1}} variant="middle">General Examination</Divider>
      {value === index && (
        <Box sx={{ justifyContent: "space-around" }} className="group">
          <Stack direction={"row"} gap={2} justifyContent={"space-around"}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
           
                <TableRow>
                  <TableCell>Juandice</TableCell>
                  <PatientEditSelect setActiveDoctorVisit={setActiveDoctorVisit} colName={'juandice'} myVal={patient.patient.juandice} patient={patient} />
                </TableRow>
                <TableRow>
                  <TableCell>Pallor</TableCell>
                  <PatientEditSelect setActiveDoctorVisit={setActiveDoctorVisit}   colName={'pallor'} myVal={patient.patient.pallor} patient={patient} />
                </TableRow>
              </TableBody>
            </Table>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Clubbing</TableCell>
                  <PatientEditSelect setActiveDoctorVisit={setActiveDoctorVisit}   colName={'clubbing'} myVal={patient.patient.clubbing} patient={patient} />
                </TableRow>
                <TableRow>
                  <TableCell>Cyanosis</TableCell>
                  <PatientEditSelect setActiveDoctorVisit={setActiveDoctorVisit}   colName={'cyanosis'} myVal={patient.patient.cyanosis} patient={patient} />
                </TableRow>
                <TableRow>
                  <TableCell>Edema Feet</TableCell>
                  <PatientEditSelect setActiveDoctorVisit={setActiveDoctorVisit}   colName={'edema_feet'} myVal={patient.patient.edema_feet} patient={patient} />
                </TableRow>
                <TableRow>
                  <TableCell>Dehydration</TableCell>
                  <PatientEditSelect setActiveDoctorVisit={setActiveDoctorVisit}   colName={'dehydration'} myVal={patient.patient.dehydration} patient={patient} />
                </TableRow>
                <TableRow>
                  <TableCell>Lymphadenopathy</TableCell>
                  <PatientEditSelect setActiveDoctorVisit={setActiveDoctorVisit}   colName={'lymphadenopathy'} myVal={patient.patient.lymphadenopathy} patient={patient} />
                </TableRow>
                <TableRow>
                  <TableCell>Peripheral pulses</TableCell>
                  <PatientEditSelect setActiveDoctorVisit={setActiveDoctorVisit}   colName={'peripheral_pulses'} myVal={patient.patient.peripheral_pulses} patient={patient} />
                </TableRow>
                <TableRow>
                  <TableCell>Feet ulcer</TableCell>
                  <PatientEditSelect setActiveDoctorVisit={setActiveDoctorVisit}   colName={'feet_ulcer'} myVal={patient.patient.feet_ulcer} patient={patient} />
                </TableRow>
              </TableBody>
            </Table>
           
          </Stack>
          <TextField defaultValue={patient.patient.general_examination_notes} label='Notes' rows={12} multiline onChange={(e)=>{
              updateHandler(e.target.value,'general_examination_notes',patient,setActiveDoctorVisit)
            }}></TextField>
        </Box>
      )}
    </div>
  );
}

export default GeneralExaminationPanel;
