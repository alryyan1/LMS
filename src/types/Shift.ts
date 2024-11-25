import { DoctorShift, DoctorVisit, Patient, User } from "./Patient";


//////////////

export interface Shift {
  id: number;
  total: number;
  bank: number;
  expenses: number;
  touched: number;
  closed_at: string;
  is_closed: number;
  created_at: string;
  updated_at: string;
  maxShiftId: number;
  specialists: Specialist[];
  cost: Cost[];
  patients: DoctorVisit[];
  doctor_shifts: DoctorShift[];
}

// //////////////////
export interface Deduct {
  id: number;
  shift_id: number;
  user_id: number;
  payment_type_id: number;
  complete: number;
  total_amount_received: number;
  number: number;
  notes: null;
  is_sell: number;
  client_id: null;
  created_at: string;
  updated_at: string;
  is_postpaid: number;
  postpaid_complete: number;
  postpaid_date: null;
  discount: number;
  paid: number;
  total_price: number;
  profit: number;
  total_price_unpaid: number;
  total_paid: number;
  calculateTax: number;
  deducted_items: any[];
  payment_type: Paymenttype;
  user: User;
  client: null;
}



export interface Paymenttype {
  id: number;
  name: string;
  created_at: null;
  updated_at: null;
}

export interface Cost {
  id: number;
  shift_id: number;
  user_cost: number;
  doctor_shift_id: null;
  description: string;
  comment: null;
  amount: number;
  created_at: string;
  updated_at: string;
  cost_category_id: number;
  user: User;
  cost_category: Specialist;
}






export interface Specialist {
  id: number;
  name: string;
}


export interface Deno {
  id: number;
  name: string;
  pivot: Pivot;
}

interface Pivot {
  user_id: number;
  deno_id: number;
  amount: number;
}