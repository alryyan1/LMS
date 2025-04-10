import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { formatNumber, toFixed } from "../constants";
import { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import MyCustomLoadingButton from "../../components/MyCustomLoadingButton";

function SellsMoneyDialog() {
  const { shift, setShift, showDialogMoney, setShowDialogMoney } =
    useOutletContext();
  const [loading, setLoading] = useState(false);
  const [deductsSummary, setDeductsSummary] = useState(null);

  useEffect(() => {
    setLoading(true);
   
      axiosClient
        .post(`deduct/summary/${shift?.id}`)
        .then(({ data }) => {
          setDeductsSummary(data);
          setLoading(false);
        })
        .finally(() => setLoading(false));
    
  }, []);
  // console.log(dialog);

  return (
    <div>
      <Dialog open={showDialogMoney}>
        <DialogTitle variant="h3"></DialogTitle>
        <DialogContent>
          {loading ? (
            <Skeleton
              animation="wave"
              variant="rectangular"
              width={"400px"}
              height={400}
            />
          ) : (
            <>
              <Stack
                direction={"column"}
                sx={{
                  m: 1,
                  backgroundColor: (theme) => theme.palette.success.light,
                  p: 1,
                  borderRadius: "5px",
                  color: "white",
                  fontSize: "2rem",
                }}
                gap={1}
              >
                <Typography variant="h4" textAlign={"center"}>
                  Total Income
                </Typography>
                <Typography variant="h4" textAlign={"center"}>
                  {deductsSummary && formatNumber(toFixed(deductsSummary.totalDeductsPaid, 3))}
                </Typography>
              </Stack>
              <Divider></Divider>
              <Stack
                direction={"column"}
                sx={{ m: 1, fontSize: "2rem" }}
                gap={1}
              >
                <Typography variant="h4" textAlign={"center"}>
                  Bank
                </Typography>
                <Typography variant="h4" textAlign={"center"}>
                  {deductsSummary && toFixed(deductsSummary.totalDeductsPriceBank, 3)}
                </Typography>
              </Stack>
              <Divider></Divider>
              <Stack
                direction={"column"}
                sx={{ m: 1, fontSize: "2rem" }}
                gap={1}
              >
                <Typography variant="h4" textAlign={"center"}>
                  Transfer
                </Typography>
                <Typography variant="h4" textAlign={"center"}>
                  {deductsSummary && toFixed(deductsSummary.totalDeductsPriceTransfer, 3)}
                </Typography>
              </Stack>
              <Divider></Divider>
              <Stack
                direction={"column"}
                sx={{ m: 1, fontSize: "2rem" }}
                gap={1}
              >
                <Typography variant="h4" textAlign={"center"}>
                  Cash
                </Typography>
                <Typography variant="h4" textAlign={"center"}>
                  {deductsSummary && formatNumber(toFixed(deductsSummary.totalDeductsPriceCash, 3))}
                </Typography>
              </Stack>
              <Divider></Divider>

              <Stack
                direction={"column"}
                sx={{ m: 1, fontSize: "2rem" }}
                gap={1}
              >
                <Typography variant="h4" textAlign={"center"}>
                  Post paid
                </Typography>
                <Typography variant="h4" textAlign={"center"}>
                  {deductsSummary && toFixed(deductsSummary.totalDeductsPostPaid, 3)}
                </Typography>
              <MyCustomLoadingButton onClick={(setLoading)=>{
                    setLoading(true)
                    let r = confirm('هل انت متأكد من انشاء قيد صافي الورديه')
                    if(r){
                        axiosClient.post('createFinalPharmacyEntry',{
                          
                            bank:deductsSummary.totalDeductsPriceBank,
                            cash:deductsSummary.totalDeductsPriceCash
                        }).then(({data})=>{
            
                        }).finally(()=>{
                          setLoading(false)
                        })
                    }
                  }}>انشاء قيد صافي الورديه </MyCustomLoadingButton>
              </Stack>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialogMoney(false)}>close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SellsMoneyDialog;
