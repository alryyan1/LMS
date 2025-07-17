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
import { DoctorShift, Doctor } from "@/types/Patient";

interface User {
  id: number;
  isAdmin: boolean;
}

interface DoctorShiftItem extends DoctorShift {
  user_id: number;
  is_cash_revenue_prooved: boolean;
  is_cash_reclaim_prooved: boolean;
  is_company_revenue_prooved: boolean;
  is_company_reclaim_prooved: boolean;
  created_at: string;
}

interface DoctorsCreditsProps {
  setAllMoneyUpdatedLab: (update: (prev: number) => number) => void;
  user: User;
}

function DoctorsCredits({ setAllMoneyUpdatedLab, user }: DoctorsCreditsProps) {
  
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [temp, setTemp] = useState<number>(0);
  const [bankAmount, setBankAmount] = useState<number>(0);
  const [doctorShifts, setDoctorShifts] = useState<DoctorShiftItem[]>([]);
  const [showCashReclaimDialog, setShowCashReclaimDialog] = useState(false);
  const [update, setUpdate] = useState(0);
  const [showAdditonalCosts, setShowAdditonalCosts] = useState(false);
  const [selectedDoctorShift, setSelectedDoctorShift] = useState<DoctorShiftItem | null>(null);

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
  const addCost = (id: number, bankAmount: number, setIsLoading: (loading: boolean) => void) => {
    setIsLoading(true);
    axiosClient
      .post(`costForDoctor/${id}`, { shiftId: id, bankAmount })
      .then(({ data }) => {
        console.log(data);
        setDoctorShifts((prev) => {
          return prev.map((item) =>
            item.id === id ? data.data : item
          );
        })
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setUpdate((prev) => prev + 1);
        setIsLoading(false)
        setAllMoneyUpdatedLab((prev) => prev + 1);
      });
  };
  const prooveRevenue = (id: number, setIsLoading: (loading: boolean) => void) => {
    setIsLoading(true);
    axiosClient
      .get(`prooveRevenue/${id}`)
      .then(({ data }) => {
        console.log(data);
        setDoctorShifts((prev) => {
          return prev.map((item) =>
            item.id === id ? data.data : item
          );
        })
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };
  const prooveCompanyRevenue = (id: number, setIsLoading: (loading: boolean) => void) => {
    setIsLoading(true);
    axiosClient
      .post(`prooveCompanyRevenue/${id}`)
      .then(({ data }) => {
        console.log(data);
        setDoctorShifts((prev) => {
          return prev.map((item) =>
            item.id === id ? data.data : item
          );
        })
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };
     useEffect(()=>{
      setCashAmount(0)
      setBankAmount(0)
      if(selectedDoctorShift){
        let api =   selectedDoctorShift.doctor.calc_insurance ? 'doctor/totalMoney' : 'doctor/moneyCash'
        axiosClient.get(`${api}/${selectedDoctorShift?.id}`).then(({data})=>{
          setCashAmount(data)
          setTemp(data)
       })
      }
    
     },[selectedDoctorShift?.id])
  const prooveCashReclaim = (setIsLoading: (loading: boolean) => void) => {
   let r =  confirm('هل انت متاكد من اثبات استحقاق الطبيب')
   if(!r) {
     setIsLoading(false);
     return;
   }
   setIsLoading(true)
   if(!selectedDoctorShift?.id) return;
   addCost(selectedDoctorShift.id, bankAmount, setIsLoading)

    axiosClient
      .post(`prooveCashReclaim/${selectedDoctorShift?.id}`,{
        cash: cashAmount,
        bank: bankAmount,
      })
      .then(({ data }) => {
        console.log(data);
        setShowCashReclaimDialog(false);
        setDoctorShifts((prev) => {
          return prev.map((item) =>
            item.id == selectedDoctorShift?.id ? data.data : item
          );
        })
        if(selectedDoctorShift?.id) {
          addCost(selectedDoctorShift.id, bankAmount, setIsLoading)
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
    
  };
  const prooveCompanyReclaim = (setIsLoading: (loading: boolean) => void) => {
    setIsLoading(true)
    axiosClient
      .post(`prooveDoctorCompanyReclaim/${selectedDoctorShift?.id}`,{
        cash: cashAmount,
        bank: bankAmount,
      })
      .then(({ data }) => {
        console.log(data);
        setShowCashReclaimDialog(false);
        setDoctorShifts((prev) => {
          return prev.map((item) =>
            item.id == selectedDoctorShift?.id ? data.data : item
          );
        })
      })
      .finally(()=>setIsLoading(false))
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
          {doctorShifts.filter((d)=>{
            if(!user?.isAdmin){
              // console.log('is not admin')
              return d.user_id == user?.id
            }else{
              return true
            }
          }).map((shift) => {
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
                  >
                    خصم
                  </MyCustomLoadingButton>
                </TableCell> */}
                <TableCell>
                  <MyCustomLoadingButton
                  disabled={shift.is_cash_revenue_prooved}
                    onClick={(setIsLoading: (loading: boolean) => void) => {
                      setIsLoading(true)
                      let result = confirm('هل انت متاكد من اثبات الايراد النقدي')
                      if(result){
                        prooveRevenue(shift.id, setIsLoading);
                      } else {
                        setIsLoading(false);
                      }
                    }}
                  >
                    اثبات الايراد النقدي
                  </MyCustomLoadingButton>
                </TableCell>
                <TableCell>
                  <MyCustomLoadingButton
                  disabled={shift.is_cash_revenue_prooved == false || shift.is_cash_reclaim_prooved}

                    onClick={(setIsLoading: (loading: boolean) => void) => {

                      //confirm
                      
                      setShowCashReclaimDialog(true)
                      setSelectedDoctorShift(shift)

                    }}
                  >
                    اثبات الاستحقاق النقدي
                  </MyCustomLoadingButton>
                </TableCell>
                <TableCell>
                  <MyCustomLoadingButton
                  disabled={ shift.is_company_revenue_prooved }
                    onClick={(setIsLoading: (loading: boolean) => void) => {
                      let result = confirm('هل انت متاكد من اثبات ايراد   التامين ')
                      if(result){
                      setIsLoading(true)

                      prooveCompanyRevenue(shift.id, setIsLoading);
                      } else {
                        setIsLoading(false);
                      }
                    }}
                  >
                    اثبات الايراد من التامين
                  </MyCustomLoadingButton>
                </TableCell>
          
                <TableCell>
                  <MyCustomLoadingButton
                  disabled={shift.is_company_revenue_prooved  == false ||shift.is_company_reclaim_prooved}
                    onClick={(setIsLoading: (loading: boolean) => void) => {
                      // setIsLoading(true)

                      let result = confirm('هل انت متاكد من اثبات استحقاق الطبيب من التامين ')
                      if(result){
                      setSelectedDoctorShift(shift)
                      prooveCompanyReclaim(setIsLoading);
                      } else {
                        setIsLoading(false);
                      }
                    }}
                  >
                    اثبات الاستحقاق من التامين
                  </MyCustomLoadingButton>
                </TableCell>
                <TableCell>
                  <Button onClick={() => {
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
      {selectedDoctorShift && <EmptyDialog title="التكاليف الإضافية" setShow={setShowAdditonalCosts} show={showAdditonalCosts}>
        <DoctorShiftAddictionalCosts selectedDoctorShift={selectedDoctorShift} addCost={addCost} doctorShift={selectedDoctorShift} />
      </EmptyDialog>}

      <EmptyDialog title="اثبات الاستحقاق النقدي" show={showCashReclaimDialog} setShow={setShowCashReclaimDialog}>
          <Stack direction={'column'} gap={1} sx={{p:1}}>
              <TextField sx={{fontSize:'19px'}} value={cashAmount} onChange={(e)=>{
                const value = Number(e.target.value);
                setCashAmount(value)
                setBankAmount(temp - value)
              }} label='الصندوق'/>
              <TextField value={bankAmount} onChange={(e)=>{
                const value = Number(e.target.value);
                setBankAmount(value)
                setCashAmount(temp - value)

              }} label='البنك'/>
              <MyCustomLoadingButton onClick={prooveCashReclaim} >خصم  الاستحقاق النقدي</MyCustomLoadingButton>
          </Stack>
      </EmptyDialog>
    </Paper>
  );
}

export default DoctorsCredits;
