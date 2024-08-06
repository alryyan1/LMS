import {Box} from "@mui/material"
import PatientDetailLong from "./PatientDetailsLong";
import PatientDetailLab from "./PatientDetailLab";
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
            <PatientDetailLong patient={patient}/>
            <PatientDetailLab patient={patient}/>
          </Box>
        )}
      </div>
    );
  }

  export default PatientInformationPanel