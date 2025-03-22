import React, { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
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
  
  const [cashAmount, setCashAmount] = useState(0);
  const [bankAmount, setBankAmount] = useState(0);
  const [doctorShifts, setDoctorShifts] = useState([]);
  const [showCashReclaimDialog, setShowCashReclaimDialog] = useState(false);
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
        setDoctorShifts((prev)=>{
          return prev.map((item) =>
            item.id === id?  data.data : item
          );
        })
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setUpdate((prev) => prev + 1);
        setAllMoneyUpdatedLab((prev) => prev + 1);
      })
      .finally(() => setIsLoading(false));
  };
  const prooveRevenue = (id, setIsLoading) => {
    setIsLoading(true);
    axiosClient
      .get(`prooveRevenue/${id}`)
      .then(({ data }) => {
        console.log(data);
        // setDoctorShifts((prev)=>{
        //   return prev.map((item) =>
        //     item.id === id?  data.data : item
        //   );
        // })
      })
      .catch((err) => console.log(err))
    
      .finally(() => setIsLoading(false));
  };
     useEffect(()=>{
      if(selectedDoctorShift){
        axiosClient.get(`doctor/moneyCash/${selectedDoctorShift?.id}`).then(({data})=>{
          setCashAmount(data)
       })
      }
    
     },[selectedDoctorShift?.id])
  const prooveCashReclaim = () => {
    axiosClient
      .post(`prooveCashReclaim/${selectedDoctorShift?.id}`,{
        cash: cashAmount,
        bank: bankAmount,
      })
      .then(({ data }) => {
        console.log(data);
        // setDoctorShifts((prev)=>{
        //   return prev.map((item) =>
        //     item.id === id?  data.data : item
        //   );
        // })
      })
      .catch((err) => console.log(err))
    
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
            <TableCell> اثبات الايراد النقدي</TableCell>
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
                    disabled={shift.cost}
                    onClick={(setIsLoading) => {
                      addCost(shift.id, setIsLoading);
                    }}
                    variant="contained"
                  >
                    خصم
                  </MyCustomLoadingButton>
                </TableCell>
                <TableCell>
                  <MyCustomLoadingButton
                    onClick={(setIsLoading) => {
                      prooveRevenue(shift.id, setIsLoading);
                    }}
                    variant="contained"
                  >
                    اثبات الايراد النقدي
                  </MyCustomLoadingButton>
                </TableCell>
                <TableCell>
                  <MyCustomLoadingButton
                    onClick={(setIsLoading) => {
                      setShowCashReclaimDialog(true)
                      setSelectedDoctorShift(shift)

                    }}
                    variant="contained"
                  >
                    اثبات الاستحقاق النقدي
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

      <EmptyDialog show={showCashReclaimDialog} setShow={setShowCashReclaimDialog}>
          <Stack direction={'column'} gap={1} sx={{p:1}}>
              <TextField sx={{fontSize:'19px'}} value={cashAmount} onChange={(e)=>{
                setCashAmount(e.target.value)
              }} label='الصندوق'/>
              <TextField onChange={(e)=>{
                setBankAmount(e.target.value)
              }} label='البنك'/>
              <Button onClick={prooveCashReclaim} >انشاء قيد الاستحقاق النقدي</Button>
          </Stack>
      </EmptyDialog>
    </Paper>
  );
}

export default DoctorsCredits;
