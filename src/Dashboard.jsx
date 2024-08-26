import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import { ArrowBack, ArrowForward, Lock, LockOpen } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
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
import { toFixed, webUrl } from "./pages/constants";
import dayjs from "dayjs";
import { LoadingButton } from "@mui/lab";

function Dashboard() {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shift, setShift] = useState(null);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    //fetch all clients
    axiosClient(`client/all`)
      .then(({data}) => {
        setClients(data);
        console.log(data);
      });
  }, []);
  useEffect(() => {
    setLoading(true);

    axiosClient.get(`items/all`).then(({ data: data }) => {
      setItems(data);
    });
    axiosClient
      .get("shift/last")
      .then(({ data: { data } }) => {
        setShift(data);
        console.log(data);
        console.log(new Date(Date.parse(data.created_at)).toLocaleDateString());
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
      {loading ? (
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={"100%"}
          height={400}
        />
      ) : (
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

          <Grid spacing={2} container>
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ borderRadius: 10, flexBasis: "70px" }}>
                <CardContent>
                  <Stack direction={"row"} justifyContent={"space-around"}>
                    <Stack
                      justifyContent={"space-between"}
                      direction={"column"}
                    >
                      <Typography>Clients</Typography>
                      <Divider />
                      {shift && (
                        <Typography variant="h4">{clients.length}</Typography>
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
                    <Stack
                      justifyContent={"space-between"}
                      direction={"column"}
                    >
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
                    <Stack
                      justifyContent={"space-between"}
                      direction={"column"}
                    >
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
            {/* <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ borderRadius: 10, flexBasis: "70px" }}>
                <CardContent>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-evenly"}
                    gap={2}
                  >
                    <Stack
                      justifyContent={"space-between"}
                      direction={"column"}
                    >
                      <Typography>Net</Typography>
                      <Divider />
                      <Typography variant="h4">
                        {shift &&
                          toFixed(shift?.totalDeductsPrice, 1) -
                            shift?.cost?.reduce((p, c) => p + c.amount, 0)}
                      </Typography>
                    </Stack>
                    <Stack direction={"column"} justifyContent={"center"}>
                      <IconButton>
                        <Lottie
                          options={defaultOptions}
                          height={100}
                          width={100}
                        />
                      </IconButton>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid> */}
              <Grid item xs={12} md={6} lg={3}>
            
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
                    <Stack
                      justifyContent={"space-between"}
                      direction={"column"}
                    >
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
                      disabled={shift?.maxShiftId != shift?.id}
                        loading={loading}
                        onClick={() => {
                          setLoading(true);
                          const msg = shift?.is_closed
                            ? "  Open shift ? "
                            : " Close Shift ?  ";
                          const result = confirm(msg);
                          if (result) {
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
                          <Lock
                            color="error"
                            sx={{ width: 100, height: 100 }}
                          />
                        )}
                      </LoadingButton>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
            
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ borderRadius: 10, flexBasis: "70px" }}>
                <CardContent>
                  <Stack direction={"row"} justifyContent={"space-around"}>
                    <Stack
                      justifyContent={"space-between"}
                      direction={"column"}
                    >
                      <Typography>Orders</Typography>
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
                        <Lottie
                          options={boxesOptions}
                          height={100}
                          width={100}
                        />
                      </IconButton>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      )}
    </>
  );
}

export default Dashboard;
