
import React, { useState } from "react";

import { Alert, Box, Paper, Stack, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
import { useStateContext } from "../appContext";
import { useForm } from "react-hook-form";
import axiosClient from "../../axios-client";
import logo from "../assets/images/pharmaStar.png";
import logo2 from "../assets/images/hitech.png";
import sahara from "../assets/images/sahara.png";
import { t } from 'i18next'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "/src/components/ui/card"
import { Input } from "/src/components/ui/input"
import { Label } from "/src/components/ui/label"
import ToothChart from "./Dentist/ToothChart";

function App() {
  console.log("login page");
  const [error, setError] = useState({ val: false, msg: "" });
  const [loading, setLoading] = useState(false);
  const { setToken, setUser } = useStateContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {
    handleSubmit,
    formState: { errors, isSubmitted },
    register,
  } = useForm();
  const sumbitHamdler = (data) => {
    setLoading(true);
    console.log(data);
    axiosClient
      .post("login", data)
      .then(({ data }) => {
        console.log(data, "success data");
        if (data.status) {
          setUser(data.user);
          setToken(data.token);
        }
      })
      .catch((error) => {
        setError({ val: true, msg: error.response.data.message });
      })
      .finally(() => setLoading(false));
  };
  return (
    <Box sx={{ display: 'flex', height: '90vh', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
      <Stack justifyContent={'center'} alignItems={'center'} direction={'column'}>
        {/* <img height='300px'  src={logo2}/> */}

        <Card className="w-[450px]  rtl text-right col-span-3 mt-4 ">
          <CardHeader>
            <CardTitle>  Register login data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form noValidate dir="rtl" onSubmit={handleSubmit(sumbitHamdler)} >

              <div className="grid w-full items-center gap-4">
                {/** User Name  */}
                <div className="flex flex-col space-y-1.5 text-right">
                  <Label htmlFor="name"> Username </Label>
                  <Input

                    className="text-right"
                    error={errors.username != null}
                    {...register("username", {
                      required: {
                        value: true,
                        message: t('usernameValidation'),
                      },
                      minLength: {
                        value: 6,
                        message:
                          t('usernameValidationMessage'),
                      },
                    })}
                    sx={{ mb: 1 }}
                    variant="standard"
                    label={t('username')}
                    helperText={errors?.username?.message}
                    value={username}
                    onChange={(value) => setUsername(value.target.value)}
                  />

                </div>
                {/** password */}
                {errors.username && errors.username.message}

                <div className="flex flex-col space-y-1.5 text-right">
                  <Label htmlFor="cash_percentage">  Password</Label>
                  <Input

                    className="text-right"
                    error={errors.password != null}
                    sx={{ mb: 1 }}
                    {...register("password", {
                      required: {
                        value: true,
                        message: t('passwordValidationMessage'),
                      },
                      minLength: {
                        value: 8,
                        message: t('passwordValidationMessageLength'),
                      },
                    })}
                    variant="standard"
                    label={t("password")}
                    type="password"
                    helperText={errors?.password?.message}
                    value={password}
                    onChange={(value) => setPassword(value.target.value)}
                  />
                </div>

              </div>

              <LoadingButton
                loading={loading}
                type="submit"
                sx={{ m: 1 }}
                variant="contained"
                style={{ display: 'block', margin: '0 auto' }}
              >
                {t('login')}
              </LoadingButton>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            {error.val && <Alert severity="error">{error.msg}</Alert>}

          </CardFooter>
        </Card>
      </Stack>

    </Box>
  );
}

export default App;
