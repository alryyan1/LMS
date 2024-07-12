import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import axiosClient from '../../axios-client';

function AddCostForm({setShift}) {
    const [loading , setLoading] = useState(false)
    const {
        handleSubmit,
        register,
        formState: { errors },
      } = useForm();
      const submitHandler = (data) => {
        setLoading(true);
        console.log("function called");
        axiosClient.post("cost/general", data).then(({ data }) => {
          console.log(data);
          if (data.status) {
            if (setShift) {
                
                setShift(data.data);
            }
          }
        }).finally(()=>setLoading(false));
      };
  return (
    <Box elevation={2}>
    <Typography textAlign={"center"} variant="h4">
      اضافه مصروف
    </Typography>
    <Divider></Divider>
    <form
      onSubmit={handleSubmit(submitHandler)}
      style={{ padding: "5px" }}
    >
      <Stack direction={"column"} spacing={2}>
        <TextField
          error={errors?.description != null}
          helperText={errors?.description && errors.description.message}
          {...register("description", {
            required: {
              value: true,
              message: "يجب ادخال وصف المصروف",
            },
          })}
          multiline
          label="وصف المصروف"
        />
        <TextField
          error={errors?.amount != null}
          helperText={errors?.amount && errors.amount.message}
          {...register("amount", {
            required: {
              value: true,
              message: "يجب ادخال المبلغ",
            },
          })}
          label="المبلغ"
        />
        <LoadingButton loading={loading} type="submit">حفظ</LoadingButton>
      </Stack>
    </form>
  </Box>
  )
}

export default AddCostForm