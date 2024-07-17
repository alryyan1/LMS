import { MenuItem, Select } from '@mui/material';
import React, { useState } from 'react'
import axiosClient from '../../axios-client';

function UserSelect({user,users,selectedContract,setUpdate}) {
  const [selectedUser,setSelectedUesr] =  useState(user)
  
  return (
    <Select
            value={selectedUser }
                    
                    onChange={(e)=>{
                       setSelectedUesr(e.target.value)
                       axiosClient.patch(`contracts/${selectedContract.id}`,{user_id:e.target.value}).then(({data})=>{
                        console.log(data)
                        setUpdate((prev)=>{
                            return prev+1
                          })
                       })
                    }} variant="filled" label="user" fullWidth>
                      {users.map((user) => {
                        return (
                          <MenuItem value={user.id} key={user.id}>
                            {user.username}
                          </MenuItem>
                        );
                      })}
                      <MenuItem selected></MenuItem>
                    </Select>
  )
}

export default UserSelect