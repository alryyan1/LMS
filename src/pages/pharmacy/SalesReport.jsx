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
} from "@mui/material";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import { LoadingButton } from "@mui/lab";
import { DeleteOutline } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { toFixed, webUrl } from "../constants";

function SalesReport() {
  const { setDialog } = useOutletContext();
  const [firstDate, setFirstDate] = useState(dayjs(new Date()));
  const [secondDate, setSecondDate] = useState(dayjs(new Date()));
  const [loading, setLoading] = useState(null);
  const [deducts, setDeducts] = useState([]);
  useEffect(() => {
    document.title = "التقارير";
  }, []);
  const searchHandler = () => {
    setLoading(true);
    const firstDayjs = firstDate.format("YYYY/MM/DD");
    const secondDayjs = secondDate.format("YYYY/MM/DD");
    axiosClient
      .post("searchDeductsByDate", {
        first: firstDayjs,
        second: secondDayjs,
      })
      .then(({ data }) => {
        console.log(data);
        setDeducts(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box>
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
        <a href={`${webUrl}searchDeductByDate?first=${firstDate.format("YYYY/MM/DD")}&second=${secondDate.format("YYYY/MM/DD")}`}>PDF</a>
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>sale number</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Payment</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>profit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deducts.map((item) => (
            <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.number}</TableCell>
              <TableCell>
                {dayjs(new Date(Date.parse(item.created_at))).format('YYYY/MM/DD H;m A')}
              </TableCell>
              <TableCell>{item.total_price}</TableCell>
              <TableCell>{item.user.username}</TableCell>
              <TableCell>{item.payment_type.name}</TableCell>
              <TableCell>
                {item.deducted_items.map(
                  (deducted) => `${deducted.item.market_name}-`
                )}
              </TableCell>
              <TableCell>{toFixed(item.profit,1)}</TableCell>
              <TableCell>
                <LoadingButton
                  loading={loading}
                  onClick={() => {
                    setLoading(true);
                    axiosClient
                      .delete(`deduct/${item.id}`)
                      .then(({ data }) => {
                        console.log(data);
                        setDeducts((prev) => {
                          return prev.filter((d) => d.id !== item.id);
                        });
                      })
                      .finally(() => {
                        setLoading(false);
                      })
                      .catch(({ response: { data } }) => {
                        setDialog((prev) => {
                          return {
                            ...prev,
                            message: data.message,
                            open: true,
                            color: "error",
                          };
                        });
                      });
                  }}
                >
                  <DeleteOutline />
                </LoadingButton>
              </TableCell>
            </TableRow>
          ))}

          {deducts.length === 0 && !loading && (
            <TableRow>
              <TableCell colSpan={5}>No data found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
}

export default SalesReport;
