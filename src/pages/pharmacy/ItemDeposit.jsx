import {
  Autocomplete,
  Badge,
  Button,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";

import { Item, url, webUrl } from "../constants.js";
import { Link, useOutletContext } from "react-router-dom";
import dayjs from "dayjs";
import axiosClient from "../../../axios-client.js";
import DepoistItemsTable from "./DepoistItemsTable.jsx";
import NewInvoiceForm from "./NewInvoiceForm.jsx";
import AddItemToDepositForm from "./AddItemToDepositForm.jsx";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { t } from "i18next";
import { ArrowDropDown, DeleteOutline, Download, FormatListBulleted } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
function ItemDeposit() {
  const [layOut, setLayout] = useState({
    newForm: "0fr",
    depositsTable:'2fr',
    showDepositsTable:true,
    showNewForm: false,
    showDopsitItemTable: false,
    depositItemTable: "0fr",
    showAddtoDeposit: false,
    addToDepositForm: "0fr",
    addToInventoryStyleObj: {},
    incomeItemsStyleObj: {},
  });
  const showNewFormHandler = () => {
    setLayout((prev) => {
      return {
        ...prev,
        showNewForm: true,
        newForm: "400px",
      };
    });
  };
  const hideNewFormHandler = () => {
    setLayout((prev) => {
      return {
        ...prev,
        showNewForm: false,
        newForm: "0fr",
      };
    });
  };
  const showAddToDeposit = () => {
    setLayout((prev) => {
      return {
        ...prev,
        showAddtoDeposit: true,
        addToDepositForm: "1fr",
      };
    });
  };
  const hideDepositItemsTable = () => {
    setLayout((prev) => {
      return {
        ...prev,
        showDopsitItemTable: false,
        depositItemTable: "0fr",
      };
    });
  };
  const showDepositItemsTable = () => {
    setLayout((prev) => {
      return {
        ...prev,
        showDopsitItemTable: true,
        depositItemTable: "3fr",
      };
    });
  }
  const hideDepositsTable = () => {
    setLayout((prev) => {
      return {
        ...prev,
        showDepositsTable: false,
        depositsTable: "0fr",
      };
    });
  };
  const showDepositsTable = () => {
    setLayout((prev) => {
      return {
        ...prev,
        showDepositsTable: true,
        depositsTable: "1fr",
      };
    });
  };
  const hideAddToDeposit = () => {
    setLayout((prev) => {
      return {
        ...prev,
        showAddtoDeposit: false,
        addToDepositForm: "0fr",
      };
    });
  };
  // console.log(items);
  //create state variable to store all suppliers
  const { setDialog, items, suppliers } = useOutletContext();
  const [incomeItems, setIncomeItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [income, setIncome] = useState(null);
  const [update, setUpdate] = useState(0);
  const [todayDeposits, setTodayDeposits] = useState([]);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [data,setData] = useState()
  console.log(income, "is equal to null", income === null);
  const dayJsObj = dayjs(new Date());
  console.log(`${dayJsObj.date()}/${dayJsObj.month() + 1}/${dayJsObj.year()}`);
  console.log(show, "show");

  useEffect(() => {
    axiosClient.get("inventory/deposit/all").then(({ data }) => {
      setTodayDeposits(data);
    });
  }, [update]);
  console.log(items, "items");
  useEffect(() => {
    axiosClient.get("inventory/deposit/last").then(({ data: data }) => {
      if (data != "") {
        console.log(data, "is data");
        setIncome(data);
        console.log(data);

        setIncomeItems(data.items);
        if (data.complete) {
          setLayout((prev) => {
            return {
              ...prev,
              incomeItemsStyleObj: {},
              addToInventoryStyleObj: {},
            };
          });
          setShow(true);
        }
      } else {
        setShow(true);
      }
    });
  }, [update]);

  useEffect(() => {
    document.title = "اذن وارد";
  }, []);
  const deleteIncomeItemHandler = (id) => {
    setLoading(true);
    axiosClient.delete(`depositItem/${id}`).then((data) => {
      if (data.status) {
        setLoading(false);
        setSelectedDeposit(data.data.deposit);
        //delete supplier by id
        setDialog({
          open: true,
          message: "تم الحذف بنجاح",
        });
      }
    });
  };

  const [billNumber, setBillNumber] = useState("");
  const [date, setDate] = useState(dayjs(new Date()));
  const showDepositBySupplier = (supplier) => {
    axiosClient
      .post(`inventory/deposit/getDepositBySupplier`, {
        supplier_id: supplier.id,
      })
      .then(({ data: { data } }) => {
        console.log(data);
        setTodayDeposits(data);
        // console.log(items, "response");
      });
  };

  const searchDeposits = () => {
    console.log(date.format("YYYY/MM/DD"), "date");
    console.log(date.$d, "date");
    axiosClient
      .post("inventory/deposit/getDepositsByDate", {
        date: date.format("YYYY/MM/DD"),
      })
      .then(({ data: { data } }) => {
        setTodayDeposits(data);
      });
  };
  useEffect(() => {
    if (billNumber != "") {
      const timeoutid = setTimeout(() => {
        axiosClient
          .post("inventory/deposit/getDepoistByInvoice", {
            bill_number: billNumber,
          })
          .then(({ data: data }) => {
            setTodayDeposits(data);
          });
      }, 300);
      return () => {
        clearTimeout(timeoutid);
      };
    }
  }, [billNumber]);
  return (
    <>
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={3}
        style={{ textAlign: "right" }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Button onClick={searchDeposits} size="medium" variant="contained">
            {t("search")}
          </Button>
          <DateField
            size="small"
            onChange={(val) => {
              setDate(val);
            }}
            value={date}
            defaultValue={dayjs(new Date())}
            sx={{ m: 1 }}
            label="Purchase Invoice Date"
          />
        </LocalizationProvider>
        <TextField
          size="small"
          onChange={(event) => {
            setBillNumber(event.target.value);
          }}
          label="Search by invoice number"
        ></TextField>
        <Autocomplete
          size="small"
          sx={{ width: "400px" }}
          isOptionEqualToValue={(option, val) => option.id === val.id}
          options={suppliers}
          getOptionLabel={(option) => option.name}
          onChange={(e, data) => {
            showDepositBySupplier(data);
          }}
          renderInput={(params) => {
            return <TextField label={"Search by Supplier"} {...params} />;
          }}
        ></Autocomplete>
      </Stack>

      <div
        style={{
          gap: "15px",
          transition: "0.3s all ease-in-out",
          display: "grid",
          gridTemplateColumns: `  ${layOut.depositItemTable}  ${layOut.addToDepositForm}   ${layOut.depositsTable}     ${layOut.newForm}  100px `,
        }}
      >
      <div>
          {/* create table with all suppliers */}
          {selectedDeposit && layOut.showDopsitItemTable && (
            <DepoistItemsTable
            setData={setData}
             data={data}
              setSelectedDeposit={setSelectedDeposit}
              deleteIncomeItemHandler={deleteIncomeItemHandler}
              loading={loading}
              selectedDeposit={selectedDeposit}
            />
          )}
        </div>
        <div style={layOut.addToInventoryStyleObj}>
          {selectedDeposit && layOut.showAddtoDeposit && (
            <AddItemToDepositForm
            setData={setData}
              setUpdate={setUpdate}
              setSelectedDeposit={setSelectedDeposit}
              items={items}
              selectedDeposit={selectedDeposit}
              setDialog={setDialog}
            />
          )}
        </div>
        <div>
          {layOut.showDepositsTable && 
          
          <TableContainer>

               <Table style={{direction:'rtl'}} size="small">
            <TableHead>
              <TableRow>
                <TableCell> كود</TableCell>
                <TableCell> الرقم المرجعي</TableCell>
                <TableCell>تاريخ الانشاء</TableCell>
                <TableCell>المورد</TableCell>
                <TableCell>المبلغ</TableCell>
                <TableCell>اضيفت بواسطه </TableCell>
                <TableCell>عرض التفاصيل</TableCell>
                <TableCell> دفع</TableCell>
                <TableCell> التقرير</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {todayDeposits.map((deposit) => {
                return (
                  <TableRow
                    sx={{
                      backgroundColor: (theme) =>
                        selectedDeposit?.id == deposit.id
                          ? theme.palette.warning.light
                          : "",
                    }}
                    key={deposit.id}
                  >
                    <TableCell>{deposit.id}</TableCell>
                    <TableCell>{deposit.bill_number}</TableCell>
                    <TableCell>
                      {dayjs(new Date(Date.parse(deposit.created_at))).format(
                        "YYYY/MM/DD"
                      )}
                    </TableCell>
                    <TableCell>{deposit.supplier.name}</TableCell>
                    <TableCell>{deposit.total}</TableCell>
               
                    <TableCell>{deposit?.user?.username}</TableCell>

                    <TableCell>
                      <Button
                        onClick={() => {

                          hideDepositsTable()
                          showAddToDeposit()
                          
                          // hideAddToDeposit();
                          // hideNewFormHandler();
                          showDepositItemsTable()
                          setSelectedDeposit(deposit);
                          
                          setData(deposit);
                        }}
                      >
                        التفاصيل
                      </Button>
                    </TableCell>
                    <TableCell>
                      <LoadingButton loading={loading} color={deposit.paid ? 'success' : 'error'} variant="contained"
                        onClick={() => {
                          setLoading(true);
                          axiosClient.patch(`inventory/deposit/pay/${deposit.id}}`).then(({data})=>{
                            setTodayDeposits((prev)=>{
                              return prev.map(d=>{
                                // console.log(d,data)
                                if(d.id === data.data.id){
                                  // alert('found')
                                  return {...data.data}
                                }else{
                                  return d;
                                }
                              })
                            })
                          }).finally(()=>setLoading(false))
                        }}
                      >
                        {deposit.paid ?'الغاء الدفع':'دفع'}
                      </LoadingButton>
                    </TableCell>
                    <TableCell>  <a
              href={`${webUrl}pdf?id=${deposit.id}`}
            >
              pdf
            </a></TableCell>

                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          </TableContainer>
       }
        </div>

        {layOut.showNewForm && (
          <NewInvoiceForm
            hideNewFormHandler={hideNewFormHandler}
            setDialog={setDialog}
            setUpdate={setUpdate}
            suppliers={suppliers}
          />
        )}
        <Stack direction={"column"} gap={2}>
        <Item>
            <IconButton
            title="اظهار الفواتير"
              onClick={() => {
                hideDepositItemsTable()
                hideAddToDeposit()
                hideNewFormHandler()
                showDepositsTable();
            
              }}
              variant="contained"
            >
              <FormatListBulleted />
            </IconButton>
          </Item>
          <Item>
            <IconButton
            title="انشاء فاتوره"
              onClick={() => {
                hideDepositItemsTable()
                
                hideAddToDeposit()
                showNewFormHandler();
               setLayout((prev)=>{
                 return {
                  ...prev,
                   depositsTable:'1fr'
                 }
 
               })
              }}
              variant="contained"
            >
              <CreateOutlinedIcon />
            </IconButton>
          </Item>
          {/* <Item>
            <IconButton
             title="اضافه صنف الي فاتوره"
              onClick={() => {
                showAddToDeposit();
                showDepositItemsTable()
              }}
              variant="contained"
            >
              <Download />
            </IconButton>
          </Item> */}
        </Stack>
      </div>
    </>
  );
}

export default ItemDeposit;
