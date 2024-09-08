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
      <ul className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 gap-2 rtl text-center my-12">
        <NavLink to={"account"}>
          <Card>
            <CardHeader>
              <CardTitle> دليل الحسابات </CardTitle>
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
        <NavLink to={"account"}>
          <Card>
            <CardHeader>
              <CardTitle> المستندات </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={stamp} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>
        <NavLink to={"trialbalance"}>
          <Card>
            <CardHeader>
              <CardTitle> ميزان المراجعه </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={balance} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>
        <NavLink to={"tree"}>
          <Card>
            <CardHeader>
              <CardTitle>  شجره الحسابات </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={tree} width={60} height={60} />
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