import { Deduct } from "./Shift";

interface RootObject {
  id: number;
  patient_id: number;
  doctor_shift_id: number;
  created_at: string;
  updated_at: string;
  is_new: number;
  number: number;
  only_lab: number;
  shift_id: number;
  total_paid_services: number;
  total_services: number;
  total_discounted: number;
  patient: Patient;
  services: any[];
}

interface Patient {
  id: number;
  name: string;
  shift_id: number;
  user_id: number;
  doctor_id: number;
  phone: string;
  gender: string;
  age_day: null;
  age_month: null;
  age_year: number;
  company_id: null;
  subcompany_id: null;
  company_relation_id: null;
  paper_fees: null;
  guarantor: null;
  expire_date: null;
  insurance_no: null;
  is_lab_paid: number;
  lab_paid: number;
  result_is_locked: number;
  sample_collected: number;
  sample_collect_time: null;
  result_print_date: null;
  sample_print_date: null;
  visit_number: number;
  result_auth: number;
  auth_date: string;
  created_at: string;
  updated_at: string;
  present_complains: string;
  history_of_present_illness: string;
  procedures: string;
  provisional_diagnosis: string;
  bp: string;
  temp: number;
  weight: number;
  height: number;
  juandice: null;
  pallor: null;
  clubbing: null;
  cyanosis: null;
  edema_feet: null;
  dehydration: null;
  lymphadenopathy: null;
  peripheral_pulses: null;
  feet_ulcer: null;
  country_id: null;
  gov_id: null;
  prescription_notes: null;
  address: null;
  heart_rate: null;
  spo2: null;
  discount: number;
  drug_history: string;
  family_history: string;
  rbs: string;
  doctor_finish: number;
  care_plan: string;
  doctor_lab_request_confirm: number;
  doctor_lab_urgent_confirm: number;
  paid: number;
  hasCbc: boolean;
  visit_count: number;
  total_lab_value_unpaid: number;
  total_lab_value_will_pay: number;
  discountAmount: number;
  labrequests: Labrequest[];
  doctor: Doctor;
  company: null;
  subcompany: null;
  relation: null;
  user: Userrequested;
  prescriptions: any[];
  file_patient: Filepatient;
  country: null;
  sickleave: null;
}

interface Filepatient {
  id: number;
  file_id: number;
  patient_id: number;
}
export interface Client {
  id: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  created_at: string;
  updated_at: string;
  payments:ClientPayment[]
  paymentAmount:number;
  deducts:Deduct[]
}
export interface ClientPayment {
  id: number;
  amount: string;
  client_id: number;
  created_at: string;
  updated_at: string;
  payment_date: string;
}
interface Labrequest {
  id: number;
  main_test_id: number;
  pid: number;
  hidden: number;
  is_lab2lab: number;
  valid: number;
  no_sample: number;
  price: number;
  amount_paid: number;
  discount_per: number;
  is_bankak: number;
  comment: null;
  user_requested: Userrequested;
  user_deposited: null;
  approve: number;
  endurance: number;
  name: string;
  requested_results: Requestedresult[];
  main_test: Maintest;
  unfinished_results_count: Requestedresult[];
  requested_organisms: any[];
}

interface Maintest {
  id: number;
  main_test_name: string;
  pack_id: number;
  pageBreak: number;
  container_id: number;
  price: number;
  firstChildId: number;
  container: Container;
  one_child: Onechild;
}

interface Onechild {
  id: number;
  child_test_name: string;
  low: number;
  upper: number;
  main_test_id: number;
  defval: string;
  unit_id: number;
  normalRange: string;
  max: string;
  lowest: string;
  test_order: null;
  child_group_id: null;
  unit: Unit;
  child_group: null;
}

interface Container {
  id: number;
  container_name: string;
}

interface Requestedresult {
  id: number;
  lab_request_id: number;
  patient_id: number;
  main_test_id: number;
  child_test_id: number;
  result: string;
  normal_range: string;
  created_at: string;
  updated_at: string;
  child_test: Childtest;
}

interface Childtest {
  id: number;
  child_test_name: string;
  low: null | number;
  upper: null | number;
  main_test_id: number;
  defval: string;
  unit_id: number;
  normalRange: string;
  max: string;
  lowest: string;
  test_order: null;
  child_group_id: null;
  unit: Unit;
  child_group: null;
}

interface Unit {
  id: number;
  name: string;
}

interface Userrequested {
  id: number;
  username: string;
  created_at: string;
  updated_at: string;
  doctor_id: number;
  is_nurse: number;
  roles: Role[];
  routes: Route2[];
  sub_routes: Subroute2[];
  doctor: Doctor;
}

interface Doctor {
  id: number;
  name: string;
  phone: string;
  cash_percentage: number;
  company_percentage: number;
  static_wage: number;
  lab_percentage: number;
  specialist_id: number;
  created_at: string;
  updated_at: string;
  lastShift: LastShift;
  services: any[];
}

interface LastShift {
  id: number;
  user_id: number;
  shift_id: number;
  doctor_id: number;
  status: number;
  created_at: string;
  updated_at: string;
}

interface Subroute2 {
  id: number;
  sub_route_id: number;
  user_id: number;
  sub_route: Subroute;
}

interface Route2 {
  id: number;
  user_id: number;
  route_id: number;
  created_at: null;
  updated_at: null;
  route: Route;
}

interface Route {
  id: number;
  name: string;
  path: string;
  created_at: null | string;
  updated_at: null | string;
  sub_routes: Subroute[];
}

interface Subroute {
  id: number;
  route_id: number;
  name: string;
  path: string;
}

interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: Pivot;
}

interface Pivot {
  model_type: string;
  model_id: number;
  role_id: number;
}