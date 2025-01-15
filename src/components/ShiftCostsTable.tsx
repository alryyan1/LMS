import React, { useEffect, useState } from 'react'
import { Shift } from '../types/Shift';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
  } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import axiosClient from '../../axios-client';
import { useStateContext } from '../appContext';
import { formatNumber } from '../pages/constants';
function ShiftCostsTable({setAllMoneyUpdatedLab}) {
  const [shift, setShift] = useState<Shift | null>(null);

    const [show, setShow] = useState(false);
    useEffect(() => {
      axiosClient.get("shift/last").then(({ data: { data } }) => {
        setShift(data);
        
      });
    }, [shift?.cost.length]);
  const {user}= useStateContext()

  return (
    <div  style={{ direction: "rtl",height:'300px',overflow:'auto' }}> <Typography variant="h6" textAlign={"center"}>
    مصروفات الورديه
  </Typography>
  <Table size="small" style={{ direction: "rtl" }}>
    <TableHead>
      <TableRow>
        <TableCell>وصف المنصرف</TableCell>
        <TableCell>قسم </TableCell>
        <TableCell>المبلغ</TableCell>
        <TableCell>حذف</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {shift?.cost.filter((c)=>c.user_cost == user?.id).map((cost) => {
        return (
          <TableRow key={cost.id}>
            <TableCell>{cost.description}</TableCell>
            <TableCell>{cost?.cost_category?.name}</TableCell>
            <TableCell>{formatNumber( cost.amount)}</TableCell>
            <TableCell>
              <LoadingButton
                onClick={() => {
                  axiosClient
                    .delete(`cost/${cost.id}`)
                    .then(({ data }) => {
                      console.log(data);
                      setShift(data.data);
                      setAllMoneyUpdatedLab((prev)=>prev+1)
                    });
                }}
              >
                حذف
              </LoadingButton>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  </Table></div>
  )
}

export default ShiftCostsTable