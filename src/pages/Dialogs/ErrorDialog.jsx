import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
  } from "@mui/material";
  import { useOutletContext } from "react-router-dom";
  
  function ErrorDialog() {
    const {dialog,setDialog} =  useOutletContext()
    console.log(dialog)
   
    return (
      <div>
        <Dialog open={dialog.openError}>
          <DialogTitle color={dialog.color}>{dialog.title}</DialogTitle>
            {dialog.msg}
          <DialogActions>
          <Button color="error" onClick={()=>setDialog((prev)=>{
            return {...prev,openError:false}
          })}>
              close
          </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  
  export default ErrorDialog;
  