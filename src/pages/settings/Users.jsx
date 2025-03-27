import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../../../axios-client";
import { useOutletContext } from "react-router-dom";
import CustomCheckBoxUser from "../../components/CustomCheckBoxUser";
import SignUp from "../Singeup";
import CustomCheckboxUserRoute from "../../components/CustomCheckboxUserRoute";
import {  use } from "i18next";
import {
  Card,
} from "/src/components/ui/card";
import MyCheckbox from "../../components/MyCheckBox";
import DoctorsAutocomplete from "../../components/DoctorsAutocomplete";
import { Plus } from "lucide-react";
import EmptyDialog from "../Dialogs/EmptyDialog";
import { useTranslation } from "react-i18next";
import PasswordChangeForm from "../../components/ChangePassword";
import MyTableCell from "../inventory/MyTableCell";
import UserMoneyCollectorTypeSelect from "../Clinic/UserTypeSelector";

function Users() {
  const { setDialog, doctors } = useOutletContext();
  const [selectedUser, setSelectedUser] = useState(null);
  const {t} = useTranslation('sidebar')
  const [users, setUsers] = useState([]);
  const [updater, setUpdater] = useState(0);
  const [roles, setRoles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [open,setOpen] = useState(false)
   const [openPasswordFrom,setOpenPasswordFrom] = useState(false)
  console.log(selectedRoute, "selected Route");
  useEffect(() => {
    document.title = 'الاعدادات'
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
  }, []);
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
      <Grid sx={{height:`${window.innerHeight}px`,overflow:'auto'}} item xs={6}>
        <Box sx={{ p: 1 }}>
          <Stack direction={'row'} justifyContent={'space-between'}>
          <Tooltip title={t('addUser')}>
          <IconButton onClick={()=>setOpen(true)}>
              <Plus/>
            </IconButton>
          </Tooltip>
            <Typography textAlign={"center"} variant="h5">
              {t("users")}
          </Typography>
          </Stack>
    
          <Table size="small">
            <TableRow>
              <TableCell>{t("id")}</TableCell>
              <TableCell>{t("name")}</TableCell>
              <TableCell>{t("username")}</TableCell>
                <TableCell>{t("isNurse")}</TableCell>
                <TableCell>{t("isDoctor")}</TableCell>
                <TableCell>نوع  المستخدم</TableCell>
            </TableRow>
            <TableBody>
              {users.map((user,i) => {
                return (
                  <TableRow   className={
                    selectedUser?.id == user.id
                      ? "p-4 mb-2 bg-purple-200 text-white"
                      : "p-4 mb-2 bg-slate-100  hover:text-gray-100 hover:cursor-pointer"
                  }
                  onClick={() => {
                    setSelectedUser(user);
                  }} key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <MyTableCell table="users"  colName={'name'} item={user} >{user.name}</MyTableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      {" "}
                      <MyCheckbox
                      evalToZeroOrOne
                        setDialog={setDialog}
                        colName={"is_nurse"}
                        isChecked={user.is_nurse}
                        path={`update/${user.id}`}
                      />
                    </TableCell>
                       <TableCell><DoctorsAutocomplete  setDialog={setDialog} user={user} doctors={doctors} val={user?.doctor}/></TableCell>
                     <TableCell><Button onClick={()=>{
                      //set user
                      setSelectedUser(user)
                      //open change pasword form
                      setOpenPasswordFrom(true)
                    }}>{t('changePassword')}</Button></TableCell>
                    <TableCell> 
                      <UserMoneyCollectorTypeSelect  id={user.id} onChange={()=>{
                      
                      }} value={user.user_money_collector_type}/>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        
        </Box>
      </Grid>
      <Grid item xs={2}>
        {selectedUser && (
          <Box key={selectedUser?.id} sx={{ p: 1 }}>
            <Typography textAlign={"center"} variant="h5">
              {t("roles")} {selectedUser.name}{" "}
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
                    label={t(role.name)}
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
              {t("routes")} {selectedUser.name}{" "}
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
               {t("subRoutes")}
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
      {/* <Grid item xs={3}>
        <SignUp doctors={doctors} setUsers={setUsers} />
      </Grid> */}
       <EmptyDialog  title={t("addUser")} setShow={setOpen} show={open}><SignUp setOpen={setOpen} setUsers={setUsers}/></EmptyDialog>
       <EmptyDialog  title={t("changePassword")} setShow={setOpenPasswordFrom} show={openPasswordFrom}><PasswordChangeForm setOpenPasswordFrom={setOpenPasswordFrom} selectedUser={selectedUser}/></EmptyDialog>
    </Grid>
  );
}

export default Users;