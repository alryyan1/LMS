import { Autocomplete, Box, Button, Divider, Stack, TextField } from "@mui/material";
import dayjs from "dayjs";
import { useOutletContext } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";

function ClientsReport(props) {
  const { value, index, setDialog, ...other } = props;
  const { items } = useOutletContext();
  const [clients, setClients] = useState([]);
  useEffect(() => {
    //fetch all clients
    axiosClient(`client/all`).then(({ data }) => {
      setClients(data);
      console.log(data);
    });
  }, []);


  console.log(items,'items')
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "name",
      width: 150,

 
    },


    {
        field: "created_at",
        headerName: "Date",
        width: 150,
  
        valueGetter: (value, row) =>
          dayjs(new Date(Date.parse(row.created_at))).format("YYYY/MM/DD H;m A"),
      },
    
      {
        field: "phone",
        headerName: "phone",
        width: 150,
  
   
      },
      {
        field: "address",
        headerName: "address",
        width: 150,
  
   
      },
      {
      field: "email",
      headerName: "email",
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
        Clients Report
      </Divider>
      {value === index && (
        <Box sx={{ justifyContent: "space-around" }} className="">
        

          <DataGrid
            slots={{
              toolbar: GridToolbar,
            }}
            rows={clients}
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

export default ClientsReport;
