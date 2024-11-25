import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
    Typography,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { useOutletContext } from "react-router-dom";
  import axiosClient from "../../../axios-client";
  import { formatNumber } from "../constants";
import PatientDetail from "../Laboratory/PatientDetail";
  
  function PatientDetailsDialog({show,setShow,patient}) {

  
    return (
      <div>
        <Dialog open={show}>
          <DialogTitle> Patient Demographics</DialogTitle>
          <DialogContent>
            <PatientDetail  patient={patient}/>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                setShow(false)
              }
            >
              close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  
  export default PatientDetailsDialog;
  