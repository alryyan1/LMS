import {
  Autocomplete,
  Badge,
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
import { toFixed, webUrl } from "../constants";
import MyCheckbox from "../../components/MyCheckBox";
import PostPaidDateField from "./MyDateFieldPostDate";
import ShippingStateAutocomplete from "../shipping/ShippingStateAutocomplete";
import PayOptions from "../../components/PayOptions";

function SalesReport() {
  const { setDialog } = useOutletContext();
  const [firstDate, setFirstDate] = useState(dayjs(new Date()));
  const [secondDate, setSecondDate] = useState(dayjs(new Date()));
  const [loading, setLoading] = useState(null);
  const [client, setClient] = useState(null);
  const [deducts, setDeducts] = useState([]);
  const [temp, setTemp] = useState([]);
  const [clients, setClients] = useState([]);
  const [checked, setChecked] = useState(null);
  const [states, setStates] = useState([]);

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
        <Autocomplete
          sx={{ width: "200px", mb: 1 }}
          options={clients}
          isOptionEqualToValue={(option, val) => option.id === val.id}
          getOptionLabel={(option) => option.name}
          onChange={(e, data) => {
            if (data == null) {
              setTemp(deducts);
              return;
            }
            setClient(data);
            setTemp((prev) => {
              return deducts.filter((d) => d.client_id == data?.id);
            });
          }}
          renderInput={(params) => {
            return (
              <TextField variant="standard" label={"العميل"} {...params} />
            );
          }}
        ></Autocomplete>

        <a
          href={`${webUrl}searchDeductByDate?first=${firstDate.format(
            "YYYY/MM/DD"
          )}&second=${secondDate.format("YYYY/MM/DD")}&client_id=${
            client?.id ?? null
          }&is_postpaid=${checked}`}
        >
          PDF
        </a>
        <a
          href={`${webUrl}allSalesByItems?first=${firstDate.format(
            "YYYY/MM/DD"
          )}&second=${secondDate.format("YYYY/MM/DD")}&client_id=${
            client?.id ?? null
          }&is_postpaid=${checked}`}
        >
        all Sales By Items
        </a>
       
      </Stack>

      <Table style={{ direction: "rtl" }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>الكود</TableCell>
            <TableCell>العميل</TableCell>
            <TableCell>المبلغ</TableCell>
            <TableCell>المنتج</TableCell>

            <TableCell>تاريخ الطلب</TableCell>
            <TableCell>فاتوره</TableCell>
            <TableCell>تاريخ سداد الاجل</TableCell>
            <TableCell> (kg) الوزن</TableCell>
            <TableCell> الحاله </TableCell>
            <TableCell>دفع</TableCell>
            <TableCell>طريقه الدفع</TableCell>
            <TableCell>حذف</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {temp.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{`${item?.client?.name ?? "No-Client"}(${
                item?.client?.state ?? ""
              })  `}</TableCell>
              <TableCell>{item.total_price_unpaid}</TableCell>
              <TableCell>
                <Stack alignContent={"start"} direction={"column"}>
                  {item.deducted_items.map((deducted) => (
                    <Badge
                      style={{ justifyContent: "end" }}
                      key={deducted.id}
                      badgeContent={deducted.offer_applied ? "offer" : ""}
                      color={deducted.offer_applied ? "secondary" : ""}
                    >
                      {deducted.item?.market_name}
                    </Badge>
                  ))}
                </Stack>
              </TableCell>
              <TableCell>
                {dayjs(new Date(Date.parse(item.created_at))).format(
                  "YYYY/MM/DD H;m A"
                )}
              </TableCell>

              <TableCell>
                {" "}
                <a href={`${webUrl}deduct/invoice?id=${item.id}`}>
                  Invoice PDF
                </a>
              </TableCell>
              <TableCell>
                {item?.payment_method == "postpaid" && (
                  <PostPaidDateField setDialog={setDialog} item={item} />
                )}
              </TableCell>
              <TableCell>{item.weight}</TableCell>

              <TableCell>
                <ShippingStateAutocomplete
                  shippingId={item.id}
                  shippingStates={states}
                  shipSate={item.state}
                />
              </TableCell>
              <TableCell>
                {item?.complete ? (
                  <LoadingButton
                    color="error"
                    fullWidth
                    loading={loading}
                    onClick={() => {
                      setLoading(true);
                      axiosClient
                        .get(`inventory/deduct/cancel/${item.id}`)
                        .then(({ data }) => {
                          setDeducts((prev) => {
                            return prev.map((d) => {
                              if (d.id === item.id) {
                                return { ...data.data };
                              } else {
                                return d;
                              }
                            });
                          });
                          setTemp((prev) => {
                            return prev.map((d) => {
                              if (d.id === item.id) {
                                return { ...data.data };
                              } else {
                                return d;
                              }
                            });
                          })
                        })
                        .catch(({ response: { data } }) => {
                          // console.log({ data });
                          setDialog((prev) => {
                            return {
                              ...prev,
                              color: "error",

                              open: true,
                              message: data?.message || "An error occured",
                            };
                          });
                        })
                        .finally(() => {
                          setLoading(false);
                        });
                    }}
                    variant="contained"
                  >
                    Cancel
                  </LoadingButton>
                ) : (
                  <LoadingButton
                    className="effect"
                    disabled={item.deducted_items.length == 0}
                    fullWidth
                    loading={loading}
                    onClick={() => {
                      setLoading(true);
                      axiosClient
                        .get(`inventory/deduct/complete/${item.id}?is_sell=1`)
                        .then(({ data }) => {
                          console.log(data, "data");
                          setDeducts((prev) => {
                            return prev.map((d) => {
                              if (d.id === item.id) {
                                return { ...data.data };
                              } else {
                                return d;
                              }
                            });
                          });
                          setTemp((prev) => {
                            return prev.map((d) => {
                              if (d.id === item.id) {
                                return { ...data.data };
                              } else {
                                return d;
                              }
                            });
                          })
                          try {
                            setDialog((prev) => {
                              return {
                                ...prev,
                                color: "success",
                                open: true,
                                message: "Sell completed successfully",
                              };
                            });
                          } catch (e) {
                            // console.log(e);
                          }
                        })
                        .catch(({ response: { data } }) => {
                          // console.log({ data });
                          setDialog((prev) => {
                            return {
                              ...prev,
                              color: "error",

                              open: true,
                              message: data?.message || "An error occured",
                            };
                          });
                        })
                        .finally(() => {
                          setLoading(false);
                        });
                    }}
                    variant="contained"
                  >
                    Pay
                  </LoadingButton>
                )}
              </TableCell>
              <TableCell>
                <PayOptions setTemp={setTemp} setDeducts={setDeducts} item={item} />
              </TableCell>
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
