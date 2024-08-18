import { LoadingButton } from "@mui/lab";
import { Autocomplete, Grid, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";

function CopyContract() {
  const { companies } = useOutletContext();
  const [loading,setLoading] = useState()
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm();
  const submitHandler = (data) => {
    console.log(data);
    const result =  confirm('هل انت متاكد من نسخ التعاقد ')
    if (result) {
        setLoading(true)
        axiosClient.patch('copyContract',{from:data.from.id,to:data.to.id}).then(({data})=>{
            console.log(data)
        }).finally(()=>setLoading(false))
    }
  };
  return (
    <Grid container>
      <Grid item xs={4}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Stack direction={"column"} gap={2}>
            <Controller
              name="from"
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
                    options={companies}
                    renderInput={(params) => {
                      // console.log(params)

                      return (
                        <TextField
                          inputRef={field.ref}
                          error={errors?.doctor}
                          {...params}
                          label={"نسخ من"}
                        />
                      );
                    }}
                  ></Autocomplete>
                );
              }}
            />
             <Controller
              name="to"
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
                    options={companies}
                    renderInput={(params) => {
                      // console.log(params)

                      return (
                        <TextField
                          inputRef={field.ref}
                          error={errors?.doctor}
                          {...params}
                          label={"نسخ الي"}
                        />
                      );
                    }}
                  ></Autocomplete>
                );
              }}
            />
            <LoadingButton loading={loading} variant="contained" color="primary" type="submit" >
              نسخ العقد
            </LoadingButton>
          </Stack>
        </form>
      </Grid>
    </Grid>
  );
}

export default CopyContract;
