import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { useOutletContext } from "react-router-dom";
  import axiosClient from "../../../axios-client";
import { LoadingButton } from "@mui/lab";
import { Add, PlusOne } from "@mui/icons-material";
  
  function SearchDialog() {
    const { dialog, setDialog , foundedPatients } = useOutletContext();
   
  
    return (
      <div>
        <TableContainer>
          <Table size="small" style={{direction:'rtl'}}>
            <thead>
              <TableRow>
                <TableCell>الاسم</TableCell>
                <TableCell>التاريخ</TableCell>
                <TableCell> الطبيب</TableCell>
                <TableCell> اضافه</TableCell>
              </TableRow>
            </thead>
            <TableBody>
              {foundedPatients.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.doctor.name}</TableCell>
                  <TableCell><LoadingButton variant="contained"><Add></Add></LoadingButton></TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
  
  export default SearchDialog;
  