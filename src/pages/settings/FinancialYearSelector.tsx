import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
  TextField,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { PhotoCamera, Image, Description, CalendarToday } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
const FinancialYearSelector = ({ settings, handleFinancialYearChange }) => {
    const [startDate, setStartDate] = useState(settings?.financial_year_start ?  dayjs(settings.financial_year_start) : null);
    const [endDate, setEndDate] = useState(settings?.financial_year_end ? new dayjs(settings.financial_year_end) : null);
  
    useEffect(() => {
        console.log(startDate,endDate,'  s')
      if (startDate && endDate) {
        handleFinancialYearChange({
          financial_year_start: startDate.format('YYYY-MM-DD'),
          financial_year_end: endDate.format('YYYY-MM-DD')
        });
      }
    }, [startDate, endDate]);
  
    return (
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardHeader
          title="الفتره الماليه"
          avatar={
            <Avatar>
              <CalendarToday />
            </Avatar>
          }
        />
        <CardContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <DatePicker
                  label="بدايه الفتره"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                //   renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  label="نهايه الفتره"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                //   renderInput={(params) => <TextField {...params} fullWidth />}
                  minDate={startDate}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </CardContent>
      </Card>
    );
  };

  export default FinancialYearSelector