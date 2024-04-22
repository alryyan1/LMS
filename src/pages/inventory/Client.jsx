import {
  Button,
  Divider,
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
import React, { useEffect, useState } from "react";
import { url } from "../constants.js";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { Delete } from "@mui/icons-material";

function Client() {
  //create state variable to store all clients
  const [clients, setClients] = useState([]);
  const {
    register,
    formState: { errors,isSubmitting },
    handleSubmit,
  } = useForm();
  console.log(isSubmitting)
  const submitHandler = async (formData) => {
    console.log(formData);
    // console.log(isSubmitting)
    fetch(`${url}client/create`, {
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
  const deleteClientHandler = (id)=>{
    fetch(`${url}client/${id}`, {
      method: "DELETE",
    })
     .then((res) => res.json())
     .then((data) => {
        if (data.status) {
          //delete client by id
          setClients(clients.filter((client) => client.id!= id));
          //show success dialog
          
        }
      });
  }
  useEffect(() => {
    //fetch all clients
    fetch(`${url}client/all`)
      .then((res) => res.json())
      .then((data) => {
        //set clients
        setClients(data);
        console.log(data);
      });
  }, []);
  return (
    <Grid container>
      <Grid item xs={4}>
        <Typography>اضافه عميل جديد</Typography>
        <form noValidate onSubmit={handleSubmit(submitHandler)}>
          <div >
            <TextField
              error={errors.name}
              {...register("name", {
                required: { value: true, message: "يجب ادخال اسم العميل" },
              })}
              id="outlined-basic"
              label="اسم العميل"
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
        {/* create table with all clients */}
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
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.id}</TableCell>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>{client.address}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell><IconButton onClick={()=>{
                      deleteClientHandler(client.id)
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

export default Client;
