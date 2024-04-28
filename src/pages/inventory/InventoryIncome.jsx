import {
  Autocomplete,
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
import { useLoaderData, useOutletContext } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import {
  DateField,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Delete } from "@mui/icons-material";

function InventoryIncome() {
  const items = useLoaderData();
  // console.log(items);
  //create state variable to store all suppliers
  const [openSuccessDialog, setOpenSuccessDialog] = useOutletContext()
  const [suppliers, setSuppliers] = useState([]);
  const [incomeItems, setIncomeItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [incomeComplete, setIncomeComplete] = useState(1);
  const {
    setValue,
    register,
    reset,
    control,
    formState: { errors, isSubmitting, isSubmitted  },
    handleSubmit,
  } = useForm();
  console.log(isSubmitting);
  const submitHandler = async (formData) => {
    console.log(formData);
    console.log(formData.expire.$d.toJSON());
    setLoading(true);
    console.log(isSubmitting)
    fetch(`${url}inventory/deposit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        supplier_id: formData.supplier.id,
        item_id: formData.item.id,
        quantity: formData.amount,
        price: formData.price,
        expire: formData.expire.$d.toJSON(),
        notes: formData.notes,
        barcode: formData.barcode,
        batch: formData.batch,

      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setLoading(false)
        if (data.status) {
          
          setLoading(false);
          reset();
          setValue('expire',dayjs(new Date()))
          setOpenSuccessDialog({
            open: true,
            msg: "تمت الاضافه  بنجاح",
          });
        }
      });
  };

  const deleteIncomeItemHandler = (id) => {
    setLoading(true)
    fetch(`${url}inventory/deposit`, {
      headers :{'content-type':'appliction/json','accept':'application/json'},
      body :JSON.stringify({item_id:id}),
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setLoading(false)
          //delete supplier by id
          setIncomeItems(incomeItems.filter((item) => item.id != id));
          //show success dialog
          setOpenSuccessDialog({
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

  useEffect(() => {
    //fetch all suppliers
    fetch(`${url}inventory/deposit/last`)
      .then((res) => res.json())
      .then((data) => {
         console.log(data,'deposit data')
        setIncomeItems(data.items);
        console.log(data.items);
      });
  }, [isSubmitted,incomeComplete]);
  const completeAdditionHandler = ()=>{
    setLoading(true)
    fetch(`${url}inventory/deposit/complete`)
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        setLoading(false)
        setIncomeComplete(incomeComplete+1)
        //show success dialog
        setOpenSuccessDialog({
          open: true,
          msg: "تمت العمليه  بنجاح",
        });
      }
       console.log(data,'deposit complete')
    });

  }
  return (
 
        <Grid container>
          <Grid item xs={5}>
            <Paper sx={{p:1}}>
            <Typography
              sx={{ fontFamily: "Tajawal-Regular", textAlign: "center", mb: 1 }}
              variant="h5"
            >
              {" "}
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
                        rules={{required:{value:true,message:"يجب ادخال الصلاحيه"}}}
                        control={control}
                         name="expire"
                          render={({field})=> <DateField {...field} value={field.value} onChange={(val)=>field.onChange(val)}  sx={{mb:1}} label="الصلاحيه" />}
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
                          isOptionEqualToValue={(option,val)=>option.id ===val.id}
                          getOptionLabel={(option) => option.name}
                          onChange={(e,data)=>field.onChange(data)}
                          renderInput={(params) => {
                            return <TextField label={"الصنف"} {...params} />;
                          }}
                        ></Autocomplete>
                      );
                    }}
                  />
                  {errors.item && errors.item.message}
                  <div>
                    <Controller
                    
                      name="supplier"
                      rules={{
                        required: {
                          value: true,
                          message: "يجب اختيار المورد",
                        },
                      }}
                      control={control}
                      render={({ field }) => {
                        return (
                          <Autocomplete
                          isOptionEqualToValue={(option,val)=>option.id ===val.id}
                          
                          sx={{ mb: 1 }}
                          {...field}
                          value={field.value || null}                          
                            options={suppliers}
                            getOptionLabel={(option) => option.name}
                            onChange={(e, data) => field.onChange(data)}

                            renderInput={(params) => {
                              return <TextField  label={"المورد"} {...params} />;
                            }}
                          ></Autocomplete>
                        );
                      }}
                    />
                    {errors.supplier && errors.supplier.message}
                  </div>
                  <div>
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
                      {...register("price",{required:{
                        value:true,
                        message:"يجب ادخال السعر"
                      }})}
                      id="outlined-basic"
                      label="سعر الوحده"
                      variant="filled"
                    />
                    {errors.price && errors.price.message}
                  </div>
                  <div></div>
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
            
          </Grid>
          <Grid item xs={7}>
            {/* create table with all suppliers */}
            <TableContainer>
              <Table dir="rtl" size="small">
                <thead>
                    <TableRow>
                  <TableCell>رقم</TableCell>
                  <TableCell>الصنف</TableCell>
                  <TableCell>المورد</TableCell>
                  <TableCell>الكميه</TableCell>
                  <TableCell>السعر</TableCell>
                  <TableCell>الاجمالي</TableCell>
                  <TableCell>حذف</TableCell>
                </TableRow>
                </thead>
              
                <TableBody>
                  {incomeItems.map((income,i) => (
                    <TableRow key={i}>
                      <TableCell>{i+1}</TableCell>
                      <TableCell
                      
                      >
                        {income.name}
                      </TableCell>
                      <TableCell
                      
                      >
                        {income.pivot.supplier.name}
                      </TableCell>
                      <TableCell
                    
                      >
                        {income.pivot.quantity}
                      </TableCell>
                      <TableCell
                      
                      >
                        {income.pivot.price}
                      </TableCell>
                      <TableCell>
                       {income.pivot.quantity * income.pivot.price}
                      </TableCell>
                      <TableCell>
                        <LoadingButton loading={loading} title="حذف" endIcon={<Delete/>} onClick={()=>{
                          deleteIncomeItemHandler(income.id)
                        }}>
                       </LoadingButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {incomeItems.length > 0 && <LoadingButton  loading={loading} onClick={completeAdditionHandler} sx={{mt:1}} color="success" variant="contained" fullWidth>تأكيد </LoadingButton>}
          </Grid>

          <Grid item xs={3}>
            1
          </Grid>
        </Grid>
    
 
  );
}

export default InventoryIncome;
