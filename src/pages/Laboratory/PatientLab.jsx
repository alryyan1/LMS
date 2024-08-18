import { FavoriteBorder, HeatPumpRounded, Lock } from "@mui/icons-material";
import { Badge, Box, Grow,  } from "@mui/material";
import 'animate.css';
import { useOutletContext } from "react-router-dom";

function PatientLab({ onClick, patient }) {
  
  const {actviePatient} = useOutletContext()

  return (
    <Grow  timeout={2000} in>
      {patient.labrequests.length > 0 ? (
        <Badge
        
         
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "bottom",
          }}
        
          badgeContent={patient.labrequests.length}
          color={patient.is_lab_paid == 0 ? "error" : "success"}
        >
          <Box
            
        
            onClick={() => {
              onClick(patient);
            }}
            style={  patient.is_lab_paid  == 1  && patient.id != actviePatient?.id ? {
             backgroundColor:"#00e676"
            }:{}}
            
            sx={ patient.active ? {
                backgroundColor :(theme)=>theme.palette.warning.light
    
              }:{
              
              }}   
          >
            {patient.visit_number}
            <span>
             {patient.company_id != null ?  <FavoriteBorder sx={{width:'16px'}} /> :""}
            </span>
          </Box>
        </Badge>
      ) : (
        <Box
       
          onClick={() => {
            onClick(patient);
          }}
          sx={ patient.active ? {
            borderBottom:"4px solid blue",
            fontWeight:"bolder",
            backgroundColor :(theme)=>theme.palette.warning.light

          }:{
          }}        >
          {patient.visit_number}
          <span>
             {patient.company_id != null ?  <FavoriteBorder sx={{width:'16px'}} /> :""}
            </span>
          <span >
             {patient.result_is_locked ?  <Lock/> :""}
            </span>
        </Box>
      )}
    </Grow>
  );
}

export default PatientLab;
