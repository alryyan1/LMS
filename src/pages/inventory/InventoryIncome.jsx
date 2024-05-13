import {
  Alert,
  Autocomplete,
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { url } from "../constants.js";
import { Controller, useForm } from "react-hook-form";
import { Link, useLoaderData, useOutletContext } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Delete, FindInPageSharp, Flare } from "@mui/icons-material";
import axiosClient from "../../../axios-client.js";

function InventoryIncome() {
  const items = useLoaderData();

  const [layOut, setLayout] = useState({
    addToInventoryStyleObj:{},
    incomeItemsStyleObj:{},
  });
  // console.log(items);
  //create state variable to store all suppliers
  const {dialog, setDialog} = useOutletContext();
  const [suppliers, setSuppliers] = useState([]);
  const [incomeItems, setIncomeItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [income, setIncome] = useState(null);
  const [update, setUpdate] = useState(0);
  console.log(income, "is equal to null", income === null);
  console.log(show, "show");
  const {
    setValue,
    register,
    reset,
    control,
    formState: {
      errors,
      isSubmitting,
      isSubmitSuccessful: isSubmitSuccessful1,
    },
    handleSubmit,
  } = useForm();
  const {
    register: register2,
    control: control2,
    formState: { errors: errors2, isSubmitSuccessful },
    handleSubmit: handleSubmit2,
  } = useForm();
  useEffect(() => {
    axiosClient.get("inventory/deposit/last").then(({ data: data }) => {
      if (data != "") {
        console.log(data, "is data");
        setIncome(data);
        console.log(data);
        setLayout((prev)=>{
          return {
           ...prev,
            incomeItemsStyleObj: {gridColumnStart:1,gridRowStart:1,gridColumnEnd:3},
            addToInventoryStyleObj: {gridColumnStart:3},
          }
        })
        setIncomeItems(data.items);
        if (data.complete) {
          setLayout((prev)=>{
            return {...prev,incomeItemsStyleObj:{},addToInventoryStyleObj:{}}
           
         })
          setShow(true)
        }
      }else{
        setShow(true)
      }
    });
  }, [isSubmitSuccessful, isSubmitSuccessful1, update]);
  const finishInvoice = (id) => {
    setLoading(true);
    axiosClient
      .patch(`inventory/deposit/finish/${id}`)
      .then(({ data }) => {
        console.log(data);
        if (data.status) {
          setShow(true);
          setLayout((prev)=>{
             return {...prev,incomeItemsStyleObj:{},addToInventoryStyleObj:{}}
            
          })

          console.log("set updating function");
          setUpdate((pev) => pev + 1);
          setDialog({
            open: true,
            msg: "تمت العمليه  بنجاح",
          });
        }
      })
      .finally(() => setLoading(false));
  };
  const submitHandler = async (formData) => {
    const payload = {
      item_id: formData.item.id,
      quantity: formData.amount,
      price: formData.price,
      expire: formData.expire.$d.toJSON(),
      notes: formData.notes,
      barcode: formData.barcode,
      batch: formData.batch,
    };
    console.log(formData);
    console.log(formData.expire.$d.toJSON());
    setLoading(true);
    console.log(isSubmitting);
    axiosClient
      .post(`inventory/deposit`, payload)
      .then((data) => {
        console.log(data);
        setLoading(false);
        if (data.status) {
          setLoading(false);
          reset();
          setValue("expire", dayjs(new Date()));
          setDialog({
            open: true,
            msg: "تمت الاضافه  بنجاح",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteIncomeItemHandler = (id) => {
    setLoading(true);
    fetch(`${url}inventory/deposit`, {
      headers: {
        "content-type": "appliction/json",
        accept: "application/json",
      },
      body: JSON.stringify({ item_id: id }),
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setLoading(false);
          //delete supplier by id
          setIncomeItems(incomeItems.filter((item) => item.id != id));
          //show success dialog
          setDialog({
            open: true,
            msg: "تم الحذف بنجاح",
          });
        }
      });
  };
  useEffect(() => {
    //fetch all suppliers
    fetch(`${url}suppliers/all`)
      .then((res) => res.json())
      .then((data) => {
        //set suppliers
        setSuppliers(data);
        // console.log(data);
      });
  }, []);

  const newInvoiceHandler = (formData) => {
    setLoading(true);
    axiosClient
      .post(`inventory/deposit/complete`, {
        bill_date: formData.bill_date.$d.toJSON(),
        bill_number: formData.bill_number,
        supplier_id: formData.supplier.id,
      })
      .then((data) => {
        if (data.status) {
          setShow(false);
          setLayout((prev)=>{
            return {
             ...prev,
              incomeItemsStyleObj: {gridColumnStart:1,gridRowStart:1,gridColumnEnd:3},
              addToInventoryStyleObj: {gridColumnStart:1},
            }
          })

          setUpdate((previous) => previous + 1);
          setLoading(false);
          //show success dialog
          setDialog({
            open: true,
            msg: "تمت العمليه  بنجاح",
          });
        }
        console.log(data, "deposit complete");
      });
  };
  return (
    <div
      style={{
        gap: "15px",
        transition: "0.3s all ease-in-out",
        height: "90vh",
        display: "grid",
        gridTemplateColumns: `  1fr     1fr   1fr    `,
      }}
    >
      <div style={layOut.addToInventoryStyleObj}>
        {income && !income?.complete ? (
          <Paper sx={{p:1}} >
            <Typography
              sx={{ fontFamily: "Tajawal-Regular", textAlign: "center", mb: 1 }}
              variant="h5"
            >
              اضافه للمخزون
            </Typography>
            <form noValidate onSubmit={handleSubmit(submitHandler)}>
              <Grid container>
                <Grid sx={{ gap: "5px" }} item xs={6}>
                  <TextField
                    {...register("batch")}
                    sx={{ mb: 1 }}
                    label={"الباتش"}
                  ></TextField>
                  <TextField
                    {...register("barcode")}
                    sx={{ mb: 1 }}
                    label={"الباركود"}
                  ></TextField>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                      defaultValue={dayjs(new Date())}
                      rules={{
                        required: {
                          value: true,
                          message: "يجب ادخال تاريخ الانتهاء",
                        },
                      }}
                      control={control}
                      name="expire"
                      render={({ field }) => (
                        <DateField
                          {...field}
                          value={field.value}
                          onChange={(val) => field.onChange(val)}
                          sx={{ mb: 1 }}
                          label="تاريخ الانتهاء"
                        />
                      )}
                    />
                  </LocalizationProvider>
                  <TextField
                    multiline
                    rows={3}
                    {...register("notes")}
                    sx={{ mb: 1 }}
                    label={"الملاحظات"}
                  ></TextField>
                </Grid>
                <Grid item xs={6}>
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
                          sx={{ mb: 1 }}
                          {...field}
                          value={field.value || null}
                          options={items}
                          isOptionEqualToValue={(option, val) =>
                            option.id === val.id
                          }
                          getOptionLabel={(option) => option.name}
                          onChange={(e, data) => field.onChange(data)}
                          renderInput={(params) => {
                            return <TextField label={"الصنف"} {...params} />;
                          }}
                        ></Autocomplete>
                      );
                    }}
                  />
                  {errors.item && errors.item.message}

                  <div >
                    <TextField
                      fullWidth
                      sx={{ mb: 1 }}
                      error={errors.amount}
                      {...register("amount", {
                        required: { value: true, message: "يجب ادخال الكميه" },
                      })}
                      id="outlined-basic"
                      label="الكميه"
                      variant="filled"
                    />
                    {errors.amount && errors.amount.message}
                  </div>
                  <div>
                    <TextField
                      sx={{ mb: 1 }}
                      fullWidth
                      error={errors.price}
                      {...register("price", {
                        required: {
                          value: true,
                          message: "يجب ادخال السعر",
                        },
                      })}
                      id="outlined-basic"
                      label="سعر الوحده"
                      variant="filled"
                    />
                    {errors.price && errors.price.message}
                  </div>
                </Grid>
                <LoadingButton
                  fullWidth
                  loading={loading}
                  variant="contained"
                  type="submit"
                >
                  اضافه للمخزون
                </LoadingButton>
              </Grid>
            </form>
          </Paper>
        ) : (
          ""
        )}
      </div>
      <div style={layOut.incomeItemsStyleObj}>
        <Link to={"/inventory/reports/income"}>reports</Link>

        {/* create table with all suppliers */}
        {!show &&  incomeItems.length > 0 &&
          <TableContainer>
            <Typography align="center" variant="h4" sx={{ mb: 1 }}>
              {income.supplier.name}
            </Typography>
            <Table dir="rtl" size="small">
              <thead>
                <TableRow>
                  <TableCell>رقم</TableCell>
                  <TableCell>الصنف</TableCell>
                  <TableCell>الكميه</TableCell>
                  <TableCell>السعر</TableCell>
                  <TableCell>الاجمالي</TableCell>
                  <TableCell>حذف</TableCell>
                </TableRow>
              </thead>

              <TableBody>
                {incomeItems.map((income, i) => (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{income.name}</TableCell>
                    <TableCell>{income.pivot.quantity}</TableCell>
                    <TableCell>{income.pivot.price}</TableCell>
                    <TableCell>
                      {income.pivot.quantity * income.pivot.price}
                    </TableCell>
                    <TableCell>
                      <LoadingButton
                        loading={loading}
                        title="حذف"
                        endIcon={<Delete />}
                        onClick={() => {
                          deleteIncomeItemHandler(income.id);
                        }}
                      ></LoadingButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <LoadingButton
              loading={loading}
              color="success"
              variant="contained"
              sx={{ mt: 1 }}
              onClick={() => {
                finishInvoice(income.id);
              }}
            >
              انهاء الفاتوره
            </LoadingButton>
          </TableContainer>
        
            }
    
      </div>
      <div>
      {show && (
          <form
            style={{ margin: "5px" }}
            noValidate
            onSubmit={handleSubmit2(newInvoiceHandler)}
          >
            <Typography variant="h3" align="center">
              انشاء فاتوره جديده
            </Typography>
            <Grid container>
              <Grid item xs={3}></Grid>

              <Grid item xs={6}>
                <div>
                  <Controller
                    name="supplier"
                    rules={{
                      required: {
                        value: true,
                        message: "يجب اختيار المورد",
                      },
                    }}
                    control={control2}
                    render={({ field }) => {
                      return (
                        <Autocomplete
                          isOptionEqualToValue={(option, val) =>
                            option.id === val.id
                          }
                          sx={{ mb: 1 }}
                          {...field}
                          value={field.value || null}
                          options={suppliers}
                          getOptionLabel={(option) => option.name}
                          onChange={(e, data) => field.onChange(data)}
                          renderInput={(params) => {
                            return <TextField label={"المورد"} {...params} />;
                          }}
                        ></Autocomplete>
                      );
                    }}
                  />
                  {errors2.supplier && errors2.supplier.message}
                </div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    defaultValue={dayjs(new Date())}
                    rules={{
                      required: {
                        value: true,
                        message: "يجب ادخال تاريخ الفاتوره",
                      },
                    }}
                    control={control2}
                    name="bill_date"
                    render={({ field }) => (
                      <DateField
                        fullWidth
                        {...field}
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                        sx={{ mb: 1 }}
                        label="تاريخ الفاتوره"
                      />
                    )}
                  />
                </LocalizationProvider>
                <TextField
                  fullWidth
                  error={errors2.bill_number != null}
                  sx={{ mb: 1 }}
                  variant="filled"
                  {...register2("bill_number", {
                    required: {
                      value: true,
                      message: "يجب ادخال رقم الفاتوره",
                    },
                  })}
                  label="رقم الفاتوره"
                ></TextField>

                {errors2.bill_number && (
                  <Alert color="error" sx={{ textAlign: "right" }}>
                    {errors2.bill_number.message}
                  </Alert>
                )}
                <LoadingButton
                  type="submit"
                  loading={loading}
                  sx={{ mt: 1 }}
                  color="success"
                  variant="contained"
                  fullWidth
                >
                  انشاء
                </LoadingButton>
              </Grid>
              <Grid item xs={3}></Grid>
            </Grid>
          </form>
        )}
      </div>
    </div>
  );
}

export default InventoryIncome;
