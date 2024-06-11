import { LoadingButton } from "@mui/lab";
import { Checkbox, Divider, FormControlLabel, FormGroup, Grid, ListItemButton, ListItemText, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../../../axios-client";
import { CheckBox } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import CustomCheckBox from "../../components/CustomCheckBox";
import CustomCheckBoxUser from "../../components/CustomCheckBoxUser";

function Users() {
  const {setDialog }=  useOutletContext()
  const [loading,setLoading] =   useState(false)
  const [selectedUser,setSelectedUser] =   useState(false)
  const [users,setUsers] =   useState([])
  const [updater,setUpdater] =   useState(0)
  const [roles,setRoles] =   useState([])
  const {handleSubmit,register,formState:{isSubmitSuccessful}} = useForm()
  const {handleSubmit:handleSubmit2,register:register2,formState:{isSubmitSuccessful:isSubmitSuccessful2}} = useForm()
  console.log(selectedUser,'selected selectedUser')
  const submitHandler = (data)=>{
    setLoading(true)
        axiosClient.post('roles',data).then(({data})=>{
            console.log(data)
        }).finally(()=>{
            setLoading(false)
        });
  }

  const submitHandler2 = (data)=>{
    setLoading(true)
        axiosClient.post('permissions',data).then(({data})=>{
            console.log(data)
        }).finally(()=>{
            setLoading(false)
        });
  }
  useEffect(()=>{
    axiosClient('users').then(({data})=>{
      setUsers(data)
      console.log(data,'users')
    })
  },[isSubmitSuccessful,updater])
  useEffect(()=>{
    axiosClient('roles').then(({data})=>{
      setRoles(data)
      console.log(data,'rules')
    //   setUpdater((prev)=>prev+1)
    })
  },[])
  return (
    <Grid container spacing={2}>
    
      <Grid item xs={3}>
        <Typography textAlign={'center'} variant="h3">Users</Typography>
        {users.map((user)=>{
          return  <ListItemButton
          style={{
            border: "1px dashed ",
            marginBottom: "2px",
            color: "black",
          }}
          sx={{backgroundColor: (theme)=>selectedUser.id == user.id ? theme.palette.primary.main : ''}}
         
          onClick={() => {
           
            setSelectedUser(user)
          }}
          key={user.id}
        >
          <ListItemText>{user.username}</ListItemText>
        </ListItemButton>
        })}
      </Grid>
      <Grid item xs={3}>
        {selectedUser && 
        <div>

          <Typography textAlign={'center'} variant="h5">Permissions {selectedUser.name } </Typography>
          <FormGroup>

            {
              
            
              roles.map((role)=>{
                console.log(role,'role check box')
                const checked =  selectedUser.roles.map((r)=>r.id).includes(role.id)
                return (<FormControlLabel key={role.id} control={<CustomCheckBoxUser selectedUser={selectedUser} setDialog={setDialog} setUpdater={setUpdater}  role_id={role.id} isChecked={checked}/>} label={role.name} />)
              })
            }
            </FormGroup>

        </div>
        

        
      }
      </Grid>
    </Grid>
  );
}

export default Users;
