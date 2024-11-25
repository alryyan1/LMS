export interface DoctorShift {
  id: number
  user_id: number
  shift_id: number
  doctor_id: number
  status: number
  created_at: string
  updated_at: string
  visits: DoctorVisit[]
  cost: any
  doctor: Doctor
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
  file:PatientFile;


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
    doctor: any
  }

  
  
  export interface Route {
    id: number
    name: string
    path: string
    created_at: string
    updated_at: string
    sub_routes: SubRoute[]
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
    id: number
    doctor_visit_id: number
    service_id: number
    user_id: number
    user_deposited: number
    doctor_id: number
    price: number
    amount_paid: number
    endurance: number
    is_paid: number
    discount: number
    bank: number
    count: number
    created_at: string
    updated_at: string
    doctor_note: string
    nurse_note: string
    done: number
    service: Service
  }
  

  
 
  export interface Doctor {
    id: number
    name: string
    phone: string
    cash_percentage: number
    company_percentage: number
    static_wage: number
    lab_percentage: number
    specialist_id: number
    created_at: string
    updated_at: string
    lastShift: LastShift
    services: DoctorService[]
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