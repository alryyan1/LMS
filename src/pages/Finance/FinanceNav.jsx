import { Link, Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "/src/components/ui/card";

import new_account from "/icons/add_folder.png";
import entries from "/icons/journal.png";
import ledger from "/icons/ledger.png";
import folder from "/icons/folders.png";
import balance from "/icons/balance.png";
import stamp from "/icons/stamp.png";
import tree from "/icons/decision-tree.png";

function FinanceNav() {
  const [items, setItems] = useState();
  const [dialog, setDialog] = useState({
    showMoneyDialog: false,
    title: "",
    color: "success",
    open: false,
    openError: false,
    openLabReport: false,
    message: "Addition was successfull",
  });
  useEffect(() => {
    axiosClient
      .get("items/all")
      .then(({ data }) => {
        setItems(data);
      })
      .catch((error) => {});
  }, []);
  const handleClose = () => {
    setDialog((prev) => ({ ...prev, open: false }));
  };
  return (
    <>
   

      {/* <ThemeProvider theme={theme}> */}
      {/* <CacheProvider value={cacheRtl}> { */}
      <Outlet context={{ dialog, setDialog, items, setItems }}></Outlet>
      {/* </CacheProvider> */}
      {/* </ThemeProvider> */}
      <Snackbar
        open={dialog.open}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={dialog.color}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {dialog.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default FinanceNav;