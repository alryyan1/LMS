import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
  } from "@mui/material";
import RequestedServices from "../Clinic/RequestedServices";
  
  function PatientServicesDialog({patient,showServices,setShowServices,activeShift,companies,setActivePatient,setDialog,setShowPatientServices,setShowServicePanel,setUpdate}) {
    return (
      <div>
        <Dialog open={showServices}>
          <DialogTitle> الخدمات</DialogTitle>
            <DialogContent>
                <RequestedServices activeShift={activeShift} setShowPatientServices={setShowPatientServices} setShowServicePanel={setShowServicePanel} setUpdate={setUpdate}  companies={companies} setActivePatient={setActivePatient} setDialog={setDialog} actviePatient={patient} />
            </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                 setShowServices(false)
              }
            >
              close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  
  export default PatientServicesDialog;
  