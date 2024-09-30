import { Autocomplete, Box, Button, Divider, Stack, TextField } from "@mui/material";
import axiosClient from "../../../axios-client";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LoadingButton } from "@mui/lab";
import { toFixed, webUrl } from "../constants";
import { useOutletContext } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DeleteOutline } from "@mui/icons-material";

function SaleReport(props) {
  const { value, index, setDialog, ...other } = props;
  const { shift } = useOutletContext();
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
        setDeducts(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const [firstDate, setFirstDate] = useState(dayjs(new Date()));
  const [secondDate, setSecondDate] = useState(dayjs(new Date()));
  const [loading, setLoading] = useState(null);
  const [client, setClient] = useState(null);
  const [deducts, setDeducts] = useState();
  const [clients, setClients] = useState([]);
  const [checked, setChecked] = useState(false);

  useEffect(()=>{
    axiosClient.get(`shift/last`).then(({ data: data }) => {
      setDeducts(data.data.deducts);

  });
  },[])
  console.log(shift,'deducts')
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
      field: "price",
      headerName: "T.Price",
      width: 110,
      type: "number",
      valueGetter: (val, row) => row.total_price,
    },
    {
      field: "payment",
      headerName: "Payment",
      width: 110,
      valueGetter: (val, row) => row.payment_type.name,
    },
    {
      field: "invoice",
      headerName: "Invoice",
      width: 110,
      renderCell: (row) => {
        return <a href={`${webUrl}deduct/invoice?id=${row.id}`}>Invoice PDF</a>;
      },
      //   valueGetter:(val,row)=>  <a href={`${webUrl}deduct/invoice?id=${row.id}`}>
      //   Invoice PDF
      // </a>
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 110,
      renderCell: (row) => {
        return <LoadingButton
        loading={loading}
        onClick={() => {
          setLoading(true);
          axiosClient
            .delete(`deduct/${row.id}`)
            .then(({ data }) => {
              console.log(data);
              setDeducts((prev) => {
                return prev.filter((d) => d.id !== row.id);
              });
            })
            .finally(() => {
              setLoading(false);
            })
            .catch(({ response: { data } }) => {
              setDialog((prev) => {
                return {
                  ...prev,
                  message: data.message,
                  open: true,
                  color: "error",
                };
              });
            });
        }}
      >
        <DeleteOutline />
      </LoadingButton>;
      },
      //   valueGetter:(val,row)=>  <a href={`${webUrl}deduct/invoice?id=${row.id}`}>
      //   Invoice PDF
      // </a>
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

  useEffect(() => {
    //fetch all clients
    axiosClient(`client/all`).then(({ data }) => {
      setClients(data);
      console.log(data);
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
        Sales Report
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
            rows={deducts}
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

export default SaleReport;
