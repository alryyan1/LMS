import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import axiosClient from "../../../axios-client";
import { t } from "i18next";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "/src/components/ui/card";

import customer_service from "/icons/customer-service.png";
import section from "/icons/section.png";
function ServiceNav() {
  const [updateServiceGroup, setUpdateServiceGroup] = useState(0);
  const [serviceGroups, setServiceGroups] = useState([]);

  const [dialog, setDialog] = useState({
    showMoneyDialog: false,
    title: "",
    color: "success",
    open: false,
    openError: false,
    openLabReport: false,
    msg: "Addition was successfull",
  });

  useEffect(() => {
    axiosClient.get("serviceGroup/all").then(({ data }) => {
      console.log(data, "service groups");
      setServiceGroups(data);
    });
  }, [updateServiceGroup]);
  return (
    <>
      <ul className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-2 gap-4 rtl text-center my-12">
        <NavLink to={"create"}>
          <Card>
            <CardHeader>
              <CardTitle> Define Medical Service </CardTitle>
            </CardHeader>
   
          </Card>
        </NavLink>

        <NavLink to={"serviceGroup/create"}>
          <Card>
            <CardHeader>
              <CardTitle> Define Section </CardTitle>
            </CardHeader>
           
          </Card>
        </NavLink>
      </ul>

      <Outlet
        context={{ dialog, setDialog, serviceGroups, setUpdateServiceGroup }}
      />
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

export default ServiceNav;
