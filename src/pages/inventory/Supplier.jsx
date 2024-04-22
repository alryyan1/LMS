import {
    Grid,
    IconButton,
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
  
  function Supplier() {
    //create state variable to store all suppliers
    const [suppliers, setSuppliers] = useState([]);
    const {
      register,
      formState: { errors,isSubmitting },
      handleSubmit,
    } = useForm();
    console.log(isSubmitting)
    const submitHandler = async (formData) => {
      console.log(formData);
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
          console.log(data);
        });
    };
    const deleteSupplierHandler = (id)=>{
      fetch(`${url}suppliers/${id}`, {
        method: "DELETE",
      })
       .then((res) => res.json())
       .then((data) => {
          if (data.status) {
            //delete supplier by id
            setSuppliers(suppliers.filter((supplier) => supplier.id!= id));
            //show success dialog
            
          }
        });
    }
    useEffect(() => {
      //fetch all suppliers
      fetch(`${url}suppliers/all`)
        .then((res) => res.json())
        .then((data) => {
          //set suppliers
          setSuppliers(data);
          console.log(data);
        });
    }, []);
    return (
      <Grid container>
        <Grid item xs={4}>
          <Typography>اضافه مورد جديد</Typography>
          <form noValidate onSubmit={handleSubmit(submitHandler)}>
            <div >
              <TextField
                error={errors.name}
                {...register("name", {
                  required: { value: true, message: "يجب ادخال اسم المورد" },
                })}
                id="outlined-basic"
                label="اسم المورد"
                variant="standard"
              />
              {errors.name && errors.name.message}
            </div>
            <div >
              <TextField
                error={errors.phone}
                {...register("phone", {
                  required: { value: true, message: "يجب ادخال رقم الهاتف" },
                })}
                id="outlined-basic"
                label="رقم الهاتف"
                variant="standard"
              />
              {errors.phone && errors.phone.message}
            </div>
            <div >
              <TextField
                error={errors.address}
                {...register("address", {
                  required: { value: true, message: "يجب ادخال العنوان" },
                })}
                id="outlined-basic"
                label="العنوان"
                variant="standard"
              />
              {errors.address && errors.address.message}
            </div>
            <div >
              <TextField sx={{mb:1}} l
                error={errors.email}
                {...register("email")}
                id="outlined-basic"
                label="الايميل"
                variant="standard"
              />
              {errors.email && errors.email.message}
            </div>
            <div></div>
              <LoadingButton  loading={isSubmitting == true} variant="contained" type="submit">
              حفظ
            </LoadingButton>
              
           
          </form>
        </Grid>
        <Grid item xs={5}>
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
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell>{supplier.phone}</TableCell>
                      <TableCell>{supplier.address}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell><IconButton onClick={()=>{
                        deleteSupplierHandler(supplier.id)
                      }}>
                      <Delete></Delete></IconButton></TableCell>
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
    );
  }
  
  export default Supplier;
  