import { act, useEffect, useRef, useState } from "react";
import { formatNumber, Item, toFixed, webUrl } from "../constants";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { useSymbologyScanner } from "@use-symbology-scanner/react";

import DescriptionIcon from "@mui/icons-material/Description";
import {
  Divider,
  IconButton,
  Stack,
  Box,
  Typography,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Card,
  CardContent,
  TextField,
  Skeleton,
  Slide,
  Grow,
  Zoom,
  Autocomplete,
  Button,
  FormControlLabel,
  Checkbox,
  FormGroup,
  TableHead,
  Menu,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import {
  Calculate,
  DeleteOutline,
  DeleteOutlineSharp,
  LockOpen,
  PersonAdd,
  Print,
  QrCode,
  ReportOutlined,
} from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import { Link, useOutletContext } from "react-router-dom";
import AddDrugAutocomplete from "../../components/AddDrugAutocomplete";
import axiosClient from "../../../axios-client";
import { LoadingButton } from "@mui/lab";
import MyTableCell from "../inventory/MyTableCell";
import PatientLab from "../Laboratory/PatientLab";
import SellBox from "./SellBox";
import PayOptions from "../../components/PayOptions";
import SellsMoneyDialog from "./SellsMoneyDialog";
import printJS from "print-js";
import AddDrugDialog from "./AddDrugDialog";
import dayjs from "dayjs";
import AddClientDialog from "./AddClientDialog";
import SaleDiscountSelect from "../../components/SaleDiscountSelect";
import MyCheckbox from "../../components/MyCheckBox";
import CalculateInventory from "./CalculateInventory";
import MyDateField2 from "../../components/MyDateField2";
import AutocompleteSearchPatient from "../../components/AutocompleteSearchPatient";
import AutocompleteSearchPatientInsurance from "../../components/AutocompleteSearchInsurancePaitents";
import { PharmacyLayoutPros } from "../../types/pharmacy";
import { Barcode, Plus, Printer } from "lucide-react";
import { useStateContext } from "../../appContext";
import { socket } from "../../socket";
// import Calculator from "../../components/calculator/Calculator";

function SellDrug() {
  const ref = useRef(null);
  const handleSymbol = (symbol, matchedSymbologies) => {
    // console.log(`Scanned ${symbol}`);
  };

  useSymbologyScanner(handleSymbol, { target: ref });
  const [loading, setLoading] = useState();
  const [userSettings, setUserSettings] = useState(null);
  const [clients, setClients] = useState([]);
  const [barcodeVal, setBarcodeVal] = useState(null);

  const [updater, setUpdater] = useState(0);
  const [searchOption, setSearchOption] = useState("market_name");
  const [recieved, setRecieved] = useState(0);
  const {
    setDialog,
    setDeduct,
    shift,
    shiftIsLoading,
    activeSell,
    setActiveSell,
    setShift,
    setShowDialogMoney,
    setOpenClientDialog,
    itemsTobeAddedToChache,
    setItems,
    items,
    showDialogMoney,
  } = useOutletContext<PharmacyLayoutPros>();
  const { user } = useStateContext();
  // console.log(shift, "shift");
  // console.log(activeSell, "active sell");
  useEffect(() => {
    //fetch all suppliers
    axiosClient(`inventory/deduct/last`).then(({ data }) => {
      console.log(data, "deduct");
      setDeduct(data);
    });
  }, []);
  useEffect(() => {
    axiosClient.get("userSettings").then(({ data }) => {
      // console.log(data, "user settings from axios");
      setUserSettings(data);
    });
  }, []);

  useEffect(() => {
    if (activeSell) {
      const controller = new AbortController();
      axiosClient(`inventory/deduct/showDeductById/${activeSell.id}`,{
        signal:controller.signal
      }).then(({ data }) => {
        // console.log(data, "active sell");
        setActiveSell(data.data);
        // setItems(data.items);
        setUpdater((prev)=>prev+1)
      });
      return ()=>{
        controller.abort();
      }
      
    }
  }, [activeSell?.id]);

  useEffect(() => {
    itemsTobeAddedToChache.map((id) => {
      if (!items.map((i) => i.id).includes(id)) {
        axiosClient(`items/find/${id}`).then(({ data }) => {
          setItems((prev) => {
            return [...prev, data];
          });
        });
      }
      if (items.find((i) => i.id == id)?.lastDepositItem == null) {
        axiosClient(`items/find/${id}`).then(({ data }) => {
          setItems((prev) => {
            return prev.map((item) => {
              if (item.id == id) {
                return { ...data };
              } else {
                return item;
              }
            });
          });
        });
      }
    });
    axiosClient(`client/all`).then(({ data }) => {
      setClients(data);
      // console.log(data);
    });
  }, []);

  const showShiftMoney = () => {
    setShowDialogMoney(true);
  };
  useEffect(() => {
    document.title = "Sales";
  }, []);

  const update = (deduct) => {
    setActiveSell(deduct);
    setShift((prev) => {
      if (prev.deducts.map((d) => d.id).find((d) => d == deduct.id)) {
        return {
          ...prev,
          deducts: prev.deducts.map((d) => {
            if (d.id == deduct.id) {
              return { ...deduct };
            } else {
              return d;
            }
          }),
        };
      } else {
        return { ...prev, deducts: [deduct, ...prev.deducts] };
      }
    });
  };

  const printHandler = () => {
    const form = new URLSearchParams();
    axiosClient
      .get(`printSale?deduct_id=${activeSell.id}&base64=1`)
      .then(({ data }) => {
        form.append("data", data);
        form.append("node_direct", userSettings.node_direct);
        // console.log(data, "daa");
        if (userSettings?.web_dialog) {
          printJS({
            printable: data.slice(data.indexOf("JVB")),
            base64: true,
            type: "pdf",
          });
        }
        if (userSettings?.node_dialog) {
          fetch("http://127.0.0.1:4000/", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },

            body: form,
          }).then(() => {});
        }
      });
  };

  //socket
    const [isConnected, setIsConnected] = useState(socket.connected);
  
    function onConnect() {
      setIsConnected(true);
      console.log("connected succfully");
    }
  
    function onDisconnect() {
      setIsConnected(false);
    }
    useEffect(() => {
      //  const socket =  io('ws://localhost:3000')
  
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("disconnect", () => {
        console.log("socket disconnected");
      });
      socket.on("connect", (args) => {
        console.log("doctor connected succfully with id" + socket.id, args);
      });
      socket.on("new deduct recieved", (args) => {
        console.log(args,'new deduct');
        update(args);
      });
  
      socket.on("update deduct recieved", (args) => {
        console.log(args,'update deduct');
        update(args);
        setUpdater((prev)=>prev+1)
      });
  
  
  
      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("new deduct recieved", onDisconnect);
        socket.off("update deduct recieved", onDisconnect);
      };
    }, []);
  return (
    <>
      <Stack direction={"row"} gap={1}>
        <div style={{ marginRight: "65px" }}></div>
        <Select
          onChange={(e) => {
            setSearchOption(e.target.value);
          }}
          value={searchOption}
          variant="standard"
        >
          <MenuItem value="market_name">Market Name</MenuItem>
          <MenuItem value="sc_name">Active</MenuItem>
        </Select>
        <Stack direction={'row'} gap={1} style={{ flexGrow: "1" }}>
          <Stack direction={'row'} gap={1}>
          <TextField
           size="small"
            label="بحث برقم العمليه"
            sx={{ width: "300px" }}
            onChange={(e) => {
              setBarcodeVal(e.target.value);
            }}
            fullWidth
            key={activeSell?.id}
            onKeyDown={(e) => {
              //get the value when key down

              if (e.key === "Enter") {
                axiosClient.get(`sells/find/${barcodeVal}`).then(({ data }) => {
                  console.log("find deduct", data);
                  setActiveSell(data);
                });
              }
            }}
          />
          <QrCode fontSize="large" />
          </Stack>

         
        {activeSell && !user?.isAccountant ? (
            <Box sx={{flex:1}}>
              <AddDrugAutocomplete 
            searchOption={searchOption}
            update={update}
            key={activeSell?.id}
            setLoading={setLoading}
            loading={loading}
            setUpdater={setUpdater}
          /></Box> 
          ):''}
        </Stack>
      </Stack>
      <div
        style={{
          userSelect: "none",
          gap: "15px",
          marginTop: "5px",
          transition: "0.3s all ease-in-out",
          height: `${window.innerHeight}px`,
          display: "grid",
          gridTemplateColumns: `0.1fr  0.3fr  2fr 0.5fr 0.1fr      `,
        }}
      >
        <div>
          <Stack
            sx={{ mr: 1 }}
            gap={"5px"}
            divider={<Divider orientation="vertical" flexItem />}
            direction={"column"}
          >
            <Tooltip title="الايرادات">
              <IconButton variant="contained" onClick={showShiftMoney}>
                <Calculate />
              </IconButton>
            </Tooltip>
            <Tooltip title="التقرير">
              <IconButton
                href={`${webUrl}pharmacy/sellsReport?shift_id=${shift?.id}`}
                variant="contained"
              >
                <DescriptionIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="طباعه تقرير تامين الورديه">
              <IconButton
                href={`${webUrl}pharmacy/sellsReportIndurance?shift_id=${shift?.id}`}
                variant="contained"
              >
                <ReportOutlined />
              </IconButton>
            </Tooltip>
          </Stack>
        </div>

        <Card
          sx={{
            p: 1,
            height: `${window.innerHeight - 100}px`,
            overflow: "auto",
            backgroundColor: "#ffffff73",
          }}
        >
          <div className="patients" style={{ padding: "15px" }}>
            {shiftIsLoading ? (
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={"100%"}
                height={400}
              />
            ) : (
              shift?.deducts
                .filter((d) => d.is_sell != 0)
                .filter((d) => {
                  if (user?.isAdmin) {
                    return true;
                  } else {
                    return d.user_id == user?.id || user?.id == d.user_paid;
                  }
                })
                .map((p, i) => (
                  <SellBox
                    setActiveSell={setActiveSell}
                    update={update}
                    delay={i * 100}
                    key={p.id}
                    sell={p}
                    activeSell={activeSell}
                    onClick={setActiveSell}
                    index={i + 1}
                  />
                ))
            )}
          </div>
        </Card>
        <Card
          sx={{ p: 1, backgroundColor: "#ffffff73" }}
          style={{ overflow: "auto" }}
        >
          {activeSell && (
            <>
              <Stack direction={"row"} key={activeSell?.id} alignContent={"right"}>
                {/* <input ref={ref}></input> */}
                <Autocomplete
                  value={activeSell.client}
                  sx={{ width: "200px", mb: 1 }}
                  options={clients}
                  isOptionEqualToValue={(option, val) => option.id === val.id}
                  getOptionLabel={(option) => option.name}
                  onChange={(e, data) => {
                    axiosClient
                      .patch(`deduct/${activeSell.id}`, {
                        colName: "client_id",
                        val: data.id,
                      })
                      .then(({ data }) => {
                        setActiveSell(data.data);
                      });
                  }}
                  renderInput={(params) => {
                    return (
                      <TextField
                        variant="standard"
                        label={"العميل"}
                        {...params}
                      />
                    );
                  }}
                ></Autocomplete>
                <IconButton
                  onClick={() => {
                    setOpenClientDialog(true);
                  }}
                >
                  <PersonAdd />
                </IconButton>
                {activeSell.client && (
                  <a href={`${webUrl}deduct/invoice?id=${activeSell.id}`}>
                    Invoice PDF
                  </a>
                )}
                {activeSell.client && (
                  <FormGroup>
                    <FormControlLabel
                      label="Postpaid"
                      control={
                        <MyCheckbox
                          update={update}
                          setDialog={setDialog}
                          path={`deduct/${activeSell?.id}`}
                          colName={"is_postpaid"}
                          isChecked={activeSell?.is_postpaid}
                        />
                      }
                    ></FormControlLabel>
                  </FormGroup>
                )}
                <AutocompleteSearchPatientInsurance
                  setActiveSell={setActiveSell}
                  selectedDeduct={activeSell}
                />
                <Box sx={{ flex: 1, textAlign: "center" }}>
                  {activeSell.doctorvisit && (
                    <Typography variant="h4">
                      {activeSell.doctorvisit.patient.company.name}
                    </Typography>
                  )}
                </Box>
              </Stack>

              {shiftIsLoading ? (
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width={"100%"}
                  height={400}
                />
              ) : (
                <Table
                  
                  className="white"
                  key={updater}
                  size="small"
                >
                  <thead>
                    <TableRow>
                      <TableCell>No</TableCell>
                      <TableCell>Item</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Strips</TableCell>
                      <TableCell>QYN</TableCell>
                      <TableCell>Subtotal</TableCell>
                      <TableCell width={"5%"}>action</TableCell>
                      <TableCell>Expire</TableCell>
                      <TableCell>Inventory</TableCell>
                    </TableRow>
                  </thead>
                  <TableBody>
                    {activeSell?.deducted_items?.map((deductedItem, index) => (
                      <TableRow
                        sx={{
                          background: (theme) => {
                            return !dayjs(
                              deductedItem?.item?.last_deposit_item?.expire
                            ).isAfter(dayjs())
                              ? "#ef535087"
                              : "theme.palette.background.defaultLight";
                          },
                          fontWeight: "500",
                        }}
                        key={deductedItem.id}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Link to={`/pharmacy/items/${deductedItem.item_id}`}>
                            {deductedItem.item?.market_name}
                          </Link>
                        </TableCell>
                        {activeSell.complete ? (
                          <TableCell>
                            {formatNumber(toFixed(deductedItem.price, 1))}
                          </TableCell>
                        ) : (
                          <MyTableCell

                            setData={setActiveSell}
                            update={update}
                            sx={{ width: "70px" }}
                            type={"number"}
                            item={deductedItem}
                            table="deductedItem"
                            colName={"price"}
                          >
                            {toFixed(deductedItem.price, 1)}
                          </MyTableCell>
                        )}

                        {activeSell.complete ? (
                          <TableCell> {deductedItem.strips}</TableCell>
                        ) : (
                          <MyTableCell
                            setData={setActiveSell}
                            sx={{ width: "70px" }}
                            type={"number"}
                            item={deductedItem}
                            table="deductedItem"
                            colName={"strips"}
                            update={update}
                          >
                            {deductedItem.strips}
                          </MyTableCell>
                        )}
                        {activeSell.complete ? (
                          <TableCell>{toFixed(deductedItem.box, 1)}</TableCell>
                        ) : (
                          <MyTableCell
                            show
                            setData={setActiveSell}
                            update={update}

                            sx={{ width: "70px" }}
                            type={"number"}
                            item={deductedItem}
                            table="deductedItem"
                            colName={"box"}
                          >
                            {toFixed(deductedItem.box, 1)}
                          </MyTableCell>
                        )}
                        <TableCell>
                          {formatNumber(
                            toFixed(
                              (deductedItem.price / deductedItem.item?.strips) *
                                deductedItem.strips,
                              3
                            )
                          )}
                        </TableCell>
                        <TableCell>
                          <LoadingButton
                            disabled={activeSell.complete}
                            size="small"
                            loading={loading}
                            onClick={() => {
                              setLoading(true);
                              axiosClient
                                .delete(`inventory/deduct/${deductedItem.id}`)
                                .then(({ data }) => {
                                  setLoading(false);
                                  update(data.data);
                                });
                            }}
                          >
                            <DeleteOutlineSharp />
                          </LoadingButton>
                        </TableCell>

                        <TableCell>
                          <MyDateField2
                            val={deductedItem?.item.last_deposit_item?.expire}
                            item={deductedItem?.item.last_deposit_item}
                          />
                        </TableCell>
                        <TableCell>
                          <CalculateInventory item_id={deductedItem.item.id} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </Card>

        <Card
          sx={{
            backgroundColor: "#ffffff73",
            p: 1,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            alignContent: "space-between",
            alignItems: "space-between",
          }}
        >
          {activeSell && (
            <>
              <Typography variant="h6" textAlign={"right"}>
                Transaction No {activeSell?.id}
              </Typography>

              {/* <Typography className="text-gray-500" textAlign={"right"}>
                Date{" "}
                {dayjs(new Date(activeSell?.created_at)).format(
                  "YYYY/MM/DD H:m A"
                )}

              </Typography> */}
              {/* <MyDateField2
              //  key={activeSell?.id}
                label="تاريخ البيع"
                path="deduct"
                colName="created_at"
                // disabled={true}
                val={activeSell.created_at}
                item={activeSell}
              /> */}
              {dayjs(activeSell.created_at).format('YYYY-MM-DD')}
              <Divider />
              {activeSell.doctorvisit ? (
                <TextField
                  defaultValue={activeSell.endurance_percentage}
                  onChange={(e) => {
                    axiosClient
                      .patch(`deduct/${activeSell.id}`, {
                        colName: "endurance_percentage",
                        val: e.target.value,
                      })
                      .then(({ data }) => {
                        setActiveSell(data.data);
                      });
                  }}
                  size="small"
                  label="نسبه التحمل"
                  color="error"
                />
              ) : (
                <PayOptions update={update} key={activeSell.id} />
              )}
              <Divider />
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="right"
                      sx={{ textAlign: "right" }}
                      colSpan={2}
                    >
                      Invoice
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* <TableRow>
                    <TableCell align="right" sx={{ textAlign: "right" }}>
                      Sub Total
                    </TableCell>
                    <TableCell>
                      {formatNumber(
                        Number(activeSell?.total_price).toFixed(1)
                      )}
                    </TableCell>
                  </TableRow> */}

                  {/* <TableRow>
                    <TableCell align="right" sx={{ textAlign: "right" }}>
                      Tax
                    </TableCell>
                    <TableCell>
                      {Number(activeSell?.calculateTax).toFixed(1)}
                    </TableCell>
                  </TableRow> */}

                  <TableRow>
                    <TableCell
                      align="right"
                      sx={{ textAlign: "right", fontSize: "27px" }}
                    >
                      {" "}
                      Total
                    </TableCell>
                    <TableCell sx={{ fontSize: "27px" }}>
                      {formatNumber(
                        toFixed(
                          activeSell?.total_price 
                            ,
                          1
                        )
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="right" sx={{ textAlign: "right" }}>
                      Discount
                    </TableCell>
                    <MyTableCell
                     key={activeSell?.id}
                      colName={"discount"}
                      sx={{ width: "80px" }}
                      table="deduct"
                      item={activeSell}
                      disabled={activeSell.complete == 1}
                    >
                      {Number(activeSell?.discount).toFixed(1)}
                    </MyTableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell
                      align="right"
                      sx={{ textAlign: "right", fontSize: "27px" }}
                    >
                      Paid
                    </TableCell>
                    <TableCell sx={{ fontSize: "27px" }}>
                      {formatNumber(Number(activeSell?.paid).toFixed(0))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Divider />

              <Stack justifyContent={"center"} sx={{ mt: 2 }}>
                {activeSell?.complete ? (
                  <LoadingButton
                    color="error"
                    fullWidth
                    loading={loading}
                    onClick={() => {
                      setLoading(true);
                      axiosClient
                        .get(`inventory/deduct/cancel/${activeSell.id}`)
                        .then(({ data }) => {
                          setRecieved(0);
                          update(data.data);
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
                    disabled={activeSell.deducted_items.length == 0}
                    fullWidth
                    loading={loading}
                    onClick={() => {
                        printHandler()
                      setLoading(true);
                      axiosClient
                        .get(
                          `inventory/deduct/complete/${activeSell.id}?is_sell=1`
                        )
                        .then(({ data }) => {
                          // printHandler();
                          try {
                            setDialog((prev) => {
                              return {
                                ...prev,
                                color: "success",
                                open: true,
                                message: "Sell completed successfully",
                              };
                            });
                            setRecieved(0);
                            setShift((prev) => {
                              return {
                                ...prev,
                                deducts: prev.deducts.map((d) => {
                                  if (d.id == activeSell.id) {
                                    return { ...activeSell, complete: 1 };
                                  } else {
                                    return d;
                                  }
                                }),
                              };
                            });
                            // console.log(data.data, "new active sell");
                            update(data.data);
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
                    Complete
                  </LoadingButton>
                )}

                <Divider />
              </Stack>
            </>
          )}
        </Card>
        <Box>
          <Stack direction={"column"} gap={2}>
            <Tooltip title="عمليه جديده">
              <LoadingButton
                sx={{ mt: 2 }}
                fullWidth
                loading={loading}
                onClick={() => {
                  setLoading(true);
                  axiosClient
                    .get(`inventory/deduct/new?is_sell=1`)
                    .then(({ data }) => {
                      try {
                        setRecieved(0);
                        update(data.data);
                      } catch (error) {
                        // console.log(error);
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
              >
                <Plus />
              </LoadingButton>
            </Tooltip>
            <Divider />
            {activeSell?.complete == 1 && (
              <IconButton onClick={printHandler}>
                <Print />
              </IconButton>
            )}

            {activeSell && (
              <IconButton
                onClick={() => {
                  axiosClient.get("print");
                }}
              >
                <LockOpen />
              </IconButton>
            )}
            <Divider />
          </Stack>
        </Box>
        {showDialogMoney && <SellsMoneyDialog />}
        <AddDrugDialog />
        <AddClientDialog
          loading={loading}
          setClients={setClients}
          setLoading={setLoading}
        />
      </div>
    </>
  );
}

export default SellDrug;
