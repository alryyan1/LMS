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
} from "@mui/material";
import { ArrowRight, ElectricBolt, Language } from "@mui/icons-material";
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
import UserDropDown from "./components/UserDropDown";
const Nav = () => {
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
  const DrawerClinicList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {user?.sub_routes
          ?.filter((s) => {
            return s.sub_route.route_id == 5;
          })
          .map((item, index) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton
                onClick={() => {
                  setClinicDrawer(false);
                  setActiveLink(5);
                }}
                LinkComponent={Link}
                to={item.sub_route.path}
              >
                <ListItemIcon>
                  <ArrowRight />
                </ListItemIcon>
                <ListItemText primary={t(item.sub_route.name)} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Box>
  );

  const DrawerPharmacyList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {user?.sub_routes
          ?.filter((s) => {
            return s.sub_route.route_id == 2;
          })
          .map((item, index) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton
                onClick={() => {
                  // setActiveLink(2);

                  setPharmacyDrawer(false);
                }}
                LinkComponent={Link}
                to={item.sub_route.path}
              >
                <ListItemIcon>
                  <ArrowRight />
                </ListItemIcon>
                <ListItemText primary={t(item.sub_route.name)} />
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
        {user?.sub_routes
          ?.filter((s) => {
            return s.sub_route.route_id == 4;
          })
          .map((item) => {
            // alert('s')
            return (
              <ListItem key={item.title} disablePadding>
                <ListItemButton
                  onClick={() => {
                    // setActiveLink(4);

                    setLabDrawer(false);
                  }}
                  LinkComponent={Link}
                  to={item.sub_route.path}
                >
                  <ListItemIcon>
                    <ArrowRight />
                  </ListItemIcon>
                  <ListItemText primary={t(`${item.sub_route.name}`)} />
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
          {user  == null &&  <NavLink
            style={{ textDecoration: "none", color: "white" }}
            to={"login"}
          >
            {t("login")}
          </NavLink>}
          {user?.routes?.map((r) => {
            if (r.route.id == 4) {
              return (
                <NavLink
                  className={activeLink == 4 ? "active" : ""}
                  key={r.id}
                  to={"/lab"}
                  onClick={(e) => {
                    e.preventDefault();
                    setLabDrawer(true);
                    setActiveLink(4);
                  }}
                  style={{
                    textDecoration: "none",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  {t("lab")}
                </NavLink>
              );
            } else if (r.route_id == 5) {
              return (
                <NavLink
                  className={activeLink == 5 ? "active" : ""}
                  key={r.id}
                  to={"clinic"}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveLink(5);

                    setClinicDrawer(true);
                  }}
                  style={{
                    textDecoration: "none",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  {t("clinic")}
                </NavLink>
              );
            } else if (r.route_id == 2) {
              return (
                <NavLink
                  className={activeLink == 2 ? "active" : ""}
                  key={r.id}
                  to={"pharma"}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveLink(2);

                    setPharmacyDrawer(true);
                  }}
                  style={{
                    textDecoration: "none",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  {t("pharma")}
                </NavLink>
              );
            }
            return (
              <NavLink
                className={activeLink == r.id ? "active" : ""}
                onClick={() => {
                  setActiveLink(r.id);
                }}
                key={r.id}
                style={{ textDecoration: "none", color: "white" }}
                to={r.route.path}
              >
                {t(r.route.name)}
              </NavLink>
            );
          })}

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
