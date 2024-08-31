import {
    Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { useOutletContext } from "react-router-dom";
import MyTableCell from "../inventory/MyTableCell";
import { webUrl } from "../constants";

function PriceList() {
  const { tests ,setDialog} = useOutletContext();
  const cut = Math.floor( tests.length/4);
   console.log(tests,'from tests')

  return (
    <>
      <Stack direction={'row'} gap={2}>
      <a href={`${webUrl}labPrices`}>PDF</a>
      <a href={`${webUrl}excel/labPrices`}>Excel</a>
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
