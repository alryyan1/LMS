import {
  AppBar,
  IconButton,
  Stack,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Typography,
  Box,
  List,
} from "@mui/material";
import { ArrowRight, Language, Mail } from "@mui/icons-material";
import { NavLink, Link } from "react-router-dom";
import { useStateContext } from "./appContext";
import axiosClient from "../axios-client";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useTranslation } from "react-i18next";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { useThemeContext } from "./ThemeContext";
import { t } from "i18next";
const Nav = () => {
  const {
    settings,
    setSettings,
    user,
    setToken,
    setUser,
    setLabDrawer,
    labDrawer,
    clinicDrawer,
    setClinicDrawer,
    pharmcyDrawer,
    setPharmacyDrawer,
  } = useStateContext();
  const { setMode, mode } = useThemeContext();
  console.log(user, "in nav ");
  const [loading, setLoading] = useState(false);
  const { i18n } = useTranslation();
  // console.log(setToken);
  const logoutHandler = () => {
    setLoading(true);
    axiosClient
      .post("logout")
      .then(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    axiosClient.get("/user").then(({ data }) => {
      setUser(data);
    });
  }, []);
  // useEffect(() => {
  //   axiosClient.get("/settings").then(({ data }) => {
  //     setSettings(data);
  //     setMode(data.theme);
  //     i18n.changeLanguage(data.lang);
  //   });
  // }, []);
  console.log(user);
  const changeLang = () => {
    if (i18n.language === "ar") {
      i18n.changeLanguage("en");
      localStorage.setItem("lang","en")
      axiosClient.post("settings", { colName: "lang", data: 'en' });
    } else {
      i18n.changeLanguage("ar");
      localStorage.setItem("lang","ar")

      // axiosClient.post("settings", { colName: "lang", data: 'ar' });
    }
  };
  const changeMode = () => {
    if (mode === "light") {
      setMode("dark");
      localStorage.setItem("theme", "dark");
      axiosClient.post("settings", { colName: "theme", data: "dark" });
    } else {
      setMode("light");
      localStorage.setItem("theme", "light");

      // axiosClient.post("settings", { colName: "theme", data: "light" });
    }
  };
 
  console.log('nav updated')

  return (
    <>
    
      <AppBar
        sx={{
          backgroundColor: "#485765",

          marginBottom: "10px",
          p: 2,
          justifyContent: "",
          borderRadius: 7,
          mt: 1,
        }}
        position="static"
      >
        <Stack
          className="nav"
          sx={{ alignItems: "center", direction: "rtl" }}
          direction={"row-reverse"}
          gap={3}
        >
          <NavLink
            style={{ textDecoration: "none", color: "white" }}
            to={"/login"}
          >
            {t('login')}
          </NavLink>
       
           {/* <NavLink
            style={{ textDecoration: "none", color: "white" }}
            to={"/contracts"}
          >
          Contracts
          </NavLink> */}
 
    
  
          <NavLink
            style={{ textDecoration: "none", color: "white" }}
            to={"/ship"}
          >
            shipping
          </NavLink>
       
      

          <div style={{ flexGrow: 1 }}></div>
          <Typography color={"white"} variant="h5">
            {user?.username}
          </Typography>
          <IconButton onClick={changeLang}>
            <Language />
          </IconButton>
          <IconButton onClick={changeMode}>
            <Brightness4Icon />
          </IconButton>
          {user && (
            <LoadingButton
              color="error"
              variant="contained"
              loading={loading}
              endIcon={loading ? "" : <ExitToAppIcon />}
              onClick={logoutHandler}
            >
              {loading ? "..." : "Logout"}
            </LoadingButton>
          )}
        </Stack>
      </AppBar>
    </>
  );
};

export default Nav;
