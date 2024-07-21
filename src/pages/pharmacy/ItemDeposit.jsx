import {
  Autocomplete,
  Badge,
  Button,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";

import { Item, url } from "../constants.js";
import { Link, useOutletContext } from "react-router-dom";
import dayjs from "dayjs";
import axiosClient from "../../../axios-client.js";
import DepoistItemsTable from "./DepoistItemsTable.jsx";
import NewInvoiceForm from "./NewInvoiceForm.jsx";
import AddItemToDepositForm from "./AddItemToDepositForm.jsx";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {t} from 'i18next'
import { ArrowDropDown, Download } from "@mui/icons-material";
function ItemDeposit() {
  const [layOut, setLayout] = useState({
    newForm: "1fr",
    showNewForm: true,
    showAddtoDeposit: false,
    addToDepositForm:'0fr',
    addToInventoryStyleObj: {},
    incomeItemsStyleObj: {},
  });
  const showNewFormHandler = () => {
    setLayout((prev) => {
      return {
        ...prev,
        showNewForm: true,
        newForm: "1fr",
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
  const { setDialog, items ,suppliers} = useOutletContext();
  const [incomeItems, setIncomeItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [income, setIncome] = useState(null);
  const [update, setUpdate] = useState(0);
  const [todayDeposits, setTodayDeposits] = useState([]);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  console.log(income, "is equal to null", income === null);
  const dayJsObj = dayjs(new Date());
  console.log(`${dayJsObj.date()}/${dayJsObj.month() + 1}/${dayJsObj.year()}`);
  console.log(show, "show");

  useEffect(() => {
    axiosClient
      .post("inventory/deposit/getDepositsByDate", {
        date: dayjs(new Date()).format("YYYY/MM/DD"),
      })
      .then(({ data }) => {
        setTodayDeposits(data.data);
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
      <Stack direction={"row"} alignItems={'center'} gap={3} style={{ textAlign: "right" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Button onClick={searchDeposits} size="medium" variant="contained">
            {t('search')}
          </Button>
          <DateField
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
          onChange={(event) => {
            setBillNumber(event.target.value);
          }}
          label="Search by invoice number"
        ></TextField>
        <Autocomplete
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
          gridTemplateColumns: `  2fr  ${layOut.addToDepositForm}   0.7fr     ${layOut.newForm}  0.1fr `,
        }}
      >
        <div style={layOut.incomeItemsStyleObj}>
          {/* create table with all suppliers */}
          {selectedDeposit && (
            <DepoistItemsTable
            setSelectedDeposit ={setSelectedDeposit}
              deleteIncomeItemHandler={deleteIncomeItemHandler}
              loading={loading}
              selectedDeposit={selectedDeposit}
            />
          )}
        </div>
        <div style={layOut.addToInventoryStyleObj}>
          {selectedDeposit && layOut.showAddtoDeposit && (
            <AddItemToDepositForm
              setUpdate={setUpdate}
              setSelectedDeposit={setSelectedDeposit}
              items={items}
              selectedDeposit={selectedDeposit}
              setDialog={setDialog}
            />
          )}
        </div>
        <div>
          {todayDeposits.map((deposit) => {
            return (
              <Badge
                key={deposit.id}
                color="primary"
                badgeContent={deposit.items.length}
              >
                <ListItem key={deposit.id}>
                  <ListItemButton
                    title={dayjs(Date.parse(deposit.bill_number)).format(
                      "YYYY-MM-DD"
                    )}
                    style={{
                      border: "1px dashed ",
                      marginBottom: "2px",
                    }}
                    sx={{
                      backgroundColor: (theme) =>
                        selectedDeposit?.id == deposit.id
                          ? theme.palette.primary.main
                          : "",
                    }}
                    onClick={() => {
                      hideAddToDeposit()
                      hideNewFormHandler();
                      setSelectedDeposit(deposit);
                    }}
                  >
                    <ListItemText>{`${deposit.supplier.name} - ${deposit.bill_number}`}</ListItemText>
                  </ListItemButton>
                </ListItem>
              </Badge>
            );
          })}
        </div>

        {layOut.showNewForm && (
          <NewInvoiceForm
            hideNewFormHandler={hideNewFormHandler}
            setDialog={setDialog}
            setUpdate={setUpdate}
            suppliers={suppliers}
          />
        )}
        <Stack direction={'column'} gap={2}>
          <Item>
            <IconButton
              onClick={() => {
                showNewFormHandler();
              }}
              variant="contained"
            >
              <CreateOutlinedIcon />
            </IconButton>
          </Item>
          <Item>
            <IconButton
              onClick={() => {
                showAddToDeposit();
              }}
              variant="contained"
            >
              <Download />
            </IconButton>
          </Item>
        </Stack>
      </div>
    </>
  );
}

export default ItemDeposit;
