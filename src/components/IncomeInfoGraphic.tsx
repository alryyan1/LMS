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
import { formatNumber } from "../pages/constants";
function IncomeInfoGraphic() {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    axiosClient(`incomeInfoGraphic?month=${selectedMonth}`).then(({ data }) => {
      setData(data);
    });
  }, [selectedMonth]);

  const handleChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // alert('s')

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
              <MenuItem key={i} value={i + 1}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <h3 className="text-lg font-medium text-gray-900 mb-4">{`  ${monthArr[selectedMonth - 1]}   الايرادات علي مستوي الشهر`}</h3>
        <div className="h-80">
          {/* <ResponsiveContainer width="100%" height="100%"> */}

          {/* <ResponsiveContainer width="100%" height="100%"> */}
          <AreaChart
            margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
            width={window.innerWidth - 200}
            height={300}
            data={data}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis tickFormatter={(value) => `${formatNumber(value)}`} dataKey="name" />
            <YAxis tickFormatter={(value) => `${formatNumber(value)}`} />
            <Tooltip formatter={(value) => `$${formatNumber(value)}`} />            <Area
              type="monotone"
              dataKey="sales"
              stroke="#4F46E5"
              fill="#EEF2FF"
            />
          </AreaChart>
          {/* </ResponsiveContainer> */}
          {/* </ResponsiveContainer> */}
        </div>
      </div>
    </>
  );
}

export default IncomeInfoGraphic;
