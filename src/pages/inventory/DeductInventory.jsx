import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { url } from "../constants.js";
import {  useForm } from "react-hook-form";
import { Link, useLoaderData, useOutletContext } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { Delete } from "@mui/icons-material";
import axiosClient from "../../../axios-client.js";

function DeductInventory() {
  // console.log(items);
  //create state variable to store all suppliers
  const {dialog, setDialog} = useOutletContext();
  const [deduct, setDeduct] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deductComplete, setDeductComplete] = useState(1);
  const {
    reset,
    formState: { isSubmitted },
  } = useForm();
 

  const deleteDeductHandler = (item) => {
    setLoading(true)
    console.log(item,'deducted item')
    axiosClient.post(`inventory/deduct/item?item_id=${item.id}`)
      .then(({data}) => {
        console.log(data)
        if (data.status) {
            setLoading(false)
            setDeductComplete(deductComplete + 1);

          //delete supplier by id
          setDeduct(data.deduct);
          //show success dialog
          setDialog({
            open: true,
            message: "تم الحذف بنجاح",
          });
        }
      }).catch(({ response: { data } }) => {
        setDialog((prev) => {
          return {
            ...prev,
            open: true,
            color: "error",
            message: data.message,
          };
        });
      }).finally(()=>setLoading(false));
  };

  useEffect(() => {
    //fetch all clients
    fetch(`${url}client/all`)
      .then((res) => res.json())
      .then((data) => {
       

        setClients(data);
        console.log(data);
      });
  }, []);
  useEffect(() => {
    //fetch all suppliers
    fetch(`${url}inventory/deduct/last`)
      .then((res) => res.json())
      .then((data) => {
         console.log(data,'deduct')
        setDeduct(data);
      });
  }, [isSubmitted,deductComplete]);
  const completeAdditionHandler = () => {
    setLoading(true);
    axiosClient(`inventory/deduct/complete`)
      .then((data) => {
        if (data.status) {
          setLoading(false);
          setDeductComplete(deductComplete + 1);
          //show success dialog
          setDialog({
            open: true,
            msg: "تمت العمليه  بنجاح",
          });
        }
        console.log(data, "deposit complete");
      }).catch(({response:{data}}) =>{
        setLoading(false);
        console.log(data)
        setDialog({
          color:'error',
          open: true,
          msg: data.message,
        })
      });
  };
  return (
    <Grid container spacing={1}>
      <Grid item xs={5}>
      <Link to={"/inventory/reports/deduct"}>reports</Link>

     
      </Grid>
      <Grid item xs={7}>
        <Paper sx={{ p: 1 }} >
        <Typography variant="h4" textAlign={'center'}>
          {deduct  && deduct.id}   اذن صرف رقم

          </Typography>
        {/* create table with all suppliers */}
        <TableContainer >
          
          <Table sx={{mb:2}} dir="rtl" size="small">
            <thead>
              <TableRow>
                <TableCell>رقم</TableCell>
                <TableCell>الصنف</TableCell>
                <TableCell>العميل</TableCell>
                <TableCell>الكميه</TableCell>
                <TableCell>حذف</TableCell>
              </TableRow>
            </thead>

            <TableBody>
              {deduct && deduct.items.map((deductedItem, i) => (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{deductedItem.name}</TableCell>
                  <TableCell>{deductedItem.pivot.client.name}</TableCell>
                  <TableCell>{deductedItem.pivot.quantity}</TableCell>
                  <TableCell><LoadingButton onClick={()=>deleteDeductHandler(deductedItem)} title="delete" color="error" size="medium" loading={loading} endIcon={<Delete/>} ></LoadingButton></TableCell>
              
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {deduct && deduct.items.length > 0 && (
          <LoadingButton
            loading={loading}
            onClick={completeAdditionHandler}
            sx={{ mt: 1 }}
            color="error"
            variant="contained"
            fullWidth
          >
            اذن صرف جديد{" "}
          </LoadingButton>
        )}
        </Paper>
     
      </Grid>

     
    </Grid>
  );
}

export default DeductInventory;
