import {
  Autocomplete,
  Button,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import axiosClient from "../../../axios-client";
var today = new Date();

function ItemState() {
  const [date, setDate] = useState(null);
  const items = useLoaderData();
  const [selectedItem, setSelectedItem] = useState(null);
  const [states, setSates] = useState([]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Button sx={{ mt: 2 }} size="medium" variant="contained">
              بحث
            </Button>
            <DateField
              onChange={(val) => {
                setDate(val);
              }}
              value={date}
              defaultValue={dayjs(new Date())}
              sx={{ m: 1 }}
              label="تاريخ الفاتوره"
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={7}>
        <Autocomplete
          fullWidth
            getOptionKey={(option) => option.id}
            sx={{ mb: 1 }}
            options={items}
            isOptionEqualToValue={(option, val) => option.id === val.id}
            getOptionLabel={(option) => option.name}
            onChange={(_, valu) => {
              setSelectedItem(valu);
              axiosClient.get(`item/state/${valu.id}`).then(({ data }) => {
                setSates(data);
              });
            }}
            renderInput={(params) => {
              return <TextField label={"الصنف"} {...params} />;
            }}
          ></Autocomplete>
        </Grid>
         
      </Grid>

      <TableContainer>
        <Table size="small" style={{direction:'rtl'}}>
          <thead>
            <TableRow>
              <TableCell>التاريخ</TableCell>
              <TableCell>وارد</TableCell>
              <TableCell>منصرف</TableCell>
            </TableRow>
          </thead>
          <TableBody>
            {states.map((state) => {
              return (
                <TableRow sx={ state.income || state.deducs ? {backgroundColor:(theme)=> state.income > state.deducts ? theme.palette.success.light : theme.palette.warning.light } : null} key={state.date}>
                  <TableCell>{state.date}</TableCell>
                  <TableCell>{state.income}</TableCell>
                  <TableCell>{state.deducts}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ItemState;
