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

import { url } from "../constants.js";
import { Controller, useForm } from "react-hook-form";
import { Link, useLoaderData, useOutletContext } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";
import { Delete } from "@mui/icons-material";

function DeductInventory() {
  const items = useLoaderData();
  // console.log(items);
  //create state variable to store all suppliers
  const {dialog, setDialog} = useOutletContext();
  const [deduct, setDeduct] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deductComplete, setDeductComplete] = useState(1);
  const {
    register,
    reset,
    control,
    formState: { errors, isSubmitted },
    handleSubmit,
  } = useForm();
  const submitHandler = async (formData) => {
    console.log(formData);
    // console.log(formData.expire.$d.toLocaleDateString());
    setLoading(true);
    fetch(`${url}inventory/deduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        item_id: formData.item.id,
        quantity: formData.amount,
        client_id: formData.client.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setLoading(false);
        if (data.status) {
          setLoading(false);
          reset();
          setDialog({
            open: true,
            msg: "تمت الاضافه  بنجاح",
          });
        }
      });
  };

  const deleteDeductHandler = (item) => {
    setLoading(true)
    fetch(`${url}inventory/deduct`, {
        headers :{'content-type':'appliction/json'},
        body :JSON.stringify({item_id:item.id}),
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.status) {
            setLoading(false)
            setDeductComplete(deductComplete + 1);

          //delete supplier by id
          setDeduct(deduct.items.filter((item) => item.id != id));
          //show success dialog
          setDialog({
            open: true,
            msg: "تم الحذف بنجاح",
          });
        }
      });
  };

  useEffect(() => {
    //fetch all clients
    fetch(`${url}client/all`)
      .then((res) => res.json())
      .then((data) => {
       

        setClients(data);
        console.log(data);
      });
  }, []);
  useEffect(() => {
    //fetch all suppliers
    fetch(`${url}inventory/deduct/last`)
      .then((res) => res.json())
      .then((data) => {
         console.log(data,'deduct')
        setDeduct(data);
      });
  }, [isSubmitted,deductComplete]);
  const completeAdditionHandler = () => {
    setLoading(true);
    fetch(`${url}inventory/deduct/complete`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setLoading(false);
          setDeductComplete(deductComplete + 1);
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
    <Grid container spacing={5}>
      <Grid item xs={5}>
      <Link to={"/inventory/reports/deduct"}>reports</Link>

        <Paper sx={{ p: 1 }}>
          <Typography
            sx={{ fontFamily: "Tajawal-Regular", textAlign: "center", mb: 1 }}
            variant="h5"
          >
            خصم من المخزن
          </Typography>
          
          <form noValidate onSubmit={handleSubmit(submitHandler)}>
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
                  renderOption={(props,option)=>{
                    return <li {...props} key={option.id}>
                      {option.name}
                    </li>
                  }}
                    sx={{ mb: 1 }}
                    {...field}
                    value={field.value || null}
                    options={items}
                    
                    isOptionEqualToValue={(option, val) => option.id === val.id}
                    getOptionLabel={(option) => option.name}
                    onChange={(e, data) => field.onChange(data)}
                    renderInput={(params) => {
                      return <TextField error={errors.item} label={"الصنف"} {...params} />;
                    }}
                  ></Autocomplete>
                );
              }}
            />
            {errors.item && errors.item.message}
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
                    sx={{ mb: 1 }}
                    {...field}
                    value={field.value || null}
                    options={clients}
                    isOptionEqualToValue={(option, val) => option.id === val.id}
                    getOptionLabel={(option) => option.name}
                    onChange={(e, data) => field.onChange(data)}
                    renderInput={(params) => {
                      return <TextField error={errors.client} label={"العميل"} {...params} />;
                    }}
                  ></Autocomplete>
                );
              }}
            />
            {errors.client && errors.client.message}

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
         
            <div></div>

            <LoadingButton
              fullWidth
              loading={loading}
              variant="contained"
              type="submit"
            >
              خصم من المخزن
            </LoadingButton>
          </form>
        </Paper>
      </Grid>
      <Grid item xs={7}>
      <Typography textAlign={'center'}>
          {deduct  && deduct.id}   اذن صرف رقم

          </Typography>
        {/* create table with all suppliers */}
        <TableContainer >
          
          <Table sx={{mb:2}} dir="rtl" size="small">
            <thead>
              <TableRow>
                <TableCell>رقم</TableCell>
                <TableCell>الصنف</TableCell>
                <TableCell>العميل</TableCell>
                <TableCell>الكميه</TableCell>
                <TableCell>حذف</TableCell>
              </TableRow>
            </thead>

            <TableBody>
              {deduct && deduct.items.map((deductedItem, i) => (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{deductedItem.name}</TableCell>
                  <TableCell>{deductedItem.pivot.client.name}</TableCell>
                  <TableCell>{deductedItem.pivot.quantity}</TableCell>
                  <TableCell><LoadingButton onClick={()=>deleteDeductHandler(deductedItem)} title="delete" color="error" size="medium" loading={loading} endIcon={<Delete/>} ></LoadingButton></TableCell>
              
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {deduct && deduct.items.length > 0 && (
          <LoadingButton
            loading={loading}
            onClick={completeAdditionHandler}
            sx={{ mt: 1 }}
            color="error"
            variant="contained"
            fullWidth
          >
            تأكيد{" "}
          </LoadingButton>
        )}
      </Grid>

      <Grid item xs={3}>
        1
      </Grid>
    </Grid>
  );
}

export default DeductInventory;
