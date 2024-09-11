import {Box} from "@mui/material"
import PatientDetailLong from "./PatientDetailsLong";
import PatientDetailLab from "./PatientDetailLab";
import PatientDetail from "../Laboratory/PatientDetail";
function PatientInformationPanel(props) {
    const { value, index,patient, ...other } = props;
  
    return (
      <div 
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{justifyContent:'space-around'}}  className='group' >
            <PatientDetail   patient={patient}/>
            {/* <PatientDetailLab patient={patient}/> */}
          </Box>
        )}
      </div>
    );
  }

  export default PatientInformationPanel