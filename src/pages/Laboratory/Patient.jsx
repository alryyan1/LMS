import { Delete } from "@mui/icons-material";
import { Badge, Box, Grow, Icon } from "@mui/material";

function Patient({ onClick, patient, delay }) {
  return (
    <Grow style={{ transitionDelay: `${delay}ms` }} timeout={2000} in>
      {patient.labrequests.length > 0 ? (
        <Badge
          anchorOrigin={{
            vertical: "right",
            horizontal: "right",
          }}
          badgeContent={patient.labrequests.length}
          color={patient.is_lab_paid == 0 ? "secondary" : "primary"}
        >
          <Box
            sx= { patient.company ? {
              backgroundColor :'lightblue!important' 
    
            }:null}
            onClick={() => {
              onClick(patient.id);
            }}
            style={ patient.active ? {
              borderBottom:"4px solid blue",
              fontWeight:"bolder",
            }:null}
          >
            {patient.visit_number}
          </Box>
        </Badge>
      ) : (
        <Box
        sx= { patient.company ? {
          backgroundColor :'lightblue!important' 

        }:null}
          onClick={() => {
            onClick(patient.id);
          }}
          style={ patient.active ? {
            borderBottom:"4px solid blue",
            fontWeight:"bolder",

          }:null}        >
          {patient.visit_number}
        </Box>
      )}
    </Grow>
  );
}

export default Patient;
