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
  useEffect(() => {
    axiosClient.get("/settings").then(({ data }) => {
      setSettings(data);
      setMode(data.theme);
    });
  }, []);
  console.log(user);
  const changeLang = () => {
    if (i18n.language === "ar") {
      i18n.changeLanguage("en");
      axiosClient.post("settings", { colName: "lang", data: mode });
    } else {
      i18n.changeLanguage("ar");
      axiosClient.post("settings", { colName: "lang", data: mode });
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

      axiosClient.post("settings", { colName: "theme", data: "light" });
    }
  };
  const DrawerClinicList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {[
          { title: "الحجز", to: "/clinic" },
          { title: "استحقاق الاطباء", to: "/clinic/doctors" },
          { title: "حساب الفئات", to: "/clinic/denos" },
        ].map((item, index) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton
              onClick={() => setClinicDrawer(false)}
              LinkComponent={Link}
              to={item.to}
            >
              <ListItemIcon>
                <Mail />
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const DrawerPharmacyList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {[
          { title: "Drug Define", to: "/pharmacy/add" },
          { title: "POS", to: "/pharmacy/sell" },
          { title: "Items", to: "/pharmacy/items" },
          { title: "Sales", to: "/pharmacy/reports" },
          { title: "Inventory", to: "/pharmacy/inventory" },
          { title: "Income", to: "/pharmacy/deposit" },
          { title: "Expenses", to: "/clinic/denos" },
        ].map((item, index) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton
              onClick={() => setPharmacyDrawer(false)}
              LinkComponent={Link}
              to={item.to}
            >
              <ListItemIcon>
                <ArrowRight />
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  return (
    <>
      <Drawer
        ModalProps={{
          onBackdropClick: () => {
            setLabDrawer(false);
          },
        }}
        open={labDrawer}
      >
        {" "}
        {[
          { title: "تسجيل مريض", to: "/laboratory/add" },
          { title: "ادخال النتائج ", to: "/laboratory/result" },
          { title: "سحب العينات", to: "/laboratory/sample" },
          { title: " اداره التحاليل", to: "/laboratory/tests" },
          { title: "قائمه الاسعار", to: "/laboratory/price" },
          { title: "CBC LIS", to: "/laboratory/cbc-lis" },
          { title: "Chemistry LIS", to: "/laboratory/chemistry-lis" },
        ].map((item) => {
          return (
            <ListItem key={item.title} disablePadding>
              <ListItemButton
                onClick={() => setLabDrawer(false)}
                LinkComponent={Link}
                to={item.to}
              >
                <ListItemIcon>
                  <Mail />
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </Drawer>
      <Drawer
        ModalProps={{
          onBackdropClick: () => {
            setClinicDrawer(false);
          },
        }}
        open={clinicDrawer}
      >
        {DrawerClinicList}
      </Drawer>
      <Drawer
        ModalProps={{
          onBackdropClick: () => {
            setPharmacyDrawer(false);
          },
        }}
        open={pharmcyDrawer}
      >
        {DrawerPharmacyList}
      </Drawer>
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
          {
            user?.routes.map((r)=>{
              if (r.route.id == 4) {
                return (<NavLink
                 key={r.id}
                  to={"/lab"}
                  onClick={(e) => {
                    e.preventDefault();
                    setLabDrawer(true);
                  }}
                  style={{
                    textDecoration: "none",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  {t('lab')}
                </NavLink>)
              }
              else if(r.route_id == 5){
                return (
                  <NavLink
                   key={r.id}
                  to={"clinic"}
                  onClick={(e) => {
                    e.preventDefault();
      
                    setClinicDrawer(true);
                  }}
                  style={{
                    textDecoration: "none",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  {t('clinic')}
                </NavLink>
                )
              }else if(r.route_id == 2){
               return <NavLink
                key={r.id}
                // to={"pharma"}
                onClick={(e) => {
                  e.preventDefault();
    
                  setPharmacyDrawer(true);
                }}
                style={{
                  textDecoration: "none",
                  color: "white",
                  cursor: "pointer",
                }}
              >
              {
                t('pharma')
              }
              </NavLink>
              }
              return (
                <NavLink
                 key={r.id}
            style={{ textDecoration: "none", color: "white" }}
            to={r.route.path}
          >
            {t(r.route.name)}
          </NavLink>
              )
            })
          }
          {/* <NavLink
            style={{ textDecoration: "none", color: "white" }}
            to={"/audit"}
          >
            {t("audit")}{" "}
          </NavLink>

          <NavLink
            to={"/lab"}
            onClick={(e) => {
              e.preventDefault();
              setLabDrawer(true);
            }}
            style={{
              textDecoration: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            {t('lab')}
          </NavLink>
          <NavLink
            to={"clinic"}
            onClick={(e) => {
              e.preventDefault();

              setClinicDrawer(true);
            }}
            style={{
              textDecoration: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            {t('clinic')}
          </NavLink>
          <NavLink
            to={"pharma"}
            onClick={(e) => {
              e.preventDefault();

              setPharmacyDrawer(true);
            }}
            style={{
              textDecoration: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
          {
            t('pharma')
          }
          </NavLink>
          <NavLink
            style={{ textDecoration: "none", color: "white" }}
            to={"/insurance"}
          >
            {
              t('insurance')
            }
          </NavLink> */}
          {/* <NavLink
          
            style={{ textDecoration: "none", color: "white" }}
            to={"/services"}
          >
            {
              t('services')
            }
          </NavLink> */}
          {/* <NavLink
            style={{ textDecoration: "none", color: "white" }}
            to={"/ship"}
          >
            shipping
          </NavLink> */}
          {/* {user?.roles.map((r) => r.name).includes("admin") || user?.id == 1 ? (
            <NavLink
              style={{ textDecoration: "none", color: "white" }}
              to={"/settings"}
            >
              {
                t('settings')
              }
            </NavLink>
          ) : (
            ""
          )} */}
          {/* <NavLink
            style={{ textDecoration: "none", color: "white" }}
            to={"/dashboard"}
          >
            {
              t('dashboard')
            }
          </NavLink> */}

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
