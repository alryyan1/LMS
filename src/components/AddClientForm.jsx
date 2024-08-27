import {
  Autocomplete,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import axiosClient from "../../axios-client";
import { LoadingButton } from "@mui/lab";
import CountryAutocomplete from "./addCountryAutocomplete";

function AddClientForm({ setClients, setLoading, setDialog, loading }) {
  const [countries, setCountries] = React.useState([]);

  useEffect(() => {
    axiosClient.get("country").then(({ data }) => {
      setCountries(data);
    });
  }, []);
  const {
    register,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitted },
    handleSubmit,
  } = useForm({
    defaultValues:{
      country:countries[0],
      state:'مسقط'
    }
  });
  const submitHandler = async (formData) => {
    setLoading(true);
    try {
      const { data } = await axiosClient.post("client/create", {
        ...formData,
        country_id: formData.country?.id,
      });
      console.log(data, "created");
      if (data.status) {
        reset();
        setClients((prev) => [data.data,...prev]);
        setDialog((prev) => ({
          ...prev,
          color: "success",
          open: true,
          message: "تمت الاضافه بنجاح",
        }));
        setLoading(false);
      }
    } catch ({ response: { data } }) {
      setDialog((prev) => ({
        ...prev,
        color: "error",
        open: true,
        message: data.message,
      }));
      setLoading(false);
    }
    setLoading(false);
  };
  useEffect(()=>{
    if (countries.length > 0) {
      
      setValue('country',countries[0])
    }
  },[countries.length])
  return (
    <Paper sx={{ p: 1 }}>
      <Typography textAlign={"center"} variant="h5">
        اضافه عميل{" "}
      </Typography>
      <form noValidate onSubmit={handleSubmit(submitHandler)}>
        <Stack sx={{minWidth:'300px'}} direction={'column'} gap={2}>
        <TextField
          fullWidth
          error={errors.name != null}
          {...register("name", {
            required: { value: true, message: "يجب ادخال اسم العميل" },
          })}
          id="outlined-basic"
          label="اسم العميل"
          variant="outlined"
          helperText={errors.name && errors.name.message}
        />
       <TextField
            fullWidth
            error={errors.clinic_name != null}
            id="outlined-basic"
            label="*اسم العياده "
            variant="outlined"
            helperText={errors.clinic_name && errors.clinic_name.message}
          />
          <TextField
            fullWidth
            error={errors.phone != null}
            {...register("phone", {
              required: { value: true, message: "يجب ادخال رقم الهاتف" },
            })}
            id="outlined-basic"
            label="رقم الهاتف"
            variant="outlined"
            type="number"
            helperText={errors.phone && errors.phone.message}
          />
        <TextField
          fullWidth
          error={errors.address != null}
          {...register("address", {
            required: { value: true, message: "يجب ادخال العنوان" },
          })}
          id="outlined-basic"
          label="العنوان"
          variant="outlined"
          helperText={errors.address && errors.address.message}
        />
        {/* <TextField
          sx={{ mb: 1 }}
          fullWidth
          {...register("email")}
          id="outlined-basic"
          label="الايميل"
          variant="outlined"
          helperText={errors.email && errors.email.message}
        /> */}
        <CountryAutocomplete
          errors={errors}
          setValue={setValue}
          control={control}
        />
        <TextField
         defaultValue={'مسقط'}
          fullWidth
          error={errors.state != null}
          {...register("state", {
            required: { value: true, message: "يجب ادخال الولايه" },
          })}
          id="outlined-basic"
          label="الولايه"
          variant="outlined"
          helperText={errors.state && errors.state.message}
        />
        <LoadingButton
          fullWidth
          loading={loading}
          variant="contained"
          type="submit"
        >
          حفظ
        </LoadingButton>
        </Stack>
     
      </form>
    </Paper>
  );
}

export default AddClientForm;
