import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import { ArrowBack, ArrowForward, Lock, LockOpen } from "@mui/icons-material";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

import {
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import animationData from "./lotties/money.json";
import people from "./lotties/people.json";
import boxes from "./lotties/boxes.json";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import axiosClient from "../axios-client";
import { formatNumber, webUrl } from "./pages/constants";
import { LoadingButton } from "@mui/lab";
import { socket } from "./socket";
import IncomeInfoGraphic from "./components/IncomeInfoGraphic";
import CountInfoGraphic from "./components/CountInfoGraphic";
function toFixed(num, fixed) {
  if (num == undefined) return 0;
  var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  return num.toString().match(re)[0];
}
function Dashboard() {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    axiosClient(`incomeInfoGraphic?month=${selectedMonth}`).then(({ data }) => {
      setData(data);
    });
  }, [selectedMonth]);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const [loading, setLoading] = useState(false);
  const [shift, setShift] = useState(null);

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get("shift/last")
      .then(({ data }) => {
        setShift(data.data);
        console.log(data, "last shift");
        console.log(
          new Date(Date.parse(data.data.created_at)).toLocaleDateString()
        );
      })
      .finally(() => setLoading(false));
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
    document.title = "Dashboard";
  }, []);
  const peopleOptions = {
    loop: true,
    autoplay: true,
    animationData: people,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const boxesOptions = {
    loop: true,
    autoplay: true,
    animationData: boxes,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  console.log("rendering");
  return (
    <>
      <div>
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
                  if (shift?.id == 1) {
                    return;
                  }
                  setLoading(true);
                  axiosClient
                    .get(`shiftById/${shift?.id - 1}`)
                    .then(({ data }) => {
                      console.log(data.data, "shift left");
                      setShift(data.data);
                    })
                    .finally(() => setLoading(false));
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography alignContent={"center"}>
                {new Date(Date.parse(shift?.created_at)).toLocaleDateString(
                  "ar-SA",
                  options
                )}
              </Typography>
              <Typography alignContent={"center"}>
                Shift No {shift?.id}
              </Typography>
              <Typography alignContent={"center"}>
                {new Date(Date.parse(shift?.created_at)).toLocaleDateString(
                  "En-US",
                  options
                )}
              </Typography>
              <IconButton
                disabled={shift?.id == shift?.maxShiftId}
                onClick={() => {
                  // if (shift?.id == 1) {
                  //   return
                  // }
                  setLoading(true);

                  axiosClient
                    .get(`shiftById/${shift?.id + 1}`)
                    .then(({ data }) => {
                      console.log(data.data, "shift left");
                      setShift(data.data);
                    })
                    .finally(() => setLoading(false));
                }}
              >
                <ArrowForward />
              </IconButton>
            </Stack>
          </CardContent>
        </Card>

    

        <Grid spacing={2} container sx={{mt:1}}>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ borderRadius: 10, flexBasis: "70px" }}>
              <CardContent>
                <Stack direction={"row"} justifyContent={"space-around"}>
                  <Stack justifyContent={"space-between"} direction={"column"}>
                    <Typography>Patients</Typography>
                    <Divider />
                    {shift && (
                      <Typography variant="h4">{shift?.totalPaid}</Typography>
                    )}
                  </Stack>
                  <Stack direction={"column"} justifyContent={"center"}>
                    <IconButton
                      href={`${webUrl}clinics/all?shift=${shift?.id}`}
                    >
                      <Lottie
                        options={peopleOptions}
                        height={100}
                        width={100}
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
                <Stack direction={"row"} justifyContent={"space-evenly"}>
                  <Stack justifyContent={"space-between"} direction={"column"}>
                    <Typography>Income</Typography>
                    <Divider />
                    <Typography variant="h4">
                      {shift && toFixed(shift?.totalDeductsPrice, 1)}
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
                <Stack
                  direction={"row"}
                  justifyContent={"space-evenly"}
                  gap={2}
                >
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
      
        </Grid>
        <Grid sx={{ mt: 1 }} spacing={2} container>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ borderRadius: 10, flexBasis: "70px" }}>
              <CardContent>
                <Stack
                  direction={"row"}
                  justifyContent={"space-evenly"}
                  gap={2}
                >
                  <Stack justifyContent={"space-between"} direction={"column"}>
                    <Typography>
                      Shift State {shift?.is_closed ? "مغلقه" : "مفتوحه"}
                    </Typography>
                    <Typography> Time </Typography>
                    <Typography>
                      {" "}
                      {shift?.is_closed
                        ? new Date(
                            Date.parse(shift?.closed_at)
                          ).toLocaleTimeString()
                        : new Date(
                            Date.parse(shift?.created_at)
                          ).toLocaleTimeString()}{" "}
                    </Typography>
                  </Stack>
                  <Stack direction={"column"} justifyContent={"center"}>
                    <LoadingButton
                      // disabled={shift?.maxShiftId != shift?.id}
                      loading={loading}
                      onClick={() => {
                        const msg = shift?.is_closed
                          ? "  Open shift ? "
                          : " Close Shift ?  ";
                        const result = confirm(msg);
                        if (result) {
                          setLoading(true);
                          if (shift?.is_closed) {
                            socket.emit("newShift");
                          }

                          axiosClient
                            .post(`shift/status/${shift?.id}`, {
                              status: shift?.is_closed,
                            })
                            .then(({ data }) => {
                              console.log(data, "data ");
                              setShift(data.data);
                            })
                            .finally(() => {
                              setLoading(false);
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
                    </LoadingButton>
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
                  </Stack>
                  <Stack direction={"column"} justifyContent={"center"}>
                    <IconButton href={`${webUrl}expireReport`}>
                      <HourglassBottomIcon sx={{ width: 100, height: 100 }} />
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
                      <Lottie options={boxesOptions} height={100} width={100} />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default Dashboard;
