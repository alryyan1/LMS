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
import { Delete as DeleteIcon } from "@mui/icons-material";
import axiosClient from "../../../axios-client";
import { formatNumber, webUrl } from "../constants";
import { Account } from "../../types/type";
import dayjs from "dayjs";

function DynamicTable() {
  const [incomeStatements, setIncomeStatements] = useState([]);
  const [incomeStatement, setIncomeStatement] = useState(null);
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
  // Inside DynamicTable.js
  useEffect(() => {
    //get last income statment using axiosclient
    axiosClient.get("lastIncomeStatment").then(({ data }) => {
      console.log(data, "data");
      setIncomeStatement(data.data);
    });
    axiosClient.get("allIncomeStatment").then(({ data }) => {
      console.log(data, "data");
      setIncomeStatements(data.data);
    });
  }, []);
  const updateTable = async () => {
    try {
      const response = await axiosClient.patch(`updateIncomeStatement/${incomeStatement?.id}`, {
        name: "Income Statement", // You can add a name input
        data: rows, // Send the table data
      });
      console.log(response.data.message); // Success message
    } catch (error) {
      console.error("Error saving table:", error);
    }
  };

  const handleNewStatement = async () => {
    try {
      const response = await axiosClient.post("new-income-statements");
      console.log(response.data.data); // Success message
      setIncomeStatement(response.data.data);
      setRows(response.data.data.data);
    } catch (error) {
      console.error("Error saving table:", error);
    }
  };
  // Add a load function
  const handleLoadTable = async () => {
    try {
      const response = await axiosClient.get(
        `income-statements/${incomeStatement?.id}`
      ); // Replace tableId with the actual ID you want to load.
      const tableData = response.data;
      setRows(tableData.data);
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
    newRows[index].textValue = value.balance ? value.name : "";
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

  const handleChange = (event) => {
    setIncomeStatement(event.target.value);
  };
 
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2 }}>
          <Stack direction={"row"} gap={1} justifyContent={"space-between"}>
            {" "}
            <Stack direction={"row"} gap={1}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNewStatement}
              >
                انشاء قائمه جديده
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddRow}
              >
                إضافة صف
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={updateTable}
              >
           تحديث القائمه
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={() => {
                  handleLoadTable();
                }}
              >
                جلب الجدول
              </Button>
              <Button href={`${webUrl}incomeStatement/${incomeStatement?.id}`} variant="contained" color="success" >
                     معاينه التقرير
                  </Button>
            </Stack>
            {/* /render select mui element for incomeStatements */}
            <FormControl>
              <InputLabel id="income-statement-label">
                القوائم الماليه
              </InputLabel>
              <Select
                size="small"
                sx={{ width: "300px" }}
                labelId="income-statement-label"
                value={incomeStatement}
                onChange={handleChange}
              >
                {incomeStatements.map((statement) => (
                  <MenuItem key={statement.id} value={statement}>
                    {`${dayjs(statement.created_at).format("YYYY-MM-DD")} (${statement.id})`}
                    {/* Adjust based on your API response */}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Typography variant="h3" textAlign={"center"} gutterBottom>
            ( {incomeStatement?.id} ) قائمه الدخل
          </Typography>
          <TableContainer>
            <Table style={{ direction: "rtl" }}>
              <TableHead>
                <TableRow>
                  <TableCell>الحساب</TableCell>
                  <TableCell>مصروفات</TableCell>
                  <TableCell>ايرادات</TableCell>
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
                          width: "400px",
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
                      <Box sx={{ display: "flex", alignItems: "center" }}>
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
                        <Button
                          onClick={() => handleSelectValue(index, "value1")}
                          variant={
                            row.value1Selected ? "contained" : "outlined"
                          }
                          size="small"
                        >
                          تحديد
                        </Button>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
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
                        <Button
                          onClick={() => handleSelectValue(index, "value2")}
                          variant={
                            row.value2Selected ? "contained" : "outlined"
                          }
                          size="small"
                        >
                          تحديد
                        </Button>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
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
                        <Button
                          onClick={() => handleSelectValue(index, "value3")}
                          variant={
                            row.value3Selected ? "contained" : "outlined"
                          }
                          size="small"
                        >
                          تحديد
                        </Button>
                      </Box>
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
      </Grid>
    </Grid>
  );
}

export default DynamicTable;
