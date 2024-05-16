  import {
  Alert,
  Autocomplete,
  Button,
  Divider,
  Grid,
  IconButton,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useEffect, useState } from "react";
import { url } from "../constants.js";
import { useForm, Controller } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { Delete } from "@mui/icons-material";
import { useLoaderData, useOutletContext } from "react-router-dom";
import MyTableCell from "./MyTableCell.jsx";
import MyAutoCompeleteTableCell from "./MyAutoCompeleteTableCell.jsx";
import axiosClient from "../../../axios-client.js";
import MyLoadingButton from "../../components/MyLoadingButton.jsx";

function Item() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(5);
  const [search, setSearch] = useState(null);
  const [links, setLinks] = useState([]);
  const sections = useLoaderData();
  //create state variable to store all Items
  const [Items, setItems] = useState([]);
  const { dialog, setDialog } = useOutletContext();

  const {
    register,
    setValue,
    formState: { errors, isSubmitting, isSubmitted },
    control,
    reset,
    handleSubmit,
  } = useForm();
  console.log(isSubmitting);
  const submitHandler = async (formData) => {
    console.log(formData, "formdata");
    setLoading(true);
    fetch(`${url}items/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        name: formData.name,
        section: formData.section.id,
        require_amount: formData.require_amount,
        initial_balance: formData.initial_balance,
        initial_price: formData.initial_price,
        tests: formData.tests,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          reset();
          setValue("section", null);
          setLoading(false);
          //show snackbar
          setDialog({
            open: true,
            msg: "تمت الاضافه بنجاح",
          });
        }
      })
      .catch((err) => console.log(err));
  };
  const searchHandler = (word) => {
    setSearch(word);
    axiosClient
      .get(`items/all/pagination/${page}?word=${word}`)
      .then(({ data: { data, links } }) => {
        console.log(data);
        console.log(links);
        setItems(data);
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
        setItems(data);
        setLinks(links);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteItemHandler = (id) => {
    fetch(`${url}items/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status) {
          //delete Item by id
          setItems(Items.filter((Item) => Item.id != id));
          //show dialog
          setDialog({
            open: true,
            msg: "تم الحذف بنجاح",
          });
        }
      });
  };
  useEffect(() => {
    //fetch all Items
    axiosClient
      .get(`items/all/pagination/${page}`)
      .then(({ data: { data, links } }) => {
        console.log(data, "items");
        console.log(links);
        setItems(data);
        console.log(links);
        setLinks(links);
      });
  }, [isSubmitted, page]);
  // useEffect(() => {
  //   //fetch all Items
  //   fetch(`${url}items/all`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       //set Items
  //       console.log(data, "items");
  //       setItems(data);
  //     });
  // }, [isSubmitted]);
  return (
    <Grid container>
      <Grid item xs={7}>
        <Stack sx={{mb:1}} direction={'row'} justifyContent={'space-between'}>
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
          value={search}
          onChange={(e) => {
            searchHandler(e.target.value);
          }}
          label="بحث"
        ></TextField>
       
        </Stack>
      
        {/* create table with all Items */}
        <TableContainer sx={{ mb: 1 }}>
          <Table dir="rtl" size="small">
            <thead>
              <TableRow>
                <TableCell>رقم</TableCell>
                <TableCell>الاسم</TableCell>
                <TableCell>القسم</TableCell>
                <TableCell>رصيد اول المده</TableCell>
                <TableCell> الحد الادني </TableCell>
                <TableCell> سعر الوحده المبدئي </TableCell>
                <TableCell>حذف</TableCell>
              </TableRow>
            </thead>
            <TableBody>
              {Items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <MyTableCell colName={"name"} item={item}>
                    {item.name}
                  </MyTableCell>
                  <MyAutoCompeleteTableCell val={item.section}
                    colName={"section_id"}
                    item={item}
                    sections={sections}
                  >
                    {item?.section?.name}
                  </MyAutoCompeleteTableCell>
                  <MyTableCell colName={"initial_balance"} item={item}>
                    {item.initial_balance}
                  </MyTableCell>
                  <MyTableCell colName={"require_amount"} item={item}>
                    {item.require_amount}
                  </MyTableCell>
                  <MyTableCell colName={"initial_price"} item={item}>
                    {item.initial_price}
                  </MyTableCell>
                  <TableCell>
                    <IconButton size="small"
                      onClick={() => {
                        deleteItemHandler(item.id);
                      }}
                    >
                      <Delete></Delete>
                    </IconButton>
                  </TableCell>
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
                    <ArrowBackIosIcon />
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
                    <ArrowForwardIosIcon />
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
      </Grid>
      <Grid item xs={1}></Grid>

      <Grid item xs={4}>
    
        <Divider>
          <Typography variant="h3" fontFamily={"Tajwal-Regular"}>
            اضافه صنف جديد
          </Typography>
        </Divider>
        <form noValidate dir="rtl" onSubmit={handleSubmit(submitHandler)}>
          <Stack direction={'column'} spacing={3}>
            <TextField
              fullWidth
              error={errors.name}
              {...register("name", {
                required: { value: true, message: "يجب ادخال اسم الصنف" },
              })}
              id="outlined-basic"
              label="اسم الصنف"
              variant="filled"
              helperText={errors.name && errors.name.message}
            />
            <Controller
              rules={{
                required: {
                  value: true,
                  message: "اختار القسم",
                },
              }}
              name="section"
              control={control}
              render={({ field }) => {
                return (
                  <Autocomplete
                    sx={{ mb: 1 }}
                    {...field}
                    options={sections}
                    value={field.value || null}
                    onChange={(e, data) => field.onChange(data)}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => {
                      return (
                        <TextField
                          helperText={errors.section && errors.section.message}
                          error={errors.section}
                          {...params}
                          label="القسم"
                          variant="filled"
                        />
                      );
                    }}
                  ></Autocomplete>
                );
              }}
            />

            <Stack direction={"row"} justifyContent={'space-between'} gap={2}>
              <div>
                <TextField
                  fullWidth
                  helperText={
                    errors.require_amount && errors.require_amount.message
                  }
                  error={errors.require_amount}
                  {...register("require_amount", {
                    required: { value: true, message: "يجب ادخال رصيد الصنف" },
                  })}
                  id="outlined-basic"
                  label="حد الادني للطلب"
                  variant="filled"
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  helperText={
                    errors.tests && errors.tests.message
                  }
                  error={errors.tests}
                  {...register("tests")}
                  id="outlined-basic"
                  label="عدد التحاليل"
                  variant="filled"
                />
              </div>

              <div>
                <TextField
                  fullWidth
                  error={errors.initial_balance}
                  {...register("initial_balance", {
                    required: {
                      value: true,
                      message: "يجب ادخال رصيد اول المده ",
                    },
                  })}
                  id="outlined-basic"
                  label="رصيد اول المده"
                  variant="filled"
                  helperText={
                    errors.initial_balance && errors.initial_balance.message
                  }
                />
              </div>
            </Stack>

            <TextField
              fullWidth
              error={errors.initial_price}
              {...register("initial_price", {
                required: { value: true, message: "يجب ادخال  السعر  " },
              })}
              id="outlined-basic"
              label="سعر الوحده "
              variant="filled"
              helperText={errors.initial_price && errors.initial_price.message}
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

export default Item;
