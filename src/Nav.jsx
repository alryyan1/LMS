import { AppBar, Toolbar, IconButton, Stack, Button } from "@mui/material";
import { CatchingPokemon, Language, List, Logout } from "@mui/icons-material";
import { Navigate, NavLink } from "react-router-dom";
import { useStateContext } from "./appContext";
import axiosClient from "../axios-client";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useTranslation } from "react-i18next";
const Nav = () => {
  const { user, setToken, setUser, setOpenDrawer } = useStateContext();
  const [loading, setLoading] = useState(false);
  const {i18n} = useTranslation()
  // console.log(setToken);
  const logoutHandler = () => {
    setLoading(true);
    axiosClient
      .post("logout")
      .then((data) => {
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
      i18n.changeLanguage('ch')
    }else{
      i18n.changeLanguage('ar')

    }
  }
  return (
    <>
      <AppBar color='primary' 
        sx={{ marginBottom: "10px", p: 1, justifyContent: "" ,borderRadius:7,mt:1}}
        position="static"
      >
        <Stack
          className="nav"
          sx={{ alignItems: "center" }}
          direction={"row"}
          spacing={3}
        >
          <IconButton
            onClick={() => {
              console.log("clicked");
              setOpenDrawer(true);
            }}
            color="success"
          >
            <FormatListBulletedIcon />
          </IconButton>
          <NavLink style={{ textDecoration: "none" ,color:"black" }} to={"/login"}>
            Login
          </NavLink>
          {/* <NavLink style={{ textDecoration: "none",color:"black" }} to={"/inventory"}>
            Inventory s
          </NavLink>
          <NavLink style={{ textDecoration: "none",color:"black" }} to={"/todayClinics"}>
            today Clincs
          </NavLink>
          <NavLink style={{ textDecoration: "none" ,color:"black"}} to={"/laboratory/add"}>
            laboratory
          </NavLink>
          <NavLink style={{ textDecoration: "none" ,color:"black"}} to={"/clinic"}>
            Clinic
          </NavLink>
          <NavLink style={{ textDecoration: "none" ,color:"black"}} to={"/insurance"}>
            Insurance
          </NavLink>
          <NavLink style={{ textDecoration: "none" ,color:"black"}} to={"/services"}>
            Services
          </NavLink>  */}
           <NavLink style={{ textDecoration: "none" ,color:"black"}} to={"/ship"}>
            shipping
          </NavLink>
           {/* <NavLink style={{ textDecoration: "none" ,color:"black"}} to={"/settings"}>
            Settings
          </NavLink>
          <NavLink style={{ textDecoration: "none" ,color:"black"}} to={"/dashboard"}>
            dashboard
          </NavLink>  */}
          <div style={{ flexGrow: 1 }}></div>
          <IconButton onClick={changeLang}><Language/></IconButton>
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
