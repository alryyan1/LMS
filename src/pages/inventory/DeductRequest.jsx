import {
  Autocomplete,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";

import { Item, url, webUrl } from "../constants.js";
import { Controller, useForm } from "react-hook-form";
import { Link, useLoaderData, useOutletContext } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { Delete, DeleteOutline, Download } from "@mui/icons-material";
import axiosClient from "../../../axios-client.js";
import dayjs from "dayjs";
import axios from "axios";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";

function DeductRequest() {
  // console.log(items);
  //create state variable to store all suppliers
  const { dialog, setDialog } = useOutletContext();
  const [selectedItem,setSelectedItem]=useState(null)
  const [deduct, setDeduct] = useState(null);
  const [deducts, setDeducts] = useState([]);
  const [items, setItems] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deductComplete, setDeductComplete] = useState(1);
  const [layout, setLayout] = useState({
    addItemToDepositFrm: "0fr",
    showAddItemToDepositFrm: false,
    deductedItemTable: "0fr",
    showDeductedItemTable: false,
  });
  const {
    register,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitted },
    handleSubmit,
  } = useForm();
  useEffect(() => {
    //fetch all clients
    axiosClient(`client/all`).then(({ data }) => {
      setClients(data);
      console.log(data);
    });
  }, []);
  const submitHandler = async (formData) => {
    console.log(formData);
    // console.log(formData.expire.$d.toLocaleDateString());
    setLoading(true);
    axiosClient
      .post(`addToDeduct/${deduct.id}`, {
        item_id: formData.item.id,
        box: formData.amount,
        client_id: formData.client.id,
      })
      .then((data) => {
        console.log(data);
        setLoading(false);
        if (data.status) {
          setLoading(false);
          reset();
          setDeduct(data.data.deduct);
          setDialog({
            open: true,
            message: "تمت الاضافه  بنجاح",
          });
        }
      })
      .catch(({ response: { data } }) => {
        setLoading(false);
        console.log(data);
        setDialog({
          color: "error",
          open: true,
          message: data.message,
        });
      });
  };

  useEffect(() => {
    const date = dayjs();
    const firstDayjs = date.format("YYYY/MM/DD");
    const secondDayjs = date.format("YYYY/MM/DD");
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
  }, []);

  useEffect(() => {
    document.title = "اذن طلب";
  }, []);
  useEffect(() => {
    //fetch all suppliers
    fetch(`${url}inventory/deduct/last`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "deduct");
        setDeduct(data);
      });
  }, []);
  useEffect(() => {
    axiosClient.get("items/all/withItemRemaining").then(({ data }) => {
      setItems(data);
    });
  }, []);

  const showAddItemToDepositFrm = () => {
    setLayout((prev) => {
      return {
        ...prev,
        addItemToDepositFrm: "1fr",
        showAddItemToDepositFrm: true,
      };
    });
  };
  const hideAddItemToDepositFrm = () => {
    setLayout((prev) => {
      return {
        ...prev,
        addItemToDepositFrm: "0fr",
        showAddItemToDepositFrm: false,
      };
    });
  };
  const showDeductedItemTable = () => {
    setLayout((prev) => {
      return {
        ...prev,
        deductedItemTable: "1fr",
        showDeductedItemTable: true,
      };
    });
  };
  const hideDeductedItemTable = () => {
    setLayout((prev) => {
      return {
        ...prev,
        deductedItemTable: "0fr",
        showDeductedItemTable: false,
      };
    });
  };

  return (
    <div
      style={{
        marginTop: "5px",
        gap: "15px",
        transition: "0.3s all ease-in-out",
        display: "grid",
        gridTemplateColumns: `0.1fr 1.5fr  ${layout.deductedItemTable}  ${layout.addItemToDepositFrm}        `,
      }}
    >
      <Stack direction={"column"} gap={2}>
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
                  setDeduct(data.data);
                  setDeducts((prv) => {
                    return [data.data, ...prv];
                  });
                } catch (error) {
                  console.log(error);
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
        <Item>
          <IconButton
            onClick={() => {
              showAddItemToDepositFrm();
            }}
            variant="contained"
          >
            <CreateOutlinedIcon />
          </IconButton>
        </Item>
        <Item>
          <IconButton onClick={() => {}} variant="contained">
            <Download />
          </IconButton>
        </Item>
      </Stack>
      <Paper sx={{ p: 1 }}>
        <TableContainer>
          <Typography textAlign={'center'}>طلبات الصرف</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>رقم</TableCell>
                <TableCell>التاريخ</TableCell>
                <TableCell>عدد </TableCell>
                <TableCell>التقرير </TableCell>
                <TableCell>حذف </TableCell>
                <TableCell>- </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deducts.map((d, i) => (
                <TableRow
                  sx={{
                    backgroundColor: (theme) => {
                      return d.id == deduct?.id
                        ? theme.palette.warning.light
                        : "";
                    },
                  }}
                  key={i}
                >
                  <TableCell>{d.number}</TableCell>
                  <TableCell>
                    {dayjs(d.created_at).format("YYYY/MM/DD H:m A")}
                  </TableCell>
                  <TableCell>{d.deducted_items.length}</TableCell>
                  <TableCell>
                    {" "}
                    <a href={`${webUrl}deduct/report?id=${d.id}`}>pdf</a>
                  </TableCell>
                  <TableCell>
                    <LoadingButton
                      loading={loading}
                      onClick={() => {
                        setLoading(true);
                        let result = confirm("هل انت متاكد حذف العمليه");
                        if (result) {
                          axiosClient
                            .delete(`deduct/${d.id}`)
                            .then(({ data }) => {
                              console.log(data);
                              setDeducts((prev) => {
                                return prev.filter((de) => de.id !== d.id);
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
                        }
                      }}
                    >
                      <DeleteOutline />
                    </LoadingButton>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        console.log(d);
                    //    hideAddItemToDepositFrm();
                        setDeduct(d);
                        showDeductedItemTable();
                      }}
                    >
                      اختيار
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      

      <div>
        <Link to={"/inventory/reports/deduct"}>reports</Link>

        {layout.showAddItemToDepositFrm && (
          <>
          <Paper sx={{ p: 1 }}>
            <Typography
              sx={{  textAlign: "center", mb: 1 }}
              variant="h5"
            >
              طلب من المخزن
            </Typography>

            <form noValidate onSubmit={handleSubmit(submitHandler)}>
              <Stack direction={"column"} gap={2}>
                <Controller
                  name="item"
                  rules={{
                    required: {
                      value: true,
                      message: "يجب اختيار الصنف",
                    },
                  }}
                  control={control}
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        renderOption={(props, option) => {
                          return (
                            <li {...props} key={option.id}>
                              {option.market_name}
                            </li>
                          );
                        }}
                        getOptionDisabled={(option) => option.remaining <= 0}
                        sx={{ mb: 1 }}
                        {...field}
                        value={selectedItem}
                        options={items}
                        
                        getOptionLabel={(option) => option.market_name}
                        onChange={(e, data) => field.onChange(data)}
                        renderInput={(params) => {
                          return (
                            <TextField

                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                console.log("enter pressed");
                              
                                  
                                //get test from tests using find
                                const barcode = e.target.value.trim();
                                const itemFounded =  items.find((item)=>{
                                  return item.barcode?.trim() === barcode
                                })
                                console.log(itemFounded,'founed')
                                if (itemFounded ) {
                                 
                                 setValue('item',itemFounded)
                                 setSelectedItem(itemFounded)
                                 console.log(itemFounded)
                               
                                  // setSelectedDrugs((prev)=>{
                                  //   console.log(prev)
                                  //   return [...prev, itemFounded]
                                  // })
                                }
          
                              
                              }
                            }}

                              helperText={errors.item && errors.item.message}
                              error={errors.item}
                              label={"الصنف"}
                              {...params}
                            />
                          );
                        }}
                      ></Autocomplete>
                    );
                  }}
                />

                <Controller
                  name="client"
                  rules={{
                    required: {
                      value: true,
                      message: "يجب اختيار العميل",
                    },
                  }}
                  control={control}
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        {...field}
                        value={field.value || null}
                        options={clients}
                        isOptionEqualToValue={(option, val) =>
                          option.id === val.id
                        }
                        getOptionLabel={(option) => option.name}
                        onChange={(e, data) => field.onChange(data)}
                        renderInput={(params) => {
                          return (
                            <TextField
                              helperText={
                                errors.client && errors.client.message
                              }
                              error={errors.client}
                              label={"العميل"}
                              {...params}
                            />
                          );
                        }}
                      ></Autocomplete>
                    );
                  }}
                />

                <TextField
            
                  fullWidth
                  error={errors.amount}
                  {...register("amount", {
                    required: { value: true, message: "يجب ادخال الكميه" },
                  })}
                  id="outlined-basic"
                  label="الكميه"
                  variant="outlined"
                  type="number"
                  helperText={errors.amount && errors.amount.message}
                />
               

                <LoadingButton
                  fullWidth
                  loading={loading}
                  variant="contained"
                  type="submit"
                >
                  طلب
                </LoadingButton>
              </Stack>
            </form>

           
          </Paper>
           <Divider></Divider>
           <TextField       onChange={(e)=>{
                    axiosClient.patch(`deduct/${deduct.id}`,{colName:'notes',val:e.target.value}).then(({data})=>{
                      console.log(data)
                    })
                  }} sx={{mt:2}}
                
                 rows={5}
                 multiline
                 label="الملاحظات"
                 variant="filled"
                 fullWidth
               ></TextField>
          </>
          
        )}
      </div>
      <div>
        {layout.showDeductedItemTable && (
          <Paper sx={{ p: 1 }}>
            <Typography sx={{ m: 1 }} variant="h5" textAlign={"center"}>
              {deduct && deduct.id} اذن طلب رقم
            </Typography>
            {/* create table with all suppliers */}
            <TableContainer>
              <Table sx={{ mb: 2 }} dir="rtl" size="small">
                <thead>
                  <TableRow>
                    <TableCell>رقم</TableCell>
                    <TableCell>الصنف</TableCell>
                    <TableCell>العميل</TableCell>
                    <TableCell>الكميه</TableCell>
                  </TableRow>
                </thead>

                <TableBody>
                  {deduct &&
                    deduct.deducted_items.map((deductedItem, i) => (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{deductedItem.item.market_name}</TableCell>
                        <TableCell>{deductedItem?.client?.name}</TableCell>
                        <TableCell>{deductedItem.box}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </div>
    </div>
  );
}

export default DeductRequest;
