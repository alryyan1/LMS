import {
  Alert,
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
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { Delete } from "@mui/icons-material";
import { CacheProvider } from "@emotion/react";
import MyTableCell from "./MyTableCell.jsx";

function Supplier() {
  //create state variable to store all suppliers
  const [openSuccessDialog, setOpenSuccessDialog] = useState({
    open: false,
    msg: "تمت الاضافه بنجاح",
  });
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    register,
    reset,
    formState: { errors, isSubmitting, isSubmitted },
    handleSubmit,
  } = useForm();
  console.log(isSubmitting);
  const submitHandler = async (formData) => {
    console.log(formData);
    setLoading(true);
    // console.log(isSubmitting)
    fetch(`${url}suppliers/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setLoading(false);
          reset()
          setOpenSuccessDialog({
            open: true,
            msg: "تمت الاضافه  بنجاح",
          });
        }
      });
  };
  const handleClose = () => {
    setOpenSuccessDialog((prev) => ({ ...prev, open: false }));
  };
  const deleteSupplierHandler = (id) => {
    fetch(`${url}suppliers/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          //delete supplier by id
          setSuppliers(suppliers.filter((supplier) => supplier.id != id));
          //show success dialog
          setOpenSuccessDialog({
            open: true,
            msg: "تم الحذف بنجاح",
          });
        }
      });
  };
  useEffect(() => {
    //fetch all suppliers
    fetch(`${url}suppliers/all`)
      .then((res) => res.json())
      .then((data) => {
        //set suppliers
        setSuppliers(data);
        console.log(data);
      });
  }, [isSubmitted]);
  return (
    <ThemeProvider theme={theme}>
      <CacheProvider value={cacheRtl}>
        <Grid container>
          <Grid item xs={4}>
            <Typography>اضافه مورد جديد</Typography>
            <form noValidate onSubmit={handleSubmit(submitHandler)}>
              <div>
                <TextField
                  fullWidth
                  error={errors.name}
                  {...register("name", {
                    required: { value: true, message: "يجب ادخال اسم المورد" },
                  })}
                  id="outlined-basic"
                  label="اسم المورد"
                  variant="filled"
                />
                {errors.name && errors.name.message}
              </div>
              <div>
                <TextField
                  fullWidth
                  error={errors.phone}
                  {...register("phone", {
                    required: { value: true, message: "يجب ادخال رقم الهاتف" },
                  })}
                  id="outlined-basic"
                  label="رقم الهاتف"
                  variant="filled"
                />
                {errors.phone && errors.phone.message}
              </div>
              <div>
                <TextField
                  fullWidth
                  error={errors.address}
                  {...register("address", {
                    required: { value: true, message: "يجب ادخال العنوان" },
                  })}
                  id="outlined-basic"
                  label="العنوان"
                  variant="filled"
                />
                {errors.address && errors.address.message}
              </div>
              <div>
                <TextField
                  sx={{ mb: 1 }}
                  fullWidth
                  error={errors.email}
                  {...register("email")}
                  id="outlined-basic"
                  label="الايميل"
                  variant="filled"
                />
                {errors.email && errors.email.message}
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
          <Grid item xs={1}>

          </Grid>
          <Grid item xs={7}>
            {/* create table with all suppliers */}
            <TableContainer>
              <Table dir="rtl" size="small">
                <TableRow>
                  <TableCell>رقم</TableCell>
                  <TableCell>الاسم</TableCell>
                  <TableCell>الهاتف</TableCell>
                  <TableCell>العنوان</TableCell>
                  <TableCell>الايميل</TableCell>
                  <TableCell>حذف</TableCell>
                </TableRow>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>{supplier.id}</TableCell>
                      <MyTableCell  setOpenSuccessDialog={setOpenSuccessDialog} item={supplier} colName={'name'}  table="suppliers" >{supplier.name}</MyTableCell>
                      <MyTableCell  setOpenSuccessDialog={setOpenSuccessDialog} item={supplier}  colName={'phone'}  table="suppliers" >{supplier.phone}</MyTableCell>
                      <MyTableCell setOpenSuccessDialog={setOpenSuccessDialog} item={supplier}  colName={'address'}  table="suppliers" >{supplier.address}</MyTableCell>
                      <MyTableCell  setOpenSuccessDialog={setOpenSuccessDialog} item={supplier} colName={'email'}  table="suppliers" >{supplier.email}</MyTableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            deleteSupplierHandler(supplier.id);
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

          <Grid item xs={3}>
            1
          </Grid>
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
      </CacheProvider>
    </ThemeProvider>
  );
}

export default Supplier;
