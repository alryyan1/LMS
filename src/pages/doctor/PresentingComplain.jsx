import {
  Box,
  Divider,
} from "@mui/material";
import CodeEditor from "./CodeMirror";

function PresentingComplain(props) {
  const {
    value,
    index,
    patient,
    setDialog,
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
          
           <CodeEditor tableName={'chief_complain'} setOptions={setComplains} options={complains} init={patient.present_complains} patient={patient} setActiveDoctorVisit={setActiveDoctorVisit} setDialog={setDialog} colName={'present_complains'}/>
        
        </Box>
      )}
    </div>
  );
}

export default PresentingComplain;
