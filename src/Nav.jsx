import { AppBar, Toolbar, IconButton, Stack, Button } from "@mui/material";
import { CatchingPokemon } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
const Nav = () => {
  return (
    <>
      <AppBar sx={{ marginBottom: "10px" }} position="static">
        <Toolbar>
          <IconButton>
            <CatchingPokemon></CatchingPokemon>
          </IconButton>
          <Stack direction={"row"} spacing={3}>
            <NavLink to={"/"}>Home</NavLink>
            <NavLink to={"/add"}>Add</NavLink>
            <NavLink to={"/inventory"}>Inventory</NavLink>

            <NavLink to={"/tests"}>Tests</NavLink>
            <NavLink>Home</NavLink>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Nav;
