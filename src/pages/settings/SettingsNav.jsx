import { CacheProvider, ThemeProvider } from "@emotion/react";
import { Link, Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { cacheRtl, theme } from "../constants";
import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useStateContext } from "../../appContext";
import Login from "../Login";
import axiosClient from "../../../axios-client";
import { t } from "i18next";

import doctor_icon from "/icons/doctor.png";
import specialists_icon from "/icons/physician.png";
import users_icon from "/icons/team.png";
import permissions_icon from "/icons/shield.png";
import other_icon from "/icons/other.png";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "/src/components/ui/card";
function SettingsNav() {
  const { setToken, setUser } = useStateContext();
  const [doctors, setDoctors] = useState([]);
  const [updateSpecialists, setUpdateSpecialists] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [doctorUpdater, setDoctorUpdater] = useState(0);

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
    Promise.all([
      axiosClient
        .get(`specialists/all`)
        .then(({ data: data }) => {
          console.log(data, "specialists ");
          setSpecialists(data);
        })
        .catch((err) => console.log(err)),
      axiosClient.get("doctors").then(({ data: data }) => {
        setDoctors(data);
      }),
    ]).finally(() => {});
  }, [updateSpecialists]);

  const handleClose = () => {
    setDialog((prev) => ({ ...prev, open: false }));
  };
  return (
    <>
      <ul className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-4 rtl text-center my-12">
        <NavLink to={"doctors"}>
          <Card>
            <CardHeader>
              <CardTitle>{t("doctors")} </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={doctor_icon} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>

        <NavLink to={"specialists"}>
          <Card>
            <CardHeader>
              <CardTitle>{t("Specialists")} </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={specialists_icon} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>

        <NavLink to={"users"}>
          <Card>
            <CardHeader>
              <CardTitle>{t("users")} </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={users_icon} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>

        <NavLink to={"permissions"}>
          <Card>
            <CardHeader>
              <CardTitle>{t("permissions")} </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={permissions_icon} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>

        <NavLink to={"paperConfig"}>
          <Card>
            <CardHeader>
              <CardTitle>{t("other")} </CardTitle>
            </CardHeader>
            <CardContent
              className="flex justify-center items-center text-center"
              style={{ justifyContent: "center" }}
            >
              <img src={other_icon} width={60} height={60} />
            </CardContent>
          </Card>
        </NavLink>
      </ul>{" "}
      {
        <Outlet
          context={{
            doctorUpdater,
            setDoctorUpdater,
            dialog,
            setDialog,
            doctors,
            specialists,
            setDoctors,
            setUpdateSpecialists,
            setSpecialists,
          }}
        ></Outlet>
      }
      <Snackbar
        open={dialog.open}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={dialog.color}
          variant="filled"
          sx={{ width: "100%", color: "black" }}
        >
          {dialog.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SettingsNav;
