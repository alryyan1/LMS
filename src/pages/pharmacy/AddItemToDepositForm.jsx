import { Autocomplete, Box, Grid, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import axiosClient from '../../../axios-client';
import dayjs from 'dayjs';
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LoadingButton } from '@mui/lab';
import { useOutletContext } from 'react-router-dom';

function AddItemToDepositForm({setUpdate,selectedDeposit,setDialog,items,setSelectedDeposit,setData,setLayout}) {
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
  const [selectedItem,setSelectedItem]=useState(null)
    const {setItemsTobeAddedToChache} =  useOutletContext()
      const submitHandler = async (formData) => {
        setLayout((prev)=>{
          return {
           ...prev,
           showAddtoDeposit:false,
           addToDepositForm: "0fr",
          }

        })
        const dayJsObj = formData.expire;
        setItemsTobeAddedToChache((prev)=>{
          return [...prev, formData.item.id];
        })
        const payload = {
          item_id: formData.item.id,
          quantity: formData.amount,
          cost: formData.cost ?? 0,
          expire: dayJsObj ? `${dayJsObj.year()}/${dayJsObj.month() + 1}/${dayJsObj.date()}` : null,
    
          notes: formData.notes ?? '',
          barcode: formData.barcode ?? '',
          batch: formData.batch ?? '',
          free_quantity: formData.free_quantity ?? 0,
          sell_price: formData.sell_price ?? 0,
          vat: formData.vat ?? 0,
        };
        console.log(formData);
        // console.log(formData.expire.$d.toJSON());
        setLoading(true);
        console.log(isSubmitting);
        axiosClient
          .post(`inventory/itemDeposit/${selectedDeposit.id}`, payload)
          .then((data) => {
            console.log(data);
            setLoading(false);
            if (data.status) {
                setSelectedDeposit(data.data.deposit)
                setData(data.data.deposit)
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
               اضافه للمخزون
            </Typography>
            <form noValidate onSubmit={handleSubmit(submitHandler)}>
              <Grid  container>
                {/* <Grid sx={{ gap: "5px" }} item xs={6}> */}
           
                  {/* <TextField
                  fullWidth
                    {...register("barcode")}
                    sx={{ mb: 1 }}
                    label={"الباركود"}
                  ></TextField> */}
                
                  {/* <TextField
                  fullWidth
                    multiline
                    rows={3}
                    {...register("notes")}
                    sx={{ mb: 1 }}
                    label={"الملاحظات"}
                  ></TextField> */}
                {/* </Grid> */}
                <Grid item xs={12}>
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
                          getOptionKey={(option) => option.id}
                          sx={{ mb: 1 }}
                          {...field}
                          
                        value={selectedItem}
                         
                          options={items}
                          isOptionEqualToValue={(option, val) =>
                            option.id === val.id
                          }
                          getOptionLabel={(option) => option.market_name}
                          onChange={(e, data) =>{
                            field.onChange(data)
                            setSelectedItem(data)
                          }}
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
                  <TextField
                  fullWidth
                    {...register("batch")}
                    sx={{ mb: 1 }}
                    label={"الباتش"}
                  ></TextField>

                     <TextField
                      fullWidth
                      sx={{ mb: 1 }}
                      error={errors.amount}
                      {...register("amount", {
                        required: { value: true, message: "Amount must be provided" },
                      })}
                      id="outlined-basic"
                      label="الكميه"
                      variant="outlined"
                   
                      helperText= {errors.amount && errors.amount.message}
                    />
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
                        fullWidth
                          {...field}
                          value={field.value}
                          onChange={(val) => field.onChange(val)}
                          sx={{ mb: 1 }}
                          label="تاريخ الصلاحيه"
                        />
                      )}
                    />
                  </LocalizationProvider>
                    {/*
                    <TextField
                      helperText=     {errors.price && errors.price.message}
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
                      label="(cost price)سعر  التكلفه"
                      variant="filled"
                      
                    />
                      <TextField
                      helperText=     {errors.sell_price && errors.sell_price.message}
                      sx={{ mb: 1 }}
                      fullWidth
                      error={errors.sell_price}
                      {...register("sell_price", {
                        required: {
                          value: true,
                          message: "sell_price must be provided",
                        },
                      })}
                      id="outlined-basic"
                      label="(sell price)سعر البيع"
                      variant="filled"
                      
                    />
                     <TextField
                      sx={{ mb: 1 }}
                      fullWidth
                      error={errors.vat}
                      {...register("vat")}
                      id="outlined-basic"
                      label="%(vat)الضريبه "
                      variant="filled"
                      
                    />
                   <TextField
                      sx={{ mb: 1 }}
                      fullWidth
                      error={errors.free_quantity}
                      {...register("free_quantity")}
                      id="outlined-basic"
                      label="(free quantity)كميه المجانيه "
                      variant="filled"
                      
                    /> */}
                </Grid>
                <LoadingButton
                  fullWidth
                  loading={loading}
                  variant="contained"
                  type="submit"
                >
                  Add  
                </LoadingButton>
              </Grid>
            </form>
          </Box>
  )
}

export default AddItemToDepositForm