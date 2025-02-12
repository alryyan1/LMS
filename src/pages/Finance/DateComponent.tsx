import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  IconButton,
} from "@mui/material";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LoadingButton } from "@mui/lab";
import { formatNumber } from "../constants.js";
import dayjs from "dayjs";
import axiosClient from "../../../axios-client.js";
function DateComponent({
  accounts,
  setAccounts,
  firstDate,
  secondDate,
  setFirstDate,
  setSecondDate,
  setData,
  api,
}) {
  // const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchHandler = () => {
    setLoading(true);
    const firstDayjs = firstDate.format("YYYY/MM/DD");
    const secondDayjs = secondDate.format("YYYY/MM/DD");
    axiosClient
      .post(`entries-between-dates`, {
        first: firstDayjs,
        second: secondDayjs,
      })
      .then(({ data }) => {
        console.log(data, "data");
        setAccounts(data);
      })
      .finally(() => {
        setLoading(false);
      });

    if (setData) {
      axiosClient
        .get(api, {
          first: firstDayjs,
          second: secondDayjs,
        })
        .then(({ data }) => {
          console.log(data, "data");
          setData(data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  return (
    <Stack direction={"row"} justifyContent={"space-between"}>
      <Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateField
            format="DD-MM-YYYY"
            onChange={(val) => {
              setFirstDate(val);
            }}
            defaultValue={dayjs(new Date())}
            sx={{ m: 1 }}
            label="From"
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateField
            format="DD-MM-YYYY"
            onChange={(val) => {
              setSecondDate(val);
            }}
            defaultValue={dayjs(new Date())}
            sx={{ m: 1 }}
            label="To"
          />
        </LocalizationProvider>
        <LoadingButton
          onClick={searchHandler}
          loading={loading}
          sx={{ mt: 2 }}
          size="medium"
          variant="contained"
        >
          Go
        </LoadingButton>
        <Button
          onClick={() => {
          axiosClient.post('incomeStatement/16').then(({data})=>{
           const datapdf = data.slice(data.indexOf("JVB"))
            axiosClient.post('ai',{data:datapdf})
          })
          }}
        >
          ai
        </Button>
      </Box>
    </Stack>
  );
}

export default DateComponent;
