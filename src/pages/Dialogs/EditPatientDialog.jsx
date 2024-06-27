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
function EditPatientDialog({ patient, setOpen, open,doctorVisitId,isLab,setPatients }) {
  const { doctors, setActivePatient, setUpdate, openedDoctors, companies } =
    useOutletContext();
  // console.log(patient);
  // console.log(appData.doctors, "doctors");
  console.log(openedDoctors, "open doctors");
  const [loading, setLoading] = useState();
  function editDoctorHandler(formData) {
    setLoading(true);
    const newPatient = { ...patient, ...formData };
    const url = isLab ?`patients/${patient.id}`  : `patients/edit/${doctorVisitId}`
    console.log(formData, "formData");
    axiosClient
      .patch(url, {...formData,company_relation_id:formData?.company_relation_id?.id,subcompany_id:formData?.subcompany_id?.id,doctor_id:formData.doctor?.id})
      .then(({data}) => {
        console.log(data,'edited data');
        if (data.status) {
          console.log(data)
          if (!isLab) {
            setUpdate((prev) => {
              return prev + 1;
            });
          }
       
          console.log(data.patient, "new patient");

          setOpen(false);
          setActivePatient(data.patient);
          setPatients((prev)=>{
            return prev.map((p)=>{
              if (p.id === data.patient.id) {
                return {...data.patient ,active:true}
              } else {
                return p
              }
            })
          })
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
      gender: patient.gender,
      age_day: patient.age_day,
      age_month: patient.age_month,
      age_year: patient.age_year,
      insurance_no: patient.insurance_no,
      doctor: patient.doctor,
      // company: patient.company,
      guarantor : patient.guarantor,
      company_relation_id : patient.relation,
      subcompany_id:patient.subcompany

    },
  });
  return (
    <Dialog key={patient.id} open={open == undefined ? false : open}>
      <DialogTitle>تعديل البيانات</DialogTitle>
      <DialogContent >
        <form onSubmit={handleSubmit(editDoctorHandler)} >
          <Stack
            // divider={<Divider orientation="horizontal" flexItem />}
            direction={"column"}
            gap={2}
            sx={{p:1}}
          >
            <TextField
              {...register("name", {
                required: { value: true, message: "يجب ادخال اسم المريض" },
              })}
              defaultValue={patient.name}
              error={errors.name != null}
              variant="outlined"
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
                variant="outlined"
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
            {isLab && <Controller
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
                  isOptionEqualToValue={(option,val)=>
                    option.id === val.id
                  }
                     
                  onChange={(e, newVal) => field.onChange(newVal)}
                  getOptionKey={(op) => op.id}
                  getOptionLabel={(option) => option.name}
                  options={doctors}
                  value={field.value}
                  
                  renderInput={(params) => {
                    // console.log(params)

                    return (
                      <TextField
                        inputRef={field.ref}
                        error={errors?.doctor}
                        {...params}
                        label="الطبيب"
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
            {patient.company_id && <Divider>التامين</Divider>}
            {patient.company_id && (
              <Stack direction={"column"} spacing={1}>
                {/* <Controller
                  name="company"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        value={patient.company}
                        isOptionEqualToValue={(opt, val) => opt.id === val.id}
                        getOptionKey={(op) => op.id}
                        {...field}
                        getOptionLabel={(op) => op.name}
                        options={companies}
                        onChange={(_, val) => {
                          field.onChange(val);
                        }}
                        renderInput={(params) => {
                          return (
                            <TextField
                              label="الشركه"
                              error={errors.company && errors.company.message}
                              {...params}
                            />
                          );
                        }}
                      />
                    );
                  }}
                /> */}
                <Stack direction={"row"} gap={2}>
                  <TextField fullWidth
                    {...register("insurance_no")}
                    label="رقم البطاقه"
                    variant="outlined"
                  />
               <TextField
               fullWidth
                    {...register("guarantor")}
                    label="اسم الضامن"
                    variant="outlined"
                  />
                         
                 
                </Stack>

                <Stack direction={"row"} gap={2}>
                  
              
                          <Controller
                        name="subcompany_id"
                        control={control}
                        render={({ field }) => {
                          return (
                            <Autocomplete
                            fullWidth
                            
                              value={patient.subcompany}
                              isOptionEqualToValue={(opt, val) => opt.id === val.id}
                              getOptionKey={(op) => op.id}
                              {...field}
                              getOptionLabel={(op) => op.name}
                              options={patient.company.sub_companies}
                              onChange={(_, val) => {
                                field.onChange(val);
                              }}
                              renderInput={(params) => {
                                return (
                                  <TextField
                                    label="الجهه"
                                    error={errors.subcompany_id && errors.subcompany_id.message}
                                    {...params}
                                  />
                                );
                              }}
                            />
                          );
                        }}
                      />
                        
               
                      <Controller
                    name="company_relation_id"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Autocomplete
                        {...field}
                        value={field.value}
                        fullWidth
                          isOptionEqualToValue={(opt, val) => opt.id === val.id}
                          getOptionKey={(op) => op.id}
                          getOptionLabel={(op) => op.name}
                          options={patient.company.relations}
                          onChange={(_, val) => {
                            field.onChange(val);
                          }}
                          renderInput={(params) => {
                            return (
                              <TextField
                                label="العلاقه"
                                {...params}
                              />
                            );
                          }}
                        />
                      );
                    }}
                  />
                 
                </Stack>

              </Stack>
            )}
          </Stack>
          <LoadingButton
            sx={{ m: 1 }}
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
