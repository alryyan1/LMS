import { useEffect, useState } from "react";
import { Item, webUrl } from "../constants";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";

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
} from "@mui/material";
import {
  Calculate,
  DeleteOutline,
  DeleteOutlineSharp,
  Print,
} from "@mui/icons-material";
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

function SellDrug() {
  const [loading, setLoading] = useState();

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
    showDialogMoney, setShowDialogMoney
  } = useOutletContext();
  console.log(shift, "shift");
  console.log(activeSell, "active sell");
  useEffect(() => {
    //fetch all suppliers
    axiosClient(`inventory/deduct/last`).then(({ data }) => {
      console.log(data, "deduct");
      setDeduct(data);
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

  const hideForm = () => {
    setLayout((prev) => {
      return {
        ...prev,
        form: "0fr",
        hideForm: true,
        tests: "2fr",
        testWidth: "500px",
        showTestPanel: false,
        patientDetails: "0.7fr",
      };
    });
  };
  const showFormHandler = () => {
    setLayout((prev) => {
      return { ...prev, form: "1fr", hideForm: false, tests: "1fr" };
    });
  };

  const showShiftMoney = () => {
   setShowDialogMoney(true);
  };
  useEffect(() => {
    document.title = "المبيعات";
  }, []);

  let total = activeSell?.deducted_items?.reduce(
    (prev, current) => prev + current.strips * current.item.sell_price,
    0
  );
  return (
    <>
      <div
        style={{
          gap: "15px",
          transition: "0.3s all ease-in-out",
          height: "75vh",
          display: "grid",
          gridTemplateColumns: `0.1fr  1fr  2fr 1fr 0.1fr      `,
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
              <IconButton href={`${webUrl}lab/report`} variant="contained">
                <Print />
              </IconButton>
            </Item>
          </Stack>
        </div>
        <div>
          <AddDrugAutocomplete setUpdater={setUpdater} />
          <div className="patients" style={{ padding: "15px" }}>
            {shiftIsLoading ? (
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={"100%"}
                height={400}
              />
            ) : (
              shift?.deducts.map((p, i) => (
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
        </div>
        <div style={{ overflow: "auto" }}>
          <Table key={updater} size="small">
            <thead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Strips</TableCell>
                <TableCell>Box</TableCell>
                <TableCell>Subtotal</TableCell>
                <TableCell width={"5%"}>action</TableCell>
              </TableRow>
            </thead>
            <TableBody>
              {activeSell?.deducted_items?.map((deductedItem) => (
                <TableRow key={deductedItem.id}>
                  <TableCell>{deductedItem.item?.market_name}</TableCell>
                  <TableCell>{deductedItem.item?.sell_price}</TableCell>
                  <MyTableCell
                    stateUpdater={setUpdater}
                    setData={setDeduct}
                    sx={{ width: "70px" }}
                    type={"number"}
                    item={deductedItem}
                    table="deductedItem"
                    colName={"strips"}
                  >
                    {deductedItem.strips}
                  </MyTableCell>
                  <MyTableCell
                    stateUpdater={setUpdater}
                    setData={setDeduct}
                    sx={{ width: "70px" }}
                    type={"number"}
                    item={deductedItem}
                    table="deductedItem"
                    colName={"box"}
                  >
                    {deductedItem.box}
                  </MyTableCell>
                  <TableCell>
                    {deductedItem.item?.sell_price * deductedItem.strips}
                  </TableCell>
                  <TableCell>
                    <LoadingButton
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Box
          sx={{
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
              <Typography variant="h5" textAlign={"center"}>
                {" "}
                Transaction No {activeSell?.id}
              </Typography>
              <Divider/>
              {activeSell &&  <PayOptions/> }
              <Divider/>
              <Card
                sx={{
                  borderRadius: 10,
                  width: "200px",
                  textAlign: "center",
                  height: "130px",
                }}
              >
                <CardContent>
                  <Stack direction={"row"} justifyContent={"center"}>
                    <Stack
                      justifyContent={"space-between"}
                      direction={"column"}
                    >
                      <Typography>Total</Typography>
                      <Divider />
                      {activeSell && (
                        <Typography variant="h3">
                          {activeSell?.deducted_items?.reduce(
                            (prev, current) =>
                              prev + current.strips * current.item.sell_price,
                            0
                          )}
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
                  width: "200px",
                  mt: 2,
                  height: "130px",
                }}
              >
                <CardContent>
                  <Stack direction={"row"} justifyContent={"center"}>
                    <Stack
                      justifyContent={"space-between"}
                      direction={"column"}
                    >
                      <Typography>Recieved</Typography>
                      <Divider />
                    
                        <TextField
                          value={recieved}
                          type="number"
                          onChange={(e) => {
                            setRecieved(e.target.value);
                            axiosClient
                              .patch(`deduct/${activeSell.id}`, {
                                colName: "total_amount_received",
                                val: e.target.value,
                              })
                              .then(({ data }) => {
                                setActiveSell(data.data);
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
                  borderRadius: 10,
                  width: "200px",
                  mt: 2,
                  height: "130px",
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
                    
                        <Typography variant="h3">
                          {" "}
                          {total > 0 &&
                            activeSell.total_amount_received - total}
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
                          setShift(data.shift)
                        })
                        .catch(({ response: { data } }) => {
                          console.log({ data });
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
                    fullWidth
                    loading={loading}
                    onClick={() => {
                      setLoading(true);
                      axiosClient
                        .get(`inventory/deduct/complete/${activeSell.id}`)
                        .then(({ data }) => {
                          try{
                            setRecieved(0);
                            console.log(data.data,'new active sell')
                            setActiveSell(data.data);
                            setShift(data.shift)
                          }catch(e) {
                              console.log(e)
                          }
                      
                        })
                        .catch(({ response: { data } }) => {
                          console.log({ data });
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
         
        </Box>
        <Box>
         <Stack>
              <LoadingButton
                  sx={{ mt: 2 }}
                  fullWidth
                  loading={loading}
                  onClick={() => {
                    setLoading(true);
                    axiosClient
                      .get(`inventory/deduct/new`)
                      .then(({ data }) => {
                        try {
                          setRecieved(0);
                          setActiveSell(data.data);
                          setShift(data.shift);
                        } catch (error) {
                          console.log(error)
                        }
                      
                      })
                      .catch(({ response: { data } }) => {
                        console.log({ data });
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
           </Stack>

        </Box>
        <SellsMoneyDialog/>
      </div>
    </>
  );
}

export default SellDrug;