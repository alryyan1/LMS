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
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client.js";
import { useStateContext } from "../../appContext.jsx";

function Client() {
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(1);
  //create state variable to store all clients
  const [clients, setClients] = useState([]);
  const { dilog, setDilog } = useOutletContext();
  const {
    register,
    reset,
    formState: { errors, isSubmitted },
    handleSubmit,
  } = useForm();
  const { setUser, setToken } = useStateContext();
  console.log(isSubmitted, "is submitted");
  const submitHandler = async (formData) => {
    // setLoading(true);
    try {
      const { data } = await axiosClient.post(
        "client/create",
        new URLSearchParams(formData)
      );
      if (data.status) {
        reset();
        setDilog((prev) => ({
          ...prev,
          color: "success",
          open: true,
          msg: "تمت الاضافه بنجاح",
        }));
        setUpdate((prev) => prev + 1);
        setLoading(false);
      }
    } catch ({ response }) {
      console.log(response.data);
      if (response.status == 404) {
        setDilog((prev) => ({
          ...prev,
          color: "error",
          open: true,
          msg: response.data.message,
        }));
        setLoading(false);
        setTimeout(() => {
          setUser(null);
          setToken(null);
        }, 4000);
      }
    }
  };
  const deleteClientHandler = (id) => {
    fetch(`${url}client/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          //delete client by id
          setClients(clients.filter((client) => client.id != id));
          //show success dialog
        }
      });
  };
  useEffect(() => {
    //fetch all clients
    fetch(`${url}client/all`)
      .then((res) => res.json())
      .then((data) => {
        setClients(data);
        console.log(data);
      });
  }, [update]);
  return (
    <Grid container>
      <Grid item xs={4}>
        <Typography>اضافه عميل جديد</Typography>
        <form noValidate onSubmit={handleSubmit(submitHandler)}>
          <div>
            <TextField
              fullWidth
              error={errors.name != null}
              {...register("name", {
                required: { value: true, message: "يجب ادخال اسم العميل" },
              })}
              id="outlined-basic"
              label="اسم العميل"
              variant="standard"
              helperText ={errors.name && errors.name.message}
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
              variant="standard"
              helperText ={errors.phone && errors.phone.message}
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
              variant="standard"
              helperText ={errors.address && errors.address.message}
            />
          </div>
          <div>
            <TextField
              sx={{ mb: 1 }}
              fullWidth
              {...register("email")}
              id="outlined-basic"
              label="الايميل"
              variant="standard"
              helperText ={errors.email && errors.email.message}
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
      </Grid>
      <Grid item xs={1}></Grid>
      <Grid item xs={6}>
        {/* create table with all clients */}
        <TableContainer>
          <Table dir="rtl" size="small">
            <thead>
              <TableRow>
                <TableCell>رقم</TableCell>
                <TableCell>الاسم</TableCell>
                <TableCell>الهاتف</TableCell>
                <TableCell>العنوان</TableCell>
                <TableCell>الايميل</TableCell>
                <TableCell>حذف</TableCell>
              </TableRow>
            </thead>

            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.id}</TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.address}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        deleteClientHandler(client.id);
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
  );
}

export default Client;
