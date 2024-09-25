import { Typography } from '@mui/material';
import React from 'react'
import { formatNumber } from '../constants';

function BottomMoney({actviePatient,activeShift,total_endurance}) {
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
            {(actviePatient.company_id == null
              ? actviePatient?.services
                  .filter((service) => {
                    return service.doctor_id == activeShift.doctor.id;
                  })
                  .reduce((accum, service) => {
                    // console.log(service.count,'service.count)')
                    const total = service.price * service.count;
                    const discount = Number(
                      (service.discount * total) / 100
                    );
                    return accum + (total - discount);
                  }, 0)
              : total_endurance) + actviePatient.patient.total_lab_value_unpaid}
          </Typography>
        </div>
        <div className="sub-price">
          <div className="title">Discount</div>
          <Typography variant="h3">
            {formatNumber( actviePatient.patient.discount + actviePatient.total_discounted + actviePatient.patient?.discountAmount)}
          </Typography>
        </div>
        <div className="sub-price">
          <div className="title">Paid</div>
          <Typography variant="h3">
            {formatNumber(actviePatient?.total_paid_services +  actviePatient.patient.paid - actviePatient.patient.discount)}
          </Typography>
        </div>
      </div>
    </div>
  </div>
  )
}

export default BottomMoney