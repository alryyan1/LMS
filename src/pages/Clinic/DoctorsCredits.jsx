import React, { useEffect, useState } from 'react'
import axiosClient from '../../../axios-client'
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'

function DoctorsCredits() {
    const [doctorShifts,setDoctorShifts] = useState([])
    useEffect(()=>{
        axiosClient.get('/doctor/byLastUnifiedShift').then(({data})=>{
            setDoctorShifts(data)
            console.log(data)
        })
    },[])
  return (
    <div>
        <Table size='small'>
            <TableHead>
                <TableRow>
                    <TableCell>الاسم</TableCell>
                    <TableCell>اجمالي الدخل</TableCell>
                    <TableCell>عدد المرضي</TableCell>
                    <TableCell>استحقاق النقدي</TableCell>
                    <TableCell>استحقاق التامين</TableCell>
                    <TableCell>خصم استحقاق</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {doctorShifts.map((shift)=>{
                    return(
                        <TableRow key={shift.id}>
                            <TableCell>{shift.doctor.name}</TableCell>
                            <TableCell>{shift.total}</TableCell>
                            <TableCell>{shift.visits.length}</TableCell>
                            <TableCell>{shift.doctor_credit_cash}</TableCell>
                            <TableCell>{shift.doctor_credit_company}</TableCell>
                            <TableCell><Button>-</Button></TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    </div>
  )
}

export default DoctorsCredits