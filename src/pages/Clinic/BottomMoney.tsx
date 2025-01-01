import { Typography } from '@mui/material';
import React from 'react'
import { formatNumber } from '../constants';
import { DoctorShift, DoctorVisit } from '../../types/Patient';
import { useTranslation } from 'react-i18next';

interface BottomMoneyProps {
    actviePatient: DoctorVisit;
    activeShift: DoctorShift;
    total_endurance: number
}

function BottomMoney({ actviePatient, activeShift, total_endurance }: BottomMoneyProps) {
   const {t} = useTranslation('serviceSumBottom')
    return (
        <div  className="requested-total">
            <div className="money-info">
                <div
                    className="total-price"
                    style={{ width: "100%", justifyContent: "space-around" }}
                >
                    <div className="sub-price">
                        <div className="title">{t("total")}</div>

                        <Typography variant="h5">
                            {formatNumber(actviePatient.total_services)}
                        </Typography>
                    </div>
                    <div className="sub-price">
                        <div className="title">{t("discount")}</div>
                        <Typography variant="h5">
                            {formatNumber(actviePatient.total_discounted)}
                        </Typography>
                    </div>
                    <div className="sub-price">
                        <div className="title">{t("paid")}</div>
                        <Typography variant="h5">
                            {formatNumber(actviePatient?.total_paid_services)}
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BottomMoney;