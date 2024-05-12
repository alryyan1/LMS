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
  import { ArrowBack, ArrowForward } from "@mui/icons-material";
import axiosClient from "../../../axios-client";
import MyTableCell from "../inventory/MyTableCell";
import MyLoadingButton from "../../components/MyLoadingButton";
import { useOutletContext } from "react-router-dom";
import MyAutoCompeleteTableCell from "../inventory/MyAutoCompeleteTableCell";
  
  function AddService() {
    const [search, setSearch] = useState(null);
    const [loading, setLoading] = useState(false);
    const [services, setservices] = useState([]);
    const [links, setLinks] = useState([]);
    const [page, setPage] = useState(5);
    const {dialog,setDialog,serviceGroups} = useOutletContext()
  
    const searchHandler = (word) => {
      setSearch(word);
      axiosClient
        .get(`service/all/pagination/${page}?word=${word}`)
        .then(({ data: { data, links } }) => {
          console.log(data);
          console.log(links);
          setservices(data);
          // console.log(links)
          setLinks(links);
        });
    };
    const updateItemsTable = (link, setLoading) => {
      console.log(search);
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
          // setItems(data)
          // setLinks(links)
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
        .post("service/create", {...data,service_group_id:data.service_group_id.id})
        .then((data) => {
          if (data.status) {
            setDialog((prev)=>{
                return{
                 ...prev,
                  open:true,
                  color:"success",
                  msg:"تمت الاضافه بنجاح"
                }
            })
            reset();
          }
        })
        .finally(() => setLoading(false));
    };
    const {
      register,
      reset,
      control,
      formState: { errors, isSubmitting },
      handleSubmit,
    } = useForm();
    console.log(isSubmitting);
    useEffect(() => {
      setLoading(true);
  
      console.log("start of use effect");
      //fetch all Items
      axiosClient
        .get(`service/all/pagination/${page}`)
        .then(({ data: { data, links } }) => {
          console.log(data, "services");
          console.log(links);
          setservices(data);
          console.log(links);
          setLinks(links);
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    }, [page, isSubmitting]);
  
    return (
      <Stack direction={"row"} gap={3}>
        {loading  ? (
          <Skeleton height={400} style={{flexGrow:"1"} }></Skeleton>
        ) : (
          <div style={{flexGrow:1}}>
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
                    <TableCell>السعر</TableCell>
                    <TableCell> نصيب الطبيب (مبلغ)</TableCell>
                    <TableCell> نصيب الطبيب (نسبه)</TableCell>
                    <TableCell>القسم</TableCell>
                  </TableRow>
                </thead>
                <TableBody>
                  {services.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <MyTableCell table="service" colName={"name"} item={item}>
                        {item.name}
                      </MyTableCell>
                      <MyTableCell
                       show 
                        table="service"
                        colName={"price"}
                        item={item}
                      >
                        {item.price}
                      </MyTableCell>
                      <MyTableCell
                        table="service"
                        colName={"static_wage"}
                        item={item}
                      >
                        {item.static_wage}
                      </MyTableCell>
                      <MyTableCell
                        table="service"
                        colName={"percentage_wage"}
                        item={item}
                      >
                        {item.percentage_wage}
                      </MyTableCell>
                      <MyAutoCompeleteTableCell table="service" val={item.service_group} item={item} colName={'service_group_id'} sections={serviceGroups}>
                     
                      </MyAutoCompeleteTableCell>
                   
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
                          updateItemsTable(link, setLoading);
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
                          updateItemsTable(link, setLoading);
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
                          updateItemsTable(link, setLoading);
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
              اضافه خدمه جديده
            </Typography>
          </Stack>
          <form noValidate dir="rtl" onSubmit={handleSubmit(submitHandler)}>
            <Stack direction={"column"} gap={3}>
              <TextField
                fullWidth
                error={errors.name != null}
                {...register("name", {
                  required: { value: true, message: "يجب ادخال اسم الخدمه" },
                })}
                id="outlined-basic"
                label="اسم الخدمه"
                variant="filled"
                helperText={errors.name?.message}
              />
                <TextField
                fullWidth
                type="number"
                error={errors.price != null}
                {...register("price", {
                  required: { value: true, message: "يجب ادخال السعر" },
                })}
                id="outlined-basic"
                label="السعر"
                variant="filled"
                helperText={errors.price?.message}
              />
              <Stack direction={'row'} gap={5}>
              <TextField
                fullWidth
                type="number"
                error={errors.static_wage != null}
                {...register("static_wage", {
                  required: { value: true, message: "نصيب الطبيب (المبلغ)" },
                })}
                id="outlined-basic"
                label="نصيب الطبيب (المبلغ)"
                variant="filled"
                helperText={errors.static_wage?.message}
              />
                  <TextField
                fullWidth
                type="number"
                error={errors.percentage_wage != null}
                {...register("percentage_wage", {
                  required: { value: true, message: "نصيب الطبيب (نسبه)" },
                  max:{
                    value: 100,
                    message: "يجب ان يكون النسبه اقل من 100",
                    validate: (value) => {
                        return value <= 100;
                    }
                  }
                })}
                id="outlined-basic"
                label="نصيب الطبيب (نسبه)"
                variant="filled"
                helperText={errors.percentage_wage?.message}
              />
              </Stack>
             
              <Controller
                control={control}
                name="service_group_id"
                rules={{
                    required: {
                        value: true,
                        message: "يجب ادخال القسم",
                    },
                }}
                render={({field})=>{
                    return <Autocomplete
                    {...field}
                    options={serviceGroups}
                    getOptionLabel={(option)=>option.name}
                    onChange={(_,newVal)=>field.onChange(newVal)}
                    renderInput={(params)=>{
                        return <TextField 
                        error={errors.service_group_id != null}
                        helperText ={errors.service_group_id && errors.service_group_id.message}
                        {...params} label="القسم" variant="filled" />
                    }}
                    />
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
        </div>
      </Stack>
    );
  }
  
  export default AddService;
  