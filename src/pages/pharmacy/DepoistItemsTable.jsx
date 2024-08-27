import { Add, Delete, SwapHoriz } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Icon,
  IconButton,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from "react";
import { theme, toFixed, webUrl } from "../constants";
import axiosClient from "../../../axios-client";
import MyTableCell from "../inventory/MyTableCell";
import MyCheckbox from "../../components/MyCheckBox";
import { useOutletContext } from "react-router-dom";
import MyDateField from "../../components/MyDateField";
import MyDateField2 from "../../components/MyDateField2";
function DepoistItemsTable({
  selectedDeposit,
  loading,
  deleteIncomeItemHandler,
  data,
  setData,
  setLayout,
  change
}) {
  const { setDialog } = useOutletContext();
  // console.log(setDialog, "setdialog");
  // console.log(data, "data of cloned deposit");
  const [ld, setLd] = useState(false);
  const [search, setSearch] = useState(null);
  const changedItems = [];
  const [page, setPage] = useState(0);
  // console.log("data in deposit items table", data);
  // console.log("selectedDeposit in deposit items table", selectedDeposit);
  useEffect(() => {
    if (search != null) {
      if (search == "") {
        // alert('empty search')
        // console.log(data, "data");
        change(data);
        return;
      }
      if (!isNaN(search)) {
        setPage(() => {
          return 0;
        });
        // alert('number search')
        const filtered = data.items.filter((item) => {
          return item.item.barcode.trim() == search.trim();
        });
        const sliced = filtered.slice(page, page + 10).map((i) => {
          // alert(i)
        });
    
        change({...selectedDeposit,items:filtered})
      } else {
        if (search == "") {
          alert("empty search");
          change(data);
          return;
        }
        change({...selectedDeposit,items:data.items.filter((item) =>
          item.item.market_name
            .toLowerCase()
            .includes(search?.toLowerCase()))})

        
      }
    }
  }, [search]);
  return (
    <TableContainer sx={{ height: "80vh", overflow: "auto", p: 1 }}>
      <LoadingButton
        loading={ld}
        onClick={() => {
          setLd(true);
          const result = confirm(
            "هل انت متاكد من اضافه كل الاصناف لهذه الفاتوره"
          );
          if (result) {
            axiosClient
              .post(`income-item/bulk/${selectedDeposit.id}`)
              .then(({ data }) => {
                change(data.deposit);
                setData(data);
              })
              .finally(() => setLd(false));
          }
        }}
      >
        تعريف كل الاصناف للفاتوره
      </LoadingButton>
      <a href={`${webUrl}pdf?id=${selectedDeposit.id}`}>pdf</a>
      <Stack
        sx={{ m: 1 }}
        alignItems={"center"}
        justifyContent={"space-between"}
        direction={"row"}
      >
        <Typography align="center" variant="h5" sx={{ mb: 1 }}>
          {`${selectedDeposit.supplier.name} /  ${selectedDeposit.bill_number}`}
        </Typography>

        <IconButton onClick={()=>{

          setLayout((prev)=>{
            return {
             ...prev,
             showAddtoDeposit:true,
             addToDepositForm: "1fr",
             
            }
  
          })
        }} title="add item" color="success"><AddIcon/></IconButton>
          <IconButton onClick={()=>{
          setLayout((prev)=>{
            return {
             ...prev,
             showAddtoDeposit:false,
             addToDepositForm: "0fr",
            }
  
          })
        }} title="expand" color="success"><SwapHoriz/></IconButton>
        <TextField
          autoComplete="false"
          placeholder="Barcode/Market name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          label="بحث"
          type="search"
        ></TextField>
      </Stack>

      <Table key={selectedDeposit.items.length} size="small">
        <thead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Cost</TableCell>
            <TableCell>Vat(Cost) %</TableCell>
            <TableCell>Vat (OMR)</TableCell>
            <TableCell> Cost + vat </TableCell>
            <TableCell> R.P </TableCell>
            <TableCell> Vat(Sell) % </TableCell>
            <TableCell> R.P + Vat </TableCell>
            <TableCell sx={{backgroundColor:(theme)=>theme.palette.error.light}}>total cost</TableCell>
            <TableCell>Dlt</TableCell>
            <TableCell> return</TableCell>
            <TableCell> free QYN</TableCell>
            <TableCell>Expire</TableCell>
          </TableRow>
        </thead>

        <TableBody>
          {selectedDeposit.items
            .slice(page, page + 10)
            .map((depositItem, i) => {
   
              return (
                <TableRow key={depositItem.id}>
                  <TableCell>{depositItem.item.market_name}</TableCell>
                  <MyTableCell
                    setDialog={setDialog}
                    sx={{ width: "60px", textAlign: "center" }}
                    show
                    change={change}
                    item={depositItem}
                    table="depositItems/update"
                    colName={"quantity"}
                  >
                    {depositItem.quantity}
                  </MyTableCell>
                  <MyTableCell
                    setDialog={setDialog}
                    show
                    sx={{ width: "60px", textAlign: "center" }}
                    change={change}
                    item={depositItem}
                    table="depositItems/update"
                    colName={"cost"}
                  >
                    {depositItem.cost}
                  </MyTableCell>

                  <MyTableCell
                    setDialog={setDialog}
                    show
                    sx={{ width: "60px", textAlign: "center" }}
                    change={change}
                    item={depositItem}
                    table="depositItems/update"
                    colName={"vat_cost"}
                  >
                    {depositItem.vat_cost}
                  </MyTableCell>
                  <TableCell>
                    {toFixed((depositItem.vat_cost * depositItem.cost) / 100,3)}
                  </TableCell>
                  <TableCell >{toFixed(depositItem.finalCostPrice,3)}</TableCell>
                  <MyTableCell
                    setDialog={setDialog}
                    sx={{ width: "60px", textAlign: "center" }}
                    show
                    change={change}
                    item={depositItem}
                    table="depositItems/update"
                    colName={"sell_price"}
                  >
                    {depositItem.sell_price}
                  </MyTableCell>
                  <MyTableCell
                    setDialog={setDialog}
                    sx={{ width: "60px", textAlign: "center" }}
                    
                    change={change}
                    item={depositItem}
                    table="depositItems/update"
                    colName={"vat_sell"}
                  >
                    {toFixed(depositItem.vat_sell,3)}
                  </MyTableCell>
                  <TableCell>{toFixed(depositItem.finalSellPrice,3)}</TableCell>

                  <TableCell sx={{backgroundColor:(theme)=>theme.palette.error.light}}>
                    {toFixed(depositItem.quantity * depositItem.finalCostPrice, 3)}
                  </TableCell>

                  <TableCell>
                    <LoadingButton
                      loading={loading}
                      title="Delete"
                      endIcon={<Delete />}
                      onClick={() => {
                        deleteIncomeItemHandler(depositItem.id);
                      }}
                    ></LoadingButton>
                  </TableCell>
                  <TableCell>
                    <MyCheckbox
                      change={change}
                      path={`depositItems/update/${depositItem.id}`}
                      isChecked={depositItem.return}
                      colName={"return"}
                    />
                  </TableCell>
                  <MyTableCell
                    setDialog={setDialog}
                    sx={{ width: "60px", textAlign: "center" }}
                    
                    change={change}
                    item={depositItem}
                    table="depositItems/update"
                    colName={"free_quantity"}
                  >
                    {depositItem.free_quantity}
                  </MyTableCell>
                  <TableCell>
                    <MyDateField2 val={depositItem.expire} item={depositItem} />
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      <Pagination
        shape="rounded"
        onChange={(e, number) => setPage(number * 10 - 10)}
        count={Math.ceil(selectedDeposit.items.length / 10)}
        variant="outlined"
      />
    </TableContainer>
  );
}

export default DepoistItemsTable;
