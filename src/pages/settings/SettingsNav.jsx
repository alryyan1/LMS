import { CacheProvider, ThemeProvider } from "@emotion/react";
import { Link, Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { cacheRtl, theme } from "../constants";
import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useStateContext } from "../../appContext";
import Login from "../Login";
import axiosClient from "../../../axios-client";
import {t} from 'i18next'
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
    message: "تمت الاضافه بنجاح",
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
      <ul className="inventroy-nav">
        <NavLink className={'heading'} to={"users"}>{t('users')}</NavLink>
        <NavLink className={'heading'} to={"permissions"}>{t('permissions')}</NavLink>
        <NavLink  className={'heading'}to={"paperConfig"}>{t('other')}</NavLink>
      </ul>

          {" "}
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
          
          sx={{ width: "100%" ,color: "black" }}
        >
          {dialog.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SettingsNav;
