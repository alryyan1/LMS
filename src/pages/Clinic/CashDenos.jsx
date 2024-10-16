import React, { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import AddCostForm from "../../components/AddCostForm";
import { webUrl } from "../constants";

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
function CashDenos() {
  useEffect(() => {
    document.title = "الفئات -";
  }, []);
  const [shift, setShift] = useState(null);
  useEffect(() => {
    axiosClient.get("shift/last").then(({ data: { data } }) => {
      setShift(data);
      console.log(data);
      console.log(new Date(Date.parse(data.created_at)).toLocaleDateString());
    });
  }, []);
  const [userDenos, setUserDenos] = useState([]);
  useEffect(() => {
    axiosClient.post("populate/denos").then(({ data }) => {
      console.log(data, "denos data");
    });
  }, []);
  useEffect(() => {
    axiosClient.post("user/denos").then(({ data }) => {
      console.log(data, "user/denos");
      setUserDenos(data.data);
    });
  }, []);

  const totalIncome = shift?.totalPaid + shift?.paidLab + shift?.totalDeductsPrice;
  const denosAmount = userDenos.reduce(
    (accum, d) => accum + d.name * d.pivot.amount,
    0
  );

  const totalCost = shift?.cost.reduce((prev, current) => {
    return prev + current.amount;
  }, 0);
  return (
    <>
      {shift && (
        <Card  sx={{ mb: 1 }}>
          <CardContent>
            <Stack
              direction={"row"}
              spacing={2}
              justifyContent={"space-around"}
            >
              <Typography alignContent={"center"}>
                {new Date(Date.parse(shift.created_at)).toLocaleDateString(
                  "ar-SA",
                  options
                )}
              </Typography>
              <Typography alignContent={"center"}>
                ورديه رقم {shift.id}
              </Typography>
              <Typography alignContent={"center"}>
                {new Date(Date.parse(shift.created_at)).toLocaleDateString(
                  "En-US",
                  options
                )}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}
      <Grid container spacing={2}>
       
        
        {/* <Grid  item lg={3} xs={12}>
          <Box sx={{ p: 1 }}>
       
            <Table size="small" style={{ direction: "rtl" }}>
              <TableHead>
                <TableRow>
                  <TableCell>الفئة</TableCell>
                  <TableCell>المضاف</TableCell>
                  <TableCell>العدد</TableCell>
                  <TableCell>الاجمالي</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userDenos.map((deno) => {
                  return (
                    <TableRow key={deno.id}>
                      <TableCell>{deno.name}</TableCell>
                      <TableCell>
                        <TextField
                        variant="standard"
                        type="number"
                        
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              console.log("enter pressed");
                              //get test from tests using find
                              axiosClient
                                .patch("deno/user", {
                                  deno_id: deno.id,
                                  val: e.target.value,
                                })
                                .then(({ data }) => {
                                  setUserDenos(data.data);
                                });
                            }
                          }}
                          onChange={(e) => {}}
                        />
                      </TableCell>
                      <TableCell>{deno.pivot.amount}</TableCell>
                      <TableCell>{deno.pivot.amount * deno.name}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Grid> */}
         <Grid   item lg={3} xs={12}>
         <AddCostForm setShift={setShift}/>
        </Grid>
        <Grid  item  lg={6} xs={12}>
          <Box sx={{ p: 1 }}>
            <Typography variant="h6" textAlign={"center"}>
              مصروفات الورديه
            </Typography>
            <Table size="small" style={{ direction: "rtl" }}>
              <TableHead>
                <TableRow>
                  <TableCell>وصف المنصرف</TableCell>
                  <TableCell>قسم </TableCell>
                  <TableCell>المبلغ</TableCell>
                  <TableCell>حذف</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shift?.cost.map((cost) => {
                  return (
                    <TableRow key={cost.id}>
                      <TableCell>{cost.description}</TableCell>
                      <TableCell>{cost?.cost_category?.name}</TableCell>
                      <TableCell>{cost.amount}</TableCell>
                      <TableCell>
                        <LoadingButton onClick={()=>{
                          axiosClient.delete(`cost/${cost.id}`).then((
                            {data}
                          ) => {
                            console.log(data);
                            setShift(data.data);
                          });
                        }}>حذف</LoadingButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Grid>
        <Grid  item  lg={3} xs={12}>
           <form  action={`${webUrl}previewLabel`} method="POST" >
            <Stack gap={2} justifyContent={'space-around'} sx={{mb:1}} direction={'row'}>
            <TextField name='orientation' label='orientation' ></TextField>
            <TextField type="number" label='height' name='height'></TextField>
            <TextField type="number" label='width' name='width'></TextField>
            </Stack>
            
           <TextField name="data" multiline rows={16} fullWidth></TextField>
           <Button fullWidth sx={{mt:1}} type="submit" variant="contained">Preview</Button>
           </form>
          
        </Grid>
       
      </Grid>
    </>
  );
}

export default CashDenos;
