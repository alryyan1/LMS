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
import { formatNumber, webUrl } from "../constants.js";

import { Account, Debit } from "../../types/type.js";
import DateComponent from "./DateComponent.js";
  function Ledger() {
    //create state variable to store all Accounts
    const {dialog, setDialog }=  useOutletContext()
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [accountLedger, setAccountLedger] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState<Account|null>(null);
    const [entries, setEntries] = useState([]);
    const [firstDate, setFirstDate] = useState(dayjs(new Date()));
  
    const [secondDate, setSecondDate] = useState(dayjs(new Date()));
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
          axiosClient(`financeEntries?first=${firstDate.format("YYYY/MM/DD")}&second=${secondDate.format("YYYY/MM/DD")}`)
          .then(({data}) => {
            setEntries(data);
            console.log(data,'accounts');
          });
      }, []);
      //

      useEffect(()=>{
        axiosClient(`ledger/${selectedAccount?.id}`)
        .then(({data}) => {
          setAccountLedger(data);
          console.log(data,'ledgers');
        });
      },[selectedAccount?.id])
  
      console.log(entries,'entries')
    return (
     <>

     <DateComponent  api={`financeEntries?first=${firstDate.format("YYYY/MM/DD")}&second=${secondDate.format("YYYY/MM/DD")}`} setData={setEntries}  setFirstDate={setFirstDate} setSecondDate={setSecondDate} firstDate={firstDate} secondDate={secondDate} accounts={accounts} setAccounts={setAccounts}/>
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
           <Button href={`${webUrl}ledger/${selectedAccount?.id}`}>PDF</Button>
          <Table key={selectedAccount?.id} dir="rtl" size="small">
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
                if (entry.credit[0].finance_account_id == selectedAccount.id || entry.debit[0].finance_account_id == selectedAccount.id) {
                  // alert('s')
                  return    (
                    <TableRow key={entry.id}>
                      <TableCell>{dayjs(new Date(Date.parse(entry.created_at))).format('YYYY-MM-DD')}</TableCell>
                      <TableCell>{entry.id}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell>{entry.debit[0].finance_account_id == selectedAccount.id ? formatNumber(entry.credit[0].amount) :0}</TableCell>
                      <TableCell>{entry.credit[0].finance_account_id == selectedAccount.id ? formatNumber(entry.credit[0].amount) :0}</TableCell>
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
      <Grid sx={{height:window.innerHeight -100,overflow:'auto'}} style={{direction:'rtl'}} item xs={4}>
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
                      <TableRow sx={{background:(theme)=>account.id == selectedAccount?.id || account?.debits?.length > 0 || account?.credits?.length > 0 ? theme.palette.warning.light:''}} key={account.id}>
                          <TableCell>{account.id}</TableCell>
                          <TableCell>{account.name}</TableCell>
                          <TableCell>{account.description}</TableCell>
                          <TableCell><Button onClick={()=>{
                              setSelectedAccount(account);
                          }}>كشف </Button></TableCell>
                      </TableRow>
                  ))}
              </TableBody>
             </Table>
      </Grid>
           {selectedAccount &&   <LedjerTDialog account={selectedAccount}  />}
    </Grid>
     </>
    );
  }
  
  export default Ledger;
  