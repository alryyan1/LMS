import React, { useEffect, useState } from 'react'
import axiosClient from '../../../axios-client'
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'

function DoctorsCredits() {
    const [doctorShifts,setDoctorShifts] = useState([])
    const [update,setUpdate] = useState(0)
    
    useEffect(()=>{
        axiosClient.get('/doctor/byLastUnifiedShift').then(({data})=>{
            setDoctorShifts(data)
            console.log(data)
        })
    },[update])
    const addCost = (id,amount,name)=>{
        axiosClient.post('cost',{id,amount,name}).then(({data})=>{
            console.log(data)
        }).catch((err)=>console.log(err)).finally(()=>{
            setUpdate((prev)=>prev+1)
        })
    }
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
                            <TableCell><Button disabled={shift?.cost?.amount > 0} onClick={()=>{
                                addCost(shift.id,shift.doctor_credit_cash+ shift.doctor_credit_company,shift.doctor.name)
                            }} variant='contained'>خصم</Button></TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    </div>
  )
}

export default DoctorsCredits