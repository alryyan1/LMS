import { Alert, Paper, TextField, Typography } from "@mui/material";
import "./login.css";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import axiosClient from "../../axios-client";
import { useStateContext } from "../appContext";
import { useState } from "react";
const SignUp = () => {
  const { setToken, setUser } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ val: false, msg: "" });

  console.log(setToken);
  const {
    handleSubmit,
    formState: { errors, isSubmitted },
    register,
  } = useForm();
  const sumbitHamdler = (data) => {
    setLoading(true);
    const payload = {
      username: data.username,
      password: data.password,
      password_confirmation: data.confirm,
    };
    console.log(payload);
    axiosClient
      .post("/signup", payload)
      .then(({ data }) => {
        if (data.status) {
          console.log(data);
          setUser(data.user);
          setToken(data.token);
        }
      })
      .catch((error) => {
        console.log(error);
        setError({ val: true, msg: error.response.data.message });
      })
      .finally(() => setLoading(false));
  };
  return (
    <div className="container">
      <Paper>
        <form onSubmit={handleSubmit(sumbitHamdler)} noValidate>
          <Typography sx={{ p: 1, textAlign: "center" }} variant="h4">
            Sign up
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
                    message: "username must be at least 6 characters",
                },

              })}
              sx={{ mb: 1 }}
              variant="standard"
              label="Username"
            ></TextField>
            {errors.username && errors.username.message}
            <TextField
              error={errors.password != null}
              sx={{ mb: 1 }}
              {...register("password", {
                required: { value: true, message: "password is required" },
                minLength: {value:8,message:'at least 8 chracters must be entered'},
              })}
              variant="standard"
              label="Password"
            ></TextField>
            {errors.password && errors.password.message}
            <TextField
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
            ></TextField>
            {errors.confirm && errors.confirm.message}
            <LoadingButton
              loading={loading}
              type="submit"
              sx={{ m: 1 }}
              variant="contained"
            >
              انشاء حساب
            </LoadingButton>
          </div>
        </form>
        {error.val && <Alert severity="error">{error.msg}</Alert>}
      </Paper>
    </div>
  );
};

export default SignUp;
