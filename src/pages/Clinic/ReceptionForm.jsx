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
import {t} from 'i18next'
import CountryAutocomplete from "../../components/addCountryAutocomplete";

function ReceptionForm({ hideForm,lab }) {
  const [loading, setIsLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedSubCompany, setSelectedSubCompany] = useState(null);
  const [selectedRelation, setSelectedRelation] = useState(null);
  console.log(selectedCompany, "selected company");
  console.log(selectedSubCompany, "selected sub company");

  const { setDialog, setFoundedPatients, activeShift, setUpdate ,companies,doctors} =
    useOutletContext();
    let btn
    if (lab){
      btn = false
    }else{
     btn =   activeShift  ? false : true}
    
  // console.log(appData.doctors,'doctors')
  const {
    watch,
    control,
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const name = watch("name");
  const phone = watch("phone");

  useEffect(() => {
    setValue('gender', 'انثي');
    if (name != undefined) {
      console.log(name, "name");
      const timer = setTimeout(() => {
        console.log("searchByName", name);
        console.log("search by phone", phone);
        axiosClient.post("patient/search", { name: name ,phone}).then(({ data }) => {
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
    if (phone != undefined) {
      console.log(name, "name");
      const timer = setTimeout(() => {
        console.log("searchByName", name);
        console.log("search by phone", phone);
        axiosClient.post("patient/search/phone", {phone}).then(({ data }) => {
          console.log(data, "founded patients");
          setFoundedPatients(data);
        });
      }, 300);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [phone]);

  const sumbitHandler = async (formData) => {
    const url =  lab ? `patients/add/true` : `patients/reception/add/${activeShift.doctor.id}`
    setIsLoading(true);
    console.log(formData, "form data");
    axiosClient
      .post(url, {
        ...formData,
        doctor_id: activeShift?.doctor.id ?? formData.doctor?.id,
        company_id:selectedCompany?.id,
        subcompany_id:selectedSubCompany?.id,
        company_relation_id : selectedRelation?.id,
        country_id: formData.country?.id,
      })
      .then((data) => {
        console.log(data, "reception added");
        if (data.status) {
          //set is loading to false
          setIsLoading(false);
          setDialog((prev) => ({
            ...prev,
            message: "تمت الاضافه بنجاح",
            color: "success",
            open: true,
          }));
          //hide form9
          reset();
          hideForm();
          setFoundedPatients([])
          //this update patient list
          setUpdate((prev) => {
            console.log("inside update");
            return prev + 1;
          });
        }
      })
      .catch(( {response:{data}} ) => {
        console.log(data, "catch error");
        setDialog((prev)=>{
          return {...prev, message: data.message, color: "error", open:true}
        })
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Item elevation={2} sx={{ padding: "10px" }}>
      <Typography fontWeight={"bold"} sx={{ textAlign: "center", mb: 2 }}>
        {t('register')}      </Typography>
      <form onSubmit={handleSubmit(sumbitHandler)} noValidate>
        <Stack direction={"column"} spacing={2}>
          <Slide in={selectedCompany != null } unmountOnExit mountOnEnter>
          <Stack direction={'column'} gap={1}>
            <TextField
              autoFocus
              error={errors?.insurance_no != null}
              {...register("insurance_no", {
                required: {
                  value: selectedCompany ? true : false,
                  message: t('cardNoValidation'),
                }
              })}
              label={t('cardNo')}
              helperText={errors?.insurance_no && errors.insurance_no.message}
            />
            <TextField
              error={errors?.guarantor != null}
              {...register("guarantor")}
              label={t('guarantor_name')}
            />
          {selectedCompany &&   <Autocomplete
                  onChange={(e, newVal) => {
                    setSelectedSubCompany(newVal);
                    console.log(newVal)
                  }}
                  getOptionKey={(op) => op.id}
                  getOptionLabel={(option) => option.name}
                  options={selectedCompany.sub_companies}
                  renderInput={(params) => {
                    // console.log(params)

                    return (
                      <TextField
                        {...params}
                        label={t('sub_company')}
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
                        label={t('relation_name')}
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

            {/* <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">
                النوع
              </InputLabel>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                    
                        onChange={(data) => {
                        console.log(data.target.value);
                        return field.onChange(data.target.value);
                      }}
                      label="النوع"
                    >
                      <MenuItem value={"ذكر"}>ذكر</MenuItem>
                      <MenuItem value={"انثي"}>انثي</MenuItem>
                    </Select>
                  );
                }}
              />
            </FormControl> */}
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
                  message: t('phoneValidation'),
                },
                // minLength: {
                //   value: 10,
                //   message: t('phoneLengthValidation'),
                // },
                // maxLength: {
                //   value: 10,
                //   message:  t('phoneLengthValidation'),
                // },
              })}
              label={t('phone')}
              helperText={errors?.phone && errors.phone.message}
            />
            <TextField
              error={errors?.name}
              {...register("name", {
                required: {
                  value: true,
                  message: t('patientNameValidation'),
                },
              })}
              label={t('patient_name')}
              helperText={errors?.name && errors.name.message}
            />
                {lab && <Controller
            name="doctor"
            // rules={{
            //   required: {
            //     value: true,
            //     message: "يجب اختيار اسم الطبيب",
            //   },
            // }}
            control={control}
            render={({ field }) => {
              return (
                <Autocomplete
                  onChange={(e, newVal) => field.onChange(newVal)}
                  getOptionKey={(op) => op.id}
                  getOptionLabel={(option) => option.name}
                  options={doctors}
                  renderInput={(params) => {
                    // console.log(params)

                    return (
                      <TextField
                        inputRef={field.ref}
                        error={errors?.doctor}
                        {...params}
                        label={t('doctor_name')}
                      />
                    );
                  }}
                ></Autocomplete>
              );
            }}
          />
          
}
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
                      message: t('ageValidation'),
                    },
                  })}
                  type="number"
                  label={t('ageInYear')}
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
                  label={t('ageInMonth')}
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
                  label={t('ageInDays')}

                  variant="standard"
                />
              </Item>
            </Stack>
            <TextField
            size="small"
              error={errors?.gov_id}
              {...register("gov_id", {
                required: {
                  value: true,
                  message: t('govIdValidation'),
                },
              })}
              label={t('govId')}
              helperText={errors?.gov_id && errors.gov_id.message}
            />
            <CountryAutocomplete control={control} errors={errors} setValue={setValue} />
            <TextField
              size="small"
              {...register("address")}
              label={t('address')}
            />
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">
                {t('gender')}
              </InputLabel>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      value={field.value || 'انثي'}
                      onChange={(data) => {
                        console.log(data.target.value);
                        return field.onChange(data.target.value);
                      }}
                      label={t('gender')}
                    >
                      <MenuItem value={"ذكر"}>{t('male')}</MenuItem>
                      <MenuItem value={"انثي"}>{t('female')}</MenuItem>
                    </Select>
                  );
                }}
              />
            </FormControl>
            </Stack>
            
          </Slide>
          <Controller
            name="company"
            control={control}
            render={({ field }) => {
              return (
                <Autocomplete
                size="small"
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
                        label={t('company')}
                      />
                    );
                  }}
                ></Autocomplete>
              );
            }}
          />
          <LoadingButton
            disabled={btn}
            loading={loading}
            type="submit"
            variant="contained"
          >
            {t('save')}
          </LoadingButton>
        </Stack>
      </form>
    </Item>
  );
}

export default ReceptionForm;
