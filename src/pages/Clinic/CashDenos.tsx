import React, { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  div,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import AddCostForm from "../../components/AddCostForm";
import { formatNumber, webUrl } from "../constants";
import { Deno, Shift } from "../../types/Shift";
import { ShiftDetails } from "../../types/CutomTypes";
import CostDialog from "../Dialogs/CostDialog";
import { Money } from "@mui/icons-material";
import { Plus } from "lucide-react";

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
  const [show, setShow] = useState(false);
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
  useEffect(() => {}, []);

  const updateHandler = (colName, denoId, val, add = false) => {
    axiosClient
      .patch("deno/user", {
        deno_id: denoId,
        val,
        colName,
        add,
      })
      .then(({ data }) => {
        setUserDenos(data.data);
      });
  };
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
      <div className="cost-grid">
        <Card>
          <Stack direction={'column'}>
          <Tooltip title='اضافه منصرف'>
          <IconButton onClick={()=>{
            setShow(true);
          }}>
              <Plus/>
            </IconButton>
          </Tooltip>
          </Stack>
        </Card>

        <div className="">
          {" "}
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
          <CostDialog setShift={setShift} setShow={setShow} show={show} />
        </div>
        <Card className="grid-item-2 p-4 ">
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
                    <TableCell>
                      <Typography variant="h5">{deno.name}</Typography>{" "}
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="standard"
                        type="number"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            updateHandler(
                              "deno",
                              deno.id,
                              e.target.value,
                              true
                            );
                          }
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      {" "}
                      <TextField
                        defaultValue={deno.pivot.amount}
                        variant="standard"
                        type="number"
                        onChange={(e) => {
                          updateHandler("amount", deno.id, e.target.value);
                        }}
                      />
                    </TableCell>
                    <TableCell>{deno.pivot.amount * deno.name}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Box>
            <Divider>حساب الموظف -الفئات</Divider>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>القيمه</TableCell>
                  <TableCell>الاسم</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography variant="h5">
                      {formatNumber(
                        userDenos.reduce((curr, red) => {
                          return curr + red.pivot.amount * red.name;
                        }, 0)
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <Typography variant="h5">اجمالي الفئات</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="h5">
                      {formatNumber(shiftSummary?.cash)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h5">صافي الكاش</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="h5">
                      {formatNumber(
                        (shiftSummary?.cash == undefined
                          ? 0
                          : shiftSummary.cash) -
                          userDenos.reduce((curr, red) => {
                            return curr + red.pivot.amount * red.name;
                          }, 0)
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h5">المتبقي</Typography>{" "}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Card>

        <div className="grid-item-3">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>القيمه</TableCell>
                <TableCell>الاسم</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="h5">
                    {formatNumber(shiftSummary?.total)}
                  </Typography>{" "}
                </TableCell>
                <TableCell>
                  <Typography variant="h5">اجمالي العيادات </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h5">
                    {" "}
                    {formatNumber(shiftSummary?.bank)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h5"> اجمالي بنكك</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h5">
                    {" "}
                    {formatNumber(shiftSummary?.expenses)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h5"> اجمالي المصروفات</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h5">
                    {formatNumber(shiftSummary?.cash)}{" "}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h5">صافي الكاش </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h5">
                    {formatNumber(shiftSummary?.safi)}{" "}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h5">(بنك + كاش)الصافي </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}

export default CashDenos;
