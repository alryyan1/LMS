import { Delete } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { toFixed, webUrl } from '../constants';
import axiosClient from '../../../axios-client';
import MyTableCell from '../inventory/MyTableCell';
import MyCheckbox from '../../components/MyCheckBox';
function DepoistItemsTable({selectedDeposit,loading,deleteIncomeItemHandler,setSelectedDeposit,data,setData}) {
  console.log(data,'data of cloned deposit')
  const [ld,setLd] = useState(false)
  const [search,setSearch] = useState(null)

  const [page, setPage] = useState(0);
  console.log('data in deposit items table',data)
  console.log('selectedDeposit in deposit items table',selectedDeposit)
  useEffect(()=>{
    if (search !=null ) {
      if (search =='') {
        // alert('empty search')
        console.log(data,'data')
        setSelectedDeposit(data)
        return
      }
       if ( !isNaN(search)) {
       setPage(()=>{
        return 0
       })
        // alert('number search')
        const filtered=  data.items.filter((item)=>{
          
          return item.item.barcode.trim() == search.trim()
        })
        const sliced = filtered.slice(page, page + 10).map((i)=>{
          // alert(i)

        })
        console.log(page,'page')
        console.log(filtered,'filtered',sliced,'sliced')
        setSelectedDeposit((prev)=>{
          return {
            ...prev,
            items : filtered
          }
        })
       }else{
        if (search =='') {
          alert('empty search')
          setSelectedDeposit(data)
          return
        }
        setSelectedDeposit((prev)=>{
          return {
            ...prev,
            items: data.items.filter(item=>item.item.market_name.toLowerCase().includes(search?.toLowerCase()))
          }
        })
       }
     
    }
   
  },[search])
  return (
    <TableContainer  sx={{height:'80vh',overflow:'auto',p:1}}>
      <LoadingButton loading={ld} onClick={()=>{
        setLd(true)
       const result =   confirm('هل انت متاكد من اضافه كل الاصناف لهذه الفاتوره')
       if (result) {
         axiosClient.post(`income-item/bulk/${selectedDeposit.id}`).then(({data}) => {
          setSelectedDeposit(data.deposit)
          setData(data)
          
          }).finally(()=>setLd(false));
       }
      }} >تعريف كل الاصناف للفاتوره</LoadingButton>
        <a
              href={`${webUrl}pdf?id=${selectedDeposit.id}`}
            >
              pdf
            </a>
            <Stack sx={{m:1}} alignItems={'center'} justifyContent={'space-between'} direction={'row'}>
            <Typography align="center" variant="h5" sx={{ mb: 1 }}>
              {`${selectedDeposit.supplier.name} /  ${selectedDeposit.bill_number}`}
            </Typography>
            <TextField   autoComplete='false' placeholder='Barcode/Market name' value={search} onChange={(e)=>setSearch(e.target.value)} size='small' label='بحث' type='search'></TextField>
            </Stack>
         
            <Table key={selectedDeposit.items.length} dir="rtl" size="small">
              <thead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Subtotal</TableCell>
                  <TableCell>barcode</TableCell>
                  <TableCell>Dlt</TableCell>
                  <TableCell>purchase return</TableCell>
                </TableRow>
              </thead>

              <TableBody>
                {selectedDeposit.items.slice(page, page + 10).map((depositItem, i) => (
                  <TableRow key={i}>
                    <TableCell>{depositItem.item.id}</TableCell>
                    <TableCell>{depositItem.item.market_name}</TableCell>
                    <MyTableCell key={page}  setSelectedDeposit={setSelectedDeposit} item={depositItem} show table='depositItems/update'  colName={'quantity'}>{depositItem.quantity}</MyTableCell>
                    <TableCell>{depositItem.price}</TableCell>
                    <TableCell>
                      {toFixed(depositItem.quantity * depositItem.price,3)}
                    </TableCell>
                    <TableCell>{depositItem.item.barcode}</TableCell>

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
                    <TableCell><MyCheckbox setSelectedDeposit={setSelectedDeposit} path={`depositItems/update/${depositItem.id}`} isChecked={depositItem.return} colName={'return'}  /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
            shape="rounded"
            onChange={(e, number) => setPage(number * 10 - 10)}
            count={Math.ceil(selectedDeposit.items.length/10)}
            variant="outlined"
          />
          </TableContainer>
  )
}

export default DepoistItemsTable