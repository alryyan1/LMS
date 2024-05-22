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
import MyAutoCompeleteTableCell from "../inventory/MyAutoCompeleteTableCell";
  
  function Doctors() {
   const {specialists} = useOutletContext()
    const [search, setSearch] = useState(null);
    const [loading, setLoading] = useState(false);
    const [links, setLinks] = useState([]);
    const [page, setPage] = useState(5);
    const [doctors, setDoctors] = useState([]);
  
    const searchHandler = (word) => {
      setSearch(word);
      axiosClient
        .get(`doctors/all/pagination/${page}?word=${word}`)
        .then(({ data: { data, links } }) => {
          console.log(data,'pagination');
          // console.log(links);
          setDoctors(data);
          // console.log(links)
          setLinks(links);
        });
    };
    const updateDoctorsTable = (link, setLoading) => {
      // console.log(search);
      setLoading(true);
      fetch(link.url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: search ? JSON.stringify({ word: search }) : null,
      })
        .then((res) => {
          return res.json();
        })
        .then(({ data, links }) => {
          console.log(data, links);
          setDoctors(data)
          setLinks(links)
        })
        .finally(() => {
          setLoading(false);
        });
    };
    //create state variable to store all Items
    const submitHandler = (data) => {
      setLoading(true);
  
      console.log(data, "submitted data");
      axiosClient
        .post("doctors/add", {...data,specialist_id:data.specialist_id.id})
        .then((data) => {
          console.log(data)
          if (data.status) {
            reset();
          }
        })
        .finally(() => setLoading(false));
    };
    const {
      register,
      reset,
      control,
      formState: { errors, isSubmitting,isSubmitSuccessful },
      handleSubmit,
    } = useForm(); 
    // console.log(isSubmitting);
    useEffect(() => {
      setLoading(true);
  
      // console.log("start of use effect");
      //fetch all Items
      axiosClient
        .get(`doctors/pagination/${page}`)
        .then(({ data: { data, links } }) => {
          // console.log(data, "companies");
          // console.log(links);
          setDoctors(data);
          // console.log(links);
          setLinks(links);
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    }, [page, isSubmitSuccessful]);
  
    return (
      <Stack direction={"row"} gap={3}>
        {loading  ? (
          <Skeleton height={400} style={{flexGrow:"2"} }></Skeleton>
        ) : (
          <div>
            <TableContainer sx={{ mb: 1 }}>
              <Stack
                sx={{ mb: 1 }}
                direction={"row"}
                justifyContent={"space-between"}
              >
                <select
                value={page}
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
                <TextField
                  size="small"
                  value={search}
                  onChange={(e) => {
                    searchHandler(e.target.value);
                  }}
                  label="بحث"
                ></TextField>
              </Stack>
  
              <Table dir="rtl" size="small">
                <thead>
                  <TableRow>
                    <TableCell>رقم</TableCell>
                    <TableCell>الاسم</TableCell>
                    <TableCell>نسبه(النقدي) </TableCell>
                    <TableCell> نسبه(التامين)  </TableCell>
                    <TableCell> رقم الهاتف </TableCell>
                    <TableCell> التخصص  </TableCell>
                    <TableCell> الثابت  </TableCell>
                  </TableRow>
                </thead>
                <TableBody>
                  {doctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell>{doctor.id}</TableCell>
                      <MyTableCell table="doctors" colName={"name"} item={doctor}>
                        {doctor.name}
                      </MyTableCell>
                      <MyTableCell
                        table="doctors"
                        colName={"cash_percentage"}
                        item={doctor}
                      >
                        {doctor.cash_percentage}
                      </MyTableCell>
                      <MyTableCell
                        table="doctors"
                        colName={"company_percentage"}
                        item={doctor}
                      >
                        {doctor.company_percentage}
                      </MyTableCell>
                      <MyTableCell table="doctors" colName={"phone"} item={doctor}>
                        {doctor.phone}
                      </MyTableCell>
                      <MyAutoCompeleteTableCell
                        val={doctor.specialist}
                        table="doctors"
                        colName={"specialist_id"}
                        item={doctor}
                        sections={specialists}
                      >
                        {doctor.specialist}
                      </MyAutoCompeleteTableCell>
                      <MyTableCell
                        table="doctors"
                        colName={"static_wage"}
                        item={doctor}
                        
                      >
                        {doctor.static_wage}
                      </MyTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
  
            <Grid sx={{ gap: "4px" }} container>
              {links.map((link, i) => {
                if (i == 0) {
                  return (
                    <Grid item xs={1} key={i}>
                      <MyLoadingButton
                        onClick={(setLoading) => {
                          updateDoctorsTable(link, setLoading);
                        }}
                        variant="contained"
                        key={i}
                      >
                        <ArrowBack />
                      </MyLoadingButton>
                    </Grid>
                  );
                } else if (links.length - 1 == i) {
                  return (
                    <Grid item xs={1} key={i}>
                      <MyLoadingButton
                        onClick={(setLoading) => {
                          updateDoctorsTable(link, setLoading);
                        }}
                        variant="contained"
                        key={i}
                      >
                        <ArrowForward />
                      </MyLoadingButton>
                    </Grid>
                  );
                } else
                  return (
                    <Grid item xs={1} key={i}>
                      <MyLoadingButton
                        active={link.active}
                        onClick={(setLoading) => {
                          updateDoctorsTable(link, setLoading);
                        }}
                      >
                        {link.label}
                      </MyLoadingButton>
                    </Grid>
                  );
              })}
            </Grid>
          </div>
        )}
        <div style={{ flexGrow: "1" }}>
          <Stack direction={"row"} justifyContent={"center"} spacing={4}>
            <Typography variant="h3" fontFamily={"Tajwal-Regular"}>
              اضافه  طبيب
            </Typography>
          </Stack>
          <form noValidate dir="rtl" onSubmit={handleSubmit(submitHandler)}>
            <Stack direction={"column"} gap={3}>
              <TextField
                fullWidth
                error={errors.name != null}
                {...register("name", {
                  required: { value: true, message: "يجب ادخال اسم الطبيب" },
                })}
                id="outlined-basic"
                label="اسم الطبيب"
                variant="filled"
                helperText={errors.name?.message}
              />
  
              <Stack direction={"row"} gap={2}>
                <TextField
                  fullWidth
                  type="number"
                  error={errors.cash_percentage != null}
                  {...register("cash_percentage", {
                    required: { value: true, message: "يجب ادخال  نسبه الطبيب" },
                    min: { value: 0, message: "يجب ان يكون القيمه اكبر من 0" },
                    max: { value: 100, message: "يجب ان يكون القيمه اقل من 100" },
                  })}
                  id="outlined-basic"
                  label="نسبه الطبيب من النقدي"
                  variant="filled"
                  helperText={errors.cash_percentage?.message}
                />
  
                <TextField
                  fullWidth
                  type="number"
                  error={errors.company_percentage != null}
                  {...register("company_percentage", {
                    min: { value: 0, message: "يجب ان يكون القيمه اكبر من 0" },
                    max: { value: 100, message: "يجب ان يكون القيمه اقل من 100" },
                  })}
                  id="outlined-basic"
                  label="نسبه الطبيب من التامين"
                  variant="filled"
                  helperText={errors.company_percentage?.message}
                />
              </Stack>
              <Stack direction={"row"} gap={2}>
                <TextField
                  fullWidth
                  type="number"
                  error={errors.static_wage != null}
                  {...register("static_wage", {
                    required: { value: true, message: "يجب ادخال  الثابت " },
                  })}
                  id="outlined-basic"
                  label="الثابت"
                  variant="filled"
                  helperText={errors.static_wage?.message}
                />
  
                <TextField
                  fullWidth
                  type="number"
                  error={errors.lab_percentage != null}
                  {...register("lab_percentage")}
                  id="outlined-basic"
                  label="نسبه الطبيب من المختبر"
                  variant="filled"
                  helperText={errors.lab_percentage?.message}
                />
              </Stack>
              <Stack direction={"row"} gap={2}>
              <TextField
                  fullWidth
                  type="number"
                  error={errors.phone != null}
                  {...register("phone", {
                    required: { value: true, message: "يجب ادخال رقم الهاتف " },
                  })}
                  label="رقم الهاتف"
                  variant="filled"
                  helperText={errors.phone?.message}
                />
            <Controller
            name="specialist_id"
            rules={{
              required: {
                value: true,
                message: "يجب اختيار اسم التخصص",
              },
            }}
            control={control}
            render={({ field }) => {
              return (
                <Autocomplete
                fullWidth
                  onChange={(e, newVal) => field.onChange(newVal)}
                  getOptionKey={(op) => op.id}
                  getOptionLabel={(option) => option.name}
                  options={specialists}
                  renderInput={(params) => {
                    // console.log(params)

                    return (
                      <TextField
                        inputRef={field.ref}
                        error={errors?.specialist_id}
                        {...params}
                        label="التخصص"
                      />
                    );
                  }}
                ></Autocomplete>
              );
            }}
          />
              </Stack>
           
              <LoadingButton
                loading={loading}
                variant="contained"
                type="submit"
              >
                حفظ
              </LoadingButton>
            </Stack>
          </form>
        </div>
      </Stack>
    );
  }
  
  export default Doctors;
  