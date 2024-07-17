import React, { useState } from "react";


import { Alert, Box, Paper, Stack, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
import { useStateContext } from "../appContext";
import { useForm } from "react-hook-form";
import axiosClient from "../../axios-client";
import logo from "../assets/images/pharmaStar.png";
import logo2 from "../assets/images/hitech.png";
import bohome from "../assets/images/bohome_logo.png";
import {t} from 'i18next'
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
      .post("/login", data)
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
    <Box  style={{
      marginTop:'5px',
      gap: "15px",
      transition: "0.3s all ease-in-out",
      height: "75vh",
      display: "grid",
      direction:'rtl',
      gridTemplateColumns: `0.1fr  1fr 1fr  1fr  0.1fr   `,
    }}>
      <div></div>
      <div></div>
    
        
    
      <Stack   justifyContent={'center'} alignItems={'center'} direction={'column'}>
      <img width={'100%'} src={bohome}/>
        <form onSubmit={handleSubmit(sumbitHamdler)} noValidate>
                  <Typography sx={{ p: 1, textAlign: "center" }} variant="h4">
                    {t('login')}
                  </Typography>
                  <div className="form">
                    <TextField
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
                    ></TextField>
                    <TextField
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
                    ></TextField>
                    <LoadingButton
                      loading={loading}
                      type="submit"
                      sx={{ m: 1 }}
                      variant="contained"
                    >
                      {t('login')}
                    </LoadingButton>
                    {/* <Link to={'/signup'}  sx={{m:1}} variant="contained">انشاء حساب</Link> */}
                  </div>
                </form>
                {error.val && <Alert severity="error">{error.msg}</Alert>}
      
      </Stack>
    
    </Box>
  );
}

export default App;
