import {
  Alert,
  Autocomplete,
  createTheme,
  Divider,
  Grid,
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { cacheRtl, theme, url } from "../constants.js";
import { useForm, Controller } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { Delete } from "@mui/icons-material";
import { useLoaderData } from "react-router-dom";

import { CacheProvider } from "@emotion/react";
import MyTableCell from "./MyTableCell.jsx";
import MyAutoCompeleteTableCell from "./MyAutoCompeleteTableCell.jsx";

function Item() {
  const [loading, setLoading] = useState(false);
  const sections = useLoaderData();
  //create state variable to store all Items
  const [Items, setItems] = useState([]);
  const [openSuccessDialog, setOpenSuccessDialog] = useState({
    open: false,
    msg: "تمت الاضافه بنجاح",
  });
  const {
    register,
    formState: { errors, isSubmitting, isSubmitted },
    control,
    reset,
    handleSubmit,
  } = useForm();
  console.log(isSubmitting);
  const submitHandler = async (formData) => {
    setLoading(true);
    fetch(`${url}items/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        name: formData.name,
        section: formData.section.id,
        unit_name: formData.unit_name,
        balance: formData.balance,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          reset();
          setLoading(false);
          //show snackbar
          setOpenSuccessDialog({
            open: true,
            msg: "تمت الاضافه بنجاح",
          });
        }
      });
  };
  const handleClose = () => {
    setOpenSuccessDialog((prev) => ({ ...prev, open: false }));
  };
  const deleteItemHandler = (id) => {
    fetch(`${url}items/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          //delete Item by id
          setItems(Items.filter((Item) => Item.id != id));
          //show success dialog
        }
      });
  };
  useEffect(() => {
    //fetch all Items
    fetch(`${url}items/all`)
      .then((res) => res.json())
      .then((data) => {
        //set Items
        console.log(data, "items");
        setItems(data);
      });
  }, [isSubmitted]);
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <Grid container>
          <Grid item xs={4}>
            <Divider>
              {" "}
              <Typography variant="h3" fontFamily={"Tajwal-Regular"}>
                اضافه صنف جديد
              </Typography>
            </Divider>
            <form noValidate dir="rtl" onSubmit={handleSubmit(submitHandler)}>
              <div>
                <TextField
                  sx={{ mb: 1 }}
                  fullWidth
                  error={errors.name}
                  {...register("name", {
                    required: { value: true, message: "يجب ادخال اسم الصنف" },
                  })}
                  id="outlined-basic"
                  label="اسم الصنف"
                  variant="filled"
                />
                {errors.name && errors.name.message}
              </div>
              <div>
                <Controller
                  rules={{
                    required: {
                      value: true,
                      message:
                        "Please tell us what you're an expert on. It helps us prioritize your referrals",
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
                        onChange={(e, data) => field.onChange(data)}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => {
                          return (
                            <TextField
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
                {errors.section && errors.section.message}
              </div>
              <div>
                <TextField
                  fullWidth
                  variant="filled"
                  sx={{ mb: 1 }}
                  label={"اسم الوحده"}
                  error={errors.unit_name}
                  {...register("unit_name", {
                    required: {
                      value: true,
                      message: "يجب ادخال اسم الوحده",
                    },
                  })}
                ></TextField>
                {errors.unit_name && errors.unit_name.message}
              </div>
              <div>
                <TextField
                  fullWidth
                  sx={{ mb: 1 }}
                  l
                  error={errors.balance}
                  {...register("balance", {
                    required: { value: true, message: "يجب ادخال رصيد الصنف" },
                  })}
                  id="outlined-basic"
                  label="رصيد اول المده"
                  variant="filled"
                />
                {errors.balance && errors.balance.message}
              </div>
              <div></div>
              <LoadingButton
                fullWidth
                loading={loading}
                variant="contained"
                type="submit"
              >
                حفظ
              </LoadingButton>
            </form>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={7}>
            {/* create table with all Items */}
            <TableContainer>
              <Table dir="rtl" size="small">
                <TableRow>
                  <TableCell>رقم</TableCell>
                  <TableCell>الاسم</TableCell>
                  <TableCell>القسم</TableCell>
                  <TableCell>الوحده</TableCell>
                  <TableCell>حذف</TableCell>
                </TableRow>
                <TableBody>
                  {Items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell >{item.id}</TableCell>
                      <MyTableCell colName={'name'} item={item} setOpenSuccessDialog={setOpenSuccessDialog}>
                        {item.name}
                      </MyTableCell>
                      <MyAutoCompeleteTableCell colName={'section_id'} item={item} setOpenSuccessDialog={setOpenSuccessDialog}  sections={sections}>{item.section.name}</MyAutoCompeleteTableCell>
                      <MyTableCell colName={'unit_name'} item={item} setOpenSuccessDialog={setOpenSuccessDialog}>
                        {item.unit_name}
                      </MyTableCell>                      <TableCell>
                        <IconButton
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
          </Grid>

          <Snackbar
            open={openSuccessDialog.open}
            autoHideDuration={2000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              {openSuccessDialog.msg}{" "}
            </Alert>
          </Snackbar>
        </Grid>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default Item;
