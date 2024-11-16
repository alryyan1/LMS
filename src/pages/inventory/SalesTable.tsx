import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
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
import { formatNumber, toFixed, webUrl } from "../constants";
import MyCheckbox from "../../components/MyCheckBox";

function SalesTable() {
  const { setDialog } = useOutletContext();
  const [firstDate, setFirstDate] = useState(dayjs(new Date()));
  const [secondDate, setSecondDate] = useState(dayjs(new Date()));
  const [loading, setLoading] = useState(null);
  const [client, setClient] = useState(null);
  let [deducts, setDeducts] = useState([]);
  const [temp, setTemp] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    setTemp((prev) => {
      return deducts.filter((d) => d.is_postpaid == event.target.checked);
    });
  };
  useEffect(() => {
    //fetch all clients
    axiosClient(`client/all`).then(({ data }) => {
      setClients(data);
      console.log(data);
    });
  }, []);
  useEffect(() => {
    document.title = "التقارير";
  }, []);
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
        setDeducts(data);
        setTemp(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (selectedClient) {
    deducts = deducts.filter((d) => d.client_id == selectedClient?.id);
  }
  console.log(deducts, "deducts", "selected", selectedClient);

  return (
    <Box>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateField
              onChange={(val) => {
                setFirstDate(val);
              }}
              format="DD-MM-YYYY"
              defaultValue={dayjs(new Date())}
              sx={{ m: 1 }}
              label="From"
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateField
              format="DD-MM-YYYY"
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
        <Autocomplete
          sx={{ width: "200px", mb: 1 }}
          options={clients}
          isOptionEqualToValue={(option, val) => option.id === val.id}
          getOptionLabel={(option) => option.name}
          onChange={(e, data) => {
            setSelectedClient(data);
            setClient(data);
            // setTemp((prev) => {
            //   return deducts.filter((d) => d.client_id == data?.id);
            // });
          }}
          renderInput={(params) => {
            return (
              <TextField variant="standard" label={"العميل"} {...params} />
            );
          }}
        ></Autocomplete>
        <FormGroup>
          <FormControlLabel
            label="Postpaid"
            control={<Checkbox checked={checked} onChange={handleChange} />}
          ></FormControlLabel>
        </FormGroup>
        <a
          href={`${webUrl}searchDeductByDate?first=${firstDate.format(
            "YYYY/MM/DD"
          )}&second=${secondDate.format("YYYY/MM/DD")}&client_id=${
            selectedClient?.id ?? null
          }&is_postpaid=${checked}`}
        >
          PDF
        </a>
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell> No</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Payment</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>profit</TableCell>
            <TableCell>Invoice</TableCell>
            <TableCell>client</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deducts.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.number}</TableCell>
              <TableCell>
                {dayjs(new Date(Date.parse(item.created_at))).format(
                  "YYYY/MM/DD H;m A"
                )}
              </TableCell>
              <TableCell>{formatNumber(item.total_price)}</TableCell>
              <TableCell>{item.user.username}</TableCell>
              <TableCell>{item.payment_type.name}</TableCell>
              <TableCell>
                {item.deducted_items.map(
                  (deducted) => `${deducted.item.market_name}-`
                )}
              </TableCell>
              <TableCell>{toFixed(item.profit, 1)}</TableCell>
              <TableCell>
                {" "}
                <a href={`${webUrl}deduct/invoice?id=${item.id}`}>
                  Invoice PDF
                </a>
              </TableCell>
              <TableCell>{item?.client?.name}</TableCell>
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
          <TableRow>
            <TableCell>.</TableCell>
            <TableCell>.</TableCell>
            <TableCell>.</TableCell>
            <TableCell>
              {deducts.reduce((prev, curr) => {
                return prev + curr.total_price;
              }, 0)}
            </TableCell>
            <TableCell>.</TableCell>
            <TableCell>.</TableCell>
            <TableCell>.</TableCell>
            <TableCell>
              {deducts.reduce((prev, curr) => {
                return prev + curr.profit;
              }, 0)}
            </TableCell>
            <TableCell>.</TableCell>
            <TableCell>.</TableCell>
            <TableCell>.</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
}

export default SalesTable;
