import { Autocomplete, Box, Button, Divider, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useOutletContext } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { use } from "i18next";
import axiosClient from "../../../axios-client";

function InventoryReport(props) {
  const { value, index, setDialog, ...other } = props;
  const [items,setItems] = useState()
  useEffect(()=>{
   axiosClient.get('items/balance').then(({data})=>{
        setItems(data)
   })
  },[])
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "barcode",
      headerName: "Barcode",
      width: 150,

 
    },

    {
      field: "market_name",
      headerName: "Market Name",
      width: 110,
    },
    {
      field: "cost",
      headerName: "Cost",
      width: 110,
      type:'number',

      valueGetter: (val, row) => row?.lastDepositItem?.finalCostPrice,
    },
    {
        field: "retail",
        headerName: "Retail",
        width: 110,
        type:'number',
        valueGetter: (val, row) => row?.lastDepositItem?.finalSellPrice,
      },
    {
      field: "totaldeduct",
      headerName: "out",
      width: 110,
      type:'number',
    
 
    },

    {
        field: "totaldeposit",
        headerName: "In",
        width: 150,
  
    },
      
    {
        field: "remaining",
        headerName: "Remaining",
        width: 150,
  
      },
  
 
    //    {
    //     field: 'client',
    //     headerName: 'S.Price',
    //     width: 110,
    //     type:'number'

    //   }, {
    //     field: 'delete',
    //     headerName: 'S.Price',
    //     width: 110,
    //     type:'number'

    //   },
  ];

 
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Divider sx={{ mb: 1 }} variant="middle">
        Inventory Report
      </Divider>
      {value === index && (
        <Box sx={{ justifyContent: "space-around" }} className="">
        

          <DataGrid
            slots={{
              toolbar: GridToolbar,
            }}
            rows={items}
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

export default InventoryReport;
