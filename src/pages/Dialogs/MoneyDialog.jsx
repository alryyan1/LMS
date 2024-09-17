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

function MoneyDialog() {
  const { dialog, setDialog } = useOutletContext();
  const [labUserMoney,setLabUserMoney] = useState(null)
  // console.log(dialog);
  useEffect(() => {
    axiosClient.get("totalUserLabTotalAndBank").then(({data})=>{
        setLabUserMoney(data)
    }).catch((err)=>console.log(err));
  }, []);

  return (
    <div>
      <Dialog open={dialog.showMoneyDialog}>
        <DialogTitle> Laboratory Income Details</DialogTitle>
        <DialogContent>
          <Stack direction={'column'} sx={{m:1 ,backgroundColor:(theme)=>theme.palette.success.light,p:1,borderRadius:'5px',color:'white',fontSize:"2rem"}} gap={1}>
            <Typography variant="h4" textAlign={'center'}>Total</Typography>
            <Typography variant="h4" textAlign={'center'}>{labUserMoney?.total}</Typography>
          </Stack>
          <Divider></Divider>
          <Stack direction={'column'} sx={{m:1,fontSize:'2rem'}} gap={1}>
            <Typography variant="h4" textAlign={'center'}>Bank</Typography>
            <Typography variant="h4" textAlign={'center'}>{labUserMoney?.bank}</Typography>
          </Stack>
          <Divider></Divider>
          <Stack direction={'column'} sx={{m:1,fontSize:'2rem'}} gap={1}>
            <Typography variant="h4" textAlign={'center'}>Cash</Typography>
            <Typography variant="h4" textAlign={'center'}>{  labUserMoney?.total - labUserMoney?.bank}</Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setDialog((prev) => {
                return { ...prev, showMoneyDialog: false };
              })
            }
          >
            close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MoneyDialog;
