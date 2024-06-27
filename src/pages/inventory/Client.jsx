import {
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
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { Delete } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client.js";
import { useStateContext } from "../../appContext.jsx";

function Client() {
  const [loading, setLoading] = useState(false);
  //create state variable to store all clients
  const [clients, setClients] = useState([]);
  const { dilog, setDialog } = useOutletContext();
  const {
    register,
    reset,
    formState: { errors, isSubmitted },
    handleSubmit,
  } = useForm();
  const submitHandler = async (formData) => {
    // setLoading(true);
    try {
      const { data } = await axiosClient.post(
        "client/create",
       formData
      );
      console.log(data, "created")
      if (data.status) {
        reset();
        setClients((prev)=>[...prev,data.data]);
        setDialog((prev) => ({
          ...prev,
          color: "success",
          open: true,
          message: "تمت الاضافه بنجاح",
        }));
        setLoading(false);
      }
    } catch ({ response:{data} }) {
      
        setDialog((prev) => ({
          ...prev,
          color: "error",
          open: true,
          message: data.message,
        }));
        setLoading(false);
    }
  };
  useEffect(() => {
    document.title = 'العملاء' ;
  }, []);

  const deleteClientHandler = (id) => {
    axiosClient.delete(`client/${id}`)
      .then(({data}) => {
        if (data.status) {
          setDialog((prev) => ({
            ...prev,
            color: "error",
            open: true,
            message: data.message,
          }));
          //delete client by id
          setClients(clients.filter((client) => client.id != id));
          //show success dialog
        }
      }).catch(({response:{data}})=>{
        setDialog((prev) => ({
          ...prev,
          color: "error",
          open: true,
          message: data.message,
        }));
      });
  };
  useEffect(() => {
    //fetch all clients
    axiosClient(`client/all`)
      .then(({data}) => {
        setClients(data);
        console.log(data);
      });
  }, []);
  return (
    <Grid container spacing={2}>
    
      <Grid item xs={8}>
        <Paper sx={{p:1}}>

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
        </Paper>

      </Grid>
      <Grid item xs={4}>
      <Paper sx={{p:1}}>
        
        <Typography textAlign={'center'} variant="h4">اضافه عميل جديد</Typography>
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
              variant="filled"
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
              variant="filled"
              type="number"
              
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
              variant="filled"
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
              variant="filled"
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
        </Paper>
      </Grid>
              
    </Grid>
  );
}

export default Client;
