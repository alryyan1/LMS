import {
  Box,
  Divider,
} from "@mui/material";
import CodeEditor from "./CodeMirror";
import { DoctorVisit } from "../../types/Patient";
interface PresentingComplainProps {
  value: number;
  index: number;
  patient: DoctorVisit;
  complains: any;
  setComplains: any;
  setActiveDoctorVisit: any;
}
function PresentingComplain(props:PresentingComplainProps) {
  const {
    value,
    index,
    patient,
    complains,
    setComplains,
    setActiveDoctorVisit,
    ...other
  } = props;

 
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Divider sx={{ mb: 1 }} variant="middle">
        Presenting Complain
      </Divider>
      {value === index && (
        <Box sx={{ justifyContent: "space-around" }} className="">
          
           <CodeEditor tableName={'chief_complain'} setOptions={setComplains} options={complains} init={patient.patient.present_complains} patient={patient} setActiveDoctorVisit={setActiveDoctorVisit}  colName={'present_complains'}/>
        
        </Box>
      )}
    </div>
  );
}

export default PresentingComplain;
