import { Download, Upload } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Grid,
  Icon,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LineChart } from "@mui/x-charts";
import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import axiosClient from "../../../axios-client";

function ItemStatisticsLine() {
  const items = useLoaderData();
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [incomes, setIncomes] = useState([]);
  const [deducts, setDeducts] = useState([]);

  return (
    <>
      <Grid container>
        <Grid item xs={5}>
          <Select
            value={selectedMonth}
            onChange={(val) => {
              console.log(val.target.value);
              setSelectedMonth(val.target.value);
            }}
            fullWidth
            label="الشهر"
          >
            <MenuItem value={1}>يناير</MenuItem>
            <MenuItem value={2}>فبراير</MenuItem>
            <MenuItem value={3}>مارس</MenuItem>
            <MenuItem value={4}>ابريل</MenuItem>
            <MenuItem value={5}>مايو</MenuItem>
            <MenuItem value={6}>يوينو</MenuItem>
            <MenuItem value={7}>يوليو</MenuItem>
            <MenuItem value={8}>اغسطس</MenuItem>
            <MenuItem value={9}>سبتمبر</MenuItem>
            <MenuItem value={10}>اوكتوبر</MenuItem>
            <MenuItem value={11}>نوفمبر</MenuItem>
            <MenuItem value={12}>ديسيمبر</MenuItem>
          </Select>
        </Grid>
        <Grid textAlign={"center"} xs={2}>
          <Button
            onClick={() => {
              console.log(selectedItem);
              axiosClient
                .post(`item/stateByMonth/${selectedItem.id}`, {
                  month: selectedMonth,
                })
                .then(({ data }) => {
                  console.log(data)
                  const incomeData = data.map((item) => {
                    if (item.income) {
                      return item.income;
                    } else {
                      return 0;
                    }
                  });
                  console.log(incomeData)
                  setIncomes(incomeData);
                  const deductData = data.map((item) => {
                    if (item.deducts) {
                      return item.deducts;
                    } else {
                      return 0;
                    }
                  });
                  console.log(deductData)
                  setDeducts(deductData);
                });
            }}
            disabled={selectedItem == null || selectedMonth == null}
            sx={{ textAlign: "center" }}
            variant="contained"
          >
            استعراض
          </Button>
        </Grid>
        <Grid item xs={5}>
          <Autocomplete
            getOptionKey={(option) => option.id}
            sx={{ mb: 1 }}
            options={items}
            isOptionEqualToValue={(option, val) => option.id === val.id}
            getOptionLabel={(option) => option.name}
            onChange={(_, valu) => {
              setSelectedItem(valu);
            }}
            renderInput={(params) => {
              return <TextField label={"الصنف"} {...params} />;
            }}
          ></Autocomplete>
        </Grid>
      </Grid>

      <Stack direction={"row"} justifyContent={"space-around"} spacing={1}>
        <div>
          <Typography textAlign={"center"}>الوارد</Typography>
          <Icon color="red">
            <Download color="red"></Download>
          </Icon>
          {incomes.length > 0 && (
            <LineChart
              title="الوارد"
              xAxis={[
                {
                  data: Array.from({ length: incomes.length }, (_, i) => i + 1),
                },
              ]}
              series={[
                {
                  data: incomes,
                },
              ]}
              width={500}
              height={300}
            />
          )}
        </div>
        <div>
          <Typography textAlign={"center"}>المنصرف</Typography>

          <Icon color="red">
            <Upload color="red"></Upload>
          </Icon>
          {deducts.length > 0 && (
            <LineChart
              title="المنصرف"
              xAxis={[
                {
                  data: Array.from({ length: deducts.length }, (_, i) => i + 1),
                },
              ]}
              series={[
                {
                  data: deducts,
                },
              ]}
              width={500}
              height={300}
            />
          )}
        </div>
      </Stack>
    </>
  );
}

export default ItemStatisticsLine;
