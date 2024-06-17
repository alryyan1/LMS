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
  const [shift,setShift] = useState(null)
  // console.log(dialog);
  useEffect(() => {
    axiosClient.get("shift/last").then(({data})=>{
        console.log(data,'last shift data')
        setShift(data.data)
    }).catch((err)=>console.log(err));
  }, [dialog.showMoneyDialog]);

  return (
    <div>
      <Dialog open={dialog.showMoneyDialog}>
        <DialogTitle>دخل المعمل</DialogTitle>
        <DialogContent>
          <Stack direction={'column'} sx={{m:1 ,backgroundColor:(theme)=>theme.palette.success.light,p:1,borderRadius:'5px',color:'white',fontSize:"2rem"}} gap={1}>
            <Typography variant="h4" textAlign={'center'}>اجمالي الدخل</Typography>
            <Typography variant="h4" textAlign={'center'}>{shift?.paidLab}</Typography>
          </Stack>
          <Divider></Divider>
          <Stack direction={'column'} sx={{m:1,fontSize:'2rem'}} gap={1}>
            <Typography variant="h4" textAlign={'center'}>بنكك</Typography>
            <Typography variant="h4" textAlign={'center'}>{shift?.bankak}</Typography>
          </Stack>
          <Divider></Divider>
          <Stack direction={'column'} sx={{m:1,fontSize:'2rem'}} gap={1}>
            <Typography variant="h4" textAlign={'center'}>النقدي</Typography>
            <Typography variant="h4" textAlign={'center'}>{  shift?.paidLab - shift?.bankak}</Typography>
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
