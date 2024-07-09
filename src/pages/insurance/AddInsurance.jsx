import {
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
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import axiosClient from "../../../axios-client";
import MyTableCell from "../inventory/MyTableCell";
import MyLoadingButton from "../../components/MyLoadingButton";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";

function AddInsurance() {
  const [search, setSearch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [links, setLinks] = useState([]);
  const [page, setPage] = useState(5);
 const {setDialog} = useOutletContext()

  const searchHandler = (word) => {
    setSearch(word);
    axiosClient
      .get(`company/all/pagination/${page}?word=${word}`)
      .then(({ data: { data, links } }) => {
        console.log(data);
        console.log(links);
        setCompanies(data);
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
        setLoading(false);
      })
      .finally(() => {
       
      });
  };
  //create state variable to store all Items
  const submitHandler = (data) => {
    setLoading(true);

    console.log(data, "submitted data");
    axiosClient
      .post("company/create", data)
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
  const {
    register,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm();
  console.log(isSubmitting);
  useEffect(() => {

    console.log("start of use effect");
    //fetch all Items
    axiosClient
      .get(`company/all/pagination/${page}`)
      .then(({ data: { data, links } }) => {
        console.log(data, "companies");
        console.log(links);
        setCompanies(data);
        console.log(links);
        setLinks(links);
      })
      .catch((error) => console.log(error))
      
  }, [page, isSubmitting]);

  return (
    <Stack direction={"row"} gap={3}>
      {loading  ? (
        <Skeleton height={400} style={{flexGrow:"2"} }></Skeleton>
      ) : (
        <div style={{ flexGrow: "1" }}>
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
                  <TableCell>تحمل المعمل</TableCell>
                  <TableCell> تحمل الخدمات </TableCell>
                  <TableCell> رقم الهاتف </TableCell>
                  <TableCell> سقف المعمل </TableCell>
                  <TableCell> سقف الخدمات </TableCell>
                </TableRow>
              </thead>
              <TableBody>
                {companies.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <MyTableCell table="company" colName={"name"} item={item}>
                      {item.name}
                    </MyTableCell>
                    <MyTableCell
                      table="company"
                      colName={"lab_endurance"}
                      item={item}
                    >
                      {item.lab_endurance}
                    </MyTableCell>
                    <MyTableCell
                      table="company"
                      colName={"service_endurance"}
                      item={item}

                    >
                      {item.service_endurance}
                    </MyTableCell>
                    <MyTableCell table="company" colName={"phone"} item={item}>
                      {item.phone}
                    </MyTableCell>
                    <MyTableCell
                      table="company"
                      colName={"lab_roof"}
                      item={item}
                    >
                      {item.lab_roof}
                    </MyTableCell>
                    <MyTableCell
                      table="company"
                      colName={"service_roof"}
                      item={item}
                    >
                      {item.service_roof}
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
      <div >
        <Stack direction={"row"} justifyContent={"center"} spacing={4}>
          <Typography variant="h3" fontFamily={"Tajwal-Regular"}>
            اضافه تعاقد جديد
          </Typography>
        </Stack>
        <form noValidate dir="rtl" onSubmit={handleSubmit(submitHandler)}>
          <Stack direction={"column"} gap={3}>
            <TextField
             InputLabelProps={{
              style: { fontSize:'1rem' },
            }}
              fullWidth
              error={errors.name != null}
              {...register("name", {
                required: { value: true, message: "يجب ادخال اسم الشركه" },
              })}
              id="outlined-basic"
              label="اسم الشركه"
              variant="filled"
              helperText={errors.name?.message}
            />

            <Stack direction={"row"} gap={2}>
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
            </Stack>
            <Stack direction={"row"} gap={2}>
              <TextField
                fullWidth
                type="number"
                error={errors.lab_roof != null}
                {...register("lab_roof", {
                  required: { value: true, message: "يجب ادخال سقف المعمل " },
                })}
                id="outlined-basic"
                label="سقف المعمل"
                variant="filled"
                helperText={errors.lab_roof?.message}
                

              />

              <TextField
                fullWidth
                type="number"
                error={errors.service_roof != null}
                {...register("service_roof", {
                  required: { value: true, message: "يجب ادخال سقف الخدمات " },
                })}
                id="outlined-basic"
                label="  سقف المريض في الخدمات"
                variant="filled"
                helperText={errors.service_roof?.message}
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
              <TextField
                fullWidth
                error={errors.email != null}
                {...register("email", {
                  required: { value: true, message: "يجب ادخال ايميل  " },
                })}
                label="ايميل"
                variant="filled"
                helperText={errors.email?.message}
                
              />
            </Stack>
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

export default AddInsurance;
