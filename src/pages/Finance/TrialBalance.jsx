import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client.js";
import dayjs from "dayjs";
import AddEntryForm from "./AddEntryForm.jsx";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LoadingButton } from "@mui/lab";

function Ledger() {
  //create state variable to store all Accounts
  const [firstDate, setFirstDate] = useState(dayjs(new Date()));
  const [secondDate, setSecondDate] = useState(dayjs(new Date()));
  const [loading, setLoading] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [accountLedger, setAccountLedger] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    document.title = "دفتر الاستاذ ";
  }, []);
  useEffect(() => {
    //fetch all Accounts
    axiosClient(`financeAccounts`).then(({ data }) => {
      setAccounts(data);
      console.log(data, "accounts");
    });
  }, []);

  useEffect(() => {
    axiosClient(`ledger/${selectedAccount?.id}`).then(({ data }) => {
      setAccountLedger(data);
      console.log(data, "ledgers");
    });
  }, [selectedAccount?.id]);
  const searchHandler = () => {
    setLoading(true);
    const firstDayjs = firstDate.format("YYYY/MM/DD");
    const secondDayjs = secondDate.format("YYYY/MM/DD");
    axiosClient
      .post(`searchDeductsByDate`, {
        first: firstDayjs,
        second: secondDayjs,
      })
      .then(({ data }) => {
        console.log(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  let totalCreditSum = 0;
  let totalDebitSum = 0;

  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <Box sx={{ p: 1 }}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateField
                  onChange={(val) => {
                    setFirstDate(val);
                  }}
                  defaultValue={dayjs(new Date())}
                  sx={{ m: 1 }}
                  label="From"
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateField
                  onChange={(val) => {
                    setSecondDate(val);
                  }}
                  defaultValue={dayjs(new Date())}
                  sx={{ m: 1 }}
                  label="To"
                />
              </LocalizationProvider>
              <LoadingButton
                onClick={searchHandler}
                loading={loading}
                sx={{ mt: 2 }}
                size="medium"
                variant="contained"
              >
                Go
              </LoadingButton>
            </Box>
          </Stack>
        </Box>
      </Grid>

      <Table style={{ direction: "rtl" }} size="small">
        <TableHead>
          <TableRow>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell colSpan={2}> بالمجاميع </TableCell>
            <TableCell colSpan={2}> بالارصده </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>رقم الحساب</TableCell>
            <TableCell>اسم الحساب</TableCell>
            <TableCell>وصف الحساب </TableCell>
            <TableCell> Debit </TableCell>
            <TableCell> Credit </TableCell>
            <TableCell> Debit </TableCell>
            <TableCell>Credit </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {accounts.map((account) => {
            let totalCredits = account.credits.reduce(
              (accum, current) => accum + current.amount,
              0
            );
            let totalDebits = account.debits.reduce(
              (accum, current) => accum + current.amount,
              0
            );
            totalCreditSum += totalCredits;
            totalDebitSum += totalDebits;
            console.log(
              totalCredits,
              "total credits",
              totalDebits,
              "total dedits"
            );
            let largerNumber = Math.max(totalCredits, totalDebits);
            let creditBalance = 0;
            let debitBalance = 0;
            if (totalCredits > totalDebits) {
              creditBalance = totalCredits - totalDebits;
            } else {
              debitBalance = totalDebits - totalCredits;
            }
            return (
              <TableRow
                sx={{
                  background: (theme) =>
                    account.id == selectedAccount?.id
                      ? theme.palette.warning.light
                      : "",
                }}
                key={account.id}
              >
                <TableCell>{account.id}</TableCell>
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.description}</TableCell>
                <TableCell>{totalDebits}</TableCell>
                <TableCell>{totalCredits}</TableCell>
                <TableCell>{debitBalance}</TableCell>
                <TableCell>{creditBalance}</TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
          </TableRow>
          <TableRow>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell sx={{ borderTop: "1px solid", color: "green" }}>
              {" "}
              {totalDebitSum}{" "}
            </TableCell>
            <TableCell> {totalCreditSum} </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Grid>
  );
}

export default Ledger;
