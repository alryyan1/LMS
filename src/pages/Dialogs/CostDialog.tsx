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
  import { useEffect, useState, VoidFunctionComponent } from "react";
  import axiosClient from "../../../axios-client";
  import { formatNumber } from "../constants";
import AddCostForm from "../../components/AddCostForm";
  
interface CostDialogProbs {
    show: boolean;
    setShow: (show: boolean) => void;
    setShift: ()=>VoidFunctionComponent
  
}
  function CostDialog({show,setShow,setShift}:CostDialogProbs) {

  
    return (
      <div>
        <Dialog open={show}>
          <DialogTitle> اضافه منصرف</DialogTitle>
          <DialogContent>
            <AddCostForm setShift={setShift}/>
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
  
  export default CostDialog;
  