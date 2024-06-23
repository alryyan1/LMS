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
} from "@mui/material";
import {
  Language,
  Mail,
} from "@mui/icons-material";
import {  NavLink, Link } from "react-router-dom";
import { useStateContext } from "./appContext";
import axiosClient from "../axios-client";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useTranslation } from "react-i18next";

const Nav = () => {
  const { user, setToken, setUser, setLabDrawer, labDrawer } =
    useStateContext();
console.log(user,'in nav ')
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
  console.log(user);
  const changeLang = () => {
    if (i18n.language === "ar") {
      i18n.changeLanguage("ch");
    } else {
      i18n.changeLanguage("ar");
    }
  };

  return (
    <>
      <Drawer open={labDrawer}>
        {" "}
        {[
          { title: "تسجيل مريض", to: "/laboratory/add" },
          { title: "ادخال النتائج ", to: "/laboratory/result" },
          { title: "سحب العينات", to: "" },
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
      <AppBar
        color="primary"
        sx={{
          marginBottom: "10px",
          p: 1,
          justifyContent: "",
          borderRadius: 7,
          mt: 1,
        }}
        position="static"
      >
        <Stack
          className="nav"
          sx={{ alignItems: "center" }}
          direction={"row"}
          spacing={3}
        >
          <NavLink
            style={{ textDecoration: "none", color: "black" }}
            to={"/login"}
          >
            Login
          </NavLink>
          <NavLink
            style={{ textDecoration: "none", color: "black" }}
            to={"/inventory"}
          >
            Inventory
          </NavLink>
         
          <NavLink
            onClick={() => {
              setLabDrawer(true);
            }}
            style={{ textDecoration: "none", color: "black" }}
          >
            laboratory
          </NavLink>
          <NavLink
            style={{ textDecoration: "none", color: "black" }}
            to={"/clinic"}
          >
            Clinic
          </NavLink>
          <NavLink
            style={{ textDecoration: "none", color: "black" }}
            to={"/insurance"}
          >
            Insurance
          </NavLink>
          <NavLink
            style={{ textDecoration: "none", color: "black" }}
            to={"/services"}
          >
            Services
          </NavLink>
          <NavLink
            style={{ textDecoration: "none", color: "black" }}
            to={"/ship"}
          >
            shipping
          </NavLink>
       {user?.roles.map((r)=>r.name).includes('admin') || user?.id == 1 ?   <NavLink 
            style={{ textDecoration: "none", color: "black" }}
            to={"/settings"}
          >
            Settings
          </NavLink> : ""}
          <NavLink
            style={{ textDecoration: "none", color: "black" }}
            to={"/dashboard"}
          >
            dashboard
          </NavLink>
         
          <div style={{ flexGrow: 1 }}></div>
          <Typography variant="h5">
          {user?.username}
          </Typography>
          <IconButton onClick={changeLang}>
            <Language />
          </IconButton>
          
          {user && (
            <LoadingButton
              color="error"
              style={{ color: "wheat" }}
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
