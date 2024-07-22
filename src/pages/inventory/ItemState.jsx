import {
  Autocomplete,
  Grid,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import  { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import axiosClient from "../../../axios-client";

function ItemState() {
  const items = useLoaderData();
  const [selectedItem, setSelectedItem] = useState(null);
  const [states, setSates] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(1);
  console.log(selectedMonth);
  useEffect(() => {
    document.title = 'حركه الاصناف' ;
  }, []);
  useEffect(() => {
    if (selectedMonth && selectedItem) {
      axiosClient
        .post(`item/state/${selectedItem.id}`, { month: selectedMonth })
        .then(({ data }) => {
          setSates(data);
        });
    }
  }, [selectedMonth, selectedItem]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={4}>
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
        <Grid item xs={7}>
          <Autocomplete
         
            fullWidth
            getOptionKey={(option) => option.id}
            sx={{ mb: 1 }}
            options={items}
            getOptionLabel={(option) => option.market_name}
            onChange={(_, valu) => {
              setSelectedItem(valu);
            }}
            renderInput={(params) => {
              return <TextField label={"الصنف"} {...params} />;
            }}
          ></Autocomplete>
        </Grid>
      </Grid>
      <Grid key={selectedItem} spacing={2} container>
        <Grid item xs={6}>
          <Table size="small" style={{ direction: "rtl" }}>
            <thead>
              <TableRow>
                <TableCell>التاريخ</TableCell>
                <TableCell>وارد</TableCell>
                <TableCell>منصرف</TableCell>
              </TableRow>
            </thead>
            <TableBody>
              {states.slice(16).map((state) => {
               
                return (
                  <TableRow
                    sx={
                      state.income || state.deducs
                        ? {
                            backgroundColor: (theme) =>
                              state.income > state.deducts
                                ? theme.palette.success.light
                                : theme.palette.warning.light,
                          }
                        : null
                    }
                    key={state.date}
                  >
                    <TableCell>{state.date}</TableCell>
                    <TableCell>{state.income}</TableCell>
                    <TableCell>{state.deducts}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={6}>
          <Table size="small" style={{ direction: "rtl" }}>
            <thead>
              <TableRow>
                <TableCell>التاريخ</TableCell>
                <TableCell>وارد</TableCell>
                <TableCell>منصرف</TableCell>
              </TableRow>
            </thead>
            <TableBody>
              {states.slice(0,16).map((state) => {
                return (
                  <TableRow
                    sx={
                      state.income || state.deducs
                        ? {
                            backgroundColor: (theme) =>
                              state.income > state.deducts
                                ? theme.palette.success.light
                                : theme.palette.warning.light,
                          }
                        : null
                    }
                    key={state.date}
                  >
                    <TableCell>{state.date}</TableCell>
                    <TableCell>{state.income}</TableCell>
                    <TableCell>{state.deducts}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
      <TableContainer></TableContainer>
    </>
  );
}

export default ItemState;
