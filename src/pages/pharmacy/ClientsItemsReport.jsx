import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
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
import { Item, toFixed, webUrl } from "../constants";
import MyCheckbox from "../../components/MyCheckBox";
import PostPaidDateField from "./MyDateFieldPostDate";
import ShippingStateAutocomplete from "../shipping/ShippingStateAutocomplete";

function ClientsItemsReport() {
  const { setDialog } = useOutletContext();
  const [firstDate, setFirstDate] = useState(dayjs(new Date()));
  const [secondDate, setSecondDate] = useState(dayjs(new Date()));
  const [loading, setLoading] = useState(null);
  const [client, setClient] = useState(null);
  const [deducts, setDeducts] = useState([]);
  const [temp, setTemp] = useState([]);
  const [clients, setClients] = useState([]);
  const [checked, setChecked] = useState(false);
  const [states, setStates] = useState([]);
  const { items } = useOutletContext();

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

  useEffect(() => {
    axiosClient.get("shippingState/all").then(({ data }) => {
      setStates(data);
    });
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
        
        <a href={`${webUrl}excel/itemsClientOrders?first=${firstDate.format(
            "YYYY/MM/DD"
          )}&second=${secondDate.format("YYYY/MM/DD")}`}>EXCEL</a>

      

      </Stack>

      <div
        style={{
          userSelect: "none",
          gap: "15px",
          transition: "0.3s all ease-in-out",
          display: "grid",
          textAlign: "center",

          gridTemplateColumns: items.map((i) => "minmax(250px,1fr)").join(" "),
        }}
      >
        {items.map((i) => {
          return (
            <TableCell sx={{ textWrap: "nowrap" }} key={i.id}>
              {i.market_name}
            </TableCell>
          );
        })}
      </div>

      <div
        style={{
          userSelect: "none",
          gap: "15px",
          transition: "0.3s all ease-in-out",
          display: "grid",
          textAlign: "center",
          gridTemplateColumns: items.map((i) => "minmax(250px,1fr)").join(" "),
        }}
      >
        {items.map((i) => {
          return (
            <Stack direction={"column"} key={i.id}>
              {deducts.map((d) => {
                if (d.deducted_items.map((di) => di.item.id).includes(i.id)) {
                  return (
                    <>
                      <div
                        key={d.id}
                      >{`${d?.client?.name}(${d?.client?.address})`}</div>
                      <Divider />
                    </>
                  );
                }
              })}
            </Stack>
          );
        })}
      </div>
    </Box>
  );
}

export default ClientsItemsReport;
