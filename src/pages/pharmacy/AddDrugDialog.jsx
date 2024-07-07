import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
  } from "@mui/material";
  import { useOutletContext } from "react-router-dom";
import AddDrugForm from "./AddDrugForm";
  
  function AddDrugDialog() {
    const {dialog,setDialog,opendDrugDialog,setOpendDrugDialog} =  useOutletContext()
    // console.log(dialog)
   
    return (
      <div>
        <Dialog open={opendDrugDialog}>
          <DialogTitle color={dialog.color}>{dialog.title}</DialogTitle>
           <DialogContent sx={{color:'black'}}>
           <AddDrugForm/>
           </DialogContent>
          <DialogActions>
          <Button color="error" onClick={()=>{
            setOpendDrugDialog(false)
          }}>
              close
          </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  
  export default AddDrugDialog;
  