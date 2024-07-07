import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import {
  Add,
  ArrowBack,
  ArrowForward,
  HourglassBottom,
  Lock,
  LockOpen,
  Person,
  PlusOne,
} from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardContent,
  Divider,
  Grid,
  Icon,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import animationData from "./lotties/money.json";
import people from "./lotties/people.json";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import axiosClient from "../axios-client";
import { webUrl } from "./pages/constants";
import { useOutletContext } from "react-router-dom";
import dayjs from "dayjs";
function Dashboard() {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const [items, setItems] = useState([]);

  const [shift, setShift] = useState(null);
  useEffect(() => {
     
    axiosClient.get(`items/all`).then(({ data: data }) => {
      setItems(data);
    

  });
    axiosClient.get("shift/last").then(({ data: { data } }) => {
      setShift(data);
      console.log(data);
      console.log(new Date(Date.parse(data.created_at)).toLocaleDateString());
    });
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  useEffect(() => {
    document.title = "الرئيسيه";
  }, []);
  const peopleOptions = {
    loop: true,
    autoplay: true,
    animationData: people,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  console.log("rendering");
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
              <IconButton
                disabled={shift?.id == 1}
                onClick={() => {
                  if (shift.id == 1) {
                    return;
                  }

                  axiosClient
                    .get(`shiftById/${shift.id - 1}`)
                    .then(({ data }) => {
                      console.log(data.data, "shift left");
                      setShift(data.data);
                    });
                }}
              >
                <ArrowBack />
              </IconButton>
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
              <IconButton
                disabled={shift?.id == shift?.maxShiftId}
                onClick={() => {
                  // if (shift.id == 1) {
                  //   return
                  // }

                  axiosClient
                    .get(`shiftById/${shift.id + 1}`)
                    .then(({ data }) => {
                      console.log(data.data, "shift left");
                      setShift(data.data);
                    });
                }}
              >
                <ArrowForward />
              </IconButton>
            </Stack>
          </CardContent>
        </Card>
      )}
      <Grid spacing={2} container>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ borderRadius: 10, flexBasis: "70px" }}>
            <CardContent>
              <Stack direction={"row"} justifyContent={"space-around"}>
                <Stack justifyContent={"space-between"} direction={"column"}>
                  <Typography>Sales</Typography>
                  <Divider />
                  {shift && (
                    <Typography variant="h4">
                      {shift?.deducts?.length}
                    </Typography>
                  )}
                </Stack>
                <Stack direction={"column"} justifyContent={"center"}>
                  <IconButton
                    href={`${webUrl}pharmacy/sellsReport?shift_id=${shift?.id}`}
                  >
                    <Lottie options={peopleOptions} height={100} width={100} />
                  </IconButton>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ borderRadius: 10, flexBasis: "70px" }}>
            <CardContent>
              <Stack direction={"row"} justifyContent={"space-evenly"}>
                <Stack justifyContent={"space-between"} direction={"column"}>
                  <Typography>الدخل</Typography>
                  <Divider />
                  <Typography variant="h4">
                    {shift?.totalDeductsPrice}
                  </Typography>
                </Stack>
                <Stack direction={"column"} justifyContent={"center"}>
                  <IconButton>
                    <AttachMoneyIcon sx={{ width: 100, height: 100 }} />
                  </IconButton>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ borderRadius: 10, flexBasis: "70px" }}>
            <CardContent>
              <Stack direction={"row"} justifyContent={"space-evenly"} gap={2}>
                <Stack justifyContent={"space-between"} direction={"column"}>
                  <Typography>المصروفات</Typography>
                  <Divider />
                  <Typography variant="h4">
                    {shift?.cost?.reduce((p, c) => p + c.amount, 0)}
                  </Typography>
                </Stack>
                <Stack direction={"column"} justifyContent={"center"}>
                  <IconButton
                    href={`${webUrl}costReport?shift_id=${shift?.id}`}
                  >
                    <RemoveCircleIcon
                      color="error"
                      sx={{ width: 100, height: 100 }}
                    />
                  </IconButton>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ borderRadius: 10, flexBasis: "70px" }}>
            <CardContent>
              <Stack direction={"row"} justifyContent={"space-evenly"} gap={2}>
                <Stack justifyContent={"space-between"} direction={"column"}>
                  <Typography>الصافي</Typography>
                  <Divider />
                  <Typography variant="h4">
                    {shift?.totalDeductsPrice -
                      shift?.cost?.reduce((p, c) => p + c.amount, 0)}
                  </Typography>
                </Stack>
                <Stack direction={"column"} justifyContent={"center"}>
                  <IconButton>
                    <Lottie options={defaultOptions} height={100} width={100} />
                  </IconButton>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid sx={{ mt: 1 }} spacing={2} container>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ borderRadius: 10, flexBasis: "70px" }}>
            <CardContent>
              <Stack direction={"row"} justifyContent={"space-evenly"} gap={2}>
                <Stack justifyContent={"space-between"} direction={"column"}>
                  <Typography>
                    حاله الودريه {shift?.is_closed ? "مغلقه" : "مفتوحه"}
                  </Typography>
                  <Typography> الزمن </Typography>
                  <Typography>
                    {" "}
                    {shift?.is_closed
                      ? new Date(
                          Date.parse(shift.closed_at)
                        ).toLocaleTimeString()
                      : new Date(
                          Date.parse(shift?.created_at)
                        ).toLocaleTimeString()}{" "}
                  </Typography>
                </Stack>
                <Stack direction={"column"} justifyContent={"center"}>
                  <IconButton
                    onClick={() => {
                      const msg = shift.is_closed
                        ? "هل تريد فتح ورديه جديد؟"
                        : "هل تريد قفل الورديه";
                      const result = confirm(msg);
                      if (result) {
                        axiosClient
                          .post(`shift/status/${shift.id}`, {
                            status: shift.is_closed,
                          })
                          .then(({ data }) => {
                            console.log(data, "data ");
                            setShift(data.data);
                          });
                      }
                    }}
                  >
                    {shift?.is_closed == 0 ? (
                      <LockOpen
                        color="success"
                        sx={{ width: 100, height: 100 }}
                      />
                    ) : (
                      <Lock color="error" sx={{ width: 100, height: 100 }} />
                    )}
                  </IconButton>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ borderRadius: 10, flexBasis: "70px" }}>
            <CardContent>
              <Stack direction={"row"} justifyContent={"space-around"}>
                <Stack justifyContent={"space-between"} direction={"column"}>
                  <Typography>Expired Items</Typography>
                  <Divider />
                  <Typography variant="h4">{items.filter((item)=>{
                    return !dayjs(item.expire).isAfter(dayjs())
                  }).length}</Typography>
                </Stack>
                <Stack direction={"column"} justifyContent={"center"}>
                  <IconButton
                    href={`${webUrl}expireReport`}
                  >
                    <HourglassBottomIcon sx={{ width: 100, height: 100 }} />
                  </IconButton>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default Dashboard;
