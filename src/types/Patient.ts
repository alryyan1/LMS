export interface DoctorShift {
  id: number
  user_id: number
  shift_id: number
  doctor_id: number
  status: number
  created_at: string
  updated_at: string
  visits: DoctorVisit[]|null
  cost: any
  doctor: Doctor
}
export interface RequestedToothService {
  id: number;
  requested_service_id: number;
  tooth_id: number;
  doctorvisit_id: number;
}
export interface DoctorVisit {
  id: number
  hasCbc:boolean;
  patient_id: number
  doctor_shift_id: number
  created_at: string
  updated_at: string
  is_new: number
  number: number
  total_paid_services: number
  total_services: number
  total_discounted: number
  patient: Patient
  services: RequestedService[]
  only_lab:number;
  file:PatientFile|null;
  totalservicebank:number;
  doctor_shift:DoctorShift;
  totalRemainig: number;
  requested_tooth_services:RequestedToothService[]


}
export interface PatientFile {
  id: number
  patients:DoctorVisit[]
}
export interface Patient {
    id: number
    name: string
    shift_id: number
    user_id: number
    doctor_id: number
    phone: string
    gender: string
    age_day: any
    age_month: any
    age_year: number
    company_id: any
    subcompany_id: any
    company_relation_id: any
    paper_fees: any
    guarantor: any
    expire_date: any
    insurance_no: any
    is_lab_paid: number
    lab_paid: number
    result_is_locked: number
    sample_collected: number
    sample_collect_time: string
    result_print_date: string
    sample_print_date: any
    visit_number: number
    result_auth: number
    auth_date: string
    created_at: string
    updated_at: string
    present_complains: string
    history_of_present_illness: string
    procedures: string
    provisional_diagnosis: string
    bp: string
    temp: number
    weight: number
    height: number
    juandice: any
    pallor: any
    clubbing: any
    cyanosis: any
    edema_feet: any
    dehydration: any
    lymphadenopathy: any
    peripheral_pulses: any
    feet_ulcer: any
    country_id: any
    gov_id: any
    prescription_notes: any
    address: any
    heart_rate: any
    spo2: any
    discount: number
    drug_history: string
    family_history: string
    rbs: string
    doctor_finish: number
    care_plan: string
    doctor_lab_request_confirm: number
    doctor_lab_urgent_confirm: number
    paid: number
    hasCbc: boolean
    visit_count: number
    total_lab_value_unpaid: number
    total_lab_value_will_pay: number
    discountAmount: number
    labrequests: Labrequest[]
    doctor: Doctor
    company: any
    subcompany: any
    relation: any
    user: User
    prescriptions: any[]
    file_patient: FilePatient
    country: any
    sickleave: any
    general_examination_notes:string;
    past_medical_history:string;
    social_history:string;
    allergies:string;
    general:string;
    skin:string;
    head:string;
    eyes:string;
    ear:string;
    nose:string;
    mouth:string;
    throat:string;
    neck:string;
    respiratory_system:string;
    cardio_system:string;
    git_system:string;
    genitourinary_system:string;
    nervous_system:string;
    musculoskeletal_system:string;
    neuropsychiatric_system:string;
    endocrine_system:string;
    peripheral_vascular_system:string;
    referred:string
    nurse_note:string;
    patient_medical_history:string;
    totalLabBank:number;
    lastShift:number;
  }
  
  export interface Labrequest {
    id: number
    main_test_id: number
    pid: number
    hidden: number
    is_lab2lab: number
    valid: number
    no_sample: number
    price: number
    amount_paid: number
    discount_per: number
    is_bankak: number
    comment: any
    user_requested: User
    user_deposited: number
    approve: number
    endurance: number
    name: string
    requested_results: RequestedResult[]
    main_test: MainTest
    unfinished_results_count: any[]
    requested_organisms: any[]
    created_at : string;
    updated_at : string;
    is_paid:boolean;
  }
  
  
  export interface Role {
    id: number
    name: string
    guard_name: string
    created_at: string
    updated_at: string
    pivot: Pivot
  }
  
  export interface Pivot {
    model_type: string
    model_id: number
    role_id: number
  }
  

  
  export interface RequestedResult {
    id: number
    lab_request_id: number
    patient_id: number
    main_test_id: number
    child_test_id: number
    result: string
    normal_range: string
    created_at: string
    updated_at: string
    child_test: ChildTest
  }
  
  export interface ChildTest {
    id: number
    child_test_name: string
    low?: number
    upper?: number
    main_test_id: number
    defval: string
    unit_id: number
    normalRange: string
    max: string
    lowest: string
    test_order: any
    child_group_id?: number
    unit: Unit
    child_group?: ChildGroup
  }
  
  export interface Unit {
    id: number
    name: string
  }
  
  export interface ChildGroup {
    id: number
    name: string
  }
  
  export interface MainTest {
    id: number
    main_test_name: string
    pack_id: number
    pageBreak: number
    container_id: number
    price: number
    firstChildId: number
    container: Container
    one_child: OneChild
  }
  
  export interface Container {
    id: number
    container_name: string
  }
  
  export interface OneChild {
    id: number
    child_test_name: string
    low: number
    upper: number
    main_test_id: number
    defval: string
    unit_id: number
    normalRange: string
    max: string
    lowest: string
    test_order: any
    child_group_id?: number
    unit: Unit
    child_group?: ChildGroup
  }
  

  
  export interface LastShift {
    id: number
    user_id: number
    shift_id: number
    doctor_id: number
    status: number
    created_at: string
    updated_at: string
  }
  
  export interface DoctorService {
    id: number
    doctor_id: number
    service_id: number
    percentage: number
    fixed: number
    service: Service
  }
  
  export interface Service {
    id: number
    name: string
    service_group_id: number
    price: number
    activate: number
    created_at: string
    updated_at: string
    service_costs: any[]
    variable:boolean;
  }
  
  export interface User {
    id: number
    username: string
    created_at: string
    updated_at: string
    doctor_id: any
    is_nurse: number
    roles: Role[]
    routes: Route[]
    sub_routes: SubRoute[]
    doctor: any;
    isAccountant:boolean
    isAdmin:boolean;
    canPayLab:boolean;
    editResults:boolean;
  }

  
  

  
  
  
  export interface SubRoute {
    id: number
    sub_route_id: number
    user_id: number
    sub_route: string
  }

  
  export interface FilePatient {
    id: number
    file_id: number
    patient_id: number
  }
  export interface RequestedService {
  id: number;
  doctorvisits_id: number;
  service_id: number;
  user_id: number;
  user_deposited: null;
  doctor_id: number;
  price: number;
  amount_paid: number;
  endurance: number;
  is_paid: number;
  discount: number;
  bank: number;
  count: number;
  created_at: string;
  updated_at: string;
  doctor_note: string;
  nurse_note: string;
  done: number;
  approval: number;
  service: Service;
  user_requested: User;
  requested_service_costs: any[];
  deposits: Deposit[];
}

