import {
    Button,
    Grid,
    IconButton,
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
import TitleIcon from '@mui/icons-material/Title';
import LedjerTDialog from "./LedjerTDialog.jsx";
import { formatNumber } from "../constants.js";
  function Ledger() {
    //create state variable to store all Accounts
    const {dialog, setDialog }=  useOutletContext()
    const [accounts, setAccounts] = useState([]);
    const [accountLedger, setAccountLedger] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [entries, setEntries] = useState([]);
    const [debits, setDebits] = useState([]);
    const [credits, setCredits] = useState([]);

    useEffect(() => {
      //fetch all Accounts
      axiosClient(`financeEntries`)
        .then(({data}) => {
            setEntries(data);
          console.log(data,'financeEntries');
        });
        axiosClient(`debits`)
        .then(({data}) => {
            setDebits(data);
          console.log(data,'debits');
        });
        axiosClient(`credits`)
        .then(({data}) => {
            setCredits(data);
          console.log(data,'credits');
        });
    }, []);
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
             
             <IconButton onClick={()=>{
              setDialog((prev)=>{
                return {...prev, showDialog: true};
              })
             }} title=" T الاستاذ حرف "><TitleIcon/></IconButton>
            <Table dir="rtl" size="small">
              <thead>
                <TableRow>
                  <TableCell>التاريخ</TableCell>
                  <TableCell>رقم القيد</TableCell>
                  <TableCell>البيان</TableCell>
                  <TableCell>Debit </TableCell>
                  <TableCell> Credit  </TableCell>
                  <TableCell> رصيد  </TableCell>
                </TableRow>
              </thead>
  
              <TableBody>
                {entries.map((entry) => {
                  if (entry.credit[0].account.id == selectedAccount.id || entry.debit[0].account.id == selectedAccount.id) {
                    // alert('s')
                    return    (
                      <TableRow key={entry.id}>
                        <TableCell>{dayjs(new Date(Date.parse(entry.created_at))).format('YYYY-MM-DD')}</TableCell>
                        <TableCell>{entry.id}</TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell>{entry.debit[0].account.id == selectedAccount.id ? formatNumber(entry.credit[0].amount) :0}</TableCell>
                        <TableCell>{entry.credit[0].account.id == selectedAccount.id ? formatNumber(entry.credit[0].amount) :0}</TableCell>
                        <TableCell>{0}</TableCell>
                      
                
                      </TableRow>
                    )
                  }
               
                })}
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
             {selectedAccount &&   <LedjerTDialog account={selectedAccount} debits={debits}  credits={credits}/>}
      </Grid>
    );
  }
  
  export default Ledger;
  