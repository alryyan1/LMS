import { Autocomplete, Box, Button, Divider, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axiosClient from "../../../axios-client";
import { webUrl } from "../constants";

function TopSalesReport(props) {
  const { value, index, setDialog, ...other } = props;
  const [data,setData] = useState()
    useEffect(()=>{
        axiosClient.get('topSales')
       .then(({data}) => setData(data))
    },[])
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
 

    {
      field: "barcode",
      headerName: "Barcode",
      width: 210,

    },
    {
      field: "market_name",
      headerName: "Market Name",
      width: 210,

    }

    ,
    {
      field: "topSales",
      headerName: "Count",
      width: 110,

    },

  
 

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
        Top Sales
      </Divider>
      {value === index && (
        <Box sx={{ justifyContent: "space-around" }} className="">
        

          <DataGrid
            slots={{
              toolbar: GridToolbar,
            }}
            rows={data}
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

export default TopSalesReport;
