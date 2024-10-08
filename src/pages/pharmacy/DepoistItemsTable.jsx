import { Add, Delete, SwapHoriz } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
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
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import { blurForNoramlUsers, onlyAdmin, theme, toFixed, webUrl } from "../constants";
import axiosClient from "../../../axios-client";
import MyTableCell from "../inventory/MyTableCell";
import MyCheckbox from "../../components/MyCheckBox";
import { useOutletContext } from "react-router-dom";
import MyDateField from "../../components/MyDateField";
import MyDateField2 from "../../components/MyDateField2";
import counting from "./../../assets/images/counting.png";
import reduction from "./../../assets/images/reduction.png";
import vat from "./../../assets/images/vat.png";
import profit from "./../../assets/images/profit.png";
import discount from "./../../assets/images/discount.png";
import discount2 from "./../../assets/images/discount2.png";
import paid from "./../../assets/images/paid.png";
import { useStateContext } from "../../appContext";

function DepoistItemsTable({
  selectedDeposit,
  loading,
  deleteIncomeItemHandler,
  data,
  setData,
  setLayout,
  change,
}) {
  const { setDialog } = useOutletContext();
  const {user} = useStateContext()
  console.log(selectedDeposit,'selected Deposit')
  // console.log(setDialog, "setdialog");
  // console.log(data, "data of cloned deposit");
  const [ld, setLd] = useState(false);
  const [search, setSearch] = useState(null);
  const [depsitWithSummery,setDepsitWithSummery] = useState(null)
  const [updateSummery,setUpdateSummery] = useState(0)
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
          console.log(item,'item filtered')
          return item.item?.barcode?.trim() == search.trim();
        });
        const sliced = filtered.slice(page, page + 10).map((i) => {
          // alert(i)
        });

        change({ ...selectedDeposit, items: filtered });
      } else {
        if (search == "") {
          alert("empty search");
          change(data);
          return;
        }
        change({
          ...selectedDeposit,
          items: data.items.filter((item) =>
            item.item.market_name.toLowerCase().includes(search?.toLowerCase())
          ),
        });
      }
    }
  }, [search]);
  useEffect(() => {
    axiosClient.get(`depositSummery/${selectedDeposit?.id}`).then(({data})=>{
      console.log(data,'data')
      setDepsitWithSummery(data)
    })
  },[updateSummery])
  return (
    <TableContainer sx={{ height: "80vh", overflow: "auto", p: 1 }}>
      <Stack direction={"row"} alignItems={"center"} gap={2}>
        <LoadingButton
          variant="contained"
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
           مخزون افتتاحي  
        </LoadingButton>
        <Button
          variant="contained"
          sx={{ m: 1 }}
          href={`${webUrl}pdf?id=${selectedDeposit.id}`}
        >
          pdf
        </Button>
        <Card sx={{ backgroundColor: "#ffffff73",height:142,width:142 }}>
          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            className={` hover:bg-sky-700`}
            sx={{ p: 1, color: "black", fontSize: "large" }}
            direction={"column"}
            gap={1}
          >
            <img width={50} src={counting} />
            <span style={{ color: "black", fontSize: "20px" }}>{selectedDeposit?.items?.length}</span>
            <span style={{ color: "black", fontSize: "20px" }}>
              عدد الاصناف
            </span>
          </Stack>
        </Card>
        <Card sx={{ backgroundColor: "#ffffff73",height:142,width:142 }}>
          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            className={` hover:bg-sky-700`}
            sx={{ p: 1, color: "black", fontSize: "large" }}
            direction={"column"}
            gap={1}
          >
            <img width={50} src={reduction} />
            <span style={{ color: "black", fontSize: "20px" }}>{toFixed(depsitWithSummery?.costWithOutVat ?? 0,3)}</span>
            <span style={{ color: "black", fontSize: "20px" }}>
              {" "}
              التكلفه قبل
            </span>
          </Stack>
        </Card>
        <Card sx={{ backgroundColor: "#ffffff73",height:142,width:142 }}>
          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            className={` hover:bg-sky-700`}
            sx={{ p: 1, color: "black", fontSize: "large" }}
            direction={"column"}
            gap={1}
          >
            <img width={50} src={vat} />
            <span style={{ color: "black", fontSize: "20px" }}>{toFixed(depsitWithSummery?.totalVatCost, 3)}</span>
            <span style={{ color: "black", fontSize: "20px" }}>
              {" "}
              اجمالي الضريبه
            </span>
          </Stack>
        </Card>
        <Card sx={{ backgroundColor: "#ffffff73",height:142,width:142 }}>
          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            className={` hover:bg-sky-700`}
            sx={{ p: 1, color: "black", fontSize: "large" }}
            direction={"column"}
            gap={1}
          >
            <img width={50} src={reduction} />
            <span style={{ color: "black", fontSize: "20px" }}>{toFixed(depsitWithSummery?.CostWithVat, 3)}</span>
            <span style={{ color: "black", fontSize: "20px" }}>
              {" "}
              التكلفه بعد
            </span>
          </Stack>
        </Card>
        <Card sx={{ backgroundColor: "#ffffff73",height:142,width:142 }}>
          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            className={` hover:bg-sky-700 ${onlyAdmin(user?.id,blurForNoramlUsers)}`}
            sx={{ p: 1, color: "black", fontSize: "large" }}
            direction={"column"}
            gap={1}
          >
            <img width={50} src={profit} />
            <span style={{ color: "black", fontSize: "20px" }}>{toFixed(depsitWithSummery?.profit, 3)}</span>
            <span style={{ color: "black", fontSize: "20px" }}>
              {" "}
              اجمالي الربح
            </span>
          </Stack>
        </Card>
        <Card sx={{ backgroundColor: "#ffffff73",height:142,width:142 }}>
          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            className={` hover:bg-sky-700`}
            sx={{ p: 1, color: "black", fontSize: "large" }}
            direction={"column"}
            gap={1}
          >
            <img width={50} src={discount} />
            <span style={{ color: "black", fontSize: "20px" }}>{depsitWithSummery?.discount}</span>
            <span style={{ color: "black", fontSize: "20px" }}>
              {" "}
               الخصم نسبه
            </span>
          </Stack>
        </Card>
        <Card sx={{ backgroundColor: "#ffffff73",height:142,width:142 }}>
          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            className={` hover:bg-sky-700`}
            sx={{ p: 1, color: "black", fontSize: "large" }}
            direction={"column"}
            gap={1}
          >
            <img width={50} src={discount2} />
            <span style={{ color: "black", fontSize: "20px" }}>{toFixed(depsitWithSummery?.discountedMoney)}</span>
            <span style={{ color: "black", fontSize: "20px" }}>
              {" "}
               الخصم ريال
            </span>
          </Stack>
        </Card>
        <Card sx={{ backgroundColor: "#ffffff73",height:142,width:142 }}>
          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            className={` hover:bg-sky-700`}
            sx={{ p: 1, color: "black", fontSize: "large" }}
            direction={"column"}
            gap={1}
          >
            <img width={50} src={paid} />
            <span style={{ color: "black", fontSize: "20px" }}>{toFixed(depsitWithSummery?.CostWithVat -depsitWithSummery?.discountedMoney ,3)}</span>
            <span style={{ color: "black", fontSize: "20px" }}>
              {" "}
                التكلفه النهائيه
            </span>
          </Stack>
        </Card>
      </Stack>
      {/* <a href={`${webUrl}pdf?id=${selectedDeposit.id}`}></a> */}

      <Stack
        sx={{ m: 1 }}
        alignItems={"center"}
        justifyContent={"space-between"}
        direction={"row"}
      >
        <Typography align="center" variant="h5" sx={{ mb: 1 }}>
          {`${selectedDeposit.supplier.name} /  ${selectedDeposit.bill_number}`}
        </Typography>

        <IconButton
          onClick={() => {
            setLayout((prev) => {
              return {
                ...prev,
                showAddtoDeposit: true,
                addToDepositForm: "1fr",
              };
            });
          }}
          title="add item"
          color="success"
        >
          <AddIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            setLayout((prev) => {
              return {
                ...prev,
                showAddtoDeposit: false,
                addToDepositForm: "0fr",
              };
            });
          }}
          title="expand"
          color="success"
        >
          <SwapHoriz />
        </IconButton>
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

      <Card sx={{ backgroundColor: "#ffffff73" }}>
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
              <TableCell>T.Cost</TableCell>
              <TableCell>Dlt</TableCell>
              <TableCell> return</TableCell>
              <TableCell> Free QYN</TableCell>
              <TableCell>Expire</TableCell>
            </TableRow>
          </thead>

          <TableBody>
            {selectedDeposit.items
              .slice(page, page + 10)
              .map((depositItem, i) => {
                return (
                  <TableRow key={depositItem.id}>
                    <TableCell>
                      <span
                        style={{
                          color: "black",
                          fontSize: "large",
                          fontWeight: "bolder",
                        }}
                      >
                        {depositItem?.item?.market_name.toUpperCase()}
                      </span>
                    </TableCell>
                    <MyTableCell
                      stateUpdater={setUpdateSummery}
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
                      stateUpdater={setUpdateSummery}
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
                      stateUpdater={setUpdateSummery}
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
                      {toFixed(
                        (depositItem.vat_cost * depositItem.cost) / 100,
                        3
                      )}
                    </TableCell>
                    <TableCell>
                      {toFixed(depositItem.finalCostPrice, 3)}
                    </TableCell>
                    <MyTableCell
                      setDialog={setDialog}
                      stateUpdater={setUpdateSummery}
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
                      stateUpdater={setUpdateSummery}
                      sx={{ width: "60px", textAlign: "center" }}
                      change={change}
                      item={depositItem}
                      table="depositItems/update"
                      colName={"vat_sell"}
                    >
                      {toFixed(depositItem.vat_sell, 3)}
                    </MyTableCell>
                    <TableCell>
                      {toFixed(depositItem.finalSellPrice, 3)}
                    </TableCell>

                    <TableCell>
                      {toFixed(
                        depositItem.quantity * depositItem.finalCostPrice,
                        3
                      )}
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
                      stateUpdater={setUpdateSummery}
                      sx={{ width: "60px", textAlign: "center" }}
                      change={change}
                      item={depositItem}
                      table="depositItems/update"
                      colName={"free_quantity"}
                    >
                      {depositItem.free_quantity}
                    </MyTableCell>
                    <TableCell>
                      <MyDateField2
                        val={depositItem.expire}
                        item={depositItem}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Card>
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
