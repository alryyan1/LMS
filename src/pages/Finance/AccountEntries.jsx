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
import AddEntryForm from "./AddEntryForm.jsx";
  
  function AccountEntries() {
    const [loading, setLoading] = useState(false);
    //create state variable to store all Accounts
    const [entries, setEntries] = useState([]);
    const { dilog, setDialog } = useOutletContext();
  
   
    useEffect(() => {
      document.title = 'اضافه حساب' ;
    }, []);
  
  
    useEffect(() => {
      //fetch all Accounts
      axiosClient(`financeEntries`)
        .then(({data}) => {
            setEntries(data);
          console.log(data,'accounts');
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
                  <TableCell>التاريخ</TableCell>
                  <TableCell>رقم القيد</TableCell>
                  <TableCell>البيان</TableCell>
                  <TableCell>مدين </TableCell>
                  <TableCell> دائن  </TableCell>
                </TableRow>
              </thead>
  
              <TableBody>
                {entries.map((entry) => (
                <>
                  <TableRow key={entry.id}>
                    <TableCell rowSpan={2}>{dayjs(new Date(Date.parse(entry.created_at))).format('YYYY-MM-DD')}</TableCell>
                    <TableCell rowSpan={2}>{entry.id}</TableCell>
                    <TableCell  >{` من ح / ${entry.from_account.name}
                 
                    
                   
                    
                    
                    `}</TableCell>
                    <TableCell>{entry.amount}</TableCell>
                    <TableCell></TableCell>
            
                  </TableRow>
                  <TableRow key={entry.id}>
                    <TableCell >{`
                 
                    
                     الي ح / ${entry.to_account.name}
                  (    ${entry.description})
                    
                    `}</TableCell>
                    <TableCell></TableCell>

                    <TableCell>{entry.amount}</TableCell>
            
                  </TableRow>
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </Paper>
  
        </Grid>
        <Grid item xs={4}>
                <AddEntryForm setEntries={setEntries} loading={loading}  setDialog={setDialog} setLoading={setLoading}/>
        </Grid>
                
      </Grid>
    );
  }
  
  export default AccountEntries;
  