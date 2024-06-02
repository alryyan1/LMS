import {
    Autocomplete,
    Divider,
    Grid,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { Controller, useForm } from "react-hook-form";
  import { LoadingButton } from "@mui/lab";
  import axiosClient from "../../../axios-client";
  import MyTableCell from "../inventory/MyTableCell";
  import MyLoadingButton from "../../components/MyLoadingButton";
  import { ArrowBack, ArrowForward } from "@mui/icons-material";
  import { useOutletContext } from "react-router-dom";
  
  function AddSubcompany() {
    const [companies, setCompanies] = useState([]);
    const [subCompanies, setSubCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [links, setLinks] = useState([]);
    const [page, setPage] = useState(5);
   const {setDialog} = useOutletContext()
   const {
    register,
    control,
    reset,
    formState: { errors, isSubmitting,isSubmitSuccessful },
    handleSubmit,
  } = useForm();
  console.log(isSubmitting);

 
    //create state variable to store all Items
    const submitHandler = (data) => {
      setLoading(true);
  
      console.log(data, "submitted data");
      axiosClient
        .post(`subcompany/create/${data.company.id}`, data)
        .then((data) => {
          if (data.status) {
            setLoading(false)
            reset();
            setDialog((prev)=>{
              return {...prev, open:true, message:data.message,color:'success'}
            })
          }
        }).catch(({data})=>{
          setDialog((prev)=>{
            return {...prev, open:true, message:data.message ,color:'error'}
          })
        })
        .finally(()=>{});
    };
    useEffect(() => {
        axiosClient.get("company/all").then(({ data }) => {
          console.log(data, "comapnies");
          setCompanies(data);
        });
      }, []);
      useEffect(() => {
        axiosClient.get("subcompany/all").then(({ data }) => {
          console.log(data, "subcomapnies");
          setSubCompanies(data);
        });
      }, [isSubmitSuccessful]);
    
    
      
  
    return (
      <Grid container  gap={3}>
       
          <Grid item xs={3}>
            <TableContainer sx={{ mb: 1 }}>
              <Stack
                sx={{ mb: 1 }}
                direction={"row"}
                justifyContent={"space-between"}
              >
                <select
                  onChange={(val) => {
                    setPage(val.target.value);
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              
              </Stack>
  
              <Table dir="rtl" size="small">
                <thead>
                  <TableRow>
                    <TableCell>رقم</TableCell>
                    <TableCell>الاسم</TableCell>
                    <TableCell>تحمل المعمل</TableCell>
                    <TableCell> تحمل الخدمات </TableCell>
                  </TableRow>
                </thead>
                <TableBody>
                  {subCompanies.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <MyTableCell table="subcompany" colName={"name"} item={item}>
                        {item.name}
                      </MyTableCell>
                      <MyTableCell
                        table="subcompany"
                        colName={"lab_endurance"}
                        item={item}
                      >
                        {item.lab_endurance}
                      </MyTableCell>
                      <MyTableCell
                        table="subcompany"
                        colName={"service_endurance"}
                        item={item}
  
                      >
                        {item.service_endurance}
                      </MyTableCell>
                   
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
  
          </Grid>
        

        <Grid item xs={3} style={{ flexGrow: "1" }}>
          <Stack direction={"row"} justifyContent={"center"} spacing={4}>
            <Typography variant="h3" fontFamily={"Tajwal-Regular"}>
              اضافه جهه جديده
            </Typography>
          </Stack>
          <form noValidate dir="rtl" onSubmit={handleSubmit(submitHandler)}>
            <Stack direction={"column"} gap={3}>
              <TextField
                fullWidth
                error={errors.name != null}
                {...register("name", {
                  required: { value: true, message: "يجب ادخال اسم الجهه" },
                })}
                id="outlined-basic"
                label="اسم الجهه"
                variant="filled"
                helperText={errors.name?.message}
              />
  
                <TextField
                  fullWidth
                  type="number"
                  error={errors.lab_endurance != null}
                  {...register("lab_endurance", {
                    required: { value: true, message: "يجب ادخال تحمل المريض" },
                    min: { value: 0, message: "يجب ان يكون القيمه اكبر من 0" },
                    max: { value: 100, message: "يجب ان يكون القيمه اقل من 100" },
                  })}
                  id="outlined-basic"
                  label="  تحمل المريض في المعمل"
                  variant="filled"
                  helperText={errors.lab_endurance?.message}
                  
                />
  
                <TextField
                  fullWidth
                  type="number"
                  error={errors.service_endurance != null}
                  {...register("service_endurance", {
                    required: { value: true, message: "يجب ادخال تحمل المريض" },
                    min: { value: 0, message: "يجب ان يكون القيمه اكبر من 0" },
                    max: { value: 100, message: "يجب ان يكون القيمه اقل من 100" },
                  })}
                  id="outlined-basic"
                  label="  تحمل المريض في الخدمات"
                  variant="filled"
                  helperText={errors.service_endurance?.message}
                />
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
                fullWidth
                loading={loading}
                variant="contained"
                type="submit"
              >
                حفظ
              </LoadingButton>
            </Stack>
          </form>
        </Grid>
      </Grid>
    );
  }
  
  export default AddSubcompany;
  