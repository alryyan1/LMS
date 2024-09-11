import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { url } from "../constants.js";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { Delete } from "@mui/icons-material";
import MyTableCell from "./MyTableCell.jsx";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client.js";

function Supplier() {
  //create state variable to store all suppliers
  const { dialog, setDialog } = useOutletContext();
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
    axiosClient
      .post(`suppliers/create`, formData)
      .then((data) => {
        if (data.status) {
          setLoading(false);
          reset();
          setDialog({
            open: true,
            message: "تمت الاضافه  بنجاح",
          });
        }
      })
      .catch(({ response: { data } }) => {
        console.log(data);
        setLoading(true);

        setDialog({
          color: "error",
          open: true,
          message: data.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    document.title = 'الموردون' ;
  }, []);
  const handleClose = () => {
    setDialog((prev) => ({ ...prev, open: false }));
  };
  const deleteSupplierHandler = (id) => {
    axiosClient
      .delete(`suppliers/${id}`)
      .then((data) => {
        if (data.status) {
          //delete supplier by id
          setSuppliers(suppliers.filter((supplier) => supplier.id != id));
          //show success dialog
          setDialog({
            open: true,
            message: "Delete was successfull",
          });
        }
      })
      .catch(({ response: { data } }) => {
        console.log(data);
        setDialog({
          color: "error",
          open: true,
          message: data.message,
        });
      });
  };
  useEffect(() => {
    //fetch all suppliers
    axiosClient.get(`suppliers/all`)
      .then(({data}) => {
        //set suppliers
        setSuppliers(data);
        console.log(data);
      });
  }, [isSubmitted]);
  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        {/* create table with all suppliers */}
        <Box sx={{p:2 }}>
          <TableContainer>
            <Table dir="rtl" size="small">
              <thead>
                <TableRow>
                  <TableCell>رقم</TableCell>
                  <TableCell>الاسم</TableCell>
                  <TableCell>الهاتف</TableCell>
                  <TableCell>العنوان</TableCell>
                  <TableCell>الايميل</TableCell>
                  <TableCell>كشف الحساب </TableCell>
                  <TableCell>حذف</TableCell>
                </TableRow>
              </thead>

              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>{supplier.id}</TableCell>
                    <MyTableCell
                      item={supplier}
                      colName={"name"}
                      table="suppliers"
                    >
                      {supplier.name}
                    </MyTableCell>
                    <MyTableCell
                      item={supplier}
                      colName={"phone"}
                      table="suppliers"
                    >
                      {supplier.phone}
                    </MyTableCell>
                    <MyTableCell
                     setDialog={setDialog}
                      show
                      item={supplier}
                      colName={"address"}
                      table="suppliers"
                    >
                      {supplier.address}
                    </MyTableCell>
                    <MyTableCell
                      item={supplier}
                      colName={"email"}
                      table="suppliers"
                    >
                      {supplier.email}
                    </MyTableCell>
                    <TableCell><Button variant="contained">كشف الحساب</Button></TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                         const result = confirm('هل انت متاكد من حذف المورد سيتم حذف جميع العمليات المتعلقه بالمورد من فواتير وغيرها')
                         if (result) {
                          
                           deleteSupplierHandler(supplier.id);
                         }
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
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box sx={{p:2 }}>
          <Typography textAlign={"center"} variant="h4">
            اضافه مورد جديد
          </Typography>
          <form noValidate onSubmit={handleSubmit(submitHandler)}>
            <div>
              <TextField
                fullWidth
                error={errors.name != null}
                {...register("name", {
                  required: { value: true, message: "يجب ادخال اسم المورد" },
                })}
                id="outlined-basic"
                label="اسم المورد"
                variant="filled"
                helperText={errors.name && errors.name.message}
              />
            </div>
            <div>
              <TextField
                fullWidth
                error={errors.phone != null}
                {...register("phone", {
                  required: { value: true, message: "يجب ادخال رقم الهاتف" },
                })}
                id="outlined-basic"
                label="رقم الهاتف"
                variant="filled"
                type="number"
                helperText={errors.phone && errors.phone.message}
              />
            </div>
            <div>
              <TextField
                fullWidth
                error={errors.address != null}
                {...register("address", {
                  required: { value: true, message: "يجب ادخال العنوان" },
                })}
                id="outlined-basic"
                label="العنوان"
                variant="filled"
                helperText={errors.address && errors.address.message}
              />
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
                helperText={errors.email && errors.email.message}
              />
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
        </Box>
      </Grid>
    </Grid>
  );
}

export default Supplier;
