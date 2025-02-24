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
import React, { useEffect, useState, useCallback } from "react";
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

interface DeleteZeroQuantityProps {
  deposit: Deposit;
  count: number;
}

interface DepositItemsTableProps {
  data: { items: Deposit[] };
  setData: (data: { items: Deposit[] }) => void;
  setLayout: (layout) => void;
  setSelectedDeposit: (deposit: Deposit) => void;
  invoiceItems: Deposit[];
  setInvoiceItems: (items: Deposit[]) => void;
  depositItemId: number | null;
  change: (deposit: Deposit) => void; // Added the change prop
}

function DepoistItemsTable({
  data,
  setData,
  setLayout,
  change,
  setSelectedDeposit,
  invoiceItems,
  setInvoiceItems,
  depositItemId,
}: DepositItemsTableProps) {
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

  const [ld, setLd] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [summeryIsLoading, setSummeryIsLoading] = useState(false);
  const [page, setPage] = useState(10);

  // Memoized function to update the items table
  const updateItemsTable = useCallback(
    (link, setLoading) => {
      setLoading(true);
      axiosClient(`${link.url}&word=${search}`)
        .then(({ data }) => {
          setInvoiceItems(data.data);
          setLinks(data.links);
        })
        .catch((error) => {
          console.error("Error updating items table:", error); // More descriptive error message
          setDialog((prev) => ({
            ...prev,
            open: true,
            color: "error",
            message: "Failed to fetch data.", // User-friendly message
          }));
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [search, setInvoiceItems, setLinks, setDialog]
  );

  // Memoized function to fetch the invoice items
  const fetchInvoiceItems = useCallback(
    (selectedDepositId: number | undefined, search: string, page: number, depositItemId: number | null) => {
      if (!selectedDepositId) return;

      const filterByDepositItemId = depositItemId != null ? `&depositItemId=${depositItemId}` : '';

      setLoading(true);
      axiosClient
        .get(
          `deposit/items/all/pagination/${selectedDepositId}?word=${search}&rows=${page}${filterByDepositItemId.trim()}`
        )
        .then(({ data: { data, links } }) => {
          setInvoiceItems(data);
          setLinks(links);
        })
        .catch(({ response: { data } }) => {
          console.error("Error fetching invoice items:", data); // More descriptive error message
          setDialog((prev) => ({
            ...prev,
            open: true,
            color: "error",
            message: data.message || "Failed to fetch invoice items.", // User-friendly message with fallback
          }));
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setInvoiceItems, setLinks, setDialog]
  );

  useEffect(() => {
    // Debounce the fetchInvoiceItems function
    const timer = setTimeout(() => {
      fetchInvoiceItems(selectedDeposit?.id, search, page, depositItemId);
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedDeposit?.id, search, page, depositItemId, fetchInvoiceItems]);

  // Memoized function to delete an income item
  const deleteIncomeItemHandler = useCallback(
    (id: number) => {
      setLoading(true);
      axiosClient
        .delete(`depositItem/${id}`)
        .then(() => {
          setInvoiceItems((prev) => prev.filter((item) => item.id !== id));
          setDialog({
            open: true,
            message: "Item deleted successfully.", // User-friendly message
          });
        })
        .catch((error) => {
          console.error("Error deleting income item:", error); // More descriptive error message
          setDialog((prev) => ({
            ...prev,
            open: true,
            color: "error",
            message: "Failed to delete item.", // User-friendly message
          }));
        })
        .finally(() => setLoading(false));
    },
    [setInvoiceItems, setDialog]
  );

  const handleDefineInvoice = () => {
    setLd(true);
    const result = confirm("Are you sure you want to define all items for this invoice?");
    if (result) {
      axiosClient
        .post(`income-item/bulk/${selectedDeposit?.id}`)
        .then(({ data }) => {
          change(data.deposit);
          setData(data);
        })
        .catch((error) => {
          console.error("Error defining invoice:", error); // More descriptive error message
          setDialog((prev) => ({
            ...prev,
            open: true,
            color: "error",
            message: "Failed to define invoice.", // User-friendly message
          }));
        })
        .finally(() => setLd(false));
    } else {
      setLd(false); // Reset loading state if the user cancels the action
    }
  };

  const handleToggleShowAll = () => {
    setLoading(true);
    if (!selectedDeposit?.id) {
      setLoading(false);
      return;
    }

    axiosClient
      .patch(`inventory/deposit/update/${selectedDeposit.id}`, {
        colName: "showAll",
        val: !selectedDeposit.showAll,
      })
      .then(({ data }) => {
        setSelectedDeposit(data.data);
        return axiosClient
          .get(
            `deposit/items/all/pagination/${selectedDeposit.id}?rows=${page}`
          );
      })
      .then(({ data: { data, links } }) => {
        setInvoiceItems(data);
        setLinks(links);
      })
      .catch((error) => {
        console.error("Error toggling showAll:", error); // More descriptive error message
        setDialog((prev) => ({
          ...prev,
          open: true,
          color: "error",
          message: "Failed to toggle visibility.", // User-friendly message
        }));
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteZeroQuantity = () => {
    const confirmDelete = confirm("Are you sure you want to delete all items with zero quantity from this invoice?");
    if (confirmDelete) {
      setLoading(true);
      if (!selectedDeposit?.id) {
        setLoading(false);
        return;
      }
      axiosClient
        .get<DeleteZeroQuantityProps>(`deleteZeroQuantity/${selectedDeposit.id}`)
        .then(({ data }) => {
          setSelectedDeposit(data.deposit);
          toast(`Deleted ${data.count} items with zero quantity.`, {
            position: toast.POSITION.TOP_RIGHT,
          });
          fetchInvoiceItems(selectedDeposit.id, search, page, depositItemId); // Refresh invoice items
        })
        .catch((error) => {
          console.error("Error deleting zero quantity items:", error); // More descriptive error message
          setDialog((prev) => ({
            ...prev,
            open: true,
            color: "error",
            message: "Failed to delete zero quantity items.", // User-friendly message
          }));
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <TableContainer sx={{ height: "80vh", overflow: "auto", p: 1 }}>
      <div>
        <ToastContainer />
      </div>
      <InvoiceSummary summeryIsLoading={summeryIsLoading} user={user} />

      <Stack
        alignItems={"center"}
        justifyContent={"space-between"}
        direction={"row"}
        gap={1}
      >
        <Typography align="center">
          {selectedDeposit?.supplier?.name || "No Supplier"} / {selectedDeposit?.bill_number || "No Bill Number"}
        </Typography>
        {loading && <CircularProgress />}
        <select
          onChange={(val) => {
            setPage(Number(val.target.value));
          }}
          defaultValue={page}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <IconButton
          onClick={() => {
            setLayout((prev) => ({
              ...prev,
              showAddtoDeposit: true,
              addToDepositForm: "1fr",
            }));
          }}
          title="add item"
          color="success"
        >
          <AddIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            setLayout((prev) => ({
              ...prev,
              showAddtoDeposit: false,
              addToDepositForm: "0fr",
            }));
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
          href={selectedDeposit?.id ? `${webUrl}pdf?id=${selectedDeposit.id}` : undefined}
          disabled={!selectedDeposit?.id}
        >
          pdf
        </Button>
        <LoadingButton
          variant="contained"
          loading={ld}
          onClick={handleDefineInvoice}
        >
          Define
        </LoadingButton>
        <LoadingButton
          loading={loading}
          sx={{ mt: 1 }}
          color="inherit"
          title="show only quantity"
          size="small"
          onClick={handleToggleShowAll}
          variant="contained"
        >
          {selectedDeposit?.showAll ? <RemoveRedEye /> : <VisibilityOff />}
        </LoadingButton>
        <LoadingButton
          loading={loading}
          sx={{ mt: 1 }}
          color="inherit"
          title="Delete Zero Quantity"
          size="small"
          onClick={handleDeleteZeroQuantity}
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
          label="Search"
          type="search"
        />
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
                {invoiceItems.map((depositItem, i) => (
                  <TableRow key={depositItem.id}>
                    <TableCell>
                      <span>
                        {depositItem?.item?.market_name?.toUpperCase()}
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
                ))}
              </TableBody>
            </Table>
          </Card>

          <Grid sx={{ gap: "4px", mt: 1 }} container>
            {links.map((link, i) => {
              if (i === 0) {
                return (
                  <Grid item xs={1} key={i}>
                    <MyLoadingButton
                      onClick={(setLoading) => {
                        if (link.url) updateItemsTable(link, setLoading);
                      }}
                      variant="contained"
                      disabled={!link.url}
                    >
                      <ArrowBack />
                    </MyLoadingButton>
                  </Grid>
                );
              } else if (links.length - 1 === i) {
                return (
                  <Grid item xs={1} key={i}>
                    <MyLoadingButton
                      onClick={(setLoading) => {
                        if (link.url) updateItemsTable(link, setLoading);
                      }}
                      variant="contained"
                      disabled={!link.url}
                    >
                      <ArrowForward />
                    </MyLoadingButton>
                  </Grid>
                );
              } else {
                const label = link.label === 'pagination.previous' ? '<' : link.label === 'pagination.next' ? '>' : link.label;
                return (
                  <Grid item xs={1} key={i}>
                    <MyLoadingButton
                      active={link.active}
                      onClick={(setLoading) => {
                        if (link.url) updateItemsTable(link, setLoading);
                      }}
                      disabled={!link.url}
                    >
                      {label}
                    </MyLoadingButton>
                  </Grid>
                );
              }
            })}
          </Grid>
        </>
      )}
    </TableContainer>
  );
}

export default DepoistItemsTable;