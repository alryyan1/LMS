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
  
  function HormoneLis() {
    const [test, setTest] = useState();
    const [immune, setImmune] = useState();
    const [hormoneMatchingTable, setHormoneMatchingRows] = useState([]);
    const [hormoneColumns, setHormoneColumns] = useState([]);
    useEffect(() => {
      axiosClient.get("getHormoneTests").then(({ data }) => {
        console.log(data);
        setTest(data);
      });
      axiosClient.get("getImmuneTests").then(({ data }) => {
        console.log(data);
        setImmune(data);
      });
    }, []);
    useEffect(() => {
      axiosClient.get("getHormoneColumnNames").then(({ data }) => {
        console.log(data);
        setHormoneColumns(data);
      });
    }, []);
    useEffect(() => {
      axiosClient.get("getHormoneBindings").then(({ data }) => {
        console.log(data);
        setHormoneMatchingRows(data);
      });
    }, []);
    const populatehormoneMatchingTable = () => {
      axiosClient.post("populateHormoneMatchingTable");
    };
    return (
      <Grid container spacing={2}>
        <Grid item xs={4}>
        <Typography variant="h3">
             Hormone Data
  
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
                test.tests.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.main_test_name}</TableCell>
                    <TableCell>{item.firstChildId}</TableCell>
                  </TableRow>
                ))}
                {immune &&
                immune.tests.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.main_test_name}</TableCell>
                    <TableCell>{item.firstChildId}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h4">
              hormone Table Columns
  
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
                hormoneColumns.map((item,i) => (
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
          <Button onClick={populatehormoneMatchingTable}>populate</Button>
  
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>hormone table</TableCell>
                <TableCell>child id array</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hormoneMatchingTable.map((item) => (
                <TableRow key={item.id}>
                  <MyTableCell   colName={"name_in_hormone_table"}
                    item={item}
                    table="updateHormoneBindings">{item.name_in_hormone_table}</MyTableCell>
                  <MyTableCell
                    colName={"child_id_array"}
                    item={item}
                    table="updateHormoneBindings"
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
  
  export default HormoneLis;
  