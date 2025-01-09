import React, { useEffect, useState } from 'react'
import axiosClient from '../../../axios-client'
import { Button, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import dayjs from 'dayjs'
import MyCustomLoadingButton from '../../components/MyCustomLoadingButton'
import TdLoader from '../../components/TdLoader'

function DoctorsCredits({setAllMoneyUpdatedLab}) {
    const [doctorShifts,setDoctorShifts] = useState([])
    const [update,setUpdate] = useState(0)
    useEffect(() => {
        document.title = 'استحقاق الاطباء' ;
      }, []);
    useEffect(()=>{
        axiosClient.get('/doctor/byLastUnifiedShift').then(({data})=>{
            setDoctorShifts(data)
            console.log(data)
        })
    },[update])
    const addCost = (id,setIsLoading)=>{
        setIsLoading(true)
        axiosClient.post(`costForDoctor/${id}`,{shiftId:id}).then(({data})=>{
            console.log(data)
        }).catch((err)=>console.log(err)).finally(()=>{
            setUpdate((prev)=>prev+1)
            setAllMoneyUpdatedLab((prev)=>prev+1)

        }).finally(()=>setIsLoading(false))
    }
  return (
    <Paper elevation={2}>
        <Table style={{direction:'rtl'}} size='small'>
            <TableHead>
                <TableRow>
                    <TableCell>الاسم</TableCell>
                    <TableCell>اجمالي الاستحقاق</TableCell>
                    <TableCell>عدد المرضي</TableCell>
                    <TableCell>استحقاق النقدي</TableCell>
                    <TableCell>استحقاق التامين</TableCell>
                    <TableCell>الزمن</TableCell>
                    <TableCell>خصم استحقاق</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {doctorShifts.map((shift)=>{
                    return(
                        <TableRow key={shift.id}>
                            <TableCell>{shift.doctor.name}</TableCell>
                            <TdLoader api={`doctor/totalMoney/${shift.id}`}/>
                            <TableCell>{shift.visits.length}</TableCell>
                            <TdLoader api={`doctor/moneyCash/${shift.id}`}/>
                            <TdLoader api={`doctor/moneyInsu/${shift.id}`}/>
                            <TableCell>{dayjs(Date.parse(shift.created_at)).format('H:m A')}</TableCell>
                            <TableCell><MyCustomLoadingButton disabled={shift.cost} onClick={(setIsLoading)=>{
                                
                                addCost(shift.id,setIsLoading)
                            }} variant='contained'>خصم</MyCustomLoadingButton></TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    </Paper>
  )
}

export default DoctorsCredits