export interface Deposit {
  id: number;
  supplier_id: number;
  bill_number: string;
  bill_date: string;
  complete: number;
  paid: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  payment_method: string;
  discount: number;
  vat_sell: number;
  vat_cost: number;
  is_locked: number;
  showAll: number;
  total_price: number;
  total_cost: number;
  supplier: Supplier;
  user: User;
  
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
  created_at: string;
  updated_at: string;
  icon: string;
  is_multi: number;
  sub_routes: Subroute[];
}

interface Subroute {
  id: number;
  route_id: number;
  name: string;
  path: string;
  icon: string;
}



interface Supplier {
  id: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  created_at: string;
  updated_at: string;
}




interface Doctorsubservicecost {
  id: number;
  doctor_id: number;
  sub_service_cost_id: number;
}

interface Specialist {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}



interface Route {
  id: number;
  name: string;
  path: string;
  created_at: null | string;
  updated_at: null | string;
  icon: string;
  is_multi: number;
  sub_routes: Subroute[];
}

interface Subroute {
  id: number;
  route_id: number;
  name: string;
  path: string;
  icon: string;
}



interface Servicecost {
  id: number;
  name: string;
  service_id: number;
  percentage: number;
  fixed: number;
  cost_type: string;
  sub_service_cost_id: number;
  cost_orders: any[];
  sub_service_cost: Subservicecost;
}

interface Subservicecost {
  id: number;
  name: string;
}



interface Requestedservicecost {
  id: number;
  requested_service_id: number;
  sub_service_cost_id: number;
  amount: number;
  created_at: string;
  updated_at: string;
  service_cost_id: number;
  service_cost: Servicecost;
}



interface Servicecost {
  id: number;
  sub_service_cost_id: number;
  service_id: number;
  percentage: number;
  fixed: number;
  cost_type: string;
  cost_orders: any[];
  sub_service_cost: Subservicecost;
}

interface Subservicecost {
  id: number;
  name: string;
}

interface Userdeposited {
  id: number;
  username: string;
  created_at: string;
  updated_at: string;
  doctor_id: null;
  is_nurse: number;
  name: string;
  isAdmin: boolean;
  isAccountant: boolean;
  canPayLab: boolean;
  roles: Role[];
  routes: Route2[];
  sub_routes: Subroute2[];
  doctor: null;
  permissions: any[];
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
  created_at: string;
  updated_at: string;
  icon: string;
  is_multi: number;
  sub_routes: Subroute[];
}

interface Subroute {
  id: number;
  route_id: number;
  name: string;
  path: string;
  icon: string;
}



interface Subroute {
  id: number;
  route_id: number;
  name: string;
  path: string;
  icon: string;
}


  
 
  export interface Doctor {
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
  services: Service[];
  specialist: Specialist;
  calc_insurance: number;
}

interface Specialist {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}






  export interface LastShift {
    id: number
    user_id: number
    shift_id: number
    doctor_id: number
    status: number
    created_at: string
    updated_at: string
  }
  
  export interface DoctorService {
    id: number
    doctor_id: number
    service_id: number
    percentage: number
    fixed: number
    service: Service
  }
  

  interface Company {
  id: number;
  name: string;
  lab_endurance: number;
  service_endurance: number;
  status: number;
  lab_roof: number;
  service_roof: number;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
  relations: Relation[];
  sub_companies: Relation[];
  tests: Test[];
  services: Service[];
}



interface Test {
  id: number;
  main_test_name: string;
  pack_id: number;
  pageBreak: number;
  container_id: number;
  price: null | number;
  firstChildId: number;
  pivot: Pivot;
  container: Container;
}



interface Relation {
  id: number;
  name: string;
  lab_endurance: number;
  service_endurance: number;
  company_id: number;
  created_at: string;
  updated_at: string;
}