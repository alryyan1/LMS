import { CircularProgress, TableCell, TableRow } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axiosClient from '../../../axios-client'
import { Account } from '../../types/type'
import { formatNumber } from '../constants'
import { Maximize } from 'lucide-react'

function DebitsAndCreditsRow({id}) {
    const [loading,setLoading] =  useState(false)
    const [account,setAccount] =  useState<Account|null>(null)
    useEffect(()=>{
        setLoading(true)
        axiosClient(`financeAccounts/${id}`)
        .then(({data}) => {
          setAccount(data);
          console.log(data,'SelectedAccount');
        }).finally(()=>setLoading(false));
    },[])
  return (
    <TableRow key={id}>
              
              
    <TableCell>{account?.name}</TableCell>
    <TableCell>{loading ? <CircularProgress/> : formatNumber(account?.totalDebits)}</TableCell>
    <TableCell>{loading ? <CircularProgress/> : formatNumber(account?.totalcredits)}</TableCell>
    <TableCell>{loading ? <CircularProgress/> : formatNumber(Math.abs(account?.totalDebits - account?.totalcredits))}</TableCell>
    </TableRow>

  )
}

export default DebitsAndCreditsRow