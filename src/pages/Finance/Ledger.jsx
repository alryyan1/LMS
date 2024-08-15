import {
    Button,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { useOutletContext } from "react-router-dom";
  import axiosClient from "../../../axios-client.js";
import dayjs from "dayjs";
import AddEntryForm from "./AddEntryForm.jsx";
  
  function Ledger() {
    //create state variable to store all Accounts
  
    const [accounts, setAccounts] = useState([]);
    const [accountLedger, setAccountLedger] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
   
    useEffect(() => {
      document.title = 'دفتر الاستاذ ' ;
    }, []);
    useEffect(() => {
        //fetch all Accounts
        axiosClient(`financeAccounts`)
          .then(({data}) => {
            setAccounts(data);
            console.log(data,'accounts');
          });
      }, []);

      useEffect(()=>{
        axiosClient(`ledger/${selectedAccount?.id}`)
        .then(({data}) => {
          setAccountLedger(data);
          console.log(data,'ledgers');
        });
      },[selectedAccount?.id])
  
  
    return (
      <Grid container spacing={2}>
      
        <Grid item xs={8}>
          <Paper sx={{p:1}}>
  
          {/* create table with all clients */}
        {selectedAccount &&   <TableContainer key={selectedAccount.id}>
           <Typography textAlign={'center'} variant="h3"> {selectedAccount?.name}</Typography>
            <Table dir="rtl" size="small">
              <thead>
                <TableRow>
                  <TableCell>التاريخ</TableCell>
                  <TableCell>رقم القيد</TableCell>
                  <TableCell>البيان</TableCell>
                  <TableCell>مدين </TableCell>
                  <TableCell> دائن  </TableCell>
                  <TableCell> رصيد  </TableCell>
                </TableRow>
              </thead>
  
              <TableBody>
                {accountLedger.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{dayjs(new Date(Date.parse(entry.date))).format('YYYY-MM-DD')}</TableCell>
                    <TableCell>{entry.id}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>{entry.debit}</TableCell>
                    <TableCell>{entry.credit}</TableCell>
                    <TableCell>{entry.amount}</TableCell>
            
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer> }
          </Paper>
  
        </Grid>
        <Grid item xs={4}>
               <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>رقم الحساب</TableCell>
                        <TableCell>اسم الحساب</TableCell>
                        <TableCell>وصف الحساب </TableCell>
                        <TableCell>كشف الحساب </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {accounts.map((account) => (
                        <TableRow sx={{background:(theme)=>account.id == selectedAccount?.id ? theme.palette.warning.light:''}} key={account.id}>
                            <TableCell>{account.id}</TableCell>
                            <TableCell>{account.name}</TableCell>
                            <TableCell>{account.description}</TableCell>
                            <TableCell><Button onClick={()=>{
                                setSelectedAccount(account);
                            }}>كشف الحساب</Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
               </Table>
        </Grid>
                
      </Grid>
    );
  }
  
  export default Ledger;
  