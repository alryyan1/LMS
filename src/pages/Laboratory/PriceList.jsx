import {
    Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import MyTableCell from "../inventory/MyTableCell";
import { webUrl } from "../constants";

function PriceList() {
  let { tests ,setDialog} = useOutletContext();
  console.log(tests,'tests')
  const [search,setSearch] = useState('')
  console.log(search,'search')
  const cut = Math.floor( tests.length/4);
   console.log(tests,'from tests')


  tests =  tests.filter((test)=>{
    return test.main_test_name.toLowerCase().includes(search.toLowerCase()) 
   })
   console.log(tests,'filtered')
  return (
    <>
      <Stack  direction={'row'} sx={{mb:1}} gap={1}>
      <a href={`${webUrl}labPrices`}>PDF</a>
      <a href={`${webUrl}excel/labPrices`}>Excel</a>
      <TextField onChange={(event)=>{
        setSearch(event.target.value)
      }} size="small" label='search'/>
      </Stack>
       <Grid spacing={2} container>
      <Grid item xs={3}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Test Name</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tests.slice(0,cut).map((test) => (
                <TableRow key={test.id}>
                  <MyTableCell table="mainTest" colName='main_test_name' item={test} >{test.main_test_name}</MyTableCell>
                  <MyTableCell setDialog={setDialog} table="mainTest" colName={'price'} item={test} show >{test.price}</MyTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={3}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Test Name</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tests.slice(cut,cut*2).map((test) => (
                <TableRow key={test.id}>
                  <MyTableCell table="mainTest" colName='main_test_name' item={test} >{test.main_test_name}</MyTableCell>
                  <MyTableCell setDialog={setDialog}  table="mainTest" colName={'price'} item={test} show >{test.price}</MyTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={3}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Test Name</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tests.slice(cut*2,cut*3).map((test) => (
                <TableRow key={test.id}>
                  <MyTableCell table="mainTest" colName='main_test_name' item={test} >{test.main_test_name}</MyTableCell>
                  <MyTableCell setDialog={setDialog}  table="mainTest" colName={'price'} item={test} show >{test.price}</MyTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={3}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Test Name</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tests.slice(cut*3).map((test) => (
                <TableRow key={test.id}>
                  <MyTableCell table="mainTest" colName='main_test_name' item={test} >{test.main_test_name}</MyTableCell>
                  <MyTableCell setDialog={setDialog}   table="mainTest" colName={'price'} item={test} show >{test.price}</MyTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
    </>
 
  );
}

export default PriceList;
