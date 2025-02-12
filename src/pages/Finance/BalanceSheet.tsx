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
import React, { useEffect, useState } from "react";
import AssetsBalanceSheetSection from "./AssetsBalanceSheetSection";
import ObligationBalanceSheetSection from "./ObligationBalanceSheetSection";
import dayjs from "dayjs";
import { Eye, Plus, Printer } from "lucide-react";
import axiosClient from "../../../axios-client";
import { webUrl } from "../constants";
import { Print } from "@mui/icons-material";

function BalanceSheet() {
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [balanceSheets, setBalanceSheets] = useState([]);
  const handleChange = (event) => {
    setBalanceSheet(event.target.value);
  };
  useEffect(() => {
    document.title = 'قائمه الميزانيه العموميه' ;
  }, []);
  useEffect(() => {
    axiosClient.get("allBalanceSheetStatment").then(({ data }) => {
      console.log(data, "data");
      setBalanceSheets(data.data);
    });
  }, []);
  const handleNewStatement = async () => {
    try {
      const response = await axiosClient.post("new-balanceSheet-statements");
      console.log(response.data.data); // Success message
      setBalanceSheet(response.data.data);
      // setRows(response.data.data.obligations);
    } catch (error) {
      console.error("Error saving table:", error);
    }
  };
  return (
    <>
      <Stack gap={1} direction={"row"} justifyContent={"center"} sx={{ mb: 1 }}>
        {" "}
        <Button
          title="اضافه قائمه جديده"
          size="small"
          variant="contained"
          color="primary"
          onClick={handleNewStatement}
        >
          <Plus />
        </Button>
        <Button
          title="معاينه التقرير"
          size="small"
          href={`${webUrl}balance-sheet/${balanceSheet?.id}`}
          variant="contained"
          color="success"
        >
          <Printer />
        </Button>
        <Typography variant="h3" textAlign={"center"}>
          قائمه الميزانيه في تاريخ {dayjs().format("YYYY-MM-DD")}
        </Typography>
        <FormControl>
          <InputLabel id="income-statement-label">
            قائمه المركز المالي
          </InputLabel>
          <Select
            variant="standard"
            size="small"
            sx={{ width: "200px" }}
            labelId="income-statement-label"
            value={balanceSheet}
            onChange={handleChange}
          >
            {balanceSheets.map((statement) => (
              <MenuItem key={statement.id} value={statement}>
                {`${dayjs(statement.created_at).format("YYYY-MM-DD")} (${statement.id})`}
                {/* Adjust based on your API response */}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Stack gap={1} direction={"row"}>
        <ObligationBalanceSheetSection
          balanceSheet={balanceSheet}
          setBalanceSheet={setBalanceSheet}
        />
        <AssetsBalanceSheetSection
          balanceSheet={balanceSheet}
          setBalanceSheet={setBalanceSheet}
        />
      </Stack>
    </>
  );
}

export default BalanceSheet;
