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
import AddClientForm from "../../components/AddClientForm.jsx";

function Client() {
  const [loading, setLoading] = useState(false);
  //create state variable to store all clients
  const [clients, setClients] = useState([]);
  const { dilog, setDialog } = useOutletContext();

 
  useEffect(() => {
    document.title = 'العملاء' ;
  }, []);

  const deleteClientHandler = (id) => {
    axiosClient.delete(`client/${id}`)
      .then(({data}) => {
        if (data.status) {
          setDialog((prev) => ({
            ...prev,
            open: true,
            message: 'تم العمليه بنجاح'
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
              <AddClientForm loading={loading} setClients={setClients} setDialog={setDialog} setLoading={setLoading}/>
      </Grid>
              
    </Grid>
  );
}

export default Client;
