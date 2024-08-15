import React, { useEffect, useState } from 'react'
import axiosClient from '../../../axios-client'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'

function MoneyIncome() {
    const [data,setData] = useState([])
    useEffect(()=>{
        axiosClient.get('monthlyIncome').then(({data})=>{
            setData(data)
            console.log(data)
        })
    },[])
  return (
    <div>
        <Table size='small'>
            <TableHead>
                <TableRow>
                    <TableCell>التاريخ</TableCell>
                    <TableCell>المختبر</TableCell>
                    <TableCell>العيادات</TableCell>
                    <TableCell>المصروفات</TableCell>
                    <TableCell>الصافي</TableCell>
                </TableRow>
            </TableHead>

                <TableBody>
                    {data?.summary?.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.totalLab}</TableCell>
                            <TableCell>{item.totalClinic}</TableCell>
                            <TableCell>{0}</TableCell>
                            <TableCell>{0}</TableCell>
                        </TableRow>
                    ))}

                </TableBody>
        </Table>
    </div>
  )
}

export default MoneyIncome