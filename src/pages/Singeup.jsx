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

const SignUp = ({ setUsers, doctors,setOpen }) => {
  const { setToken } = useStateContext();
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
      name: data.name,
    };
    console.log(payload);
    axiosClient
      .post("/signup", payload)
      .then(({ data }) => {
        if (data.status) {
          console.log(data);
          // setUser(data.user);
          setUsers((prev) => {
            return [ data.user,...prev];
          });
          setOpen(false)
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
   
    <Card className="   text-right col-span-3 ">
      <CardHeader>
        <CardTitle> تسجيل بيانات المستخدم</CardTitle>
      </CardHeader>
      <CardContent>
        <form noValidate  onSubmit={handleSubmit(sumbitHamdler)}>
          <Stack direction={'column'} gap={1} >
            {/** Name  */}
            <TextField
                
                error={errors.name != null}
                {...register("name", {
                  required: {
                    value: true,
                    message: "name is required",
                  },
                
                })}
                sx={{ mb: 1 }}
                variant="standard"
                label="name"
              />
              <TextField
                
                error={errors.username != null}
                {...register("username", {
                  required: {
                    value: true,
                    message: "username is required",
                  },
                  minLength: {
                    value: 4,
                    message: "username must be at least 4 characters",
                  },
                })}
                sx={{ mb: 1 }}
                variant="standard"
                label="Username"
              />

              <TextField
                
                error={errors.password != null}
                sx={{ mb: 1 }}
                {...register("password", {
                  required: { value: true, message: "password is required" },
                  minLength: {
                    value: 4,
                    message: "at least 4 chracters must be entered",
                  },
                })}
                variant="standard"
                label="Password"
              />

              <TextField
                
                error={errors.confirm != null}
                sx={{ mb: 1 }}
                {...register("confirm", {
                  required: {
                    value: true,
                    message: "confirm password is required",
                  },
                  minLength: 4,
                })}
                variant="standard"
                label="confirm password"
              />


            <Controller
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
            />
          </Stack>

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
