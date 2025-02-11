import React, { useState, useEffect } from 'react';
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
  Typography
} from '@mui/material';
import axiosClient from '../../../axios-client';

function IncomeStatement() {
  const [accounts, setAccounts] = useState([]);
  const [rows, setRows] = useState([{ account: null, value1: '', value2: '', value3: '' }]);

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
    setRows([...rows, { account: null, value1: '', value2: '', value3: '' }]);
  };

  const handleAccountChange = (index, value) => {
    const newRows = [...rows];
    newRows[index].account = value;
    setRows(newRows);
  };

  const handleValueChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Dynamic Table
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>الحساب</TableCell>
                  <TableCell>القيمة 1</TableCell>
                  <TableCell>القيمة 2</TableCell>
                  <TableCell>القيمة 3</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Autocomplete
                        options={accounts}
                        getOptionLabel={(option) => option.name || ''}
                        value={row.account}
                        onChange={(event, newValue) => handleAccountChange(index, newValue)}
                        renderInput={(params) => (
                          <TextField {...params} label="اختر حساب" variant="outlined" fullWidth />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={row.value1}
                        onChange={(e) => handleValueChange(index, 'value1', e.target.value)}
                        variant="outlined"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={row.value2}
                        onChange={(e) => handleValueChange(index, 'value2', e.target.value)}
                        variant="outlined"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={row.value3}
                        onChange={(e) => handleValueChange(index, 'value3', e.target.value)}
                        variant="outlined"
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="contained" color="primary" onClick={handleAddRow}>
            إضافة صف
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default IncomeStatement;