import { DateField, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { Controller } from 'react-hook-form'
import axiosClient from '../../axios-client'
import { useState } from 'react'

function MyDateField({val,item}) {
    // console.log(item , val,'date filed ')
    console.log( dayjs(val),'date filed ',val,'val')
  const [date, setDate] = useState(val)
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    
        <DateField
         
        size='small'
            defaultValue={dayjs(date)}
        
          value={dayjs(date)}
          onChange={(val) =>{
            const dayJsObj = dayjs(val)
          
            setDate(val)
            axiosClient.patch(`items/${item.id}`,{colName:'expire',val:`${dayJsObj.year()}/${dayJsObj.month() + 1}/${dayJsObj.date()}`}).then(({data})=>{
                console.log(data,'edited')
            })
          }}
          sx={{ mb: 1 }}
          label="تاريخ الانتهاء"
        />
      
    
  </LocalizationProvider>
  )
}

export default MyDateField