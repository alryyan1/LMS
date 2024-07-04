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
  const { user, setToken, setUser, setLabDrawer, labDrawer ,clinicDrawer, setClinicDrawer, pharmcyDrawer, 
    setPharmacyDrawer} =
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
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage("ar");
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
          { title: "تعريف دواء", to: "/pharmacy/add" },
          { title: "نافذه البيع", to: "/pharmacy/sell" },
          { title: "حساب الفئات", to: "/clinic/denos" },
        ].map((item, index) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton
              onClick={() => setPharmacyDrawer(false)}
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
  return (
    <>
      <Drawer open={labDrawer}>
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
      <Drawer open={clinicDrawer}>
        {DrawerClinicList}
      </Drawer>
      <Drawer open={pharmcyDrawer}>
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
          sx={{ alignItems: "center" }}
          direction={"row"}
          gap={3}
        >
          <NavLink
            style={{ textDecoration: "none", color: "white" }}
            to={"/login"}
          >
            Login
          </NavLink>
          <NavLink
            style={{ textDecoration: "none", color: "white" }}
            to={"/inventory"}
          >
            Inventory
          </NavLink>
         
          <Link
            onClick={() => {
              setLabDrawer(true);
            }}
            style={{ textDecoration: "none", color: "white" }}
          >
            Lab
          </Link>
          <Link
            onClick={() => {
              setClinicDrawer(true);
            }}
            style={{ textDecoration: "none", color: "white" }}
          
          >
            Clinic
          </Link>
          <Link
            onClick={() => {
              setPharmacyDrawer(true);
            }}
            style={{ textDecoration: "none", color: "white" }}
          
          >
            pharmacy
          </Link>
          <NavLink
            style={{ textDecoration: "none", color: "white" }}
            to={"/insurance"}
          >
            Insurance
          </NavLink>
          <NavLink
            style={{ textDecoration: "none", color: "white" }}
            to={"/services"}
          >
            Services
          </NavLink>
          <NavLink
            style={{ textDecoration: "none", color: "white" }}
            to={"/ship"}
          >
            shipping
          </NavLink>
       {user?.roles.map((r)=>r.name).includes('admin') || user?.id == 1 ?   <NavLink 
            style={{ textDecoration: "none", color: "white" }}
            to={"/settings"}
          >
            Settings
          </NavLink> : ""}
          <NavLink
            style={{ textDecoration: "none", color: "white" }}
            to={"/dashboard"}
          >
            dashboard
          </NavLink>
         
          <div style={{ flexGrow: 1 }}></div>
          <Typography color={'black'} variant="h5">
          {user?.username}
          </Typography>
          <IconButton onClick={changeLang}>
            <Language />
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
