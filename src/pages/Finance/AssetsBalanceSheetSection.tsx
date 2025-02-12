import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Autocomplete,
  Grid,
  Switch,
  FormControlLabel,
  Box,
  IconButton,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Delete as DeleteIcon, Sync } from "@mui/icons-material";
import axiosClient from "../../../axios-client";
import { formatNumber, webUrl } from "../constants";
import { Account } from "../../types/type";
import dayjs from "dayjs";
import { Eye, Import, Plus, Rows } from "lucide-react";

function AssetsBalanceSheetSection({balanceSheet,setBalanceSheet}) {
  const [balanceSheets, setBalanceSheets] = useState([]);
  // const [balanceSheet, setBalanceSheet] = useState(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [rows, setRows] = useState([
    {
      useAutocomplete: true,
      account: null,
      textValue: "",
      value1: "",
      value2: "",
      value3: "",
    },
  ]);
  // Inside AssetsBalanceSheetSection.js
  useEffect(() => {
    //get last income statment using axiosclient
    axiosClient.get("lastBalanceSheet").then(({ data }) => {
      console.log(data, "data");
      setBalanceSheet(data.data);
    });
    axiosClient.get("allBalanceSheetStatment").then(({ data }) => {
      console.log(data, "data");
      setBalanceSheets(data.data);
    });
  }, []);
  const updateTable = async () => {
    try {
      const response = await axiosClient.patch(`updateBalanceSheetStatement/${balanceSheet?.id}`, {
        name: "balance sheet", // You can add a name input
        assets: rows, // Send the table data
      });
      console.log(response.data.message); // Success message
    } catch (error) {
      console.error("Error saving table:", error);
    }
  };

  const handleNewStatement = async () => {
    try {
      const response = await axiosClient.post("new-balanceSheet-statements");
      console.log(response.data.data); // Success message
      setBalanceSheet(response.data.data);
      setRows(response.data.data.assets);
    } catch (error) {
      console.error("Error saving table:", error);
    }
  };
  // Add a load function
  const handleLoadTable = async () => {
    try {
      const response = await axiosClient.get(
        `balance-sheet/${balanceSheet?.id}`
      ); // Replace tableId with the actual ID you want to load.
      const tableData = response.data;
      setRows(tableData.assets);
      //setRows();

      // console.log(response.data.message); // Success message
    } catch (error) {
      console.error("Error loading table:", error);
    }
  };
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axiosClient.get("accounts");
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        useAutocomplete: true,
        account: null,
        textValue: "",
        value1: "",
        value2: "",
        value3: "",
      },
    ]);
  };

  const handleToggleInputType = (index) => {
    const newRows = [...rows];
    newRows[index].useAutocomplete = !newRows[index].useAutocomplete;
    setRows(newRows);
  };

  const handleAccountChange = (index, value) => {
    console.log(value, "val");
    const newRows = [...rows];
    newRows[index].account = value;
    newRows[index].textValue = null
    if (value.debit == 0) {
      newRows[index].value1 = Math.abs(value.balance);
    } else {
      newRows[index].value2 = Math.abs(value.balance);
    }

    setRows(newRows);
  };

  const handleTextValueChange = (index, value) => {
    const newRows = [...rows];
    newRows[index].textValue = value;
    newRows[index].account = null;
    setRows(newRows);
  };

  const handleValueChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const handleDeleteRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleSelectValue = (index, field) => {
    const newRows = [...rows];
    newRows[index][field + "Selected"] = !newRows[index][field + "Selected"];
    setRows(newRows);
  };

  const handleDoubleClick = (index, field) => {
    let sum = 0;
    for (let i = 0; i < rows.length; i++) {
      // Iterate through ALL rows
      let currentValue = 0;
      if (rows[i][field + "Selected"]) {
        // Only add value from selected
        currentValue = parseFloat(rows[i][field]) || 0;
      }
      sum += currentValue;
    }

    const newRows = [...rows];
    newRows[index][field] = sum; // Apply the formatted result
    setRows(newRows); // Update the state with the new list
  };


 
  return (
 
        <Paper sx={{ p: 2 }}>
          <Stack direction={"row"} gap={1} justifyContent={"space-between"}>
            {" "}
            <Stack direction={"row"} gap={1}>
              {/* <Button title="اضافه قائمه جديده" size="small"
                variant="contained"
                color="primary"
                onClick={handleNewStatement}
              >
                  <Plus/>
              </Button> */}
              <Button title="اضافه صف جديد" size="small"
                variant="contained"
                color="primary"
                onClick={handleAddRow}
              >
                 <Rows/>
              </Button>
              <Button title="تحديث وحفظ القائمه" size="small"
                variant="contained"
                color="success"
                onClick={updateTable}
              >
            <Sync/>
              </Button>
              <Button title="جلب البيانات" size="small"
                variant="contained"
                color="warning"
                onClick={() => {
                  handleLoadTable();
                }}
              >
                 <Import/>
              </Button>
          
            </Stack>
            {/* /render select mui element for balanceSheets */}
            
          </Stack>
          <Typography variant="h5" textAlign={"center"} gutterBottom>
            ( {balanceSheet?.id} )  الاصول 
          </Typography>
          <TableContainer>
            <Table size="small" className="table" >
              <TableHead className="thead">
                <TableRow>
                  <TableCell>البيان</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>مفرد</TableCell>
                  <TableCell>اجمالي</TableCell>
                  <TableCell></TableCell> {/* Empty cell for Delete button */}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ display: "flex", alignItems: "center" }}>
                      {/* Switch and Input Container */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "300px",
                        }}
                      >
                        {row.useAutocomplete ? (
                          <Autocomplete
                            options={accounts}
                            getOptionLabel={(option) => option.name || ""}
                            value={row.account || null}
                            onChange={(event, newValue) =>
                              handleAccountChange(index, newValue)
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="اختر حساب"
                                variant="outlined"
                                size="small"
                              />
                            )}
                            sx={{ flexGrow: 1, mr: 1 }} // Take remaining space, margin for spacing
                          />
                        ) : (
                          <TextField
                            value={row.textValue}
                            onChange={(e) =>
                              handleTextValueChange(index, e.target.value)
                            }
                            variant="outlined"
                            label="ادخل حساب"
                            size="small"
                            sx={{ flexGrow: 1, mr: 1 }} // Take remaining space, margin for spacing
                          />
                        )}
                        <Switch
                          checked={row.useAutocomplete}
                          onChange={() => handleToggleInputType(index)}
                          name="useAutocomplete"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      {/* <Box sx={{ display: "flex", alignItems: "center" }}> */}
                        <TextField
                          value={row.value1}
                          onChange={(e) =>
                            handleValueChange(index, "value1", e.target.value)
                          }
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{
                            flexGrow: 1,
                            mr: 1,
                            border: row.value1Selected ? "2px solid aqua" : "",
                          }}
                          onDoubleClick={() =>
                            handleDoubleClick(index, "value1")
                          }
                        />
                        {/* <Button
                          onClick={() => handleSelectValue(index, "value1")}
                          variant={
                            row.value1Selected ? "contained" : "outlined"
                          }
                          size="small"
                        >
                          تحديد
                        </Button> */}
                      {/* </Box> */}
                    </TableCell>
                    <TableCell>
                      {/* <Box sx={{ display: "flex", alignItems: "center" }}> */}
                        <TextField
                          value={row.value2}
                          onChange={(e) =>
                            handleValueChange(index, "value2", e.target.value)
                          }
                          variant="outlined"
                          size="small"
                          fullWidth
                          onDoubleClick={() =>
                            handleDoubleClick(index, "value2")
                          }
                          sx={{
                            flexGrow: 1,
                            mr: 1,
                            border: row.value2Selected ? "2px solid aqua" : "",
                          }}
                        />
                        {/* <Button
                          onClick={() => handleSelectValue(index, "value2")}
                          variant={
                            row.value2Selected ? "contained" : "outlined"
                          }
                          size="small"
                        >
                          تحديد
                        </Button> */}
                      {/* </Box> */}
                    </TableCell>
                    <TableCell>
                      {/* <Box sx={{ display: "flex", alignItems: "center" }}> */}
                        <TextField
                          value={row.value3}
                          onChange={(e) =>
                            handleValueChange(index, "value3", e.target.value)
                          }
                          variant="outlined"
                          size="small"
                          fullWidth
                          onDoubleClick={() =>
                            handleDoubleClick(index, "value3")
                          }
                          sx={{
                            flexGrow: 1,
                            mr: 1,
                            border: row.value3Selected ? "2px solid aqua" : "",
                          }}
                        />
                        {/* <Button
                          onClick={() => handleSelectValue(index, "value3")}
                          variant={
                            row.value3Selected ? "contained" : "outlined"
                          }
                          size="small"
                        >
                          تحديد
                        </Button> */}
                      {/* </Box> */}
                    </TableCell>
                    <TableCell>
                      {/* Delete Button */}
                      <IconButton
                        onClick={() => handleDeleteRow(index)}
                        aria-label="delete"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
    
  );
}

export default AssetsBalanceSheetSection;
