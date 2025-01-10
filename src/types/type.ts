import { Patient, User } from "./Patient";
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
  user_deposited: User;
  approve: number;
  endurance: number;
  name: string;
  requested_results: Requestedresult[];
  main_test: Maintest;
  unfinished_results_count: Requestedresult[];
  requested_organisms: any[];
  is_paid: boolean;
}

interface Servicegroup {
  id: number;
  name: string;
  services: Service[];
}

export interface Service {
  id: number;
  name: string;
  service_group_id: number;
  price: number;
  activate: number;
  created_at: string;
  updated_at: string;
  service_costs: Servicecost[];
  service_group: Servicegroup;

}

interface Servicecost {
  id: number;
  name: string;
  service_id: number;
  percentage: number;
  fixed: number;
  cost_type: string;
  cost_orders: Costorder[];
}

interface Costorder {
  id: number;
  requested_service_id: number;
  service_cost_id: number;
  service_cost_item: number;
  created_at: string;
  updated_at: string;
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