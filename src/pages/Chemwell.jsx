import React, { useEffect, useState } from 'react'
import axiosClient from '../../axios-client'
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'

function Chemwell() {
  const [data,setData] = useState([])
    useEffect(()=>{
        fetch('http://127.0.0.1:3000').then((res)=>res.json()).then((data)=>{
            console.log(data,'data')
            setData(data)
        })
    },[])
  return (
    <div>
      <Typography>Intaj Stars Technology </Typography>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell>TestNo</TableCell>
            <TableCell>AssayName</TableCell>
            <TableCell>SampleType</TableCell>
            <TableCell>Reading</TableCell>
            <TableCell>Abs</TableCell>
            <TableCell>Conc</TableCell>
            <TableCell>Interpretation</TableCell>
            <TableCell>RefRange</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Selected</TableCell>
            <TableCell>QC</TableCell>
            <TableCell>Pos</TableCell>
            <TableCell>CalculatedFrom</TableCell>
            <TableCell>Send Ministry</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {
              data.map((row,i)=>{
                return      <TableRow key={i}>
                <TableCell>{row.TestNo}</TableCell>
                <TableCell>{row.AssayName}</TableCell>
                <TableCell>{row.SampleType}</TableCell>
                <TableCell>{row.Reading}</TableCell>
                <TableCell>{row.Abs}</TableCell>
                <TableCell>{row.Conc}</TableCell>
                <TableCell>{row.Interpretation}</TableCell>
                <TableCell>{row.RefRange}</TableCell>
                <TableCell>{row.Time}</TableCell>
                <TableCell>{row.Selected}</TableCell>
                <TableCell>{row.QC}</TableCell>
                <TableCell>{row.Pos}</TableCell>
                <TableCell>{row.CalculatedFrom}</TableCell>
                <TableCell><LoadingButton variant='contained'>Send</LoadingButton></TableCell>
                </TableRow>
              })
            }
        
        </TableBody>
      </Table>
    </div>
  )
}

export default Chemwell