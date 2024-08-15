import { Autocomplete, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import axiosClient from "../../../axios-client";

function AddEntryForm({ setLoading, setDialog, loading ,setEntries}) {
    const [accounts,setAccounts] = useState([])
  const {
    register,
    control,
    reset,
    formState: { errors, isSubmitted },
    handleSubmit,
  } = useForm();
  const submitHandler = async (formData) => {
    setLoading(true);
    try {
      const { data } = await axiosClient.post("createFinanceEntries", {...formData,from_account:formData.from_account.id,to_account:formData.to_account.id});
      console.log(data, "created");
      if (data.status) {
        reset();
        setEntries((prev) => [...prev, data.data]);
        setDialog((prev) => ({
          ...prev,
          color: "success",
          open: true,
          message: "تمت الاضافه بنجاح",
        }));
        setLoading(false);
      }
    } catch ({ response: { data } }) {
      setDialog((prev) => ({
        ...prev,
        color: "error",
        open: true,
        message: data.message,
      }));
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(()=>{
    axiosClient.get('financeAccounts').then(({data})=>{
        setAccounts(data)
  
    })
  },[])
  return (
    <Paper sx={{ p: 1 }}>
      <Typography textAlign={"center"} variant="h5">
        قيد جديد 
      </Typography>
      <form noValidate onSubmit={handleSubmit(submitHandler)}>
        <Stack gap={1}>
        <TextField
            fullWidth
            error={errors.description != null}
            {...register("amount", {
              required: { value: true, message: "يجب ادخال المبلغ " },
            })}
            type="number"
            id="outlined-basic"
            label="المبلغ"
            variant="filled"
            helperText={errors.amount && errors.amount.message}
          />
          <TextField
          multiline
           rows={4}
            fullWidth
            error={errors.description != null}
            {...register("description", {
              required: { value: true, message: "يجب ادخال البيان " },
            })}
            id="outlined-basic"
            label="بيان القيد"
            variant="filled"
            helperText={errors.description && errors.description.message}
          />
          <Controller
            name="from_account"
            rules={{
              required: {
                value: true,
                message: "يجب اختيار اسم الحساب",
              },
            }}
            control={control}
            render={({ field }) => {
              return (
                <Autocomplete
                  onChange={(e, newVal) => field.onChange(newVal)}
                  getOptionKey={(op) => op.id}
                  getOptionLabel={(option) => option.name}
                  options={accounts}
                  renderInput={(params) => {
                    // console.log(params)

                    return (
                      <TextField
                        inputRef={field.ref}
                        error={errors?.doctor}
                        {...params}
                        label='من حساب'
                      />
                    );
                  }}
                ></Autocomplete>
              );
            }}
          />
              <Controller
            name="to_account"
            rules={{
              required: {
                value: true,
                message: "يجب اختيار اسم الحساب",
              },
            }}
            control={control}
            render={({ field }) => {
              return (
                <Autocomplete
                  onChange={(e, newVal) => field.onChange(newVal)}
                  getOptionKey={(op) => op.id}
                  getOptionLabel={(option) => option.name}
                  options={accounts}
                  renderInput={(params) => {
                    // console.log(params)

                    return (
                      <TextField
                        inputRef={field.ref}
                        error={errors?.doctor}
                        {...params}
                        label='الي حساب'
                      />
                    );
                  }}
                ></Autocomplete>
              );
            }}
          />
      
          <LoadingButton
            fullWidth
            loading={loading}
            variant="contained"
            type="submit"
          >
            حفظ
          </LoadingButton>
        </Stack>
      </form>
    </Paper>
  );
}

export default AddEntryForm;
