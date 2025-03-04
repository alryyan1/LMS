import {
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
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
import { useOutletContext } from "react-router-dom";
import MyTableCell from "../inventory/MyTableCell";
import axiosClient from "../../../axios-client";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { LoadingButton } from "@mui/lab";
import { formatNumber, webUrl } from "../constants";
import MyLoadingButton from "../../components/MyLoadingButton";
import { Deposit } from "../../types/Patient";
interface PharmacyLayoutPros {
  invoices: Deposit[];
}
function Invoices({
  hideDepositsTable,
  showDepositItemsTable,
  setData,
  resetLayout,
}) {
  const [page, setPage] = useState(10);

  const [loading, setLoading] = useState(false);
  const {
    invoices,
    setInvoices,
    selectedInvoice,
    setSelectedInvoice,
    setDialog,
    excelLoading,
    invoicesLinks,
    setInvoicesLinks,
  } = useOutletContext<PharmacyLayoutPros>();
  console.log(excelLoading, "excelLoading excelLoading");
  const updateItemsTable = useCallback((link, setLoading) => {
    setLoading(true);
    axiosClient(`${link.url}&rows=${page}`)
      .then(({ data }) => {
        setInvoices(data.data);
        setInvoicesLinks(data.links);
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
  }, []);

  return (
    <>
      <TableContainer>
        <Table style={{ direction: "rtl" }} className="table" size="small">
          <TableHead className="thead">
            <TableRow>
              <TableCell> كود</TableCell>
              <TableCell> الرقم المرجعي</TableCell>
              <TableCell>تاريخ الانشاء</TableCell>
              <TableCell>المورد</TableCell>
              <TableCell>اضيفت بواسطه </TableCell>
              <TableCell>عرض التفاصيل</TableCell>
              <TableCell> التكلفه</TableCell>
              <TableCell> التقرير</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((deposit) => {
              return (
                <TableRow
                  sx={{
                    backgroundColor: (theme) =>
                      selectedInvoice?.id == deposit.id
                        ? theme.palette.warning.light
                        : "",
                  }}
                  key={deposit.id}
                >
                  <TableCell>{deposit.id}</TableCell>
                  <MyTableCell
                    table="inventory/deposit/update"
                    sx={{ width: "100px" }}
                    setDialog={setDialog}
                    colName={"bill_number"}
                    item={deposit}
                  >
                    {deposit.bill_number}
                  </MyTableCell>
                  <TableCell>
                    {dayjs(new Date(Date.parse(deposit.created_at))).format(
                      "YYYY/MM/DD"
                    )}
                  </TableCell>
                  <TableCell>{deposit.supplier.name}</TableCell>

                  <TableCell>{deposit?.user?.username}</TableCell>

                  <TableCell>
                    <LoadingButton
                      loading={loading}
                      onClick={() => {
                        setLoading(true);

                        hideDepositsTable();
                        resetLayout();
                        // showAddToDeposit();
                        showDepositItemsTable();
                        setSelectedInvoice(deposit);

                        // hideAddToDeposit();
                        // hideNewFormHandler();
                      }}
                    >
                      التفاصيل
                    </LoadingButton>
                  </TableCell>
                  <TableCell>{formatNumber(deposit.total_cost)}</TableCell>
                  <TableCell>
                    {" "}
                    <a href={`${webUrl}pdf?id=${deposit.id}`}>pdf</a>
                  </TableCell>
                  
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Grid sx={{ gap: "4px", mt: 1 }} container>
          {invoicesLinks.map((link, i) => {
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
            } else if (invoicesLinks.length - 1 === i) {
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
              const label =
                link.label === "pagination.previous"
                  ? "<"
                  : link.label === "pagination.next"
                    ? ">"
                    : link.label;
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
      </TableContainer>
    </>
  );
}

export default Invoices;
