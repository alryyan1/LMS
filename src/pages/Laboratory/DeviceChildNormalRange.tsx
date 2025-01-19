import React, { useEffect, useState } from 'react'
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    List,
    ListItem,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography,
  } from "@mui/material";
import axiosClient from '../../../axios-client';
function DeviceChildNormalRange({selectedReslult,selectedTest,setLoading,selectedDevice,setResultUpdated,setShow,deviceNormalRange, setDeviceNormalRange}) {

    useEffect(()=>{
        axiosClient
        .post(`deviceChildTest`, {
          device_id: selectedDevice?.id,
          child_test_id: selectedReslult.child_test_id,
        })
        .then(({ data }) => {
          setDeviceNormalRange(data.normal_range);
          setLoading(false);
        }).finally(()=>{
        });
    },[])
  return (
    <Stack direction={"column"} gap={2}>
    <Typography
      textAlign={"center"}
    >{`${selectedTest?.name}(${selectedReslult?.child_test?.child_test_name})`}</Typography>
    <Divider></Divider>
    <TextField
      value={deviceNormalRange}
      onChange={(e) => {
        setDeviceNormalRange(e.target.value);

        // setLoading(true)
        axiosClient
          .patch(`deviceChildTest`, {
            normal_range: e.target.value,
            device_id: selectedDevice?.id,
            child_test_id: selectedReslult.child_test_id,
          })
          .then(({ data }) => {
          });
        // setShow(false)
      }}
      rows={6}
      multiline
    ></TextField>
    <Button 
    title='  لهذا التحليل (Normal Range)سيتم حفظ  ال '
      onClick={() => {
        axiosClient
          .patch(
            `requestedResult/normalRange/${selectedReslult.id}`,
            { val: deviceNormalRange }
          )
          .then(() => {
            setShow(false);
          });
      }}
    >
      Set
    </Button>
  </Stack>
  )
}

export default DeviceChildNormalRange