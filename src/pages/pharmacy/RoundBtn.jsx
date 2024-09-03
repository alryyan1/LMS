import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import axiosClient from '../../../axios-client';

export default function RoundBtn({val,activeSell,setActiveSell,setShift}) {
  return (
    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">طريقه الدفع</FormLabel>
      <RadioGroup
       onChange={(e)=>{
        axiosClient
                            .patch(`deduct/${activeSell.id}`, {
                              colName: "payment_method",
                              val: e.target.value,
                            })
                            .then(({ data }) => {
                              setActiveSell(data.data);
                              setShift(data.shift)
                            });
       }}
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue={val}
        name="radio-buttons-group"
      >
        <FormControlLabel value="on_receive" control={<Radio />} label="الدفع عند الاستلام" />
        <FormControlLabel value="postpaid" control={<Radio />} label="آجل" />
        <FormControlLabel value="postpaid" control={<Radio />} label="" />
      </RadioGroup>
    </FormControl>
  );
}