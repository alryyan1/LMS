import { Divider, IconButton, Stack } from '@mui/material';
import React from 'react'
import { Item, webUrl } from '../pages/constants';
import { Calculate, Group, PersonAdd, Print } from '@mui/icons-material';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';


function CustumSideBar({showFormHandler,showDoctorsDialog,setOpen,showShiftMoney,activeShift,user}) {
  return (
    <Stack
    sx={{ mr: 1 }}
    gap={"5px"}
    divider={<Divider orientation="vertical" flexItem />}
    direction={"column"}
  >
    <Item>
      <IconButton variant="contained" onClick={showFormHandler}>
        <CreateOutlinedIcon />
      </IconButton>
    </Item>
    <Item>
      <IconButton variant="contained" onClick={showDoctorsDialog}>
        <Group />
      </IconButton>
    </Item>
    <Item>
      <IconButton
        variant="contained"
        onClick={() => {
          setOpen(true);
        }}
      >
        <PersonAdd />
      </IconButton>
    </Item>
    <Item>
      <IconButton variant="contained" onClick={showShiftMoney}>
        <Calculate />
      </IconButton>
    </Item>
   
    <Item>
      
     {user && <IconButton title="التقرير العام" href={`${webUrl}clinics/report?user=${user.id}`} variant="contained">
        <Print />
      </IconButton>}
    </Item>
    {activeShift &&<Item>
     <IconButton color="info" title="التقرير الخاص" href={`${webUrl}clinics/doctor/report?user=${user.id}&doctorshift=${activeShift.id}`} variant="contained">
        <Print  />
      </IconButton>
    </Item>}
  </Stack>
  )
}

export default CustumSideBar