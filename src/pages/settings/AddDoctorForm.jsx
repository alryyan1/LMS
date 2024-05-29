import { Autocomplete, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";
import { LoadingButton } from "@mui/lab";

function AddDoctorForm() {
  const { specialists, setDoctorUpdater ,setDoctors} = useOutletContext();
  const [loading, setLoading] = useState(false);

  const {
    register,
    reset,
    control,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    handleSubmit,
  } = useForm();
  //create state variable to store all Items
  const submitHandler = (data) => {
    setLoading(true);

    console.log(data, "submitted data");
    axiosClient
      .post("doctors/add", { ...data, specialist_id: data.specialist_id.id })
      .then(({data}) => {
        console.log(data,'add doctor data');
        if (data.status) {
          if (setDoctors) {
            setDoctors((prev) => {
              return [...prev, data.doctor];
            });
          }

          reset();
          if (setDoctorUpdater) {
          setDoctorUpdater((prev) => prev + 1);
            
          }

        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ flexGrow: "1" }}>
      <form noValidate dir="rtl" onSubmit={handleSubmit(submitHandler)}>
        <Stack direction={"column"} gap={3}>
          <TextField
            fullWidth
            error={errors.name != null}
            {...register("name", {
              required: { value: true, message: "يجب ادخال اسم الطبيب" },
            })}
            id="outlined-basic"
            label="اسم الطبيب"
            variant="filled"
            helperText={errors.name?.message}
          />

          <Stack direction={"row"} gap={2}>
            <TextField
              fullWidth
              type="number"
              error={errors.cash_percentage != null}
              {...register("cash_percentage", {
                required: { value: true, message: "يجب ادخال  نسبه الطبيب" },
                min: { value: 0, message: "يجب ان يكون القيمه اكبر من 0" },
                max: { value: 100, message: "يجب ان يكون القيمه اقل من 100" },
              })}
              id="outlined-basic"
              label="نسبه الطبيب من النقدي"
              variant="filled"
              helperText={errors.cash_percentage?.message}
            />

            <TextField
              fullWidth
              type="number"
              error={errors.company_percentage != null}
              {...register("company_percentage", {
                min: { value: 0, message: "يجب ان يكون القيمه اكبر من 0" },
                max: { value: 100, message: "يجب ان يكون القيمه اقل من 100" },
              })}
              id="outlined-basic"
              label="نسبه الطبيب من التامين"
              variant="filled"
              helperText={errors.company_percentage?.message}
            />
          </Stack>
          <Stack direction={"row"} gap={2}>
            <TextField
              fullWidth
              type="number"
              error={errors.static_wage != null}
              {...register("static_wage", {
                required: { value: true, message: "يجب ادخال  الثابت " },
              })}
              id="outlined-basic"
              label="الثابت"
              variant="filled"
              helperText={errors.static_wage?.message}
            />

            <TextField
              fullWidth
              type="number"
              error={errors.lab_percentage != null}
              {...register("lab_percentage")}
              id="outlined-basic"
              label="نسبه الطبيب من المختبر"
              variant="filled"
              helperText={errors.lab_percentage?.message}
            />
          </Stack>
          <Stack direction={"row"} gap={2}>
            <TextField
              fullWidth
              type="number"
              error={errors.phone != null}
              {...register("phone", {
                required: { value: true, message: "يجب ادخال رقم الهاتف " },
              })}
              label="رقم الهاتف"
              variant="filled"
              helperText={errors.phone?.message}
            />
            <Controller
              name="specialist_id"
              rules={{
                required: {
                  value: true,
                  message: "يجب اختيار اسم التخصص",
                },
              }}
              control={control}
              render={({ field }) => {
                return (
                  <Autocomplete
                    fullWidth
                    onChange={(e, newVal) => field.onChange(newVal)}
                    getOptionKey={(op) => op.id}
                    getOptionLabel={(option) => option.name}
                    options={specialists}
                    renderInput={(params) => {
                      // console.log(params)

                      return (
                        <TextField
                          inputRef={field.ref}
                          error={errors?.specialist_id}
                          {...params}
                          label="التخصص"
                        />
                      );
                    }}
                  ></Autocomplete>
                );
              }}
            />
          </Stack>

          <LoadingButton loading={loading} variant="contained" type="submit">
            حفظ
          </LoadingButton>
        </Stack>
      </form>
    </div>
  );
}

export default AddDoctorForm;
