import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axiosClient from "../../axios-client";
import { useState } from "react";

function MyDateField2({ val, item ,disabled, label='تاريخ الانتهاء',path='depositItems/update',colName="expire"}) {
  // console.log(item,'item in date field')
  // console.log(item , val,'date filed ')
  // console.log(dayjs(val), "date filed ", val, "val");
  const [date, setDate] = useState(val);
  console.log(dayjs(val))
  console.log(val,'val')
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateField
      
      disabled={disabled}
      label={label}
      format='YYYY-MM-DD'
      fullWidth
        size="small"
        defaultValue={dayjs(date)}
        value={dayjs(date)}
        onChange={(val) => {
          const dayJsObj = dayjs(val);

          setDate(val);
       
          axiosClient
            .patch(`${path}/${item.id}`, {
              colName: colName,
              val: `${dayJsObj.year()}/${
                dayJsObj.month() + 1
              }/${dayJsObj.date()}`,
            })
          
        }}
        sx={{ mb: 1 }}
      />
    </LocalizationProvider>
  );
}

export default MyDateField2;
