import { useOutletContext } from "react-router-dom";
import {
  Typography,
  Paper,
  Divider,
  styled,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import "../Laboratory/addPatient.css"
import { LoadingButton } from "@mui/lab";
import { Autocomplete, TextField, Stack } from "@mui/material";
import {  useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axiosClient from "../../../axios-client";
import { useStateContext } from "../../appContext";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function ReceptionForm({ hideForm }) {
  const { setToken, setUser } = useStateContext();
  const [loading, setIsLoading] = useState(false);
  const {setDialog,setFoundedPatients,doctors,activeShift,setActiveShift,setUpdate} = useOutletContext();
  // console.log(appData.doctors,'doctors')
  const {
    watch,
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  const name =   watch('name')
  
  useEffect(() => {
    if (name != undefined) {
      console.log(name,'name')
      const timer = setTimeout(() => {
        console.log("searchByName", name);
        axiosClient
          .post("patient/search", { name: name })
          .then(({ data }) => {
            console.log(data,'founded patients')
            setFoundedPatients(data);
          });
      }, 300);
      return () => {
        clearTimeout(timer);
      };
    }
   
    
  }, [name]);
  const sumbitHandler = async (formData) => {
    setIsLoading(true);
    console.log(formData,'form data');
    axiosClient
      .post(`patients/reception/add/${activeShift.doctor.id}`, { ...formData, doctor_id: activeShift.doctor.id })
      .then((data) => {
        console.log(data, "reception added");
        if (data.status) {
          //set is loading to false
          setIsLoading(false);
       setDialog((prev) => ({...prev, msg: 'تمت الاضافه بنجاح', color: "success", open:true}));
          //hide form
          reset();
          hideForm();
          //this update patient list
          setUpdate((prev) =>{
            console.log('inside update')
            return prev + 1
          });
        }
      })
      .catch((data) => {
        console.log(data, "error");
        if (data.status == 401) {
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Paper elevation={3} sx={{ padding: "10px" }}>
      <Typography fontWeight={"bold"} sx={{ textAlign: "center", mb: 2 }}>
         حجز لطبيب معين 
      </Typography>
      <form onSubmit={handleSubmit(sumbitHandler)} noValidate>
        <Stack direction={"column"} spacing={2}>
          <TextField
            type="number"
            autoFocus
            error={errors?.phone && errors.phone.message}
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
            label="رقم الهاتف "
          />
          {errors?.phone && errors.phone.message}
          <TextField
          
            error={errors?.name}
            {...register("name", {
              required: {
                value: true,
                message: "يجب ادخال اسم المريض",
              },
            })}
            label="اسم المريض"
          />
          {errors.name && errors.name.message}
          <Stack
            direction={"row"}
            gap={2}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Item>
              <TextField
                onKeyDown={(event) => {
                  if (event.key == "Enter") {
                    console.log("event");
                    // setFocus('age_month')
                  }
                }}
                error={errors?.age_year}
                {...register("age_year", {
                  required: { value: true, message: "يجب ادخال العمر بالسنه" },
                })}
                type="number"
                label="السنه"
                variant="standard"
              />
            </Item>
            <Item>
              <TextField
                onKeyDown={(event) => {
                  if (event.key == "Enter") {
                    console.log("event");
                    //   setFocus('age_day')
                  }
                }}
                {...register("age_month")}
                type="number"
                label="الشهر"
                variant="standard"
              />
            </Item>
            <Item>
              <TextField
               type="number"
                onKeyDown={(event) => {
                  if (event.key == "Enter") {
                    console.log("event");
                    //setFocus('doctor')
                  }
                }}
                {...register("age_day")}
                label="اليوم"
                variant="standard"
              />
            </Item>
          </Stack>

          {errors?.age && errors.age.message}
         
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">
              النوع
            </InputLabel>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => {
                return ( 
                  <Select
                 
                    defaultValue={""}
                    value={'ذكر'}
                    onChange={(data) => {
                      console.log(data.target.value);
                      return field.onChange(data.target.value);
                    }}
                    label="النوع"
                  >
                    <MenuItem value={"ذكر"}>ذكر</MenuItem>
                    <MenuItem value={"اثني"}>اثني</MenuItem>
                  </Select>
                );
              }}
            />
          </FormControl>
          {/* {errors.doctor && errors.doctor.message} */}

          <LoadingButton disabled = {activeShift ? false:true} loading={loading} type="submit" variant="contained">
            حفظ
          </LoadingButton>
        </Stack>
      </form>
    </Paper>
  );
}

export default ReceptionForm;
