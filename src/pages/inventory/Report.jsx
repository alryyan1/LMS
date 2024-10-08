import {
  Autocomplete,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import { webUrl } from "../constants";
import { useOutletContext } from "react-router-dom";
import { Delete } from "@mui/icons-material";

function Report() {
  const {setDialog} =  useOutletContext()
  const [date, setDate] = useState(null);
  const [income, setIncome] = useState([]);
  const [incomeItems, setIncomeItems] = useState([]);
  const [billNumber, setBillNumber] = useState(null);
  const [selectIncome, setSelectedIncome] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [update,setUpdate] = useState(0);


  const searchDeposits = () => {
    console.log(date.format('YYYY/MM/DD'),'date')
    console.log(date.$d,'date')
    axiosClient
      .post("inventory/deposit/getDepositsByDate", {
        date: date.format('YYYY/MM/DD'),
      })
      .then(({ data: { data } }) => {
        setIncomeItems([]);
        setIncome(data);

        console.log(data, "getDepositsByDate");
      });
  };
  useEffect(() => {
    //fetch all suppliers
    axiosClient("suppliers/all").then(({ data }) => {
      console.log(data);
      //set suppliers
      setSuppliers(data);
      // console.log(data);
    });
  }, []);

  const showDepositById = (id) => {
    axiosClient.get(`inventory/deposit/getDepositById/${id}`).then(
      ({
        data: {
          data: { items },
        },
      }) => {
        setIncomeItems(items);
        console.log(items, "response");
      }
    );
  };
  const showDepositBySupplier = (supplier) => {
    axiosClient
      .post(`inventory/deposit/getDepositBySupplier`, {
        supplier_id: supplier.id,
      })
      .then(({data:{data}}) => {
        console.log(data)
        setIncome(data);
        // console.log(items, "response");
      });
  };
  useEffect(() => {
    setDate(dayjs(new Date()));
  }, []);
  useEffect(() => {
    const timeoutid = setTimeout(() => {
      axiosClient
        .post("inventory/deposit/getDepoistByInvoice", {
          bill_number: billNumber,
        })
        .then(({ data: data }) => {
          setIncome(data);
        });
    }, 300);
    return () => {
      clearTimeout(timeoutid);
    };
  }, [billNumber]);
  return (
    <Grid container sx={{ gap: "5px" }}>
      <Grid item xs={5}>
        <Typography variant="h4" align="center" sx={{ mb: 1 }}>
          استعلام فاتوره اذن وارد{" "}
        </Typography>
        {incomeItems.length > 0 ? (
          <TableContainer>
            <a
              href={`${webUrl}pdf?id=${selectIncome}`}
            >
              pdf
            </a>

            <Table dir="rtl" size="small">
              <thead>
                <TableRow>
                  <TableCell>رقم</TableCell>
                  <TableCell>الصنف</TableCell>
                  <TableCell>الكميه</TableCell>
                  <TableCell>السعر</TableCell>
                  <TableCell>الاجمالي</TableCell>
                </TableRow>
              </thead>

              <TableBody>
                {incomeItems.map((income, i) => (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{income.name}</TableCell>
                    <TableCell>{income.quantity}</TableCell>
                    <TableCell>{income.price}</TableCell>
                    <TableCell>
                      {income.quantity * income.price}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          ""
        )}
      </Grid>
      <Grid item xs={6}>
        <div style={{ textAlign: "right" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Button
              sx={{ mt: 2 }}
              onClick={searchDeposits}
              size="medium"
              variant="contained"
            >
              بحث
            </Button>
            <DateField
              onChange={(val) => {
                setDate(val);
              }}
              value={date}
              defaultValue={dayjs(new Date())}
              sx={{ m: 1 }}
              label="تاريخ الفاتوره"
            />
          </LocalizationProvider>
          <TextField
            onChange={(event) => {
              setBillNumber(event.target.value);
            }}
            sx={{ mt: 1 }}
            label="بحث برقم الفاتوره"
          ></TextField>
        </div>
        <Autocomplete
          isOptionEqualToValue={(option, val) => option.id === val.id}
          sx={{ mb: 1 }}
          options={suppliers}
          getOptionLabel={(option) => option.name}
          onChange={(e, data) =>{
            setSelectedSupplier(data)
            showDepositBySupplier(data)
          } }
          renderInput={(params) => {
            return <TextField label={"بحث بالمورد"} {...params} />;
          }}
        ></Autocomplete>

        <TableContainer>
          <Table dir="rtl">
            <thead>
              <TableRow>
                <TableCell>رقم الفاتوره</TableCell>
                <TableCell>تاريخ انشاء الفاتوره </TableCell>
                <TableCell>تاريخ الفاتوره </TableCell>
                <TableCell> المورد </TableCell>
                <TableCell>عرض</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            </thead>
            <TableBody>
              {income.map((item) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.bill_number}</TableCell>
                    <TableCell>
                      {new Date(item.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(item.bill_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{item.supplier.name}</TableCell>
                    <TableCell>
                      <Button
                      size="small"

                        onClick={() => {
                          setSelectedIncome(item.id);
                          showDepositById(item.id);
                        }}
                      >
                        show
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                      size="small"
                      color="error"
                        onClick={() => {
                         axiosClient.delete(`inventory/${item.id}`).then(({data}) => {  //show success dialog
                          if (data.status) {
                            setIncome((prev)=>{
                              return  prev.filter((p)=> p.id != item.id)
                            })
                            setDialog({
                              open: true,
                              msg: "Operation completed successfully",
                            })
                          }
                         }).catch(({response:{data}}) =>{
                          console.log(data)
                          setDialog({
                            color:'error',
                            open: true,
                            msg: data.message,
                          })
                        });
                        }}
                      >
                        <Delete/>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

export default Report;
