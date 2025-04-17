import {
    Button,
    Grid,
    IconButton,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
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

import { Account, Debit, Entry } from "../../types/type.js";
import DateComponent from "./DateComponent.js";
import TotalCredits from "./TotalCredits.js";
import TotalDebits from "./DebitsAndCreditsRow.js";
import DebitsAndCreditsRow from "./DebitsAndCreditsRow.js";
  function Ledger() {
    //create state variable to store all Accounts
    const {dialog, setDialog }=  useOutletContext()
    const [loading ,setLoading] = useState(false)
    const [filter ,setFilter] = useState('')
    let [accounts, setAccounts] = useState<Account[]>([]);
    const [accountLedger, setAccountLedger] = useState<Account[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<Account|null>(null);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [firstDate, setFirstDate] = useState(dayjs().startOf('month'));
    console.log(firstDate,'first date')
  
    const [secondDate, setSecondDate] = useState(dayjs(new Date()));
    useEffect(() => {
      document.title = 'دفتر الاستاذ ' ;
    }, []);
    useEffect(() => {
        setLoading(true)
        //fetch all Accounts
        axiosClient(`financeAccounts`)
          .then(({data}) => {
            setAccounts(data);
            console.log(data,'accounts');
          }).finally(()=>setLoading(false));
              axiosClient.get("settings").then(({data})=>{
                     setFirstDate(dayjs(data.financial_year_start))
                          setSecondDate(dayjs(data.financial_year_end))
                axiosClient(`financeEntries?first=${data.financial_year_start}&second=${data.financial_year_end}`)
                .then(({data}) => {
                  setEntries(data);
                  console.log(data,'accounts');
                });
              })
     
      }, []);
      //

      useEffect(()=>{
        if(selectedAccount?.id){
          axiosClient(`ledger/${selectedAccount?.id}`)
          .then(({data}) => {
            setAccountLedger(data);
            console.log(data,'ledgers');
          });
       
        }
     
      },[selectedAccount?.id])
      accounts =   accounts.filter((a)=>a.name.includes(filter))
      console.log(entries,'entries')
      let sumDebits = 0;
      let sumCredits = 0;
    return (
     <>

     <DateComponent  api={`financeEntries?first=${firstDate.format("YYYY/MM/DD")}&second=${secondDate.format("YYYY/MM/DD")}`} setData={setEntries}  setFirstDate={setFirstDate} setSecondDate={setSecondDate} firstDate={firstDate} secondDate={secondDate} accounts={accounts} setAccounts={setAccounts}/>
     <Grid container spacing={2}>
      
      <Grid item xs={8}>
        <Paper sx={{p:1}}>

        {/* create table with all clients */}
      { selectedAccount && selectedAccount.debits.length > 0 || selectedAccount?.credits.length > 0 ? <TableContainer key={selectedAccount?.id}>
         <Typography textAlign={'center'} variant="h5"> {selectedAccount?.name}</Typography>
           
           <IconButton onClick={()=>{
            setDialog((prev)=>{
              return {...prev, showDialog: true};
            })
           }} title=" T الاستاذ حرف "><TitleIcon/></IconButton>

           <Button href={`${webUrl}ledger/${selectedAccount?.id}?first=${firstDate.format("YYYY/MM/DD")}&second=${secondDate.format("YYYY/MM/DD")}`}>PDF</Button>
           <Button href={`${webUrl}ledger-excel/${selectedAccount?.id}?first=${firstDate.format("YYYY/MM/DD")}&second=${secondDate.format("YYYY/MM/DD")}`}>Excell</Button>
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
                  let totalCreditSum = 0;
                  let totalDebitSum = 0;
                  let totalCredits = selectedAccount?.credits.reduce(
                    (accum, current) => accum + current.amount,
                    0
                  );
                  let totalDebits = selectedAccount?.debits.reduce(
                    (accum, current) => accum + current.amount,
                    0
                  );
                  // console.log(first)
                  let sumEntryCredit = selectedAccount?.credits.filter((e)=>e.finance_entry_id == entry.id).reduce(
                    (accum, current) => accum + current.amount,
                    0
                  ) ?? 0;
                  console.log(sumEntryCredit,'sumEntryCredit')
                  sumCredits+=sumEntryCredit
                  let sumEntryDebit = selectedAccount?.debits.filter((e)=>e.finance_entry_id == entry.id).reduce(
                    (accum, current) => accum + current.amount,
                    0
                  )?? 0;
                  sumDebits += sumEntryDebit
                  totalCreditSum += totalCredits;
                  totalDebitSum += totalDebits;
                if (entry.credit.map((c)=>c.finance_account_id).includes(selectedAccount?.id ) ||entry.debit.map((c)=>c.finance_account_id).includes(selectedAccount?.id )) {
                  // alert('s')
                  return    (
                    <TableRow key={entry.id}>
                      <TableCell>{dayjs(new Date(Date.parse(entry.created_at))).format('YYYY-MM-DD')}</TableCell>
                      <TableCell>{entry.id}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell>{ formatNumber(entry.debit.filter((d)=>d.finance_account_id == selectedAccount.id).reduce((prev,curr)=>prev+curr.amount,0)) }</TableCell>
                      <TableCell>{ formatNumber(entry.credit.filter((d)=>d.finance_account_id == selectedAccount.id).reduce((prev,curr)=>prev+curr.amount,0)) }</TableCell>
                      <TableCell>{Math.abs(sumDebits - sumCredits)}</TableCell>
                    
              
                    </TableRow>
                  )
                }
             
              }) }
            </TableBody>
          </Table>
        </TableContainer>  : <Typography textAlign={'center'} variant="h4">       </Typography>}
        {selectedAccount?.children?.length > 0 &&   <TableContainer >
         <Typography textAlign={'center'} variant="h5"> {selectedAccount?.name}</Typography>
           
           <IconButton onClick={()=>{
            setDialog((prev)=>{
              return {...prev, showDialog: true};
            })
           }} title=" T الاستاذ حرف "><TitleIcon/></IconButton>

           <Button href={`${webUrl}ledger/${selectedAccount?.id}?first=${firstDate.format("YYYY/MM/DD")}&second=${secondDate.format("YYYY/MM/DD")}`}>PDF</Button>
           <Button href={`${webUrl}ledger-excel/${selectedAccount?.id}?first=${firstDate.format("YYYY/MM/DD")}&second=${secondDate.format("YYYY/MM/DD")}`}>Excell</Button>
          <Table key={selectedAccount?.id} dir="rtl" size="small">
            <thead>
              <TableRow>
                <TableCell>الحساب</TableCell>
                <TableCell>Debit </TableCell>
                <TableCell> Credit  </TableCell>
                <TableCell>  الرصيد  </TableCell>
              </TableRow>
            </thead>

            <TableBody>
              {selectedAccount?.children.map((account) => {
             
                  // alert('s')
                  return    (
                      <DebitsAndCreditsRow id={account.id}/>                    
                  )
                
             
              })}
            </TableBody>
          </Table>
        </TableContainer> }
        </Paper>

      </Grid>
      <Grid sx={{height:window.innerHeight -100,overflow:'auto'}} style={{direction:'rtl'}} item xs={4}>
            <TextField value={filter} onChange={(e)=>setFilter(e.target.value)} size="small" sx={{mb:1}} label='الحساب'/>
            {loading ?  <Skeleton height={window.innerHeight - 300}/> : <Table  size="small">
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
                      <TableRow  key={account.id}>
                          <TableCell>{account.id}</TableCell>
                          <TableCell>{account.name}{account.children.length > 0 ? ` (رئيسي) ` : ``}</TableCell>
                          <TableCell>{account.description}</TableCell>
                          <TableCell><Button onClick={()=>{
                              setSelectedAccount(account);
                          }}>كشف </Button></TableCell>
                      </TableRow>
                  ))}
              </TableBody>
             </Table>}
             
      </Grid>
           {selectedAccount &&   <LedjerTDialog account={selectedAccount}  />}
    </Grid>
     </>
    );
  }
  
  export default Ledger;
  