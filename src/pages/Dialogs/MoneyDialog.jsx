import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";

function MoneyDialog() {
  const { dialog, setDialog } = useOutletContext();
  const [money,setMoney] = useState()
  console.log(dialog);
  useEffect(() => {
    axiosClient.get("lab/money").then(({data:{total}})=>{
        console.log(total)
        setMoney(total)
    }).catch((err)=>console.log(err));
  }, [dialog.showMoneyDialog]);

  return (
    <div>
      <Dialog open={dialog.showMoneyDialog}>
        <DialogTitle>دخل المعمل</DialogTitle>
        <DialogContent>{money}</DialogContent>
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
