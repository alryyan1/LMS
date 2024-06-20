import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import MyTableCell from "../inventory/MyTableCell";

function CBCLIS() {
  const [test, setTest] = useState();
  const [cbcMatchingRows, setCbcMatchingRows] = useState([]);
  const [sysmexColumns, setSysmexColumns] = useState([]);
  useEffect(() => {
    axiosClient.get("mainTestById/1").then(({ data }) => {
      console.log(data);
      setTest(data);
    });
  }, []);
  useEffect(() => {
    axiosClient.get("getSysmexColumnNames").then(({ data }) => {
      console.log(data);
      setSysmexColumns(data);
    });
  }, []);
  useEffect(() => {
    axiosClient.get("getCbcBindings").then(({ data }) => {
      console.log(data);
      setCbcMatchingRows(data);
    });
  }, []);
  const populateCbcTable = () => {
    axiosClient.post("populateCBCMatchingTable");
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
      <Typography variant="h3">
           CBC Data

        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>child id</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {test &&
              test.child_tests.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.child_test_name}</TableCell>
                  <TableCell>{item.id}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="h3">
            Sysmex Table Columns

        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>index</TableCell>
              <TableCell>name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              sysmexColumns.map((item,i) => (
                <TableRow key={i}>
                  <TableCell>{i}</TableCell>
                  <TableCell>{item}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Grid>
      <Grid item xs={4}>
        <Typography>Matching Table</Typography>
        <Button onClick={populateCbcTable}>populate</Button>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>sysmex table</TableCell>
              <TableCell>child id array</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cbcMatchingRows.map((item) => (
              <TableRow key={item.id}>
                <MyTableCell   colName={"name_in_sysmex_table"}
                  item={item}
                  table="updateCbcBindings">{item.name_in_sysmex_table}</MyTableCell>
                <MyTableCell
                  colName={"child_id_array"}
                  item={item}
                  table="updateCbcBindings"
                >
                  {item.child_id_array}
                </MyTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
}

export default CBCLIS;
