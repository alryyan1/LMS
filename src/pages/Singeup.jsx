import {
  Alert,
  Autocomplete,
  Box,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import "./login.css";
import { LoadingButton } from "@mui/lab";
import { Controller, useForm } from "react-hook-form";
import axiosClient from "../../axios-client";
import { useStateContext } from "../appContext";
import { useState } from "react";
import { t } from "i18next";

import { Input } from "/src/components/ui/input";
import { Label } from "/src/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "/src/components/ui/card";

const SignUp = ({ setUsers, doctors }) => {
  const { setToken, setUser } = useStateContext();
  console.log(doctors, "doctorrs");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ val: false, msg: "" });

  console.log(setToken);
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
    register,
  } = useForm();
  const sumbitHamdler = (data) => {
    setLoading(true);
    const payload = {
      username: data.username,
      password: data.password,
      password_confirmation: data.confirm,
      doctor_id: data.doctor?.id,
    };
    console.log(payload);
    axiosClient
      .post("/signup", payload)
      .then(({ data }) => {
        if (data.status) {
          console.log(data);
          // setUser(data.user);
          setUsers((prev) => {
            return [...prev, data.user];
          });
          // setToken(data.token);
        }
      })
      .catch((error) => {
        console.log(error);
        setError({ val: true, msg: error.response.data.message });
      })
      .finally(() => setLoading(false));
  };
  return (
    // <form onSubmit={handleSubmit(sumbitHamdler)} noValidate>
    //   <Stack direction={"column"} gap={2}>
    //     <Typography sx={{ p: 1, textAlign: "center" }} variant="h5">
    //        {
    //         t('Addnewuser')
    //        }
    //     </Typography>
    //     <TextField
    //       error={errors.username != null}
    //       {...register("username", {
    //         required: {
    //           value: true,
    //           message: "username is required",
    //         },
    //         minLength: {
    //           value: 6,
    //           message: "username must be at least 6 characters",
    //         },
    //       })}
    //       sx={{ mb: 1 }}
    //       variant="standard"
    //       label="Username"
    //     ></TextField>
    //     {errors.username && errors.username.message}
    //     <TextField
    //       error={errors.password != null}
    //       sx={{ mb: 1 }}
    //       {...register("password", {
    //         required: { value: true, message: "password is required" },
    //         minLength: {
    //           value: 8,
    //           message: "at least 8 chracters must be entered",
    //         },
    //       })}
    //       variant="standard"
    //       label="Password"
    //     ></TextField>
    //     {errors.password && errors.password.message}
    //     <TextField
    //       error={errors.confirm != null}
    //       sx={{ mb: 1 }}
    //       {...register("confirm", {
    //         required: {
    //           value: true,
    //           message: "confirm password is required",
    //         },
    //         minLength: 8,
    //       })}
    //       variant="standard"
    //       label="confirm password"
    //     ></TextField>
    //     {errors.confirm && errors.confirm.message}
    //     <Controller
    //       name="doctor"
    //       // rules={{
    //       //   required: {
    //       //     value: true,
    //       //     message: "يجب اختيار اسم الطبيب",
    //       //   },
    //       // }}
    //       control={control}
    //       render={({ field }) => {
    //         return (
    //           <Autocomplete
    //             onChange={(e, newVal) => field.onChange(newVal)}
    //             getOptionKey={(op) => op.id}
    //             getOptionLabel={(option) => option.name}
    //             options={doctors}
    //             renderInput={(params) => {
    //               // console.log(params)

    //               return (
    //                 <TextField
    //                   inputRef={field.ref}
    //                   error={errors?.doctor}
    //                   {...params}
    //                   label={t('doctor_name')}
    //                 />
    //               );
    //             }}
    //           ></Autocomplete>
    //         );
    //       }}
    //     />
    //     <LoadingButton
    //       loading={loading}
    //       type="submit"
    //       sx={{ m: 1 }}
    //       variant="contained"
    //     >
    //       {t('signup')}
    //     </LoadingButton>
    //   </Stack>

    //   {error.val && <Alert severity="error">{error.msg}</Alert>}
    // </form>
    <Card className="   text-right col-span-3 ">
      <CardHeader>
        <CardTitle> تسجيل بيانات المستخدم</CardTitle>
        <CardDescription>الرجاء ادخال بيانات المستخدم</CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate  onSubmit={handleSubmit(sumbitHamdler)}>
          <div className="grid w-full items-center gap-4">
            {/** Name  */}
            <div className="flex flex-col space-y-1.5 text-right">
              <Label htmlFor="name"> اسم المستخدم</Label>
              <Input
                className="text-right"
                error={errors.username != null}
                {...register("username", {
                  required: {
                    value: true,
                    message: "username is required",
                  },
                  minLength: {
                    value: 6,
                    message: "username must be at least 6 characters",
                  },
                })}
                sx={{ mb: 1 }}
                variant="standard"
                label="Username"
              />
            </div>
            {/** password */}
            {errors.username && errors.username.message}

            <div className="flex flex-col space-y-1.5 text-right">
              <Label htmlFor="cash_percentage"> كلمة المرور</Label>
              <Input
                className="text-right"
                error={errors.password != null}
                sx={{ mb: 1 }}
                {...register("password", {
                  required: { value: true, message: "password is required" },
                  minLength: {
                    value: 8,
                    message: "at least 8 chracters must be entered",
                  },
                })}
                variant="standard"
                label="Password"
              />
            </div>
            {/**confirm password     */}
            {errors.password && errors.password.message}

            <div className="flex flex-col space-y-1.5 text-right">
              <Label htmlFor="company_percentage"> تاكيد كلمة المرور </Label>
              <Input
                className="text-right"
                error={errors.confirm != null}
                sx={{ mb: 1 }}
                {...register("confirm", {
                  required: {
                    value: true,
                    message: "confirm password is required",
                  },
                  minLength: 8,
                })}
                variant="standard"
                label="confirm password"
              />
            </div>

            {/** choose the doctor */}
            {errors.confirm && errors.confirm.message}

            {/* <Controller
              name="doctor"
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
                    options={doctors}
                    renderInput={(params) => {
                      // console.log(params)

                      return (
                        <TextField
                          inputRef={field.ref}
                          error={errors?.doctor}
                          {...params}
                          label={t("doctor_name")}
                        />
                      );
                    }}
                  ></Autocomplete>
                );
              }}
            /> */}
          </div>

          <LoadingButton
            loading={loading}
            type="submit"
            sx={{ m: 1 }}
            variant="contained"
            className="mt-3 w-full"
          >
            {t("signup")}
          </LoadingButton>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
};

export default SignUp;
