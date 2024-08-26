import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Controller } from "react-hook-form";
import axiosClient from "../../axios-client";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function MyDateField2({ val, item }) {
  // console.log(item , val,'date filed ')
  // console.log(dayjs(val), "date filed ", val, "val");
  const [date, setDate] = useState(val);
  const {setDialog} = useOutletContext()
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateField
      format='YYYY-MM-DD'
      fullWidth
        size="small"
        defaultValue={dayjs(date)}
        value={dayjs(date)}
        onChange={(val) => {
          const dayJsObj = dayjs(val);

          setDate(val);
          axiosClient
          .patch(`items/${item.item.id}`, {
            colName: "expire",
            val: `${dayJsObj.year()}/${
              dayJsObj.month() + 1
            }/${dayJsObj.date()}`,
          })
          axiosClient
            .patch(`depositItems/update/${item.id}`, {
              colName: "expire",
              val: `${dayJsObj.year()}/${
                dayJsObj.month() + 1
              }/${dayJsObj.date()}`,
            })
            .then(({ data }) => {
              if (data.status) {
                setDialog((prev)=>{
                  return {
                     ...prev,
                    open: true,
                    message: "تم التعديل ",
                  };
                })
              }
            });
        }}
        sx={{ mb: 1 }}
        label="تاريخ الانتهاء"
      />
    </LocalizationProvider>
  );
}

export default MyDateField2;
