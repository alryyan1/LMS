import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";

function AddDoctorDialog() {
  const [ loading, setLoading ] = useState(false);
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const { setOpen, specialists, open,setDoctors } = useOutletContext();
  console.log(specialists, "specialists in add doctor dialog");
  const addDoctorHandler = (formData) => {
    console.log({ ...formData,
        specialist_id: formData.specialist.id});
    setLoading(true);
    //add doctor using axios
    axiosClient
      .post("doctors/add", {
        ...formData,
        specialist_id: formData.specialist.id,
      })
      .then(({data:data}) => {
        if (data.status) {
            setLoading(false);
            setOpen(false);
            setDoctors((prev)=>[...prev,data.doctor])
            console.log(data);
        }
      
      });
  };
  return (
    <div>
      <Dialog open={open}>
        <DialogTitle color={"success"}>اضافه طبيب</DialogTitle>
        <form onSubmit={handleSubmit(addDoctorHandler)} noValidate>
          <Stack sx={{ p: 2 }} direction={"column"} gap={5}>
            <TextField
              error={errors?.name !=null}
              {...register("name", {
                required: { value: true, message: "يجب ادخال اسم الطبيب" },
              })}
              label="اسم الطبيب"
            ></TextField>
            {errors?.name && errors.name.message}

            <TextField
              error={errors?.phone}
              {...register("phone")}
              label="رقم الهاتف"
            ></TextField>
            {errors?.phone && errors.phone.message}
            <Controller
              name="specialist"
              rules={{
                required: {
                  value: true,
                  message: "يجب اختيار التخصص ",
                },
              }}
              control={control}
              render={({ field }) => (
                <Autocomplete
                  onChange={(e, newVal) => field.onChange(newVal)}
                  getOptionKey={(op) => op.id}
                  getOptionLabel={(option) => option.name}
                  options={specialists}
                  renderInput={(params) => {
                    // console.log(params)

                    return (
                      <TextField
                        error={errors?.specialist_id}
                        {...params}
                        label="التخصص"
                      />
                    );
                  }}
                ></Autocomplete>
              )}
            />
            {errors?.specialist_id && errors.specialist_id.message}
            <LoadingButton
            loading={loading}
            variant="contained"
            type="submit"
          
          >
            ok
          </LoadingButton>
          </Stack>
        </form>
        <DialogActions>
        <Button color="error" onClick={()=>setOpen(false)}>
            close
        </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddDoctorDialog;
