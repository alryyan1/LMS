import { CacheProvider, ThemeProvider } from "@emotion/react";
import { Link, Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { Item, cacheRtl, theme } from "../constants";
import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useStateContext } from "../../appContext";
import Login from "../Login";
import axiosClient from "../../../axios-client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "/src/components/ui/card";

import new_account from "/icons/add_folder.png";
import entries from "/icons/journal.png";
import ledger from "/icons/ledger.png";
import folder from "/icons/folders.png";

function FinanceNav() {
  const [items, setItems] = useState();
  const [dialog, setDialog] = useState({
    showMoneyDialog: false,
    title: "",
    color: "success",
    open: false,
    openError: false,
    openLabReport: false,
    message: "تمت الاضافه بنجاح",
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
      <ul className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-2 gap-4 rtl text-center my-12">
        <NavLink to={"account"}>
          <Card>
            <CardHeader>
              <CardTitle>حساب جديد </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={new_account} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>

        <NavLink to={"entries"}>
          <Card>
            <CardHeader>
              <CardTitle> قيود اليومية </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={entries} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>
        <NavLink to={"ledger"}>
          <Card>
            <CardHeader>
              <CardTitle> دفتر الاستاذ </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={ledger} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>
        <NavLink to={"section"}>
          <Card>
            <CardHeader>
              <CardTitle> قسم جديد </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={folder} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>
      </ul>

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
