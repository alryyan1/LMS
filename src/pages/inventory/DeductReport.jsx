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
  
  function DeductReport() {
    const [date, setDate] = useState(null);
    const [deduct, setDeduct] = useState([]);
    const [deductItems, setDeductItems] = useState([]);
    const [selectDeduct, setSelectedDeduct] = useState(null);
   const {setDialog} = useOutletContext()


  
    const searchDeducts = () => {
      axiosClient
        .post("inventory/deduct/getDeductsByDate", {
          date: date.format('YYYY-MM-DD'),
        })
        .then(({ data: { data } }) => {

        //   setDeductItems([]);
          setDeduct(data);
          console.log(data, "response");
        });
    };
  
  
    const showDeductById = (id) => {
      axiosClient.get(`inventory/deduct/showDeductById/${id}`).then(
        ({
          data: {
            data: { items },
          },
        }) => {
          setDeductItems(items);
          console.log(items, "response");
        }
      ).catch((error)=>console.log(error));
    };
  
    useEffect(() => {
      setDate(dayjs(new Date()));
    }, []);
  const deleteDeductHandler = (deduct) => {
    axiosClient
     .delete(`inventory/deduct/${deduct.id}`)
     .then(({ data }) => {
      setDeduct((prev)=>prev.filter(item=>item.id!==deduct.id))
        console.log(data);
      }).catch(({response:{data}}) =>{
        console.log(data)
        setDialog({
          color:'error',
          open: true,
          msg: data.message,
        })
      });
  }
    return (
      <Grid container sx={{ gap: "5px" }}>
        <Grid item xs={5}>
          <Typography variant="h4" align="center" sx={{ mb: 1 }}>
            استعلام اذن طلب
          </Typography>
          {deductItems.length > 0 ? (
            <TableContainer>
              <a
                href={`${webUrl}deduct/report?id=${selectDeduct}`}
              >
                pdf
              </a>
  
              <Table dir="rtl" size="small">
                <thead>
                  <TableRow>
                    <TableCell>رقم</TableCell>
                    <TableCell>الصنف</TableCell>
                    <TableCell>الكميه</TableCell>
                  </TableRow>
                </thead>
  
                <TableBody>
                  {deductItems.map((income, i) => (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{income.name}</TableCell>
                      <TableCell>{income.pivot.quantity}</TableCell>
                      
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
                onClick={searchDeducts}
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
                label="تاريخ"
              />
            </LocalizationProvider>
           
          </div>
         
          <TableContainer>
            <Table dir="rtl">
              <thead>
                <TableRow>
                  <TableCell>رقم البند</TableCell>
                  <TableCell>عرض</TableCell>
                  <TableCell>حذف</TableCell>
                </TableRow>
              </thead>
              <TableBody>
                {deduct.map((item) => {
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
               
                      <TableCell>
                        <Button
                        size="small"
                          onClick={() => {
                            setSelectedDeduct(item.id);
                            showDeductById(item.id);
                          }}
                        >
                          show
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                        variant="contained"
                        color="error"
                          onClick={() => {
                          deleteDeductHandler(item);
                          }}
                        >
                          حذف
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
  
  export default DeductReport;
  