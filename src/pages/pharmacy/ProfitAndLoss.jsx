import {
  Box,
  Button,
  Divider,
  Skeleton,
  Stack,
  TextField,
} from "@mui/material";
import axiosClient from "../../../axios-client";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { webUrl } from "../constants";
function ProfitAndLoss(props) {
  const { value, index, setDialog, ...other } = props;

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "barcode",
      headerName: "Barcode",
      width: 150,
      editable: true,
    },
    {
      field: "market_name",
      headerName: "Market name",
      width: 150,
      editable: true,
    },
    {
      field: "sc_name",
      headerName: "S.Name",
      width: 110,
      editable: true,
    },
    {
      field: "totalSales",
      headerName: "Sales",
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "totalCost",
      headerName: "Total Cost",
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "totalProfit",
      headerName: "Profits",
      type: "number",
      width: 110,
      editable: true,
    },
  ];
  // const rows = [
  //   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  //   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  //   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  //   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  //   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  //   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  //   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  //   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  //   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  // ];

  const [loading, setLoading] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const searchHandler = (word) => {
    setSearch(word);
  };
  useEffect(() => {
    setLoading(true);
    axiosClient
      .get("profitAndLoss/100")
      .then(({ data }) => {
        console.log(data, "profit And loss");
        setData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Divider sx={{ mb: 1 }} variant="middle">
        Profit & Loss
      </Divider>
      {value === index && (
        <Box sx={{ justifyContent: "space-around" }} className="">
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Button sx={{m:1}} variant="contained" href={`${webUrl}profitAndLoss`}>
              PDF
            </Button>
          </Stack>
          {loading ? (
            <Skeleton
              animation="wave"
              variant="rectangular"
              width={"100%"}
              height={400}
            />
          ) : (
            <DataGrid
              slots={{
                toolbar: GridToolbar,
              }}
              rows={data}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              checkboxSelection
              disableRowSelectionOnClick
            />
          )}
          {/* <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell> Barcode</TableCell>
                <TableCell>M.Name</TableCell>
                <TableCell>S.Name</TableCell>
                <TableCell>Total Cost</TableCell>
                <TableCell>Total Sales</TableCell>
                <TableCell>Profit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.barcode}</TableCell>
             
                  <TableCell>{item.market_name}</TableCell>
                  <TableCell>{item.sc_name}</TableCell>
             
                  <TableCell>{toFixed(item.totalCost, 1)}</TableCell>
                  <TableCell>{toFixed(item.totalSales, 1)}</TableCell>
                  <TableCell>{toFixed(item.totalProfit, 1)}</TableCell>
       
                 
                </TableRow>
              ))}

              {deducts.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5}>No data found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table> */}
        </Box>
      )}
    </div>
  );
}

export default ProfitAndLoss;
