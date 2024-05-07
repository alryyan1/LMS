import { useState } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Paper,
  Select,
  Stack,
  styled,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import axiosClient from "../../../axios-client";
import { useOutletContext } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
function EditPatientDialog({ patient, setOpen, open ,setPatients}) {
  const { doctors ,setActivePatient } = useOutletContext();
  // console.log(patient);
  // console.log(appData.doctors, "doctors");
  const [loading, setLoading] = useState();
  function editDoctorHandler(formData) {
    setLoading(true);
    const newPatient = { ...patient, ...formData };

    console.log(formData, "formData");
    axiosClient
      .patch(`patients/edit/${patient.id}`, {
        ...formData,
        doctor_id: formData.doctor.id,
      })
      .then((data) => {
        if (data.status) {
          console.log(newPatient, "new patient");
          setPatients((prePaitients) => {
            return prePaitients.map((p) => {
              if (p.id === patient.id) {
                return newPatient;
              } else {
                return p;
              }
            });
          });
          setOpen(false);
          setActivePatient(newPatient);
        }
      })
      .finally(() => setLoading(false));
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      name: patient.name,
      phone: patient.phone,
      doctor: patient.doctor,
      gender: patient.gender,
      age_day: patient.age_day,
      age_month: patient.age_month,
      age_year: patient.age_year,
    },
  });
  return (
    <Dialog
      key={patient.id}
      sx={{ p: 2 }}
      open={open == undefined ? false : open}
    >
      <DialogTitle>تعديل البيانات</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(editDoctorHandler)} noValidate>
          <Stack
            // divider={<Divider orientation="horizontal" flexItem />}
            direction={"column"}
            gap={5}
          >
            <TextField
              {...register("name", {
                required: { value: true, message: "يجب ادخال اسم المريض" },
              })}
              defaultValue={patient.name}
              error={errors.name != null}
              variant="standard"
              label={"اسم المريض"}
            ></TextField>
            <Stack direction={"row"} gap={5} justifyContent={"space-around"}>
              <TextField
                fullWidth
                {...register("phone", {
                  required: {
                    value: true,

                    message: "يجب ادخال رقم الهاتف",
                    //phone validation
                    validator: (value) => {
                      if (value.length == 10) {
                        return true;
                      }
                      return false;
                    },
                  },
                })}
                defaultValue={patient.phone}
                error={errors.phone != null}
                variant="standard"
                label={"رقم الهاتف"}
              ></TextField>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      fullWidth
                      onChange={(data) => {
                        console.log(data.target.value);
                        return field.onChange(data.target.value);
                      }}
                      label="النوع"
                    >
                      <MenuItem value={"ذكر"}>ذكر</MenuItem>
                      <MenuItem value={"اثني"}>اثني</MenuItem>
                      <MenuItem value=""></MenuItem>
                    </Select>
                  );
                }}
              />
            </Stack>

            <Stack
              direction={"row"}
              gap={4}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Item>
                <TextField
                  defaultValue={patient.age_year}
                  error={errors?.age_year}
                  {...register("age_year", {
                    required: {
                      value: true,
                      message: "يجب ادخال العمر بالسنه",
                    },
                  })}
                  label="السنه"
                  variant="standard"
                />
              </Item>
              <Item>
                <TextField
                  defaultValue={patient.age_month}
                  {...register("age_month")}
                  label="الشهر"
                  variant="standard"
                />
              </Item>
              <Item>
                <TextField
                  defaultValue={patient.age_day}
                  {...register("age_day")}
                  label="اليوم"
                  variant="standard"
                />
              </Item>
            </Stack>

            {errors?.age && errors.age.message}
            <Controller
              name="doctor"
              control={control}
              render={({ field }) => (
                <Autocomplete
                sx={{mb:1}}
                  {...field}
                  ref={field.ref}
                  value={field.value}
                  defaultValue={patient.doctor}
                  onChange={(e, newVal) => field.onChange(newVal)}
                  getOptionKey={(op) => op.id}
                  getOptionLabel={(option) => option.name}
                  options={doctors}
                  //fill isOptionEqualToValue

                  isOptionEqualToValue={(option, val) => option.id === val.id}
                  renderInput={(params) => {
                    // console.log(params)

                    return <TextField {...params} label="الطبيب" />;
                  }}
                ></Autocomplete>
              )}
            />
          </Stack>
          <LoadingButton
            loading={loading}
            type="submit"
            fullWidth
            variant="contained"
          >
            حفظ التعدييل
          </LoadingButton>
        </form>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
          }}
        >
          close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditPatientDialog;
