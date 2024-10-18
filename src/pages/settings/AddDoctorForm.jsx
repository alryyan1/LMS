import { Autocomplete, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";
import { LoadingButton } from "@mui/lab";

import { cn } from "/src/lib/utils"
import { Button } from "/src/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "/src/components/ui/card"
import { Input } from "/src/components/ui/input"
import { Label } from "/src/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "/src/components/ui/select"

function AddDoctorForm() {
  const { specialists, setDoctorUpdater ,setDoctors,setDialog} = useOutletContext();
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
      }).catch(({response:{data}})=>{
        console.log(data,'error')
        setDialog((prev)=>{
          return {...prev,message:data.message,open:true,color:'error'}
        })
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="grid grid-cols-2" >

      <Card className="w-[450px]  rtl text-right col-span-3 ">
          <CardHeader>
            <CardTitle>  تسجيل بيانات الطبيب</CardTitle>
            <CardDescription>الرجاء ادخال  بيانات الطبيب</CardDescription>
          </CardHeader>
          <CardContent>
            <form noValidate dir="rtl" onSubmit={handleSubmit(submitHandler)}>
              <Input type="hidden" name="supplier_id" />
              <Input type="hidden" name="user_id" />
              <div className="grid w-full items-center gap-4">
                {/** Name  */}
                <div className="flex flex-col space-y-1.5 text-right">
                  <Label htmlFor="name"> اسم الطبيب</Label>
                  <Input
                    
                    className="text-right"
                    error={errors.name != null}
                    {...register("name", {
                      required: { value: true, message: "يجب ادخال اسم الطبيب" },
                    })}
                    id="outlined-basic"
                    label="اسم الطبيب"
                    variant="filled"
                    helperText={errors.name?.message}
                  />
                  
                </div>
                {/** Cash Precentage */}
                <div className="flex flex-col space-y-1.5 text-right">
                  <Label htmlFor="cash_percentage">نسبة الطبيب</Label>
                  <Input
                    
                    className="text-right"
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
                </div>
                {/**Insurance precentage of the doctor */}
                <div className="flex flex-col space-y-1.5 text-right">
                  <Label htmlFor="company_percentage">نسبة الطبيب من التأمين</Label>
                  <Input
                    
                    className="text-right"
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
                </div>
                {/**Salary */}
                <div className="flex flex-col space-y-1.5 text-right">
                  <Label htmlFor="static_wage"> المرتب</Label>
                  <Input
                    
                    className="text-right"
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
                </div>
                {/**lab_percentage */}
                <div className="flex flex-col space-y-1.5 text-right">
                  <Label htmlFor="lab_percentage"> نسبة الطبيب من المختبر</Label>
                  <Input
                    
                    className="text-right"
                    type="number"
                    error={errors.lab_percentage != null}
                    {...register("lab_percentage")}
                    id="outlined-basic"
                    label="الرجاء ادخال نسبة الطبيب من المختبر"
                    variant="filled"
                    helperText={errors.lab_percentage?.message}
                  />
                </div>
                {/**phone */}
                <div className="flex flex-col space-y-1.5 text-right">
                  <Label htmlFor="lab_percentage"> رقم الهاتف </Label>
                  <Input
                    
                    className="text-right"
                    type="number"
                    error={errors.phone != null}
                    {...register("phone", {
                      required: { value: true, message: "يجب ادخال رقم الهاتف " },
                    })}
                    label="رقم الهاتف"
                    variant="filled"
                    helperText={errors.phone?.message}
                        />
                </div>
                {/** specialist */}
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
                
              </div>
              <LoadingButton loading={loading} variant="contained" type="submit" className="mt-3 w-full">
                حفظ
              </LoadingButton>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            
          </CardFooter>
        </Card>
    </div>
  );
}

export default AddDoctorForm;
