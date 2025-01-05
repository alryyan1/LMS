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
    message:'',
  });

  useEffect(() => {
    axiosClient.get("company/all").then(({ data }) => setCompanies(data));
  }, []);
  return (
    <>
     

      <Outlet context={{ dialog, setDialog, companies }} />
      <Snackbar
        open={dialog.open}
        autoHideDuration={2000}
        onClose={() => setDialog((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={dialog.color} variant="filled" sx={{ width: "100%" }}>
          {dialog.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default InsuranceNav;
