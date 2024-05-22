import { AppBar, Toolbar, IconButton, Stack, Button } from "@mui/material";
import { CatchingPokemon, List, Logout } from "@mui/icons-material";
import { Navigate, NavLink } from "react-router-dom";
import { useStateContext } from "./appContext";
import axiosClient from "../axios-client";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
const Nav = () => {
  const { user, setToken, setUser, setOpenDrawer } = useStateContext();
  const [loading, setLoading] = useState(false);
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
  return (
    <>
      <AppBar
        sx={{ marginBottom: "10px", p: 1, justifyContent: "" }}
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
          <NavLink style={{ textDecoration: "none" }} to={"/login"}>
            Login
          </NavLink>
          <NavLink style={{ textDecoration: "none" }} to={"/inventory"}>
            Inventory
          </NavLink>
          <NavLink style={{ textDecoration: "none" }} to={"/laboratory/add"}>
            laboratory
          </NavLink>
          <NavLink style={{ textDecoration: "none" }} to={"/clinic"}>
            Clinic
          </NavLink>
          <NavLink style={{ textDecoration: "none" }} to={"/insurance"}>
            Insurance
          </NavLink>
          <NavLink style={{ textDecoration: "none" }} to={"/services"}>
            Services
          </NavLink>
          <NavLink style={{ textDecoration: "none" }} to={"/settings"}>
            Settings
          </NavLink>
          <div style={{ flexGrow: 1 }}></div>
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
