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
import { Deno, Shift } from "../../types/Shift";
import { ShiftDetails } from "../../types/CutomTypes";

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
  const [shift, setShift] = useState<Shift | null>(null);
  const [shiftSummary, setShiftSummary] = useState<ShiftDetails | null>(null);
  useEffect(() => {
    axiosClient.get("shift/last").then(({ data: { data } }) => {
      setShift(data);
      axiosClient.get(`shift/summary/${data.id}`).then(({ data }) => {
        console.log(data, "shift summary");
        setShiftSummary(data);
      });
    });
  }, [shift?.cost.length]);
  const [userDenos, setUserDenos] = useState<Deno[]>([]);
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
  useEffect(() => {

  },[])

  const updateHandler = (colName,denoId,val,add = false) => {
       axiosClient
        .patch("deno/user", {
          deno_id:denoId,
          val,
          colName,
          add
        })
        .then(({ data }) => {
          setUserDenos(data.data);
        });
    
  }
  return (
    <>
      {shift && (
        <Card sx={{ mb: 1 }}>
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
        <Grid item lg={3} xs={12}>
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
                              updateHandler('deno', deno.id,e.target.value,true);

                            }
                          }}
                     
                        />
                      </TableCell>
                      
                      <TableCell>   <TextField
                      defaultValue={deno.pivot.amount}
                          variant="standard"
                          type="number"
                         
                          onChange={(e) => {
                            updateHandler('amount', deno.id,e.target.value);
                          }}
                        />
                      </TableCell>
                      <TableCell>{deno.pivot.amount * deno.name}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Grid>
        <Grid item lg={3} xs={12}>
          <AddCostForm setShift={setShift} />
        </Grid>
        <Grid item lg={3} xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>القيمه</TableCell>
                <TableCell>الاسم</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{shiftSummary?.total}</TableCell>
                <TableCell>اجمالي العيادات</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{shiftSummary?.bank}</TableCell>
                <TableCell>اجمالي بنكك</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{shiftSummary?.expenses}</TableCell>
                <TableCell>اجمالي المصروفات</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{shiftSummary?.cash}</TableCell>
                <TableCell>صافي الكاش</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{shiftSummary?.safi}</TableCell>
                <TableCell>(بنك + كاش)الصافي</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Divider>حساب الموظف -الفئات</Divider>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>القيمه</TableCell>
                <TableCell>الاسم</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{userDenos.reduce((curr,red)=>{
                  return curr + red.pivot.amount * red.name
                },0)}</TableCell>
                <TableCell>اجمالي الفئات</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{shiftSummary?.cash}</TableCell>
                <TableCell>صافي الكاش</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{(shiftSummary?.cash  == undefined ?0:shiftSummary.cash) - userDenos.reduce((curr,red)=>{
                  return curr + red.pivot.amount * red.name
                },0)}</TableCell>
                <TableCell>المتبقي </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
        <Grid item lg={3} xs={12}>
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
                        <LoadingButton
                          onClick={() => {
                            axiosClient
                              .delete(`cost/${cost.id}`)
                              .then(({ data }) => {
                                console.log(data);
                                setShift(data.data);
                              });
                          }}
                        >
                          حذف
                        </LoadingButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Grid>
        {/* <Grid  item  lg={3} xs={12}>
           <form  action={`${webUrl}previewLabel`} method="POST" >
            <Stack gap={2} justifyContent={'space-around'} sx={{mb:1}} direction={'row'}>
            <TextField name='orientation' label='orientation' ></TextField>
            <TextField type="number" label='height' name='height'></TextField>
            <TextField type="number" label='width' name='width'></TextField>
            </Stack>
            
           <TextField name="data" multiline rows={16} fullWidth></TextField>
           <Button fullWidth sx={{mt:1}} type="submit" variant="contained">Preview</Button>
           </form>
          
        </Grid> */}
      </Grid>
    </>
  );
}

export default CashDenos;
