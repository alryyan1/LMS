import { Box, Button } from "@mui/material";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useState } from "react";
import axiosClient from "../../axios-client";

function Audit() {
  const [date, setDate] = useState(null);
  const searchShiftByDateHandler = ()=>{
    axiosClient.get(`getShiftByDate?date=${date.format('YYYY-MM-DD')}`)
  }
  return (
    <div
      style={{
        marginTop: "5px",
        gap: "15px",
        transition: "0.3s all ease-in-out",
        height: "75vh",
        display: "grid",
        direction: "rtl",
        gridTemplateColumns: `1fr  1fr  1fr        `,
      }}
    >

        <Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Button
               onClick={searchShiftByDateHandler}
                sx={{ mt: 2 }}
                size="medium"
                variant="contained"
              >
                بحث
              </Button>
              <DateField
                onChange={(val) => {
                  setDate(val);
                }}
                value={date}
                defaultValue={dayjs(new Date())}
                sx={{ m: 1 }}
                label="تاريخ"
              />
            </LocalizationProvider>
        </Box>

    </div>
  );
}

export default Audit;
