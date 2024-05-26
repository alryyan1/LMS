import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import AddDoctorForm from "../settings/AddDoctorForm";

function AddDoctorDialog() {
  const [ loading, setLoading ] = useState(false);
 
  const { setOpen, specialists, open,setDoctors } = useOutletContext();
  console.log(specialists, "specialists in add doctor dialog");

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle textAlign={'center'} color={"success"}>اضافه طبيب</DialogTitle>
       <DialogContent>
        <AddDoctorForm setDoctor={setDoctors}/>
       </DialogContent>
        <DialogActions>
        <Button color="error" onClick={()=>setOpen(false)}>
            close
        </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddDoctorDialog;
