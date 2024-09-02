import {
    Box,
    Button,
    Grid,
    Paper,
    Stack,
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
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LoadingButton } from "@mui/lab";
  
  function Ledger() {
    //create state variable to store all Accounts
    const [firstDate, setFirstDate] = useState(dayjs(new Date()));
  const [secondDate, setSecondDate] = useState(dayjs(new Date()));
  const [loading, setLoading] = useState(null);
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
      const searchHandler = () => {
        setLoading(true);
        const firstDayjs = firstDate.format("YYYY/MM/DD");
        const secondDayjs = secondDate.format("YYYY/MM/DD");
        axiosClient
          .post(`searchDeductsByDate`, {
            first: firstDayjs,
            second: secondDayjs,
          })
          .then(({ data }) => {
            console.log(data);
     
          })
          .finally(() => {
            setLoading(false);
          });
      };
    
  
    return (
      <Grid container spacing={2}>
      
        <Grid item xs={8}>
          <Paper sx={{p:1}}>
          <Stack direction={"row"} justifyContent={"space-between"}>
        <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateField
              onChange={(val) => {
                setFirstDate(val);
              }}
              defaultValue={dayjs(new Date())}
              sx={{ m: 1 }}
              label="From"
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateField
              onChange={(val) => {
                setSecondDate(val);
              }}
              defaultValue={dayjs(new Date())}
              sx={{ m: 1 }}
              label="To"
            />
          </LocalizationProvider>
          <LoadingButton
            onClick={searchHandler}
            loading={loading}
            sx={{ mt: 2 }}
            size="medium"
            variant="contained"
          >
            Go
          </LoadingButton>

        </Box>
      
               
      </Stack>
   
          </Paper>
  
        </Grid>
      
               <Table style={{direction:'rtl'}} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>رقم الحساب</TableCell>
                        <TableCell>اسم الحساب</TableCell>
                        <TableCell>وصف الحساب </TableCell>
                        <TableCell> مدين </TableCell>
                        <TableCell> دائن </TableCell>
                        <TableCell> مدين </TableCell>
                        <TableCell>دائن  </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {accounts.map((account) => (
                        <TableRow sx={{background:(theme)=>account.id == selectedAccount?.id ? theme.palette.warning.light:''}} key={account.id}>
                            <TableCell>{account.id}</TableCell>
                            <TableCell>{account.name}</TableCell>
                            <TableCell>{account.description}</TableCell>
                            <TableCell>0</TableCell>
                            <TableCell>0</TableCell>
                            <TableCell>0</TableCell>
                            <TableCell>0</TableCell>
                            
                        </TableRow>
                    ))}
                </TableBody>
               </Table>
      
                
      </Grid>
    );
  }
  
  export default Ledger;
  