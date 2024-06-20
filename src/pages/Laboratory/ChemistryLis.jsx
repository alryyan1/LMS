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
  
  function ChemistryLIS() {
    const [test, setTest] = useState();
    const [chemistryMatchingTable, setChemistryMatchingRows] = useState([]);
    const [sysmexColumns, setSysmexColumns] = useState([]);
    useEffect(() => {
      axiosClient.get("chemistry").then(({ data }) => {
        console.log(data);
        setTest(data);
      });
    }, []);
    useEffect(() => {
      axiosClient.get("getChemistryColumnNames").then(({ data }) => {
        console.log(data);
        setSysmexColumns(data);
      });
    }, []);
    useEffect(() => {
      axiosClient.get("getChemistryBindings").then(({ data }) => {
        console.log(data);
        setChemistryMatchingRows(data);
      });
    }, []);
    const populateChemistryMatchingTable = () => {
      axiosClient.post("populateMindrayMatchingTable");
    };
    return (
      <Grid container spacing={2}>
        <Grid item xs={4}>
        <Typography variant="h3">
             Chemistry Data
  
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
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h4">
              chemistry Table Columns
  
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
          <Button onClick={populateChemistryMatchingTable}>populate</Button>
  
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>chemistry table</TableCell>
                <TableCell>child id array</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chemistryMatchingTable.map((item) => (
                <TableRow key={item.id}>
                  <MyTableCell   colName={"name_in_mindray_table"}
                    item={item}
                    table="updateCbcBindings">{item.name_in_mindray_table}</MyTableCell>
                  <MyTableCell
                    colName={"child_id_array"}
                    item={item}
                    table="updateChemistryBindings"
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
  
  export default ChemistryLIS;
  