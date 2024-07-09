import { Delete } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import React from 'react'
import { webUrl } from '../constants';

function DepoistItemsTable({selectedDeposit,loading,deleteIncomeItemHandler}) {
  return (
    <TableContainer sx={{height:'80vh',overflow:'auto',p:1}}>
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
                  <TableCell>رقم</TableCell>
                  <TableCell>الصنف</TableCell>
                  <TableCell>الكميه</TableCell>
                  <TableCell>السعر</TableCell>
                  <TableCell>الاجمالي</TableCell>
                  <TableCell>حذف</TableCell>
                </TableRow>
              </thead>

              <TableBody>
                {selectedDeposit.items.map((depositItem, i) => (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{depositItem.item.market_name}</TableCell>
                    <TableCell>{depositItem.quantity}</TableCell>
                    <TableCell>{depositItem.price}</TableCell>
                    <TableCell>
                      {depositItem.quantity * depositItem.price}
                    </TableCell>
                    <TableCell>
                      <LoadingButton
                        loading={loading}
                        title="حذف"
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