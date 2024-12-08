import {
  Box,
  FormControlLabel,
  FormGroup,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../../../axios-client";
import { useOutletContext } from "react-router-dom";
import CustomCheckBoxUser from "../../components/CustomCheckBoxUser";
import SignUp from "../Singeup";
import CustomCheckboxUserRoute from "../../components/CustomCheckboxUserRoute";
import { t, use } from "i18next";
import {
  Card,
} from "/src/components/ui/card";
import MyCheckbox from "../../components/MyCheckBox";
import DoctorsAutocomplete from "../../components/DoctorsAutocomplete";

function Users() {
  const { setDialog, doctors } = useOutletContext();
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [updater, setUpdater] = useState(0);
  const [roles, setRoles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  console.log(selectedRoute, "selected Route");
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
          <Typography textAlign={"center"} variant="h4">
            Users
          </Typography>
          <Table size="small">
            <TableRow>
              <TableCell>Username</TableCell>
              {/* <TableCell>is Nurse</TableCell> */}
              {/* <TableCell>is Doctor</TableCell> */}
            </TableRow>
            <TableBody>
              {users.map((user) => {
                return (
                  <TableRow   className={
                    selectedUser?.id == user.id
                      ? "p-4 mb-2 bg-slate-700 text-white"
                      : "p-4 mb-2 bg-slate-100 hover:bg-slate-700 hover:text-gray-100 hover:cursor-pointer"
                  }
                  onClick={() => {
                    setSelectedUser(user);
                  }} key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    {/* <TableCell>
                      {" "}
                      <MyCheckbox
                      evalToZeroOrOne
                        setDialog={setDialog}
                        colName={"is_nurse"}
                        isChecked={user.is_nurse}
                        path={`update/${user.id}`}
                      />
                    </TableCell>
                    <TableCell><DoctorsAutocomplete  setDialog={setDialog} user={user} doctors={doctors} val={user?.doctor}/></TableCell> */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {/* {users.map((user) => {
            return (
              <Card
                className={
                  selectedUser?.id == user.id
                    ? "p-4 mb-2 bg-slate-700 text-white"
                    : "p-4 mb-2 bg-slate-100 hover:bg-slate-700 hover:text-gray-100 hover:cursor-pointer"
                }
                onClick={() => {
                  setSelectedUser(user);
                }}
                key={user.id}
              >
                <ListItem
                  secondaryAction={
                    <MyCheckbox
                      setDialog={setDialog}
                      colName={"is_nurse"}
                      isChecked={user.is_nurse}
                      path={`update/${user.id}`}
                    />
                  }
                >
                  <ListItemText>{user.username}</ListItemText>
                </ListItem>
              </Card>
            );
          })} */}
        </Box>
      </Grid>
      <Grid item xs={2}>
        {selectedUser && (
          <Box key={selectedUser?.id} sx={{ p: 1 }}>
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
      <Grid key={selectedUser?.id} item xs={2}>
        {selectedUser && (
          <Box sx={{ p: 1 }}>
            <Typography textAlign={"center"} variant="h5">
              User Routes {selectedUser.name}{" "}
            </Typography>
            <List>
              {routes.map((route) => {
                const checked = selectedUser.routes
                  .map((r) => r.route_id)
                  .includes(route.id);
                return (
                  <ListItem
                    onClick={() => {
                      setSelectedRoute(route);
                    }}
                    sx={{
                      backgroundColor: (theme) =>
                        selectedRoute?.id == route.id
                          ? theme.palette.warning.light
                          : "",
                    }}
                    secondaryAction={
                      <CustomCheckboxUserRoute
                        setSelectedUser={setSelectedUser}
                        selectedUser={selectedUser}
                        setDialog={setDialog}
                        setUpdater={setUpdater}
                        route_id={route.id}
                        isChecked={checked}
                      />
                    }
                    key={route.route_id}
                  >
                    <ListItemButton
                      key={route.route_id}
                      onClick={() => setSelectedRoute(route)}
                    >
                      <ListItemText>{t(route.name)}</ListItemText>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        )}
      </Grid>
      <Grid item xs={2}>
        {selectedUser && (
          <Box key={selectedUser.id} sx={{ p: 1 }}>
            <Typography textAlign={"center"} variant="h5">
              User sub Routes
            </Typography>
            <FormGroup>
              {selectedRoute?.sub_routes.map((route) => {
                console.log(route, "route check box");
                const checked = selectedUser.sub_routes
                  .map((r) => r.sub_route_id)
                  .includes(route.id);
                return (
                  <FormControlLabel
                    key={route.id}
                    control={
                      <CustomCheckboxUserRoute
                        setSelectedUser={setSelectedUser}
                        sub_route_id={route.id}
                        selectedUser={selectedUser}
                        setDialog={setDialog}
                        setUpdater={setUpdater}
                        route_id={route.route_id}
                        isChecked={checked}
                        path="subRoutes"
                      />
                    }
                    label={t(route.name)}
                  />
                );
              })}
            </FormGroup>
          </Box>
        )}
      </Grid>
      <Grid item xs={3}>
        <SignUp doctors={doctors} setUsers={setUsers} />
      </Grid>
    </Grid>
  );
}

export default Users;
