import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { Table, TableCell, TableHead, TableRow, TextField, Stack } from "@mui/material";
import MyCustomLoadingButton from "./MyCustomLoadingButton";
import { formatNumber } from "../pages/constants";
import EmptyDialog from "../pages/Dialogs/EmptyDialog";

interface DoctorShift {
  id: number;
  doctor: {
    name: string;
  };
}

interface AdditionalCostItem {
  id: number;
  name: string;
  amount: number;
}

interface DoctorShiftAddictionalCostsProps {
  doctorShift: DoctorShift;
  addCost: (id: number, amount: number, setIsLoading: (loading: boolean) => void) => void;
  selectedDoctorShift: DoctorShift | null;
}

function DoctorShiftAddictionalCosts({ doctorShift, addCost, selectedDoctorShift }: DoctorShiftAddictionalCostsProps) {
  const [data, setData] = useState<AdditionalCostItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCostDialog, setShowCostDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AdditionalCostItem | null>(null);
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [bankAmount, setBankAmount] = useState<number>(0);

  useEffect(() => {
    axiosClient
      .get(`additionalDoctorShiftCosts/${doctorShift.id}`)
      .then(({ data }) => {
        setData(data);
      });
  }, [doctorShift.id]);

  useEffect(() => {
    if (selectedItem) {
      setCashAmount(0);
      setBankAmount(selectedItem.amount);
    }
  }, [selectedItem]);

  const handleOpenDialog = (item: AdditionalCostItem) => {
    setSelectedItem(item);
    setShowCostDialog(true);
  };

  const handleSaveCost = (setIsLoading: (loading: boolean) => void) => {
    if (!selectedItem || !selectedDoctorShift) return;
    
    const totalAmount = cashAmount + bankAmount;
    if (totalAmount !== selectedItem.amount) {
      alert('مجموع النقدي والبنك يجب أن يساوي المبلغ الإجمالي');
      return;
    }

    setIsLoading(true);
    axiosClient
      .post(`additionalDoctorShiftCost/${selectedDoctorShift.id}`, {
        itemId: selectedItem.id,
        itemName: selectedItem.name,
        itemAmount: selectedItem.amount,
        cashAmount: cashAmount,
        bankAmount: bankAmount,
      })
      .then(({ data }) => {
        console.log(data);
        setShowCostDialog(false);
        alert('تم إضافة التكلفة بنجاح');
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data?.message) {
          alert(err.response.data.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div>
      <Table style={{direction:'rtl'}} size="small">
        <TableHead>
          <TableRow>
            <TableCell>الاسم</TableCell>
            <TableCell>المبلغ</TableCell>
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
                    handleOpenDialog(item);
                  }}
                >
                  open
                </MyCustomLoadingButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      <EmptyDialog 
        show={showCostDialog} 
        setShow={setShowCostDialog}
        title="إضافة تكلفة إضافية"
      >
        <Stack direction={'column'} gap={2} sx={{p:1, minWidth: 300}}>
          {selectedItem && (
            <>
              <TextField 
                disabled
                label="اسم التكلفة"
                value={selectedItem.name}
              />
              <TextField 
                disabled
                label="المبلغ الإجمالي"
                value={formatNumber(selectedItem.amount)}
              />
              <TextField 
                type="number"
                label="النقدي"
                value={cashAmount}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setCashAmount(value);
                  setBankAmount(selectedItem.amount - value);
                }}
              />
              <TextField 
                type="number"
                label="البنك"
                value={bankAmount}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setBankAmount(value);
                  setCashAmount(selectedItem.amount - value);
                }}
              />
              <MyCustomLoadingButton 
                onClick={handleSaveCost}
                disabled={cashAmount + bankAmount !== selectedItem.amount}
              >
                حفظ التكلفة
              </MyCustomLoadingButton>
            </>
          )}
        </Stack>
      </EmptyDialog>
    </div>
  );
}

export default DoctorShiftAddictionalCosts;
