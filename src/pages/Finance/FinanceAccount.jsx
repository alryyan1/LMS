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
import AddAcountForm from "./AddAcountForm.jsx";
import dayjs from "dayjs";
  
  function FinanceAccount() {
    const [loading, setLoading] = useState(false);
    //create state variable to store all Accounts
    const [Accounts, setAccounts] = useState([]);
    const { dilog, setDialog } = useOutletContext();
  
   
    useEffect(() => {
      document.title = 'اضافه حساب' ;
    }, []);
  
    const deleteAccountHandler = (id) => {
      axiosClient.delete(`financeAccounts/${id}`)
        .then(({data}) => {
          if (data.status) {
            setDialog((prev) => ({
              ...prev,
              open: true,
              message: 'تم العمليه بنجاح'
            }));
            //delete client by id
            setAccounts(Accounts.filter((client) => client.id != id));
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
      //fetch all Accounts
      axiosClient(`financeAccounts`)
        .then(({data}) => {
          setAccounts(data);
          console.log(data,'accounts');
        });
    }, []);
    return (
      
  
          <Paper sx={{p:1}}>
  
          {/* create table with all clients */}
          <TableContainer>
            <Table dir="rtl" size="small">
              <thead>
                <TableRow>
                  <TableCell>رقم</TableCell>
                  <TableCell>الاسم</TableCell>
                  <TableCell>الكود</TableCell>
                  {/* <TableCell>طبيعه الحساب</TableCell> */}
                  <TableCell> تاريخ انشاء الحساب</TableCell>
                  <TableCell>حذف</TableCell>
                </TableRow>
              </thead>
  
              <TableBody>
                {Accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>{account.id}</TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>{account.code}</TableCell>
                    {/* <TableCell>{account.debit  ==  0 ? 'debit' : 'credit'}</TableCell> */}
                    <TableCell>{dayjs(new Date(Date.parse(account.created_at))).format('YYYY-MM-DD')}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          deleteAccountHandler(account.id);
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
  
     
    
    );
  }
  
  export default FinanceAccount;
  