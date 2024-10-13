import {
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
  } from "@mui/material";
import { useOutletContext } from 'react-router-dom';
import MyTableCell from "../inventory/MyTableCell";
import axiosClient from "../../../axios-client";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { LoadingButton } from "@mui/lab";
import { webUrl } from "../constants";
function Invoices({hideDepositsTable,showDepositItemsTable,setData}) {
    const [loading,setLoading] = useState(false)
    const {invoices,setInvoices,selectedInvoice,setSelectedInvoice,setDialog,excelLoading} = useOutletContext()
    console.log(excelLoading,'excelLoading excelLoading')

  
  return (
    <>
    <TableContainer >
              <Table  style={{ direction: "rtl" }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell> كود</TableCell>
                    <TableCell> الرقم المرجعي</TableCell>
                    <TableCell>تاريخ الانشاء</TableCell>
                    <TableCell>المورد</TableCell>
                    <TableCell>اضيفت بواسطه </TableCell>
                    <TableCell>عرض التفاصيل</TableCell>
                    <TableCell> دفع</TableCell>
                    <TableCell> التقرير</TableCell>
                    <TableCell>  حذف</TableCell>
                    <TableCell>  ضريبه البيع</TableCell>
                    <TableCell>  ضريبه التكلفه</TableCell>
                    <TableCell> %الخصم </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.map((deposit) => {
                    return (
                      <TableRow 
                        sx={{
                          backgroundColor: (theme) =>
                            selectedInvoice?.id == deposit.id
                              ? theme.palette.warning.light
                              : "",
                        }}
                        key={deposit.id}
                      >
                        <TableCell>{deposit.id}</TableCell>
                        <MyTableCell table="inventory/deposit/update" sx={{width:'100px'}} setDialog={setDialog}  colName={'bill_number'} item={deposit}>{deposit.bill_number}</MyTableCell>
                        <TableCell>
                          {dayjs(
                            new Date(Date.parse(deposit.created_at))
                          ).format("YYYY/MM/DD")}
                        </TableCell>
                        <TableCell>{deposit.supplier.name}</TableCell>

                        <TableCell>{deposit?.user?.username}</TableCell>

                        <TableCell>
                          <LoadingButton loading={loading}
                            onClick={() => {
                              setLoading(true);
                            
                               axiosClient(`getDepositWithItems/${deposit.id}`).then(({data})=>{
                                hideDepositsTable();
                                // showAddToDeposit();
                                showDepositItemsTable();
                                console.log(data)
                                setSelectedInvoice(data)
  
                                setData(data);
                               }).finally(()=>setLoading(false))
                              // hideAddToDeposit();
                              // hideNewFormHandler();
                              
                            }}
                          >
                            التفاصيل
                          </LoadingButton>
                        </TableCell>
                        <TableCell>
                          <LoadingButton
                            loading={loading}
                            color={deposit.paid ? "success" : "error"}
                            variant="contained"
                            onClick={() => {
                              setLoading(true);
                              axiosClient
                                .patch(`inventory/deposit/pay/${deposit.id}}`)
                                .then(({ data }) => {
                                  setInvoices((prev) => {
                                    return prev.map((d) => {
                                      // console.log(d,data)
                                      if (d.id === data.data.id) {
                                        // alert('found')
                                        return { ...data.data };
                                      } else {
                                        return d;
                                      }
                                    });
                                  });
                                })
                                .finally(() => setLoading(false));
                            }}
                          >
                            {deposit.paid ? "الغاء الدفع" : "دفع"}
                          </LoadingButton>
                        </TableCell>
                        <TableCell>
                          {" "}
                          <a href={`${webUrl}pdf?id=${deposit.id}`}>pdf</a>
                        </TableCell>
                        <TableCell>
                       <LoadingButton onClick={()=>{
                        let result  =  confirm(
                          `هل تريد حذف الفاتورة ${deposit.bill_number}?`  
                        )
                        if(result){
                             axiosClient.delete(`inventory/${deposit.id}`).then(({data})=>{
                          if (data.status) {
                            setInvoices((prev)=>{
                              return prev.filter((d) => d.id!== deposit.id);
                            })
                          }
                        })
                        }
                     
                       }}>Delete</LoadingButton>
                       
                        </TableCell>
                        <MyTableCell table="inventory/deposit/update" sx={{width:'100px'}} setDialog={setDialog}  colName={'vat_sell'} item={deposit}>{deposit.vat_sell}</MyTableCell>
                        <MyTableCell table="inventory/deposit/update" sx={{width:'100px'}} setDialog={setDialog}  colName={'vat_cost'} item={deposit}>{deposit.vat_cost}</MyTableCell>

                        <MyTableCell
                          setDialog={setDialog}
                          show
                          sx={{ width: "60px", textAlign: "center" }}
                          setDeposit={setSelectedInvoice}
                          item={deposit}
                          table="inventory/deposit/update"
                          colName={"discount"}
                        >
                          {deposit.discount}
                        </MyTableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
    </>
   
  )
}

export default Invoices