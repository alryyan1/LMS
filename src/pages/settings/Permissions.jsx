import { LoadingButton } from "@mui/lab";
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../../../axios-client";
import { CheckBox, Delete, Recycling } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import CustomCheckBox from "../../components/CustomCheckBox";

function Permissions() {
  const { setDialog } = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(false);
  const [roles, setRoles] = useState([]);
  const [updater, setUpdater] = useState(0);
  const [permissions, setPermissions] = useState([]);
  const {
    handleSubmit,
    register,
    formState: { isSubmitSuccessful },
  } = useForm();
  const {
    handleSubmit: handleSubmit2,
    register: register2,
    formState: { isSubmitSuccessful: isSubmitSuccessful2 },
  } = useForm();
  console.log(selectedRole, "selected role");

  const submitHandler = (data) => {
    setLoading(true);
    axiosClient
      .post("roles", data)
      .then(({ data }) => {
        console.log(data);
        setUpdater((prev) => prev + 1);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const submitHandler2 = (data) => {
    setLoading(true);
    axiosClient
      .post("permissions", data)
      .then(({ data }) => {
        console.log(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    axiosClient("roles").then(({ data }) => {
      setRoles(data);
      console.log(data);
    });
  }, [isSubmitSuccessful, updater]);
  useEffect(() => {
    axiosClient("permissions").then(({ data }) => {
      setPermissions(data);
      console.log(data);
      setUpdater((prev) => prev + 1);
    });
  }, []);
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Typography textAlign={"center"} variant="h4">
          Add Roles
        </Typography>

        <form onSubmit={handleSubmit(submitHandler)}>
          <Stack direction={"column"}>
            <TextField {...register("name")} label="add role" />
            <LoadingButton loading={loading} type="submit">
              add
            </LoadingButton>
          </Stack>
        </form>
        <Divider />
        <Typography textAlign={"center"} variant="h4">
          Add Permissions
        </Typography>

        <form onSubmit={handleSubmit2(submitHandler2)}>
          <Stack direction={"column"}>
            <TextField {...register2("name")} label="add permission" />
            <LoadingButton loading={loading} type="submit">
              add
            </LoadingButton>
          </Stack>
        </form>
      </Grid>
      <Grid item xs={3}>
        <Typography textAlign={"center"} variant="h2">
          Roles
        </Typography>
        <List dense>
          {roles.map((role) => {
            return (
              <ListItem sx={{
                backgroundColor: (theme) =>
                  selectedRole.id == role.id
                    ? theme.palette.primary.main
                    : "",
              }} secondaryAction={<IconButton onClick={()=>{
                axiosClient.delete(`roles/${role.id}`).then(({data}) =>{
                  console.log(data)
                   
                      setRoles(data.rules)
                    
                })
              }} ><Delete/></IconButton>} key={role.id}>
              
                <ListItemButton
                  style={{
                    marginBottom: "2px",
                    color: "black",
                  }}
                 
                  onClick={() => {
                    setSelectedRole(role);
                  }}
                >
                  <ListItemText>{role.name}</ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Grid>
      <Grid key={selectedRole.id} item xs={3}>
        {selectedRole && (
          <div>
            <Typography textAlign={"center"} variant="h5">
              Permissions {selectedRole.name}{" "}
            </Typography>
            <FormGroup>
              {permissions.map((p) => {
                console.log(p, "permissionsin check box");
                const checked = selectedRole.permissions
                  .map((p) => p.id)
                  .includes(p.id);
                return (
                  <FormControlLabel
                    key={p.id}
                    control={
                      <CustomCheckBox
                        selectedRole={selectedRole}
                        setDialog={setDialog}
                        setUpdater={setUpdater}
                        key={p.id}
                        permission_id={p.id}
                        isChecked={checked}
                      />
                    }
                    label={p.name}
                  />
                );
              })}
            </FormGroup>
          </div>
        )}
      </Grid>
    </Grid>
  );
}

export default Permissions;
