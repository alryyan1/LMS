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
  import { useOutletContext } from "react-router-dom";
  import axiosClient from "../../../axios-client.js";
import dayjs from "dayjs";
import AddEntryForm from "./AddEntryForm.jsx";
import { formatNumber } from "../constants.js";
  
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
                  <TableCell>Debit </TableCell>
                  <TableCell> Credit </TableCell>
                </TableRow>
              </thead>
  
              <TableBody>
                {entries.map((entry) => (
                <>
                  <TableRow key={entry.id}>
                    <TableCell rowSpan={2}>{dayjs(new Date(Date.parse(entry.created_at))).format('YYYY-MM-DD')}</TableCell>
                    <TableCell rowSpan={2}>{entry.id}</TableCell>
                    <TableCell  >{` من ح / ${entry?.debit[0]?.account?.name}
                 
                    
                   
                    
                    
                    `}</TableCell>
                    <TableCell>{formatNumber(entry.debit[0].amount)}</TableCell>
                    <TableCell></TableCell>
            
                  </TableRow>
                  <TableRow key={entry.id}>
                    <TableCell >{`
                 
                    
                     الي ح / ${entry?.credit[0]?.account?.name}
                  (    ${entry.description})
                    
                    `}</TableCell>
                    <TableCell></TableCell>

                    <TableCell>{formatNumber(entry?.credit[0]?.amount)}</TableCell>
            
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
  