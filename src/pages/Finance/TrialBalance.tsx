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
import { formatNumber, webUrl } from "../constants.js";
import DateComponent from "./DateComponent.js";
import { Account } from "../../types/type.js";

function Ledger() {
  //create state variable to store all Accounts
  const [firstDate, setFirstDate] = useState(dayjs().startOf("month"));
  const [secondDate, setSecondDate] = useState(dayjs(new Date()));
  const [loading, setLoading] = useState(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountLedger, setAccountLedger] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

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
          <DateComponent
            setAccounts={setAccounts}
            accounts={accounts}
            firstDate={firstDate}
            secondDate={secondDate}
          />
        </Box>
      </Grid>
      <Stack alignItems={'center'} justifyContent={'center'} direction='row' gap={1}>
      <Typography variant="h3">ميزان المراجعه </Typography>
      <Button href={`${webUrl}trial-balance`}>PDF</Button>
      <Button href={`${webUrl}trial-balance-excel`}>Excell</Button>
      </Stack>

      <Table style={{ direction: "rtl" }} className="table" size="small">
        <TableHead className="thead">
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
          {accounts
            // .filter((a) => {

            // return a.balance > 0
            
            // })
            .map((account) => {
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
                  <TableCell>{formatNumber(totalDebits)}</TableCell>
                  <TableCell>{formatNumber(totalCredits)}</TableCell>
                  <TableCell>{formatNumber(debitBalance)}</TableCell>
                  <TableCell>{formatNumber(creditBalance)}</TableCell>
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
              {formatNumber(totalDebitSum)}{" "}
            </TableCell>
            <TableCell> {formatNumber(totalCreditSum)} </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Grid>
  );
}

export default Ledger;
