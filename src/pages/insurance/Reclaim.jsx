import { LoadingButton } from '@mui/lab';
import { Autocomplete, Box, Button, Grid, Stack, TextField } from '@mui/material'
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

function Reclaim() {
    const [firstDate, setFirstDate] = useState(dayjs(new Date()));
    const [secondDate, setSecondDate] = useState(dayjs(new Date()));
    const [loading, setLoading] = useState(null);
    const [selectedCompany , setSelectedCompany] = useState(null)
  const {companies}=   useOutletContext()
  const {handleSubmit,control,formState:{errors}} = useForm()
  const submitHandler = ()=>{

  }
   return (
    <Grid container  >
        <Grid item xs={2}>
        <Stack direction={"row"} justifyContent={"space-between"}>
            <form onSubmit={handleSubmit(submitHandler)}>
            <Controller
            name="company"
            control={control}
            render={({ field }) => {
              return (
                <Autocomplete
                  size="small"
                  onChange={(e, newVal) => {
                    setSelectedCompany(newVal);
                    field.onChange(newVal);
                  }}
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
                        label={'الشركه'}
                      />
                    );
                  }}
                ></Autocomplete>
              );
            }}
          />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateField
                format='YYYY-MM-DD'
                  onChange={(val) => {
                    setFirstDate(val);
                  }}
                  defaultValue={dayjs(new Date())}
                  sx={{ m: 1 }}
                  label="من"
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateField
                format='YYYY-MM-DD'

                  onChange={(val) => {
                    setSecondDate(val);
                  }}
                  defaultValue={dayjs(new Date())}
                  sx={{ m: 1 }}
                  label="الي"
                />
              </LocalizationProvider>
              <LoadingButton
                sx={{ mt: 2 }}
                size="medium"
                variant="contained"
              >
                Go
              </LoadingButton>
            </form>
        

      
          </Stack>
        </Grid>
        <Grid item xs={10}></Grid>

    </Grid  >
  )
}

export default Reclaim