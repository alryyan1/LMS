import {
  Button,
  Grid,
  IconButton,
  Paper,
  selectClasses,
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
import ClientPaymentHistory from "../../components/ClientPaymentHistory.js";
import EmptyDialog from "../Dialogs/EmptyDialog.js";
import { Client } from "../../types/type.js";
import { formatNumber } from "../constants.js";

function ClientPage() {
  const [loading, setLoading] = useState(false);
  //create state variable to store all Pages
  const [clients, setClients] = useState([]);
  const [selctedClient, setSelctedClient] = useState<Client|null>(null)
  const [open,setOpen] = useState(false)
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
  useEffect(() => {
    setClients((prev)=>{
      return prev.map((c:Client)=>{
        if(c.id == selctedClient?.id) return selctedClient
        else return c 
      })
    })
  },[selctedClient]);
  return (
    <Grid container spacing={2}>
    
      <Grid item xs={9}>
        <Typography textAlign={'center'} variant="h5">العملاء</Typography>
        <Paper sx={{p:1}}>

        {/* create table with all clients */}
        <TableContainer>
          <Table dir="rtl" size="small">
            <thead>
              <TableRow>
                <TableCell>رقم</TableCell>
                <TableCell>الاسم</TableCell>
                <TableCell>اجمالي</TableCell>
                <TableCell>المدفوع</TableCell>
                <TableCell>المتبقي</TableCell>
                <TableCell>الهاتف</TableCell>
                <TableCell>العنوان</TableCell>
                <TableCell>الحساب</TableCell>
                {/* <TableCell>حذف</TableCell> */}
              </TableRow>
            </thead>

            <TableBody>
              {clients.map((client:Client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.id}</TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{formatNumber(client.deducts.reduce((prev,curr)=>{
                    return prev + curr.paid
                  },0))}</TableCell>
                  <TableCell>{formatNumber(client.paymentAmount)}</TableCell>
                  <TableCell>{formatNumber(client.deducts.reduce((prev,curr)=>{
                    return prev + curr.paid
                  },0) - client.paymentAmount)}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.address}</TableCell>
                  <TableCell><Button onClick={()=>{
                    setSelctedClient(client);
                    setOpen(true);
                  }}>كشف الحساب</Button></TableCell>
                  {/* <TableCell> */}
                    {/* <IconButton
                      onClick={() => {
                        deleteClientHandler(client.id);
                      }}
                    >
                      <Delete></Delete>
                    </IconButton> */}
                  {/* </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </Paper>

      </Grid>
      <Grid item xs={3}>
              <AddClientForm loading={loading} setClients={setClients} setDialog={setDialog} setLoading={setLoading}/>
      </Grid>
      <EmptyDialog setShow={setOpen} show={open} title="سداد  " >
        <ClientPaymentHistory setClient={setSelctedClient} client={selctedClient}/>
      </EmptyDialog>
              
    </Grid>
  );
}

export default ClientPage;
