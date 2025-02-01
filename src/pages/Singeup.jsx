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
import { useTranslation } from "react-i18next";

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

const SignUp = ({ setUsers, doctors, setOpen }) => {
    const { t } = useTranslation('addUser');

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
            return [data.user, ...prev];
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
        <CardTitle> {t('signUpTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={handleSubmit(sumbitHamdler)}>
          <Stack direction={"column"} gap={1}>
            {/** Name  */}
            <TextField
              error={errors.name != null}
              {...register("name", {
                required: {
                  value: true,
                  message: t('nameRequired'),
                },
              })}
              sx={{ mb: 1 }}
              variant="standard"
              label={t("name")}
            />
            <TextField
              error={errors.username != null}
              {...register("username", {
                required: {
                  value: true,
                  message: t("usernameRequired"),
                },
                minLength: {
                  value: 4,
                  message: t("usernameMinLength"),
                },
              })}
              sx={{ mb: 1 }}
              variant="standard"
              label={t("username")}
            />

            <TextField
              error={errors.password != null}
              sx={{ mb: 1 }}
              {...register("password", {
                required: { value: true, message: t("passwordRequired") },
                minLength: {
                  value: 4,
                  message: t("passwordMinLength"),
                },
              })}
              variant="standard"
              label={t("password")}
            />

            <TextField
              error={errors.confirm != null}
              sx={{ mb: 1 }}
              {...register("confirm", {
                required: {
                  value: true,
                  message: t("confirmPasswordRequired"),
                },
                minLength: 4,
              })}
              variant="standard"
              label={t("confirmPassword")}
            />

            <Controller
              name="doctor"
              control={control}
              render={({ field }) => {
                return (
                  <Autocomplete
                    onChange={(e, newVal) => field.onChange(newVal)}
                    getOptionKey={(op) => op.id}
                    getOptionLabel={(option) => option.name}
                    options={doctors}
                    renderInput={(params) => {
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