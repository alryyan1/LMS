import { Delete } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import React, { useState } from 'react'
import { webUrl } from '../constants';
import axiosClient from '../../../axios-client';
import MyTableCell from '../inventory/MyTableCell';
function DepoistItemsTable({selectedDeposit,loading,deleteIncomeItemHandler,setSelectedDeposit}) {
  const [ld,setLd] = useState(false)
  return (
    <TableContainer sx={{height:'80vh',overflow:'auto',p:1}}>
      <LoadingButton loading={ld} onClick={()=>{
        setLd(true)
       const result =   confirm('هل انت متاكد من اضافه كل الاصناف لهذه الفاتوره')
       if (result) {
         axiosClient.post(`income-item/bulk/${selectedDeposit.id}`).then(({data}) => {
          setSelectedDeposit(data.deposit)
          }).finally(()=>setLd(false));
       }
      }} >تعريف كل الاصناف للفاتوره</LoadingButton>
        <a
              href={`${webUrl}pdf?id=${selectedDeposit.id}`}
            >
              pdf
            </a>
            <Typography align="center" variant="h5" sx={{ mb: 1 }}>
              {selectedDeposit.supplier.name}
            </Typography>
            <Table dir="rtl" size="small">
              <thead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Subtotal</TableCell>
                  <TableCell>Dlt</TableCell>
                </TableRow>
              </thead>

              <TableBody>
                {selectedDeposit.items.map((depositItem, i) => (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{depositItem.item.market_name}</TableCell>
                    <MyTableCell  item={depositItem} show table='depositItems/update'  colName={'quantity'}>{depositItem.quantity}</MyTableCell>
                    <TableCell>{depositItem.price}</TableCell>
                    <TableCell>
                      {depositItem.quantity * depositItem.price}
                    </TableCell>
                    <TableCell>
                      <LoadingButton
                        loading={loading}
                        title="Delete"
                        endIcon={<Delete />}
                        onClick={() => {
                          deleteIncomeItemHandler(depositItem.id);
                        }}
                      ></LoadingButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        
          </TableContainer>
  )
}

export default DepoistItemsTable