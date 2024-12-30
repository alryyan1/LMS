import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Client } from "../types/type";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axiosClient from "../../axios-client";
import { formatNumber } from "../pages/constants";
interface ClientPaymentHistoryProbs {
  client: Client;
  setClient: (newClient: Client) => void;
}
function ClientPaymentHistory({ client,setClient }: ClientPaymentHistoryProbs) {
  const [firstDate, setFirstDate] = useState(dayjs(new Date()));
  const [amount, setAmount] = useState();
  const makePaymentHandler = () => {
    axiosClient.post(`clientPayment`, {
      client_id: client.id,
      amount: amount,
      payment_date: dayjs(firstDate).format("YYYY-MM-DD"),
    }).then(({data})=>{
      setClient(data)
    });
  };
  return (
    <div>
      <Typography variant="h3" textAlign={'center'}>{client.name}</Typography>

      <Stack direction={"row"} gap={2}>
        <Box>
          <Stack direction={"column"} gap={1}>
            <TextField
              size="small"
              variant="standard"
              onChange={(e) => setAmount(e.target.value)}
              label="amount"
              type="number"
              autoFocus={true}
              autoComplete="off"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateField
                onChange={(val) => {
                  setFirstDate(val);
                }}
                defaultValue={dayjs(new Date())}
                label="التاريخ"
              />
            </LocalizationProvider>
            <Button onClick={makePaymentHandler}>حفظ</Button>
          </Stack>
        </Box>
        <Box>
          <Table style={{direction:"rtl"}} size="small">
            <TableHead>
              <TableRow>
                <TableCell>رقم</TableCell>
                <TableCell>التاريخ</TableCell>
                <TableCell>المبلغ</TableCell>
                <TableCell>حذف</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {client.payments.map((payment, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{dayjs(payment.payment_date).format("DD/MM/YYYY")}</TableCell>
                  <TableCell>{formatNumber(payment.amount)}</TableCell>
                  <TableCell>
                    <Button onClick={() => {
                      axiosClient.delete(`clientPayment/${payment.id}`)
                       .then(({data}) => {
                          setClient(data);
                        });
                    }}>حذف</Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3}>Total: {formatNumber(client.paymentAmount)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Stack>
    </div>
  );
}

export default ClientPaymentHistory;
