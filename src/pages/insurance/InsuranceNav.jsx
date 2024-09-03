import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import axiosClient from "../../../axios-client";
import { Alert, Snackbar } from "@mui/material";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "/src/components/ui/card";

import new_contract from "/icons/list-items.png";
import services from "/icons/physician.png";
import lab_result from "/icons/item-trafic.png";
import sub_company from "/icons/company.png";
import relations from "/icons/family.png";
import copy_contract from "/icons/supplier.png";
import income_deduct from "/icons/income.png";
import report from "/icons/report.png";
function InsuranceNav() {
  const [companies, setCompanies] = useState([]);
  const [dialog, setDialog] = useState({
    showMoneyDialog: false,
    title: "",
    color: "success",
    open: false,
    openError: false,
    openLabReport: false,
    msg: "تمت الاضافه بنجاح",
  });

  useEffect(() => {
    axiosClient.get("company/all").then(({ data }) => setCompanies(data));
  }, []);
  return (
    <>
      <ul className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-4 rtl text-center my-12">
        <NavLink to={"create"}>
          <Card>
            <CardHeader>
              <CardTitle> تعاقد جديد </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={new_contract} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>

        <NavLink to={"lab"}>
          <Card>
            <CardHeader>
              <CardTitle>التحاليل الطبية </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={lab_result} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>
        <NavLink to={"service"}>
          <Card>
            <CardHeader>
              <CardTitle> الخدمات الطبية </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={services} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>
        <NavLink to={"subcomapny"}>
          <Card>
            <CardHeader>
              <CardTitle> الجهات </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={sub_company} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>
        <NavLink to={"relation"}>
          <Card>
            <CardHeader>
              <CardTitle> العلاقات </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={relations} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>
        <NavLink to={"copy"}>
          <Card>
            <CardHeader>
              <CardTitle> نسخ العقد </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={copy_contract} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>
        <NavLink to={"income/deduct"}>
          <Card>
            <CardHeader>
              <CardTitle> المطالبات </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={income_deduct} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>
        <NavLink to={"inventory/balance"}>
          <Card>
            <CardHeader>
              <CardTitle> التقارير </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={report} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>
      </ul>

      <Outlet context={{ dialog, setDialog, companies }} />
      <Snackbar
        open={dialog.open}
        autoHideDuration={2000}
        onClose={() => setDialog((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={dialog.color} variant="filled" sx={{ width: "100%" }}>
          {dialog.msg}
        </Alert>
      </Snackbar>
    </>
  );
}

export default InsuranceNav;
