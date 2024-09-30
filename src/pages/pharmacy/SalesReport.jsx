import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import { LoadingButton } from "@mui/lab";
import { DeleteOutline } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { toFixed, webUrl } from "../constants";
import MyCheckbox from "../../components/MyCheckBox";
import ReportsPanel from "./ReportsPanel";
import ProfitAndLoss from "./ProfitAndLoss";
import SaleReport from "./SaleReport";
import ItemsReport from "./ItemsReport";
import ShiftsReport from "./ShiftsReport";
import TopSalesReport from "./TopSalesReport";
import CostReport from "./CostReport";
import ExpiredReport from "./ExpiredReport";
import InventoryReport from "./InventoryReport";
import ClientsReport from "./ClientsReport";
import SuppliersReport from "./SuppliersReport";

function SalesReport() {
  const { setDialog } = useOutletContext();
  const [value, setValue] = useState(0);

  useEffect(() => {
    document.title = "التقارير";
  }, []);
 

  return (
    <Grid container>
      <Grid sx={{ p: 1 }} item xs={2}>
        <Typography variant="h4">Reports</Typography>
        <ReportsPanel setValue={setValue} value={value} />
      </Grid>
      <Grid item xs={10}>
        <ProfitAndLoss setDialog={setDialog} index={0} value={value} />
        <SaleReport setDialog={setDialog} index={1} value={value} />
        <ItemsReport setDialog={setDialog} index={2} value={value} />
        <ShiftsReport setDialog={setDialog} index={3} value={value} />
        <CostReport setDialog={setDialog} index={4} value={value} />
        <TopSalesReport setDialog={setDialog} index={5} value={value} />
        <ExpiredReport setDialog={setDialog} index={6} value={value} />
        <InventoryReport setDialog={setDialog} index={7} value={value} />
        <ClientsReport setDialog={setDialog} index={8} value={value} />
        <SuppliersReport setDialog={setDialog} index={11} value={value} />
      </Grid>
    </Grid>
  );
}

export default SalesReport;
