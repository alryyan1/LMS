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
  
  function AddRelation() {
    const [companies, setCompanies] = useState([]);
    const [subCompanies, setSubCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setDialog } = useOutletContext();

    const {
      register:register2,
      control:control2,
      reset:reset2,
      formState: { errors:errors2, isSubmitting:isSubmitting2, isSubmitSuccessful:isSubmitSuccessful2 },
      handleSubmit:handleSubmit2,
    } = useForm();
  
    //create state variable to store all Items

    const submitHandler2 = (data) => {
      setLoading(true);
  
      console.log(data, "submitted data");
      axiosClient
        .post(`relation/create/${data.company.id}`, data)
        .then((data) => {
          if (data.status) {
            setLoading(false);
            reset2();
            setDialog((prev) => {
              return {
                ...prev,
                open: true,
                message: data.message,
                color: "success",
              };
            });
          }
        })
        .catch(({ data }) => {
          setDialog((prev) => {
            return { ...prev, open: true, message: data.message, color: "error" };
          });
        })
        .finally(() => {});
    };
    useEffect(() => {
      axiosClient.get("company/all").then(({ data }) => {
        console.log(data, "comapnies");
        setCompanies(data);
      });
    }, []);
 
    useEffect(() => {
      axiosClient.get("relation/all").then(({ data }) => {
        console.log(data, "subcomapnies");
        setSubCompanies(data);
      });
    }, [isSubmitSuccessful2]);
  
  
    return (
      <Grid container spacing={3}>
       
  
       
  
  
        <Grid item xs={7}>
          <TableContainer sx={{ mb: 1 }}>
          
  
            <Table dir="rtl" size="small">
              <thead>
                <TableRow>
                  <TableCell>رقم</TableCell>
                  <TableCell>الاسم</TableCell>
                  <TableCell>تحمل المعمل</TableCell>
                  <TableCell> تحمل الخدمات </TableCell>
                  <TableCell> الشركه  </TableCell>
                </TableRow>
              </thead>
              <TableBody>
                {subCompanies.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <MyTableCell table="relation" colName={"name"} item={item}>
                      {item.name}
                    </MyTableCell>
                    <MyTableCell
                      table="relation"
                      colName={"lab_endurance"}
                      item={item}
                    >
                      {item.lab_endurance}
                    </MyTableCell>
                    <MyTableCell
                      table="relation"
                      colName={"service_endurance"}
                      item={item}
                    >
                      {item.service_endurance}
                    </MyTableCell>
                    <TableCell>
                        {item.company.name}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
  
        <Grid item xs={3} style={{ flexGrow: "1" }}>
          <Stack direction={"row"} justifyContent={"center"} spacing={4}>
            <Typography variant="h3" fontFamily={"Tajwal-Regular"}>
              اضافه علاقه جديده
            </Typography>
          </Stack>
          <form noValidate dir="rtl" onSubmit={handleSubmit2(submitHandler2)}>
            <Stack direction={"column"} gap={3}>
              <TextField
                fullWidth
                error={errors2.name != null}
                {...register2("name", {
                  required: { value: true, message: "يجب ادخال اسم العلاقه" },
                })}
                id="outlined-basic"
                label="اسم العلاقه"
                variant="filled"
                helperText={errors2.name?.message}
              />
  
              <TextField
                fullWidth
                type="number"
                error={errors2.lab_endurance != null}
                {...register2("lab_endurance", {
                  required: { value: true, message: "يجب ادخال تحمل المريض" },
                  min: { value: 0, message: "يجب ان يكون القيمه اكبر من 0" },
                  max: { value: 100, message: "يجب ان يكون القيمه اقل من 100" },
                })}
                id="outlined-basic"
                label="  تحمل المريض في المعمل"
                variant="filled"
                helperText={errors2.lab_endurance?.message}
              />
  
              <TextField
                fullWidth
                type="number"
                error={errors2.service_endurance != null}
                {...register2("service_endurance", {
                  required: { value: true, message: "يجب ادخال تحمل المريض" },
                  min: { value: 0, message: "يجب ان يكون القيمه اكبر من 0" },
                  max: { value: 100, message: "يجب ان يكون القيمه اقل من 100" },
                })}
                id="outlined-basic"
                label="  تحمل المريض في الخدمات"
                variant="filled"
                helperText={errors2.service_endurance?.message}
              />
              <Controller
                name="company"
                rules={{
                  required: {
                    value: true,
                    message: "يجب اختيار اسم الشركه",
                  },
                }}
                control={control2}
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
                            {...params}
                            helperText={errors2?.company && errors2.company.message}
                            error={errors2?.company != null}
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
  
  export default AddRelation;
  