import {
  Add,
  ArrowBack,
  ArrowForward,
  Delete,
  DeleteForeverSharp,
  RemoveRedEye,
  SwapHoriz,
  VisibilityOff,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Icon,
  IconButton,
  Pagination,
  Skeleton,
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
import {
  blurForNoramlUsers,
  onlyAdmin,
  theme,
  toFixed,
  webUrl,
} from "../constants";
import axiosClient from "../../../axios-client";
import MyTableCell from "../inventory/MyTableCell";
import MyCheckbox from "../../components/MyCheckBox";
import { useOutletContext } from "react-router-dom";
import MyDateField from "../../components/MyDateField";
import MyDateField2 from "../../components/MyDateField2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStateContext } from "../../appContext";
import ButtonOptions from "./ButtonOptions";
import MyLoadingButton from "../../components/MyLoadingButton";
import ExcelReader from "../../ExcelReader";
import InvoiceSummary from "./InvoiceSummary";
import { Deposit, PharmacyLayoutPros } from "../../types/pharmacy";

interface deleteZeroQuantityProps {
  deposit: Deposit;
  count: number;
}

interface DepoistItemsTableProps {
  data: { items: Deposit[] };
  setData: (data: { items: Deposit[] }) => void;
  setLayout: (layout) => void;
  setSelectedDeposit: (deposit: Deposit) => void;
  invoiceItems: Deposit[];
  setInvoiceItems: (items: Deposit[]) => void;
  depositItemId: number|null;
}
function DepoistItemsTable({
  data,
  setData,
  setLayout,
  change,
  setSelectedDeposit,
  invoiceItems,
  setInvoiceItems,
  depositItemId
}:DepoistItemsTableProps) {
  const {
    setDialog,
    selectedInvoice: selectedDeposit,
    excelLoading,
    links,
    setLinks,
    setUpdateSummery,
    updateSummery,
  } = useOutletContext<PharmacyLayoutPros>();
  const { user } = useStateContext();
  console.log(selectedDeposit, "deposit items table rendereed ");
  const [ld, setLd] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [summeryIsLoading, setSummeryIsLoading] = useState(false);
  const [page, setPage] = useState(0);
 

  const updateItemsTable = (link, setLoading) => {
    console.log(search);
    setLoading(true);
    axiosClient(`${link.url}&word=${search}`)
      .then(({ data }) => {
        console.log(data, "pagination data");
        setInvoiceItems(data.data);
        setLinks(data.links);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const filterByDepositItemId = depositItemId != null ? `&depositItemId=${depositItemId}` : '';
    setLoading(true);
    const timer = setTimeout(() => {
      axiosClient
        .get(
          `deposit/items/all/pagination/${selectedDeposit?.id}?word=${search}&rows=${page}${filterByDepositItemId.trim()}`
        )
        .then(({ data: { data, links } }) => {
          console.log(data);
          console.log(links, "links");
          setInvoiceItems(data);
          // console.log(links)
          setLinks(links);
        })
        .catch(({ response: { data } }) => {
          setDialog((prev) => {
            return {
              ...prev,
              open: true,
              color: "error",
              message: data.message,
            };
          });
        }).finally(() => {
          setLoading(false);
        });
    }, 300);
    return () => clearTimeout(timer);
  }, [search,page]);


  const deleteIncomeItemHandler = (id) => {
    setLoading(true);
    axiosClient.delete(`depositItem/${id}`).then((data) => {
      if (data.status) {
        setLoading(false);
        setInvoiceItems((prev) => {
          return prev.filter((item) => item.id !== id);
        });
        //delete supplier by id
        setDialog({
          open: true,
          message: "Delete was successfull",
        });
      }
    });
  };
  return (
    <TableContainer sx={{ height: "80vh", overflow: "auto", p: 1 }}>
      <div>
        <ToastContainer />
      </div>
      <InvoiceSummary 
        summeryIsLoading={summeryIsLoading}
        user={user}
      />
      {/* <a href={`${webUrl}pdf?id=${selectedDeposit.id}`}></a> */}

      <Stack
        alignItems={"center"}
        justifyContent={"space-between"}
        direction={"row"}
        gap={1}
      >
        <Typography align="center">
          {`${selectedDeposit.supplier.name} /  ${selectedDeposit.bill_number}`}
        </Typography>
        {loading && <CircularProgress/>}
        <select
          onChange={(val) => {
            setPage(val.target.value);
          }}
        >
          <option value="5">5</option>
          <option selected value="10">
            10
          </option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
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

        <ExcelReader
          setItems={setInvoiceItems}
          setSelectedDeposit={setSelectedDeposit}
          selectedDeposit={selectedDeposit}
        />

        <Button
          variant="contained"
          sx={{ m: 1 }}
          href={`${webUrl}pdf?id=${selectedDeposit.id}`}
        >
          pdf
        </Button>
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
          تعريف
        </LoadingButton>
        <LoadingButton
          loading={loading}
          sx={{ mt: 1 }}
          color="inherit"
          title="show only quantity"
          size="small"
          onClick={() => {
            setLoading(true);
            axiosClient
              .patch(`inventory/deposit/update/${selectedDeposit.id}`, {
                colName: "showAll",
                val: !selectedDeposit.showAll,
              })
              .then(({ data }) => {
                setSelectedDeposit(data.data);
                axiosClient
                  .get(
                    `deposit/items/all/pagination/${selectedDeposit.id}?rows=${page}`
                  )
                  .then(({ data: { data, links } }) => {
                    console.log(data, "items");
                    console.log(links);
                    setInvoiceItems(data);
                    console.log(links);
                    setLinks(links);
                  })
                  .catch(({ response: { data } }) => {})
                  .finally(() => setLoading(false));
              });
          }}
          variant="contained"
        >
          {selectedDeposit.showAll ? <RemoveRedEye /> : <VisibilityOff />}
        </LoadingButton>
        <LoadingButton
          loading={loading}
          sx={{ mt: 1 }}
          color="inherit"
          title="Delete Zero Quantity"
          size="small"
          onClick={() => {
            let r = confirm(
              "سيتم حذف كل الكميات التي كميتها صفر من هذه الفاتوره"
            );
            if (r) {
              setLoading(true);
              axiosClient
                .get<deleteZeroQuantityProps>(
                  `deleteZeroQuantity/${selectedDeposit.id}`
                )
                .then(({ data }) => {
                  setSelectedDeposit(data.deposit);
                  toast(`تم حذف عدد ${data.count}`, {});
                })
                .finally(() => setLoading(false));
            }
          }}
          variant="contained"
        >
          <DeleteForeverSharp />
        </LoadingButton>
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
      {excelLoading ? (
        <Skeleton width={"100%"} height={"80vh"} />
      ) : (
        <>
          <Card sx={{ backgroundColor: "#ffffff73" }}>
            <Table size="small">
              <thead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Cost</TableCell>
                  <TableCell>Vat(Cost) %</TableCell>
                  <TableCell> R.P </TableCell>
                  <TableCell> Vat(Sell) % </TableCell>
                  <TableCell> R.P + Vat </TableCell>
                  <TableCell> Other</TableCell>
                  <TableCell>Expire</TableCell>
                  <TableCell>Barcode</TableCell>
                </TableRow>
              </thead>

              <TableBody>
                {invoiceItems.map((depositItem, i) => {
                  return (
                    <TableRow key={depositItem.id}>
                      <TableCell>
                        <span
                       
                        >
                          {depositItem?.item?.market_name.toUpperCase()}
                        </span>
                      </TableCell>
                      <MyTableCell
                        stateUpdater={setUpdateSummery}
                        setDialog={setDialog}
                        sx={{ width: "60px", textAlign: "center" }}
                        show
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
                        item={depositItem}
                        table="depositItems/update"
                        colName={"vat_cost"}
                      >
                        {depositItem.vat_cost}
                      </MyTableCell>

                      <MyTableCell
                        setDialog={setDialog}
                        stateUpdater={setUpdateSummery}
                        sx={{ width: "60px", textAlign: "center" }}
                        show
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
                        <ButtonOptions
                          loading={loading}
                          deleteIncomeItemHandler={deleteIncomeItemHandler}
                          item={depositItem}
                          change={change}
                        />
                      </TableCell>

                      <TableCell>
                        <MyDateField2
                          val={depositItem.expire}
                          item={depositItem}
                        />
                      </TableCell>
                      <MyTableCell
                        show
                        colName={"barcode"}
                        item={depositItem.item}
                        table="items"
                      >
                        {depositItem?.item?.barcode}
                      </MyTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          <Grid sx={{ gap: "4px", mt: 1 }} container>
            {links.map((link, i) => {
              if (i == 0) {
                return (
                  <Grid item xs={1} key={i}>
                    <MyLoadingButton
                      onClick={(setLoading) => {
                        updateItemsTable(link, setLoading);
                      }}
                      variant="contained"
                      key={i}
                    >
                      <ArrowBack />
                    </MyLoadingButton>
                  </Grid>
                );
              } else if (links.length - 1 == i) {
                return (
                  <Grid item xs={1} key={i}>
                    <MyLoadingButton
                      onClick={(setLoading) => {
                        updateItemsTable(link, setLoading);
                      }}
                      variant="contained"
                      key={i}
                    >
                      <ArrowForward />
                    </MyLoadingButton>
                  </Grid>
                );
              } else
                return (
                  <Grid item xs={1} key={i}>
                    <MyLoadingButton
                      active={link.active}
                      onClick={(setLoading) => {
                        updateItemsTable(link, setLoading);
                      }}
                    >
                      {link.label}
                    </MyLoadingButton>
                  </Grid>
                );
            })}
          </Grid>
        </>
      )}
    </TableContainer>
  );
}

export default DepoistItemsTable;
