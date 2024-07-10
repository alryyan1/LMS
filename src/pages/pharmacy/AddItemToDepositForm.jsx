import { Autocomplete, Box, Grid, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import axiosClient from '../../../axios-client';
import dayjs from 'dayjs';
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LoadingButton } from '@mui/lab';

function AddItemToDepositForm({setUpdate,selectedDeposit,setDialog,items,setSelectedDeposit}) {
    const[loading,setLoading] =useState()
    const {
        setValue,
        register,
        reset,
        control,
        formState: {
          errors,
          isSubmitting,
   
        },
        handleSubmit,
      } = useForm();
      const submitHandler = async (formData) => {
        const dayJsObj = formData.expire;
    
        const payload = {
          item_id: formData.item.id,
          quantity: formData.amount,
          price: formData.price,
          expire: `${dayJsObj.year()}/${dayJsObj.month() + 1}/${dayJsObj.date()}`,
    
          notes: formData.notes,
          barcode: formData.barcode,
          batch: formData.batch,
        };
        console.log(formData);
        console.log(formData.expire.$d.toJSON());
        setLoading(true);
        console.log(isSubmitting);
        axiosClient
          .post(`inventory/itemDeposit/${selectedDeposit.id}`, payload)
          .then((data) => {
            console.log(data);
            setLoading(false);
            if (data.status) {
                setSelectedDeposit(data.data.deposit)
              setLoading(false);
              setUpdate((prev)=>prev+1)
              reset();
              setValue("expire", dayjs(new Date()));
              setDialog({
                open: true,
                message: "Items added successfully",
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
  return (
    <Box sx={{ p: 1 }}>
            <Typography
              sx={{ fontFamily: "Tajawal-Regular", textAlign: "center", mb: 1 }}
              variant="h5"
            >
               Add To Inventory
            </Typography>
            <form noValidate onSubmit={handleSubmit(submitHandler)}>
              <Grid container>
                <Grid sx={{ gap: "5px" }} item xs={6}>
                  <TextField
                    {...register("batch")}
                    sx={{ mb: 1 }}
                    label={"Batch"}
                  ></TextField>
                  <TextField
                    {...register("barcode")}
                    sx={{ mb: 1 }}
                    label={"Barcode"}
                  ></TextField>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                      defaultValue={dayjs(new Date())}
                      rules={{
                        required: {
                          value: true,
                          message: "Expire date must be provided",
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
                          label="Expire Date"
                        />
                      )}
                    />
                  </LocalizationProvider>
                  <TextField
                    multiline
                    rows={3}
                    {...register("notes")}
                    sx={{ mb: 1 }}
                    label={"Notes"}
                  ></TextField>
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="item"
                    rules={{
                      required: {
                        value: true,
                        message: "Item must be selected",
                      },
                    }}
                    control={control}
                    render={({ field }) => {
                      return (
                        <Autocomplete
                          getOptionKey={(option) => option.id}
                          sx={{ mb: 1 }}
                          {...field}
                          value={field.value || null}
                          options={items}
                          isOptionEqualToValue={(option, val) =>
                            option.id === val.id
                          }
                          getOptionLabel={(option) => option.market_name}
                          onChange={(e, data) => field.onChange(data)}
                          renderInput={(params) => {
                            return (
                              <TextField
                                helperText={
                                  errors.name && errors.name.message
                                }
                                error={errors.name != null}
                                label={"Item"}
                                {...params}
                              />
                            );
                          }}
                        ></Autocomplete>
                      );
                    }}
                  />
                  {errors.item && errors.item.message}

                  <div>
                    <TextField
                      fullWidth
                      sx={{ mb: 1 }}
                      error={errors.amount}
                      {...register("amount", {
                        required: { value: true, message: "Amount must be provided" },
                      })}
                      id="outlined-basic"
                      label="Amount"
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
                          message: "Price must be provided",
                        },
                      })}
                      id="outlined-basic"
                      label="Box Price"
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
                  Add to inventory 
                </LoadingButton>
              </Grid>
            </form>
          </Box>
  )
}

export default AddItemToDepositForm