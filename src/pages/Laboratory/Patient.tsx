import { Delete, Lock, LockOpen } from "@mui/icons-material";
import { Badge, Box, Grow, Icon, breadcrumbsClasses } from "@mui/material";
import 'animate.css';
import { DoctorVisit } from "../../types/Patient";

interface PatientProps {
  onClick: (patient: number) => void;
  patient: DoctorVisit;
  delay: number;
  unfinshed_count: number;
  actviePatient: DoctorVisit | null;
}
function Patient({ onClick, patient:{patient}, delay,unfinshed_count,actviePatient }:PatientProps) {
  let patientState= ''
  if (patient.result_print_date == null){
 
    switch(unfinshed_count){
      case 0 :
         patientState = "animate__animated  animate__bounce   animate__infinite animate__slower";
      break;
      case 1 :
        patientState = "animate__animated animate__heartBeat animate__infinite animate__slower";
        break;
    }
  }

  return (
    <Grow className={patientState  } style={{ transitionDelay: `${delay}ms` }} timeout={2000} in>
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
          color={patient.is_lab_paid == 0 ? "error" : "success"}
        >
          <Box
          
            style= { patient.result_print_date !=null &&   actviePatient?.patient.id != patient.id ? {
              
              backgroundColor :'#00b0ff' 

    
            }:null}
            onClick={() => {
              onClick(patient.id);
            }}
            sx={ patient.id == actviePatient?.patient?.id ? {
              backgroundColor :(theme)=>theme.palette.warning.light
            }:null}
          >
            {patient.visit_number}
            <span>
             {patient.result_is_locked ?  <Lock sx={{width:'16px'}}/> :""}
            </span>
          </Box>
        </Badge>
      ) : (
        <Box
        style= { patient.result_print_date !=null &&  actviePatient?.patient?.id != patient.id ? {
              
          backgroundColor :'#00b0ff' 


        }:null}
          onClick={() => {
            onClick(patient.id);
          }}
          sx={ patient.id == actviePatient?.patient?.id ? {
            backgroundColor :(theme)=>theme.palette.warning.light

          }:null}        >
          {patient.visit_number}
          <span >
             {patient.result_is_locked ?  <Lock  sx={{width:'16px'}} /> :""}
            </span>
        </Box>
      )}
    </Grow>
  );
}

export default Patient;
