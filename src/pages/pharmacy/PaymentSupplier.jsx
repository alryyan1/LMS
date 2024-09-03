import React from 'react'
import { useForm } from 'react-hook-form'

function PaymentSupplier() {
   const {register,handleSubmit,formState:{errors}} = useForm()
  return (
    <div>
        <form onSubmit={handleSubmit}>
            
        </form>
    </div>
  )
}

export default PaymentSupplier