import { LoadingButton } from '@mui/lab';
import { Box, Divider, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import axiosClient from '../../axios-client';
import MyCustomControlledAutocomplete from '../pages/doctor/MyCutomAutocomplete';

function AddCostForm({setShift,selectedShift,setAllMoneyUpdatedLab}) {
    const [loading , setLoading] = useState(false)
    const [costCategories,setCostCategories] = useState([])
    useEffect(()=>{
        axiosClient.get(`costCategory`).then(({data})=>{
          setCostCategories(data);
        })
    },[])
    const {
        handleSubmit,
        setValue,
        register,
        control,
        reset,
        
        formState: { errors,submitCount },
      } = useForm();
      console.log(errors,'errors')
      const submitHandler = (data) => {
        console.log(data)
        setLoading(true);
        axiosClient.post("cost/general", {...data,cost_category_id:data.costCategory.id,shift_id:selectedShift?.id}).then(({ data }) => {
          console.log(data);
          if (data.status) {
            reset()
            if(setAllMoneyUpdatedLab){

              setAllMoneyUpdatedLab((prev)=>prev+1)
            }
            if (setShift) {
                
                setShift(data.data);
            }
          }
        }).finally(()=>setLoading(false));
      };
  return (
    <Box elevation={2}>

    <Divider></Divider>
    <form
      onSubmit={handleSubmit(submitHandler)}
      style={{ padding: "5px" }}
    >
      <Stack direction={"column"} gap={2}>
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
        <MyCustomControlledAutocomplete key={submitCount} setValue={setValue} control={control} errors={errors} rows={costCategories} setRows={setCostCategories} submitPath={'costCategory'}  isRequired={true} title='اضافه قسم' label='قسم المصروف' controllerName={'costCategory'} />
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
        <LoadingButton variant='contained' loading={loading} type="submit">حفظ</LoadingButton>
      </Stack>
    </form>
  </Box>
  )
}

export default AddCostForm