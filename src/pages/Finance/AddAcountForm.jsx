import { Autocomplete, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import axiosClient from "../../../axios-client";

function AddAcountForm({ setAccounts, setLoading, setDialog, loading }) {
    const [accountCategory,setAccountCategory] = useState([])
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
      const { data } = await axiosClient.post("createFinanceAccount", {...formData,account_category_id:formData.category.id});
      console.log(data, "created");
      if (data.status) {
        reset();
        setAccounts((prev) => [...prev, data.data]);
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
    axiosClient.get('financeSections').then(({data})=>{
        setAccountCategory(data)
  
    })
  },[])
  return (
    <Paper sx={{ p: 1 }}>
      <Typography textAlign={"center"} variant="h5">
        اضافه حساب
      </Typography>
      <form noValidate onSubmit={handleSubmit(submitHandler)}>
        <Stack gap={1}>
          <TextField
            fullWidth
            error={errors.name != null}
            {...register("name", {
              required: { value: true, message: "يجب ادخال اسم الحساب" },
            })}
            id="outlined-basic"
            label="اسم الحساب"
            variant="filled"
            helperText={errors.name && errors.name.message}
          />
          <Controller
            name="category"
            // rules={{
            //   required: {
            //     value: true,
            //     message: "يجب اختيار اسم الطبيب",
            //   },
            // }}
            control={control}
            render={({ field }) => {
              return (
                <Autocomplete
                  onChange={(e, newVal) => field.onChange(newVal)}
                  getOptionKey={(op) => op.id}
                  getOptionLabel={(option) => option.name}
                  options={accountCategory}
                  renderInput={(params) => {
                    // console.log(params)

                    return (
                      <TextField
                        inputRef={field.ref}
                        error={errors?.doctor}
                        {...params}
                        label='القسم'
                      />
                    );
                  }}
                ></Autocomplete>
              );
            }}
          />
           <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">
              طبيعه الحساب
              </InputLabel>
              <Controller
                name="debit"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      value={field.value || 0}
                      onChange={(data) => {
                        console.log(data.target.value);
                        return field.onChange(data.target.value);
                      }}
                      label='طبيعه الحساب'
                    >
                      <MenuItem value={0}>مدين</MenuItem>
                      <MenuItem value={1}>دائن</MenuItem>
                    </Select>
                  );
                }}
              />
            </FormControl>
            <TextField multiline rows={2} {...register('description')} label='وصف الحساب' ></TextField>
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

export default AddAcountForm;
