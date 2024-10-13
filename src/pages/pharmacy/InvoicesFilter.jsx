import {
    Autocomplete,
    Button,
    Stack,
    TextField,
  } from "@mui/material";
  import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { t } from "i18next";
import axiosClient from "../../../axios-client";
import { useOutletContext } from "react-router-dom";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
function InvoicesFilter() {
  const [date, setDate] = useState(dayjs(new Date()));
  const [billNumber, setBillNumber] = useState("");

  const {setInvoices,suppliers} =  useOutletContext()
    const showDepositBySupplier = (supplier) => {
        axiosClient
          .post(`inventory/deposit/getDepositBySupplier`, {
            supplier_id: supplier.id,
          })
          .then(({ data: { data } }) => {
            // console.log(data);
            setInvoices(data);
            // console.log(items, "response");
          });
      };
    
      const searchDeposits = () => {
        // console.log(date.format("YYYY/MM/DD"), "date");
        // console.log(date.$d, "date");
        axiosClient
          .post("inventory/deposit/getDepositsByDate", {
            date: date.format("YYYY/MM/DD"),
          })
          .then(({ data: { data } }) => {
            setInvoices(data);
          });
      };
      

  useEffect(() => {
    if (billNumber != "") {
      const timeoutid = setTimeout(() => {
        axiosClient
          .post("inventory/deposit/getDepoistByInvoice", {
            bill_number: billNumber,
          })
          .then(({ data: data }) => {
            setInvoices(data);
          });
      }, 300);
      return () => {
        clearTimeout(timeoutid);
      };
    }
  }, [billNumber]);
  return (
    <Stack
    direction={"row"}
    alignItems={"center"}
    gap={3}
    style={{ textAlign: "right" }}
  >
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Button onClick={searchDeposits} size="medium" variant="contained">
        {t("search")}
      </Button>
      <DateField
        size="small"
        onChange={(val) => {
          setDate(val);
        }}
        value={date}
        defaultValue={dayjs(new Date())}
        sx={{ m: 1 }}
        label="Purchase Invoice Date"
      />
    </LocalizationProvider>
    <TextField
      size="small"
      onChange={(event) => {
        setBillNumber(event.target.value);
      }}
      label="Search by invoice number"
    ></TextField>
    <Autocomplete
      size="small"
      sx={{ width: "400px" }}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      options={suppliers}
      getOptionLabel={(option) => option.name}
      onChange={(e, data) => {
        showDepositBySupplier(data);
      }}
      renderInput={(params) => {
        return <TextField label={"Search by Supplier"} {...params} />;
      }}
    ></Autocomplete>
  </Stack>
  )
}

export default InvoicesFilter