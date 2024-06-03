import { useOutletContext } from "react-router-dom";
import {
  Typography,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slide,
} from "@mui/material";
import "../Laboratory/addPatient.css";
import { LoadingButton } from "@mui/lab";
import { Autocomplete, TextField, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axiosClient from "../../../axios-client";
import { Item } from "../constants";

function ReceptionForm({ hideForm }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedSubCompany, setSelectedSubCompany] = useState(null);
  const [selectedRelation, setSelectedRelation] = useState(null);
  console.log(selectedCompany, "selected company");
  const { setDialog, setFoundedPatients, activeShift, setUpdate } =
    useOutletContext();
  // console.log(appData.doctors,'doctors')
  const {
    watch,
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  const name = watch("name");

  useEffect(() => {
    if (name != undefined) {
      console.log(name, "name");
      const timer = setTimeout(() => {
        console.log("searchByName", name);
        axiosClient.post("patient/search", { name: name }).then(({ data }) => {
          console.log(data, "founded patients");
          setFoundedPatients(data);
        });
      }, 300);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [name]);
  useEffect(() => {
    axiosClient.get("company/all").then(({ data }) => {
      console.log(data, "comapnies");
      setCompanies(data);
    });
  }, []);
  const sumbitHandler = async (formData) => {
    setIsLoading(true);
    console.log(formData, "form data");
    axiosClient
      .post(`patients/reception/add/${activeShift.doctor.id}`, {
        ...formData,
        doctor_id: activeShift.doctor.id,
        company_id:selectedCompany?.id,
        sub_company_id:selectedSubCompany?.id
      })
      .then((data) => {
        console.log(data, "reception added");
        if (data.status) {
          //set is loading to false
          setIsLoading(false);
          setDialog((prev) => ({
            ...prev,
            msg: "تمت الاضافه بنجاح",
            color: "success",
            open: true,
          }));
          //hide form
          reset();
          hideForm();
          //this update patient list
          setUpdate((prev) => {
            console.log("inside update");
            return prev + 1;
          });
        }
      })
      .catch(({ data }) => {
        console.log(data, "catch error");
        // setDialog((prev)=>{
        //   return {...prev, msg: data.message, color: "error", open:true}
        // })
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
          <Slide in={selectedCompany != null } unmountOnExit mountOnEnter>
          <Stack direction={'column'} gap={1}>
            <TextField
              autoFocus
              error={errors?.card_number != null}
              {...register("card_number", {
                required: {
                  value: true,
                  message: "يجب ادخال رقم البطاقه",
                }
              })}
              label="رقم البطاقه "
              helperText={errors?.card_number && errors.card_number.message}
            />
            <TextField
              error={errors?.guarantor != null}
              {...register("guarantor")}
              label="اسم الضامن"
            />
          {selectedCompany &&   <Autocomplete
                  onChange={(e, newVal) => {
                    setSelectedSubCompany(newVal);
                  }}
                  getOptionKey={(op) => op.id}
                  getOptionLabel={(option) => option.name}
                  options={selectedCompany.sub_companies}
                  renderInput={(params) => {
                    // console.log(params)

                    return (
                      <TextField
                        {...params}
                        label="الجهه"
                      />
                    );
                  }}
                />}
                {selectedCompany &&   <Autocomplete
                  onChange={(e, newVal) => {
                    setSelectedRelation(newVal);
                  }}
                  getOptionKey={(op) => op.id}
                  getOptionLabel={(option) => option.name}
                  options={selectedCompany.relations}
                  renderInput={(params) => {
                    // console.log(params)

                    return (
                      <TextField
                        {...params}
                        label="العلاقه"
                      />
                    );
                  }}
                />}
            <Stack
              direction={"row"}
              gap={2}
              divider={<Divider orientation="vertical" flexItem />}
            >
             
            </Stack>

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
                      value={"ذكر"}
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
            </Stack>
          </Slide>
          <Slide unmountOnExit in={selectedCompany == null} mountOnEnter >
            <Stack direction={'column'} gap={1}>
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
              helperText={errors?.phone && errors.phone.message}
            />
            <TextField
              error={errors?.name}
              {...register("name", {
                required: {
                  value: true,
                  message: "يجب ادخال اسم المريض",
                },
              })}
              label="اسم المريض"
              helperText={errors?.name && errors.name.message}
            />
            <Stack
              direction={"row"}
              gap={2}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Item>
                <TextField
                  helperText={errors?.age && errors.age.message}
                  onKeyDown={(event) => {
                    if (event.key == "Enter") {
                      console.log("event");
                      // setFocus('age_month')
                    }
                  }}
                  error={errors?.age_year}
                  {...register("age_year", {
                    required: {
                      value: true,
                      message: "يجب ادخال العمر بالسنه",
                    },
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
                      value={"ذكر"}
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
            </Stack>
            
          </Slide>
          <Controller
            name="company"
            rules={{
              required: {
                value: true,
                message: "يجب اختيار اسم الشركه",
              },
            }}
            control={control}
            render={({ field }) => {
              return (
                <Autocomplete
                  onChange={(e, newVal) => {
                    setSelectedCompany(newVal);
                    field.onChange(newVal);
                  }}
                  getOptionKey={(op) => op.id}
                  getOptionLabel={(option) => option.name}
                  options={companies}
                  renderInput={(params) => {
                    // console.log(params)

                    return (
                      <TextField
                        inputRef={field.ref}
                        error={errors?.doctor}
                        {...params}
                        label="الشركه"
                      />
                    );
                  }}
                ></Autocomplete>
              );
            }}
          />
          <LoadingButton
            disabled={activeShift ? false : true}
            loading={loading}
            type="submit"
            variant="contained"
          >
            حفظ
          </LoadingButton>
        </Stack>
      </form>
    </Paper>
  );
}

export default ReceptionForm;
