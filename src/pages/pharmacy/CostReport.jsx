import { Autocomplete, Box, Button, Divider, Stack, TextField } from "@mui/material";
import axiosClient from "../../../axios-client";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LoadingButton } from "@mui/lab";
import { toFixed, webUrl } from "../constants";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

function CostReport(props) {
  const { value, index, setDialog, ...other } = props;
  const [firstDate, setFirstDate] = useState(dayjs(new Date()));
  const [secondDate, setSecondDate] = useState(dayjs(new Date()));
  const [loading, setLoading] = useState(null);
  const [costs, setCosts] = useState([]);
  const searchHandler = () => {
    setLoading(true);
    const firstDayjs = firstDate.format("YYYY/MM/DD");
    const secondDayjs = secondDate.format("YYYY/MM/DD");
    axiosClient
      .post(`searchDeductsByDate`, {
        first: firstDayjs,
        second: secondDayjs,
      })
      .then(({ data }) => {
        console.log(data);
        setCosts(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  

  useEffect(() => {
    axiosClient.get(`costs`).then(({ data }) => {
        setCosts(data);
    });
  }, []);

 
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "created_at",
      headerName: "Date",
      width: 150,

      valueGetter: (value, row) =>
        dayjs(new Date(Date.parse(row.created_at))).format("YYYY/MM/DD H;m A"),
    },

    {
      field: "amount",
      headerName: "Amount",
      width: 110,
      type: "number",
    },
    {
      field: "user",
      headerName: "user",
      width: 110,
      valueGetter: (val, row) => row?.user_cost?.username,
    },
    {
        field: "category",
        headerName: "Category",
        width: 110,
        valueGetter: (val, row) => row?.cost_category?.name,
      },
    {
      field: "description",
      headerName: "description",
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
        Cost Report
      </Divider>
      {value === index && (
        <Box sx={{ justifyContent: "space-around" }} className="">
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateField
                  onChange={(val) => {
                    setFirstDate(val);
                  }}
                  defaultValue={dayjs(new Date())}
                  sx={{ m: 1 }}
                  label="From"
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateField
                  onChange={(val) => {
                    setSecondDate(val);
                  }}
                  defaultValue={dayjs(new Date())}
                  sx={{ m: 1 }}
                  label="To"
                />
              </LocalizationProvider>
              <LoadingButton
                onClick={searchHandler}
                loading={loading}
                sx={{ mt: 2 }}
                size="medium"
                variant="contained"
              >
                Go
              </LoadingButton>
            </Box>
        

            <Button
              href={`${webUrl}searchDeductByDate?first=${firstDate.format(
                "YYYY/MM/DD"
              )}&second=${secondDate.format("YYYY/MM/DD")}`}
            >
              PDF
            </Button>
          </Stack>

          <DataGrid
            slots={{
              toolbar: GridToolbar,
            }}
            rows={costs}
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

export default CostReport;
