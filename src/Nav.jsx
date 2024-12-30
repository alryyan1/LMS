import {
  AppBar,
  IconButton,
  Stack,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Box,
  List,
  Tooltip,
} from "@mui/material";
import { ArrowRight, ElectricBolt, Language, Logout } from "@mui/icons-material";
import { NavLink, Link, Navigate, useNavigate } from "react-router-dom";
import { useStateContext } from "./appContext";
import axiosClient from "../axios-client";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useTranslation } from "react-i18next";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { useThemeContext } from "./ThemeContext";
import { t } from "i18next";
import UserDropDown from "./components/UserDropDown";
const Nav = () => {
  const navigate = useNavigate();

  const [activeLink, setActiveLink] = useState(null);
  const {
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
  // console.log(user, "in nav ");
  const [loading, setLoading] = useState(false);
  const { i18n } = useTranslation();
  // console.log(setToken);
  const logoutHandler = () => {

    setLoading(true);
    console.log('navigate to to login');
    axiosClient
      .post("logout")
      .then(() => {
        setToken(null);
        setUser(null);
        localStorage.clear()
        navigate("/dashboard");
      })
      .finally(() => setLoading(false));
  };
  // useEffect(() => {
  //   axiosClient.get("/user").then(({ data }) => {
  //     setUser(data);
  //   }).catch((err)=>{
  //   console.log('error')
  //   setUser(null);
  //   setToken(null)
  // });
  // }, [])

  // console.log(user);
  const changeLang = () => {
    if (i18n.language === "ar") {
      i18n.changeLanguage("en");
      localStorage.setItem("lang", "en");
    } else if (i18n.language === "en") {
      i18n.changeLanguage("ar");
      localStorage.setItem("lang", "ar");
    }
  };
  const changeMode = () => {
    if (mode === "light") {
      setMode("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setMode("light");
      localStorage.setItem("theme", "light");
    }
  };



  return (
    <>
   
    
      
      <AppBar
        sx={{mb:1,p:1,borderRadius:'10px'}}
        position="static"
      >
        <Stack
          className="nav"
          sx={{ alignItems: "center"}}
          direction={"row-reverse"}
          gap={3}
        >
          {user == null && (
            <NavLink
              style={{ textDecoration: "none", color: "white" }}
              to={"login"}
            >
              {t("login")}
            </NavLink>
          )}
       

          <div style={{ flexGrow: 1 }}></div>

          <UserDropDown user={user} />
          <IconButton title="language" onClick={changeLang}>
            <Language />
          </IconButton>
          {/* <IconButton title="clear cache" onClick={()=>{
            localStorage.removeItem('items')
          }}>
            <ElectricBolt sx={{color:'yellow'}} />
          </IconButton> */}
          <IconButton title="theme" onClick={changeMode}>
            <Brightness4Icon />
          </IconButton>
          {user && (
            <Tooltip title='تسجيل خروج'>
              <LoadingButton
              color="error"
              loading={loading}
              onClick={logoutHandler}
            >
              {loading ? "..." : <Logout/>}
            </LoadingButton>
            </Tooltip>
            
          )}
        </Stack>
      </AppBar>
    </>
  );
};

export default Nav;
