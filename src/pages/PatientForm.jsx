import { useOutletContext } from "react-router-dom";
import { Typography, Paper } from "@mui/material";

import "./addPatient.css";
import LoadingButton from "@mui/lab/LoadingButton";
import { Autocomplete, TextField, Stack } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
function PatientForm({ setPatients, hideForm }) {
  const appData = useOutletContext();

  const [val, setVal] = useState(null);
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm();
  console.log(isSubmitting, "is submitting");

  const sumbitHandler = async (formData)  => {

    console.log(formData);
    console.log(val);
    const urlParams = new URLSearchParams(formData);
    urlParams.append("doc_id", val.id);
    // console.log(urlParams)

    fetch(`http://127.0.0.1:8000/api/patients/add`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: urlParams,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.status) {
          //hide form
          hideForm();
          setPatients((prePatients) => {
            return [
              {
                ...formData,
                doctor: val,
                id: data.id,
              },
              ...prePatients,
            ];
          });
        }
      });
  };

  return (
    <Paper elevation={3} sx={{ padding: "10px" }}>
      <Typography fontWeight={"bold"} sx={{ textAlign: "center", mb: 2 }}>
        تسجيل مريض للمعمل
      </Typography>
      <form onSubmit={handleSubmit(sumbitHandler)} noValidate>
        <Stack direction={"column"} spacing={2}>
          <TextField
            error={errors.phone && errors.phone.message}
            {...register("phone", {
              required: {
                value: true,
                message: "يجب ادخال رقم الهاتف",
              },
              minLength: {
                value: 10,
                message: "يجب ان يكون رقم الهاتف مكون من 10 ارقام",
              },
              maxLength: {
                value: 10,
                message: "يجب ان يكون رقم الهاتف مكون من 10 ارقام",
              },
            })}
            variant="filled"
            label="رقم الهاتف "
          />
          {errors.phone && errors.phone.message}
          <TextField
            error={errors.name}
            {...register("name", {
              required: {
                value: true,
                message: "يجب ادخال اسم المريض",
              },
            })}
            variant="filled"
            label="اسم المريض"
          />
          {errors.name && errors.name.message}

          <TextField
            error={errors.age}
            {...register("age", {
              required: {
                value: true,
                message: "يجب ادخال العمر",
              },
            })}
            label="العمر"
            variant="filled"
          />
          {errors.age && errors.age.message}
          <Autocomplete
            value={val}
            onChange={(e, newVal) => setVal(newVal)}
            getOptionKey={(op) => op.id}
            getOptionLabel={(option) => option.name}
            options={appData.doctors}
            renderInput={(params) => {
              // console.log(params)

              return <TextField {...params} label="الطبيب" />;
            }}
          ></Autocomplete>
          {isSubmitting ? (
            ""
          ) : (
            <LoadingButton
              loading={isSubmitting}
              loadingIndicator="loading ..."
              type="submit"
              variant="contained"
            >
              حفظ
            </LoadingButton>
          )}
        </Stack>
      </form>
    </Paper>
  );
}

export default PatientForm;
