import { Autocomplete, Box, Button, Divider, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axiosClient from "../../../axios-client";
import { webUrl } from "../constants";

function ShiftsReport(props) {
  const { value, index, setDialog, ...other } = props;
   const [shifts, setShifts] = useState([]);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "date",
      headerName: "Date",
      width: 150,
      valueGetter: (value, row) =>
        dayjs(new Date(Date.parse(row?.created_at))).format("YYYY/MM/DD H;m A"),
 
    },

    {
      field: "sales",
      headerName: "Sales Count",
      width: 110,
      type:'number',
      valueGetter: (val, row) => row?.deducts.length,

    },
    {
      field: "income",
      headerName: "Total Income",
      width: 110,
      type:'number',

      valueGetter: (val, row) => row?.totalDeductsPrice,
    },
    {
        field:'report',
        headerName: "Report",
        width: 110,
        renderCell: (shift) => (
          <Button
            variant="contained"
            href={`${webUrl}pharmacy/sellsReport?shift_id=${shift?.id}`}
            >Report</Button>)

    }
  
 

  ];
  useEffect(()=>{
   axiosClient.get('shifts').then(({data})=>{
    setShifts(data)
    console.log(data,'shifts')
   })
  },[])
 
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Divider sx={{ mb: 1 }} variant="middle">
        Items Report
      </Divider>
      {value === index && (
        <Box sx={{ justifyContent: "space-around" }} className="">
        

          <DataGrid
            slots={{
              toolbar: GridToolbar,
            }}
            rows={shifts}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[5,10,20,50]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      )}
    </div>
  );
}

export default ShiftsReport;
