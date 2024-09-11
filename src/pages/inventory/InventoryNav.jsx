import { CacheProvider, ThemeProvider } from "@emotion/react";
import { Link, Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { Item, cacheRtl, theme } from "../constants";
import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useStateContext } from "../../appContext";
import Login from "../Login";
import axiosClient from "../../../axios-client";

import shopping_bag from "/icons/shopping-bag.png";
import supplier from "/icons/supplier.png";
import client from "/icons/client.png";
import item_trafic from "/icons/item-trafic.png";
import section from "/icons/section.png";
import income_request from "/icons/list-items.png";
import deposit from "/icons/deposit.png";
import statistics from "/icons/statistics.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "/src/components/ui/card";
import { t } from "i18next";

function InventoryNav() {
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
      <ul className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-4 rtl text-center my-12">
        <NavLink to={"client/create"}>
          <Card>
            <CardHeader>
              <CardTitle>عميل جديد</CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={client} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>

        <NavLink to={"supplier/create"}>
          <Card>
            <CardHeader>
              <CardTitle>مورد جديد</CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={supplier} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>

        <NavLink to={"item/create"}>
          <Card>
            <CardHeader>
              <CardTitle>صنف جديد </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={shopping_bag} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>

        <NavLink to={"item/state"}>
          <Card>
            <CardHeader>
              <CardTitle>حركة الصنف </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={item_trafic} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>

        <NavLink to={"section/create"}>
          <Card>
            <CardHeader>
              <CardTitle>قسم جديد </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={section} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>

        <NavLink to={"income/request"}>
          <Card>
            <CardHeader>
              <CardTitle>اذن طلب </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={income_request} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>
        <NavLink to={"/pharmacy/deposit"}>
          <Card>
            <CardHeader>
              <CardTitle>اذن وارد </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={deposit} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>
        <NavLink to={"item/statistics"}>
          <Card>
            <CardHeader>
              <CardTitle>الرسم البياني </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={statistics} width={60} height={60} />
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

export default InventoryNav;
