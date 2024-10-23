import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { PharmacyLayoutPros, DrugItem } from "../../types/Pharmacy";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import MyLoadingButton from "../../components/MyLoadingButton";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import axiosClient from "../../../axios-client";
import { toFixed } from "../constants";
import dayjs from "dayjs";
import { LoadingButton } from "@mui/lab";
interface DepoistItemsTableProps {
  setLayout: (layout: any) => void;
  hideDepositsTable: () => void;
  resetLayout: () => void;
  showDepositItemsTable: () => void;
  depositItemId: number | null;
  setDepositItemId: (id: number) => void;
}
function DepositItems({
  setLayout,
  hideDepositsTable,
  resetLayout,
  showDepositItemsTable,
  depositItemId,
  setDepositItemId,
}: DepoistItemsTableProps) {
  const {
    depositItems,
    setDepositItems,
    depositItemsSearch,
    depositItemsLinks,
    setDepositItemsLinks,
    setSelectedInvoice,
  } = useOutletContext<PharmacyLayoutPros>();
  const [loading, setLoading] = useState(false);
  // make table according to object DepositItem properties
  const updateItemsTable = (link, setLoading) => {
    console.log(depositItemsSearch);
    setLoading(true);
    axiosClient(`${link.url}&word=${depositItemsSearch}`)
      .then(({ data }) => {
        console.log(data, "pagination data");
        setLayout((prev) => {
          return {
            ...prev,
            showDepositItems: true,
          };
        });
        setDepositItems(data.data);
        setDepositItemsLinks(data.links);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell> اسم</TableCell>
            <TableCell> مورد| فاتوره</TableCell>
            <TableCell>س البيع</TableCell>
            <TableCell>س الشراء</TableCell>
            <TableCell>الكميه</TableCell>
            <TableCell>الصلاحيه</TableCell>
            <TableCell>الباركود</TableCell>
            <TableCell>الكميه المجانيه</TableCell>
            <TableCell>تاريخ الاضافه</TableCell>
            <TableCell>ذهاب</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {depositItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.item.market_name}</TableCell>
              <TableCell>{`${item.deposit.supplier.name} / ${item.deposit.bill_number}`}</TableCell>
              <TableCell>{toFixed(item.sell_price, 3)}</TableCell>
              <TableCell>{item.cost}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.expire}</TableCell>
              <TableCell>{item.barcode}</TableCell>
              <TableCell>{item.free_quantity}</TableCell>
              <TableCell>
                {dayjs(new Date(item.created_at)).format("YYYY-MM-DD H:m A")}
              </TableCell>
              <TableCell>
                {" "}
                <LoadingButton
                  loading={loading}
                  onClick={() => {
                    setLoading(true);
                    // alert(item.id)
                    setDepositItemId(item.id);
                    hideDepositsTable();
                    resetLayout();
                    // showAddToDeposit();
                    showDepositItemsTable();
                    setSelectedInvoice(item.deposit);

                    // hideAddToDeposit();
                    // hideNewFormHandler();
                  }}
                >
                  التفاصيل
                </LoadingButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Grid sx={{ gap: "4px", mt: 1 }} container>
        {depositItemsLinks.map((link, i) => {
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
          } else if (depositItemsLinks.length - 1 == i) {
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
  );
}

export default DepositItems;
