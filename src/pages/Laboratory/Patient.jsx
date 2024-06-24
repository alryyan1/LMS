import { Delete, Lock, LockOpen } from "@mui/icons-material";
import { Badge, Box, Grow, Icon } from "@mui/material";
import 'animate.css';

function Patient({ onClick, patient, delay,unfinshed_count }) {
  return (
    <Grow className={unfinshed_count == 0 && patient.result_print_date ==null ? "animate__animated animate__bounce animate__infinite animate__slow" :"" } style={{ transitionDelay: `${delay}ms` }} timeout={2000} in>
      {patient.labrequests.length > 0 ? (
        <Badge
        style={{

          minHeight:'15px!important',minWidth:"15px!important",height:'15px!important',width:'15px!important'
        }}
         
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "bottom",
          }}
        
          badgeContent={patient.labrequests.length}
          color={patient.is_lab_paid == 0 ? "secondary" : "warning"}
        >
          <Box
          
            sx= { patient.result_print_date !=null? {
              
              backgroundColor :'#00b0ff!important' 

    
            }:null}
            onClick={() => {
              onClick(patient.id);
            }}
            style={ patient.active ? {
              borderBottom:"4px solid blue",
              fontWeight:"bolder",
              backgroundColor :'lightblue!important' 
            }:null}
          >
            {patient.visit_number}
            <span>
             {patient.result_is_locked ?  <Lock/> :""}
            </span>
          </Box>
        </Badge>
      ) : (
        <Box
        sx= { patient.result_print_date !=null? {
              
          backgroundColor :'#00b0ff!important' 


        }:null}
          onClick={() => {
            onClick(patient.id);
          }}
          style={ patient.active ? {
            borderBottom:"4px solid blue",
            fontWeight:"bolder",
            backgroundColor :'lightblue' 

          }:null}        >
          {patient.visit_number}
          <span >
             {patient.result_is_locked ?  <Lock/> :""}
            </span>
        </Box>
      )}
    </Grow>
  );
}

export default Patient;
