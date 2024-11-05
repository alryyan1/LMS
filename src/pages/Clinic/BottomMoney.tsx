import { Typography } from '@mui/material';
import React from 'react'
import { formatNumber } from '../constants';
import { DoctorShift, DoctorVisit } from '../../types/Patient';

interface BottomMoneyProbs {
  actviePatient: DoctorVisit;
  activeShift: DoctorShift;
  total_endurance: number
}
function BottomMoney({actviePatient,activeShift,total_endurance}:BottomMoneyProbs) {
  return (
    <div className="requested-total">
    <div className="money-info">
      <div
        className="total-price"
        style={{ width: "100%", justifyContent: "space-around" }}
      >
        <div className="sub-price">
          <div className="title">Total</div>

          <Typography variant="h3">
            {actviePatient.total_services}
          </Typography>
        </div>
        <div className="sub-price">
          <div className="title">Discount</div>
          <Typography variant="h3">
            {formatNumber( actviePatient.total_discounted )}
          </Typography>
        </div>
        <div className="sub-price">
          <div className="title">Paid</div>
          <Typography variant="h3">
            {formatNumber(actviePatient?.total_paid_services )}
          </Typography>
        </div>
      </div>
    </div>
  </div>
  )
}

export default BottomMoney