import {
  Box,
  FormControlLabel,
  FormGroup,
  Grid,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import  { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../../../axios-client";
import { useOutletContext } from "react-router-dom";
import CustomCheckBoxUser from "../../components/CustomCheckBoxUser";
import SignUp from "../Singeup";
import CustomCheckboxUserRoute from "../../components/CustomCheckboxUserRoute";

function Users() {
  const { setDialog } = useOutletContext();
  const [selectedUser, setSelectedUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [updater, setUpdater] = useState(0);
  const [roles, setRoles] = useState([]);
  const [routes, setRoutes] = useState([]);
  useEffect(() => {
    document.title = "المستخدمين";
  }, []);
  const {
    formState: { isSubmitSuccessful },
  } = useForm();
  const {
    formState: { isSubmitSuccessful: isSubmitSuccessful2 },
  } = useForm();
  console.log(selectedUser, "selected selectedUser");

 
  useEffect(() => {
    axiosClient("users").then(({ data }) => {
      setUsers(data);
      console.log(data, "users");
    });
  }, [isSubmitSuccessful, updater]);
  useEffect(() => {
    axiosClient("roles").then(({ data }) => {
      setRoles(data);
      console.log(data, "rules");
      //   setUpdater((prev)=>prev+1)
    });
  }, []);
  useEffect(() => {
    axiosClient("routes").then(({ data }) => {
      setRoutes(data);
      console.log(data, "rouotes");
      //   setUpdater((prev)=>prev+1)
    });
  }, []);
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Box sx={{ p: 1 }}>
          <Typography textAlign={"center"} variant="h3">
            Users
          </Typography>
          {users.map((user) => {
            return (
              <ListItemButton
                style={{
                  border: "1px dashed ",
                  marginBottom: "2px",
             
                }}
                sx={{
                  backgroundColor: (theme) =>
                    selectedUser.id == user.id
                      ? theme.palette.primary.main
                      : "",
                }}
                onClick={() => {
                  setSelectedUser(user);
                }}
                key={user.id}
              >
                <ListItemText>{user.username}</ListItemText>
              </ListItemButton>
            );
          })}
        </Box>
      </Grid>
      <Grid item xs={3}>
        {selectedUser && (
          <Box sx={{ p: 1 }}>
            <Typography textAlign={"center"} variant="h5">
              Roles {selectedUser.name}{" "}
            </Typography>
            <FormGroup>
              {roles.map((role) => {
                console.log(role, "role check box");
                const checked = selectedUser.roles
                  .map((r) => r.id)
                  .includes(role.id);
                return (
                  <FormControlLabel
                    key={role.id}
                    control={
                      <CustomCheckBoxUser
                        selectedUser={selectedUser}
                        setDialog={setDialog}
                        setUpdater={setUpdater}
                        role_id={role.id}
                        isChecked={checked}
                      />
                    }
                    label={role.name}
                  />
                );
              })}
            </FormGroup>
          </Box>
        )}
      </Grid>
      <Grid item xs={3}>
        {selectedUser && (
          <Box sx={{ p: 1 }}>
            <Typography textAlign={"center"} variant="h5">
              User Routes {selectedUser.name}{" "}
            </Typography>
            <FormGroup>
              {routes.map((route) => {
                console.log(route, "route check box");
                const checked = selectedUser.routes
                  .map((r) => r.route_id)
                  .includes(route.id);
                return (
                  <FormControlLabel
                    key={route.id}
                    control={
                      <CustomCheckboxUserRoute
                        selectedUser={selectedUser}
                        setDialog={setDialog}
                        setUpdater={setUpdater}
                        route_id={route.id}
                        isChecked={checked}
                      />
                    }
                    label={route.name}
                  />
                );
              })}
            </FormGroup>
          </Box>
        )}
      </Grid>
      <Grid item xs={3}>
        <SignUp setUsers={setUsers} />
      </Grid>
    </Grid>
  );
}

export default Users;
