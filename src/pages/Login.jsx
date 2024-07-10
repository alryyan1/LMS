import React, { useState } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
  MDBRow,
  MDBCol,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { Alert, Box, Paper, Stack, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
import { useStateContext } from "../appContext";
import { useForm } from "react-hook-form";
import axiosClient from "../../axios-client";
import logo from "../assets/images/pharmaStar.png";
import logo2 from "../assets/images/hitech.png";

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
    <Box sx={{display:'flex',justifyContent:'center',alignContent:'center'}}>
      <Stack   justifyContent={'center'} alignItems={'center'} direction={'column'}>
      <img height='200px' src={logo}/>
        <form onSubmit={handleSubmit(sumbitHamdler)} noValidate>
                  <Typography sx={{ p: 1, textAlign: "center" }} variant="h4">
                    Login
                  </Typography>
                  <div className="form">
                    <TextField
                      error={errors.username != null}
                      {...register("username", {
                        required: {
                          value: true,
                          message: "username is required",
                        },
                        minLength: {
                          value: 6,
                          message:
                            "username must be at least 6 characters long",
                        },
                      })}
                      sx={{ mb: 1 }}
                      variant="standard"
                      label="Username"
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
                          message: "password is required",
                        },
                        minLength: {
                          value: 8,
                          message: "password must be 8 chrachters long",
                        },
                      })}
                      variant="standard"
                      label="Password"
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
                      تسجيل دخول
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
