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
  const [temp, setTemp] = useState(0);
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
  const addCost = (id, setIsLoading,bankAmount) => {
    setIsLoading(true);
    axiosClient
      .post(`costForDoctor/${id}`, { shiftId: id ,bankAmount})
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
        setDoctorShifts((prev)=>{
          return prev.map((item) =>
            item.id === id?  data.data : item
          );
        })
      })
      .catch((err) => console.log(err))
    
      .finally(() => setIsLoading(false));
  };
  const prooveCompanyRevenue = (id, setIsLoading) => {
    setIsLoading(true);
    axiosClient
      .post(`prooveCompanyRevenue/${id}`)
      .then(({ data }) => {
        console.log(data);
        setDoctorShifts((prev)=>{
          return prev.map((item) =>
            item.id === id?  data.data : item
          );
        })
      })
      .catch((err) => console.log(err))
    
      .finally(() => setIsLoading(false));
  };
     useEffect(()=>{
      if(selectedDoctorShift){
        axiosClient.get(`doctor/moneyCash/${selectedDoctorShift?.id}`).then(({data})=>{
          setCashAmount(data)
          setTemp(data)
       })
      }
    
     },[selectedDoctorShift?.id])
  const prooveCashReclaim = () => {
   let r =  confirm('هل انت متاكد من اثبات استحقاق الطبيب')
   if(!r) return
    axiosClient
      .post(`prooveCashReclaim/${selectedDoctorShift?.id}`,{
        cash: cashAmount,
        bank: bankAmount,
      })
      .then(({ data }) => {
        console.log(data);
        setShowCashReclaimDialog(false);
        setDoctorShifts((prev)=>{
          return prev.map((item) =>
            item.id == selectedDoctorShift?.id ?  data.data : item
          );
        })
        addCost(selectedDoctorShift?.id,()=>{},bankAmount)
      })
      .catch((err) => console.log(err))
    
  };
  const prooveCompanyReclaim = () => {
    axiosClient
      .post(`prooveDoctorCompanyReclaim/${selectedDoctorShift?.id}`,{
        cash: cashAmount,
        bank: bankAmount,
      })
      .then(({ data }) => {
        console.log(data);
        setShowCashReclaimDialog(false);
        setDoctorShifts((prev)=>{
          return prev.map((item) =>
            item.id == selectedDoctorShift?.id ?  data.data : item
          );
        })
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
            {/* <TableCell>الثابت</TableCell> */}
            <TableCell>استحقاق النقدي</TableCell>
            <TableCell>استحقاق التامين</TableCell>
            <TableCell>الزمن</TableCell>
            {/* <TableCell>خصم استحقاق</TableCell> */}
            <TableCell> اثبات الايراد النقدي</TableCell>
            <TableCell> اثبات الاستحقاق النقدي</TableCell>
            <TableCell> اثبات الايراد من التامين</TableCell>
            <TableCell> اثبات الاستحقاق من التامين</TableCell>

            <TableCell>اخري </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {doctorShifts.map((shift) => {
            return (
              <TableRow key={shift.id}>
                <TableCell>{shift.doctor.name}</TableCell>
                <TdLoader api={`doctor/totalMoney/${shift.id}`} />
                {/* <TableCell>{shift.visits.length}</TableCell> */}
                <TableCell>{formatNumber(shift.doctor.static_wage)}</TableCell>
                <TdLoader api={`doctor/moneyCash/${shift.id}`} />
                <TdLoader api={`doctor/moneyInsu/${shift.id}`} />
                <TableCell>
                  {dayjs(Date.parse(shift.created_at)).format("H:m A")}
                </TableCell>
                {/* <TableCell>
                  <MyCustomLoadingButton
                    disabled={shift.cost}
                    onClick={(setIsLoading) => {
                      addCost(shift.id, setIsLoading);
                    }}
                    variant="contained"
                  >
                    خصم
                  </MyCustomLoadingButton>
                </TableCell> */}
                <TableCell>
                  <MyCustomLoadingButton
                  disabled={shift.is_cash_revenue_prooved}
                    onClick={(setIsLoading) => {
                      let result = confirm('هل انت متاكد من اثبات الايراد النقدي')
                      if(result){
                        prooveRevenue(shift.id, setIsLoading);
                      }
                    }}
                    variant="contained"
                  >
                    اثبات الايراد النقدي
                  </MyCustomLoadingButton>
                </TableCell>
                <TableCell>
                  <MyCustomLoadingButton
                  disabled={shift.is_cash_revenue_prooved == false || shift.is_cash_reclaim_prooved}

                    onClick={(setIsLoading) => {

                      //confirm
                      
                      setShowCashReclaimDialog(true)
                      setSelectedDoctorShift(shift)

                    }}
                    variant="contained"
                  >
                    اثبات الاستحقاق النقدي
                  </MyCustomLoadingButton>
                </TableCell>
                <TableCell>
                  <MyCustomLoadingButton
                  disabled={ shift.is_company_revenue_prooved }
                    onClick={(setIsLoading) => {
                      prooveCompanyRevenue(shift.id, setIsLoading);
                    }}
                    variant="contained"
                  >
                    اثبات الايراد من التامين
                  </MyCustomLoadingButton>
                </TableCell>
          
                <TableCell>
                  <MyCustomLoadingButton
                  disabled={shift.is_company_revenue_prooved  == false ||shift.is_company_reclaim_prooved}
                    onClick={(setIsLoading) => {
                      setSelectedDoctorShift(shift)
                      prooveCompanyReclaim();
                    }}
                    variant="contained"
                  >
                    اثبات الاستحقاق من التامين
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
                setBankAmount(temp - e.target.value)
              }} label='الصندوق'/>
              <TextField value={bankAmount} onChange={(e)=>{
                setBankAmount(e.target.value)
              }} label='البنك'/>
              <Button onClick={prooveCashReclaim} >انشاء قيد الاستحقاق النقدي</Button>
          </Stack>
      </EmptyDialog>
    </Paper>
  );
}

export default DoctorsCredits;
