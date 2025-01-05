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

function ServiceMoneyDialog() {
  const { dialog, setDialog } = useOutletContext();
  const [money, setMoney] = useState();
  const [bank  , setBank] = useState();
  // console.log(dialog);
  useEffect(() => {
    axiosClient
      .get("service/money")
      .then(({ data: { total } }) => {
        console.log(total);
        setMoney(total);
      })
      .catch((err) => console.log(err));
  }, [dialog.showMoneyDialog]);

  useEffect(() => {
    axiosClient
      .get("service/money/bank")
      .then(({ data: { total } }) => {
        console.log(total);
        setBank(total);
      })
      .catch((err) => console.log(err));
  }, [dialog.showMoneyDialog]);

  return (
    <div>
      <Dialog open={dialog.showMoneyDialog}>
        <DialogTitle className="text-center" variant="h5">دخل العيادات</DialogTitle>
        <DialogContent>
          <Stack direction={'column'} sx={{m:1 ,backgroundColor:(theme)=>theme.palette.success.light,p:1,borderRadius:'5px',color:'white',fontSize:"2rem"}} gap={1}>
            <Typography variant="h4" textAlign={'center'}>اجمالي الدخل</Typography>
            <Typography variant="h4" textAlign={'center'}>{formatNumber(money)}</Typography>
          </Stack>
          <Divider></Divider>
          <Stack direction={'column'} sx={{m:1,fontSize:'2rem'}} gap={1}>
            <Typography variant="h4" textAlign={'center'}>بنكك</Typography>
            <Typography variant="h4" textAlign={'center'}>{formatNumber(bank)}</Typography>
          </Stack>
          <Divider></Divider>
          <Stack direction={'column'} sx={{m:1,fontSize:'2rem'}} gap={1}>
            <Typography variant="h4" textAlign={'center'}>النقدي</Typography>
            <Typography variant="h4" textAlign={'center'}>{formatNumber(money - bank)}</Typography>
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

export default ServiceMoneyDialog;
