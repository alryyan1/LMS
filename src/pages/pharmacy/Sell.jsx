import { useEffect, useRef, useState } from "react";
import { Item, webUrl } from "../constants";
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
} from "@mui/material";
import {
  Calculate,
  DeleteOutline,
  DeleteOutlineSharp,
  LockOpen,
  PersonAdd,
  Print,
} from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import { useOutletContext } from "react-router-dom";
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
// import Calculator from "../../components/calculator/Calculator";
function toFixed(num, fixed) {
  if (num == null) {
    return 0;
  }
  var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  return num.toString().match(re)[0];
}
function SellDrug() {
  const ref = useRef(null);
  const handleSymbol = (symbol, matchedSymbologies) => {
    // console.log(`Scanned ${symbol}`);
  };

  useSymbologyScanner(handleSymbol, { target: ref });
  const [loading, setLoading] = useState();
  const [userSettings, setUserSettings] = useState(null);
  const [clients, setClients] = useState([]);

  const [updater, setUpdater] = useState(0);
  const [recieved, setRecieved] = useState(0);
  const {
    setDialog,
    deduct,
    setDeduct,
    shift,
    shiftIsLoading,
    activeSell,
    setActiveSell,
    setShift,
    showDialogMoney,
    setShowDialogMoney,
    openClientDialog,
    setOpenClientDialog,
    setItemsTobeAddedToChache,
    itemsTobeAddedToChache,setItems,items
  } = useOutletContext();
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
  const [layOut, setLayout] = useState({
    form: "1fr",
    tests: "1fr",
    hideForm: false,
    testWidth: "400px",
    requestedDiv: "minmax(0,1.5fr)",
    showTestPanel: false,
    patientDetails: "0.7fr",
  });
  useEffect(() => {
    itemsTobeAddedToChache.map((id)=>{
    
        if (!items.map((i)=>i.id).includes(id) ) {
          axiosClient(`items/find/${id}`).then(({ data }) => {
              setItems((prev)=>{
                return [...prev, data];
              })
          })
        }
        if (items.find((i)=>i.id == id)?.lastDepositItem == null) {
            axiosClient(`items/find/${id}`).then(({ data }) => {
                setItems((prev)=>{
                   return prev.map((item)=>{
                     if(item.id == id){
                       return {...data };
                     }else{
                       return item;
                     }
                   })
                })
            })
          }
      
    })
    axiosClient(`client/all`).then(({ data }) => {
      setClients(data);
      // console.log(data);
    });
  }, []);
  // const hideForm = () => {
  //   setLayout((prev) => {
  //     return {
  //       ...prev,
  //       form: "0fr",
  //       hideForm: true,
  //       tests: "2fr",
  //       testWidth: "500px",
  //       showTestPanel: false,
  //       patientDetails: "0.7fr",
  //     };
  //   });
  // };
  // const showFormHandler = () => {
  //   setLayout((prev) => {
  //     return { ...prev, form: "1fr", hideForm: false, tests: "1fr" };
  //   });
  // };

  const showShiftMoney = () => {
    setShowDialogMoney(true);
  };
  useEffect(() => {
    document.title = "Sales";
  }, []);

  return (
    <>
      <div
        style={{
          userSelect: "none",
          gap: "15px",
          transition: "0.3s all ease-in-out",
          display: "grid",
          gridTemplateColumns: `0.1fr  1fr  2fr 0.5fr 0.1fr      `,
        }}
      >
                

        <div style={{ marginRight: "65px" }}></div>
        {activeSell && (
          <AddDrugAutocomplete
            key={activeSell?.id}
            setLoading={setLoading}
            loading={loading}
            setUpdater={setUpdater}
          />
        )}
      </div>
      <div
        style={{
          userSelect: "none",
          gap: "15px",
          marginTop: "5px",
          transition: "0.3s all ease-in-out",
          height: "75vh",
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
            <Item>
              <IconButton variant="contained" onClick={showShiftMoney}>
                <Calculate />
              </IconButton>
            </Item>
            <Item>
              <IconButton
                href={`${webUrl}pharmacy/sellsReport?shift_id=${shift?.id}`}
                variant="contained"
              >
                <DescriptionIcon />
              </IconButton>
            </Item>
          </Stack>
        </div>
        

        <Card sx={{ p: 1, height: "80vh", overflow: "auto" ,backgroundColor: "#ffffff73" ,}}>
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
                .map((p, i) => (
                  <SellBox
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
        <Card  sx={{ p: 1 , backgroundColor: "#ffffff73" }} style={{ overflow: "auto" }}>
          {activeSell && (
            <>
              <Stack direction={"row"} alignContent={"center"}>
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
                          setShift={setShift}
                          setDialog={setDialog}
                          path={`deduct/${activeSell?.id}`}
                          colName={"is_postpaid"}
                          isChecked={activeSell?.is_postpaid}
                        />
                      }
                    ></FormControlLabel>
                  </FormGroup>
                )}
              </Stack>

              {shiftIsLoading ? (
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width={"100%"}
                  height={400}
                />
              ) : (
                <Table className="white" key={updater} size="small">
                  <thead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Strips</TableCell>
                      <TableCell>Box</TableCell>
                      <TableCell>Subtotal</TableCell>
                      <TableCell width={"5%"}>action</TableCell>
                      <TableCell>Expire</TableCell>
                      <TableCell>Inventory</TableCell>
                    </TableRow>
                  </thead>
                  <TableBody>
                    {activeSell?.deducted_items?.map((deductedItem) => (
                      <TableRow
                        sx={{
                          background: (theme) => {
                            return !dayjs(
                              deductedItem?.item?.lastDepositItem?.expire
                            ).isAfter(dayjs())
                              ? theme.palette.error.light
                              : theme.palette.background.defaultLight;
                          },
                          fontWeight: "500",
                        }}
                        key={deductedItem.id}
                      >
                        <TableCell><span style={{    
          color: "black",
          fontSize: "large",
          fontWeight: "bolder",
        }}>{deductedItem.item?.market_name}</span></TableCell>
                   
                        <TableCell>
                          {" "}
                          {Number(
                            deductedItem?.item.lastDepositItem?.finalSellPrice
                          ).toFixed(3)}
                        </TableCell>

                        {activeSell.complete ? (
                          <TableCell> {deductedItem.strips}</TableCell>
                        ) : (
                          <MyTableCell
                            stateUpdater={setUpdater}
                            setData={setActiveSell}
                            sx={{ width: "70px" }}
                            type={"number"}
                            item={deductedItem}
                            table="deductedItem"
                            colName={"strips"}
                            setShift={setShift}
                          >
                            {deductedItem.strips}
                          </MyTableCell>
                        )}
                        {activeSell.complete ? (
                          <TableCell>{toFixed(deductedItem.box, 3)}</TableCell>
                        ) : (
                          <MyTableCell
                            stateUpdater={setUpdater}
                            setData={setActiveSell}
                            setShift={setShift}
                            sx={{ width: "70px" }}
                            type={"number"}
                            item={deductedItem}
                            table="deductedItem"
                            colName={"box"}
                          >
                            {toFixed(deductedItem.box, 3)}
                          </MyTableCell>
                        )}
                        <TableCell>
                          {toFixed(
                            (deductedItem.price / deductedItem.item?.strips) *
                              deductedItem.strips,
                            3
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
                                  setActiveSell(data.data);
                                  setShift(data.shift);
                                });
                            }}
                          >
                            <DeleteOutlineSharp />
                          </LoadingButton>
                        </TableCell>
                        
                        <TableCell>
                        <MyDateField2
                      val={deductedItem?.item.lastDepositItem?.expire}
                      item={deductedItem?.item.lastDepositItem}
                    />
                        </TableCell>
                        <TableCell>
                          <CalculateInventory item_id={deductedItem.item.id}/>
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
             backgroundColor: "#ffffff73" ,
            p: 1,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          {activeSell && (
            <>
              <Typography textAlign={"center"}>
                Transaction No {activeSell?.id}
              </Typography>
              <Typography className="text-gray-500" textAlign={"center"}>
                 Date {dayjs(new Date(activeSell?.created_at)).format('YYYY/MM/DD H:m A')}
              </Typography>
              <Divider />
              {activeSell && <PayOptions key={activeSell.id} />}
              <Divider />
              <Card
                sx={{
                  borderRadius: 10,
                  width: "150px",
                  textAlign: "center",
                  height: "120px",
                }}
              >
                <CardContent>
                  <Stack direction={"row"} justifyContent={"center"}>
                    <Stack
                      justifyContent={"space-between"}
                      direction={"column"}
                    >
                      <Typography textAlign={"right"} variant="h5">
                        Total
                      </Typography>
                      <Divider />
                      {activeSell && (
                        <Typography variant="h6">
                          {Number(activeSell?.total_price_unpaid).toFixed(3)}
                        </Typography>
                      )}
                    </Stack>
                    <Stack
                      direction={"column"}
                      justifyContent={"center"}
                    ></Stack>
                  </Stack>
                </CardContent>
              </Card>
              <Card
                sx={{
                  borderRadius: 10,
                  width: "150px",
                  mt: 2,
                  height: "120px",
             backgroundColor: "#ffffff73" ,

                }}
              >
                <CardContent>
                  <Stack direction={"row"} justifyContent={"center"}>
                    <Stack
                      justifyContent={"space-between"}
                      direction={"column"}
                    >
                      <Typography>Discount</Typography>
                      <Divider />

                      <TextField key={activeSell?.id}
                        defaultValue={activeSell?.discount}
                        onChange={(e) => {
                          setRecieved(e.target.value);
                          axiosClient
                            .patch(`deduct/${activeSell.id}`, {
                              colName: "discount",
                              val: e.target.value,
                            })
                            .then(({ data }) => {
                              setActiveSell(data.data);
                          setShift(data.shift);


                            });
                        }}
                        variant="standard"
                      ></TextField>
                    </Stack>
                    <Stack
                      direction={"column"}
                      justifyContent={"center"}
                    ></Stack>
                  </Stack>
                </CardContent>
              </Card>
              <Card
                sx={{
             backgroundColor: "#ffffff73" ,

                  borderRadius: 10,
                  width: "150px",
                  mt: 2,
                  height: "120px",
                }}
              >
                <CardContent>
                  <Stack direction={"row"} justifyContent={"center"}>
                    <Stack
                      justifyContent={"space-between"}
                      direction={"column"}
                    >
                      <Typography>Balance</Typography>
                      <Divider />

                      <Typography variant="h6">
                        {(
                          Number(activeSell?.total_price_unpaid) -
                          Number(activeSell?.discount)
                        ).toFixed(3)}
                      </Typography>
                    </Stack>
                    <Stack
                      direction={"column"}
                      justifyContent={"center"}
                    ></Stack>
                  </Stack>
                </CardContent>
              </Card>
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
                          setActiveSell(data.data);
                          setShift(data.shift);
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
                      setLoading(true);
                      axiosClient
                        .get(
                          `inventory/deduct/complete/${activeSell.id}?is_sell=1`
                        )
                        .then(({ data }) => {
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
                            // console.log(data.data, "new active sell");
                            setActiveSell(data.data);
                            setShift(data.shift);
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
                      setActiveSell(data.data);
                      setShift(data.shift);
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
              variant="contained"
            >
              <AddIcon />
            </LoadingButton>
            <Divider />
            {activeSell?.complete == 1 && (
              <IconButton
                onClick={() => {
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
                }}
              >
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
        <SellsMoneyDialog />
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
