import { Badge, Box, Grow } from "@mui/material";

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
            onClick={() => {
              onClick(patient.id);
            }}
            className={patient.active ? "active" : ""}
          >
            {patient.id}
          </Box>
        </Badge>
      ) : (
        <Box
          onClick={() => {
            onClick(patient.id);
          }}
          className={patient.active ? "active" : ""}
        >
          {patient.id}
        </Box>
      )}
    </Grow>
  );
}

export default Patient;
