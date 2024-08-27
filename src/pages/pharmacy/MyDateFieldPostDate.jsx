import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Controller } from "react-hook-form";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";

function PostPaidDateField({ item,setShift,setDialog }) {
  // console.log(item , val,'date filed ')
  // console.log(dayjs(val), "date filed ", val, "val");
  const [date, setDate] = useState(()=>{
    if(item.postpaid_date){
      return dayjs(item.postpaid_date)
    }
    return dayjs(new Date()).add(30,'day')
  });
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateField
      format='YYYY-MM-DD'
        
        size="small"
           defaultValue={date}    
        value={null}
        onChange={(val) => {
          const dayJsObj = dayjs(val);

          setDate(val);
          axiosClient
          .patch(`deduct/${item.id}`, {
            colName: "postpaid_date",
            val: `${dayJsObj.year()}/${
              dayJsObj.month() + 1
            }/${dayJsObj.date()}`,
          }).then(({data})=>{
            if (data.status) {
               if (setShift) {
                setShift(data.shift)
               }
               if (setDialog) {
                setDialog((prev) => {
                    return {
                      ...prev,
                      color: "success",

                      open: true,
                      message: 'تم التعديل',
                    };
                  });
               }
            }
          })
       
        }}
        sx={{ mt: 1 }}
        label="تاريخ استلام المبلغ"
      />
    </LocalizationProvider>
  );
}

export default PostPaidDateField;
