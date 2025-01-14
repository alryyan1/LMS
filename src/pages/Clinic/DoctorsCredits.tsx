import React, { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import MyCustomLoadingButton from "../../components/MyCustomLoadingButton";
import TdLoader from "../../components/TdLoader";
import { Eye } from "lucide-react";
import EmptyDialog from "../Dialogs/EmptyDialog";
import DoctorShiftAddictionalCosts from "../../components/DoctorShiftAddictionalCosts";
import { formatNumber } from "../constants";
import { Shift } from "../../types/Shift";

function DoctorsCredits({ setAllMoneyUpdatedLab }) {
  const [doctorShifts, setDoctorShifts] = useState([]);
  const [update, setUpdate] = useState(0);
  const [showAdditonalCosts, setShowAdditonalCosts] = useState(false);
  const [selectedDoctorShift, setSelectedDoctorShift] = useState(null);

  const [unifiedShift, setUnifiedShift] = useState<Shift | null>(null);

  const [show, setShow] = useState(false);
  useEffect(() => {
    axiosClient.get("shift/last").then(({ data: { data } }) => {
      setUnifiedShift(data);
      
    });
  }, [unifiedShift?.cost.length]);
  useEffect(() => {
    document.title = "استحقاق الاطباء";
  }, []);
  useEffect(() => {
    axiosClient.get("/doctor/byLastUnifiedShift").then(({ data }) => {
      setDoctorShifts(data);
      console.log(data);
    });
  }, [update]);
  const addCost = (id, setIsLoading) => {
    setIsLoading(true);
    axiosClient
      .post(`costForDoctor/${id}`, { shiftId: id })
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setUpdate((prev) => prev + 1);
        setAllMoneyUpdatedLab((prev) => prev + 1);
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <Paper elevation={2}>
      <Table style={{ direction: "rtl" }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>الاسم</TableCell>
            <TableCell>اجمالي الاستحقاق</TableCell>
            <TableCell>عدد المرضي</TableCell>
            <TableCell>الثابت</TableCell>
            <TableCell>استحقاق النقدي</TableCell>
            <TableCell>استحقاق التامين</TableCell>
            <TableCell>الزمن</TableCell>
            <TableCell>خصم استحقاق</TableCell>
            <TableCell>اخري </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {doctorShifts.map((shift) => {
            return (
              <TableRow key={shift.id}>
                <TableCell>{shift.doctor.name}</TableCell>
                <TdLoader api={`doctor/totalMoney/${shift.id}`} />
                <TableCell>{shift.visits.length}</TableCell>
                <TableCell>{formatNumber(shift.doctor.static_wage)}</TableCell>
                <TdLoader api={`doctor/moneyCash/${shift.id}`} />
                <TdLoader api={`doctor/moneyInsu/${shift.id}`} />
                <TableCell>
                  {dayjs(Date.parse(shift.created_at)).format("H:m A")}
                </TableCell>
                <TableCell>
                  <MyCustomLoadingButton
                    disabled={unifiedShift?.cost.map((c)=>c.doctor_shift_id).includes(shift.id)}
                    onClick={(setIsLoading) => {
                      addCost(shift.id, setIsLoading);
                    }}
                    variant="contained"
                  >
                    خصم
                  </MyCustomLoadingButton>
                </TableCell>
                <TableCell>
                  <Button variant="" onClick={() => {
                    setSelectedDoctorShift(shift)
                    setShowAdditonalCosts(true);
                  }}>
                    <Eye />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {selectedDoctorShift && <EmptyDialog setShow={setShowAdditonalCosts} show={showAdditonalCosts}>
        <DoctorShiftAddictionalCosts doctorShift={selectedDoctorShift} />
      </EmptyDialog>}
    </Paper>
  );
}

export default DoctorsCredits;
