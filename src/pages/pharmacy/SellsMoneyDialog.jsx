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
  
  function SellsMoneyDialog() {
    const { shift,  showDialogMoney, setShowDialogMoney} = useOutletContext();
    const [money, setMoney] = useState();
    const [bank  , setBank] = useState(); 
    // console.log(dialog);
  
  
    return (
      <div>
        <Dialog open={showDialogMoney}>
          <DialogTitle variant="h3"></DialogTitle>
          <DialogContent>
            <Stack direction={'column'} sx={{m:1 ,backgroundColor:(theme)=>theme.palette.success.light,p:1,borderRadius:'5px',color:'white',fontSize:"2rem"}} gap={1}>
              <Typography variant="h4" textAlign={'center'}>Total Income</Typography>
              <Typography variant="h4" textAlign={'center'}>{shift?.totalDeductsPrice}</Typography>
            </Stack>
            <Divider></Divider>
            <Stack direction={'column'} sx={{m:1,fontSize:'2rem'}} gap={1}>
              <Typography variant="h4" textAlign={'center'}>Bank</Typography>
              <Typography variant="h4" textAlign={'center'}>{shift?.totalDeductsPriceBank}</Typography>
            </Stack>
            <Divider></Divider>
            <Stack direction={'column'} sx={{m:1,fontSize:'2rem'}} gap={1}>
              <Typography variant="h4" textAlign={'center'}>Transfer</Typography>
              <Typography variant="h4" textAlign={'center'}>{shift?.totalDeductsPriceTransfer}</Typography>
            </Stack>
            <Divider></Divider>
            <Stack direction={'column'} sx={{m:1,fontSize:'2rem'}} gap={1}>
              <Typography variant="h4" textAlign={'center'}>Cash</Typography>
              <Typography variant="h4" textAlign={'center'}>{shift?.totalDeductsPriceCash}</Typography>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                setShowDialogMoney(false)
              }
            >
              close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  
  export default SellsMoneyDialog;
  