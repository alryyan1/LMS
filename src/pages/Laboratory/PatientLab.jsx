import { Delete, Lock, LockOpen } from "@mui/icons-material";
import { Badge, Box, Grow, Icon, breadcrumbsClasses } from "@mui/material";
import 'animate.css';

function PatientLab({ onClick, patient }) {
  
  

  return (
    <Grow  timeout={2000} in>
      {patient.labrequests.length > 0 ? (
        <Badge
        
         
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "bottom",
          }}
        
          badgeContent={patient.labrequests.length}
          color={patient.is_lab_paid == 0 ? "secondary" : "warning"}
        >
          <Box
          
        
            onClick={() => {
              onClick(patient);
            }}
            sx={ patient.active ? {
                borderBottom:"4px solid blue",
                fontWeight:"bolder",
                backgroundColor :(theme)=>theme.palette.primary.light
    
              }:{
                backgroundColor:'white'
              }}   
          >
            {patient.visit_number}
            <span>
             {patient.result_is_locked ?  <Lock/> :""}
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
            backgroundColor :(theme)=>theme.palette.primary.light

          }:{
            backgroundColor:'white'
          }}        >
          {patient.visit_number}
          <span >
             {patient.result_is_locked ?  <Lock/> :""}
            </span>
        </Box>
      )}
    </Grow>
  );
}

export default PatientLab;
