import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axiosClient from "../../axios-client";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
function CountInfoGraphic() {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()+1);

  useEffect(() => {
    axiosClient(`countInfoGraphic?month=${selectedMonth}`).then(({ data }) => {
      setData(data);
    });
  }, [selectedMonth]);

  const handleChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const startOfYear = dayjs().startOf("year");
  const monthArr = [];
  for (let i = 0; i < 12; i++) {
    const month = startOfYear.add(i, "month");
    monthArr.push(month.format("MMMM"));
  }

  return (
    <>
      <div className="p-6 rounded-lg shadow-sm">
      <FormControl fullWidth>
            <InputLabel id="month-label">الشهر</InputLabel>
            <Select
              id="month-select"
              value={selectedMonth}
              label={"Month"}
              onChange={handleChange}
            >
              {monthArr.map((m, i) => (
                <MenuItem key={i} value={i+1}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        <h3 className="text-lg font-medium text-gray-900 mb-4" >{`  ${monthArr[selectedMonth -1]}   التردد علي مستوي الشهر`}</h3>
        <div className="h-80">
          {/* <ResponsiveContainer width="100%" height="100%"> */}
            <AreaChart
            width={window.innerWidth - 200} height={300}
              margin={{ top: 20, right: 50, left: 50, bottom: 20 }}
              data={data}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#4F46E5"
                fill="#EEF2FF"
              />
            </AreaChart>
          {/* </ResponsiveContainer> */}
        </div>
      </div>
    
    </>
  );
}

export default CountInfoGraphic;
