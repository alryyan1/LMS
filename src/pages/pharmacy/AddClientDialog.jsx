import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
  } from "@mui/material";
  import { useOutletContext } from "react-router-dom";
import AddDrugForm from "./AddDrugForm";
import AddClientForm from "../../components/AddClientForm";
  
  function AddClientDialog({setClients,loading,setLoading}) {
    const {dialog,setDialog,openClientDialog,setOpenClientDialog} =  useOutletContext()
    // console.log(dialog)
   
    return (
      <div>
        <Dialog open={openClientDialog}>
          <DialogTitle color={dialog.color}>{dialog.title}</DialogTitle>
           <DialogContent >
           <AddClientForm setClients={setClients} setDialog={setDialog} loading={loading} setLoading={setLoading} />
           </DialogContent>
          <DialogActions>
          <Button color="error" onClick={()=>{
            setOpenClientDialog(false)
          }}>
              close
          </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  
  export default AddClientDialog;
  