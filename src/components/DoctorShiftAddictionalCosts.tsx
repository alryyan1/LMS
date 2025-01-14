import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { Table, TableCell, TableHead, TableRow } from "@mui/material";
import MyCustomLoadingButton from "./MyCustomLoadingButton";
import { formatNumber } from "../pages/constants";

function DoctorShiftAddictionalCosts({ doctorShift }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    axiosClient
      .get(`additionalDoctorShiftCosts/${doctorShift.id}`)
      .then(({ data }) => {
        setData(data);
      });
  }, []);
  const addCost = (amount,description) => {
    axiosClient.post("cost/general", {description,amount}).then(({ data }) => {
        console.log(data);
      });
  };
  return (
    <div>
      <Table style={{direction:'rtl'}} size="small">
        <TableHead>
          <TableRow>
            <TableCell>الاسم</TableCell>
            <TableCell>الملبغ</TableCell>
            <TableCell>-</TableCell>
          </TableRow>
        </TableHead>
        <tbody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{formatNumber(item.amount)}</TableCell>
              <TableCell>
                <MyCustomLoadingButton
                  onClick={() => {
                    addCost(item.amount,item.name);
                  }}
                >
                  خصم
                </MyCustomLoadingButton>
              </TableCell>{" "}
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default DoctorShiftAddictionalCosts;
