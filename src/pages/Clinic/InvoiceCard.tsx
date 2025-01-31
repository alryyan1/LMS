import React, { useState } from 'react';
import { Calculator, DollarSign, CreditCard, Wallet } from 'lucide-react';
import { formatNumber } from '../constants';

function InvoiceCard({actviePatient}) {
  const [total, setTotal] = useState<number>(2500);
  const [paid, setPaid] = useState<number>(1500);
  const remaining = total - paid;

  return (
    <div className="  flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-small overflow-hidden">
        {/* Header */}
        {/* <div className="bg-indigo-600 p-6 text-white">
      
        </div> */}

        {/* Content */}
        <div className="p-1">
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Card */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-600 font-medium">Total Amount</h2>
                <Calculator className="text-indigo-600 w-5 h-5" />
              </div>
              <div className="flex items-center">
                <DollarSign className="w-6 h-6 text-gray-400 mr-1" />
                <span className="text-2xl font-bold text-gray-800">
                  {formatNumber(actviePatient.total_services)}
                </span>
              </div>
            </div>

            {/* Paid Card */}
            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-600 font-medium">Paid Amount</h2>
                <CreditCard className="text-green-600 w-5 h-5" />
              </div>
              <div className="flex items-center">
                <DollarSign className="w-6 h-6 text-gray-400 mr-1" />
                <span className="text-2xl font-bold text-gray-800">
                    {formatNumber(actviePatient?.total_paid_services)}
                </span>
              </div>
            </div>

            {/* Remaining Card */}
            <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-600 font-medium">Remaining</h2>
                <Wallet className="text-orange-600 w-5 h-5" />
              </div>
              <div className="flex items-center">
                <DollarSign className="w-6 h-6 text-gray-400 mr-1" />
                <span className="text-2xl font-bold text-gray-800">
                  {formatNumber(actviePatient.totalRemainig) }
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Payment Progress</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round(( actviePatient?.total_paid_services/actviePatient.total_services ) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${( actviePatient?.total_paid_services / actviePatient.total_services) * 100}%` }}
              ></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default InvoiceCard;