export interface Paginate {
  current_page: number;
  data: DrugItem[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: null;
  to: number;
  total: number;
}

export interface Link {
  url: null | string;
  label: string;
  active: boolean;
}

export interface DrugItem {
  id: number;
  section_id: null;
  name: string;
  require_amount: number;
  initial_balance: number;
  initial_price: number;
  tests: number;
  expire: string;
  cost_price: number;
  sell_price: number;
  tax: number;
  drug_category_id: null;
  pharmacy_type_id: null;
  barcode: string;
  strips: number;
  sc_name: string;
  market_name: string;
  batch: string;
  created_at: string;
  updated_at: string;
  unit: string;
  active1: string;
  active2: string;
  active3: string;
  pack_size: string;
  approved_rp: number;
  totaldeposit: number;
  totaldeduct: null;
  remaining: number;
  lastDepositItem: Deposititem;
  section: null;
  category: null;
  type: null;
  deposit_item: Deposititem;
}

export interface Deposititem {
  id: number;
  item_id: number;
  deposit_id: number;
  quantity: number;
  cost: number;
  batch: null | string;
  expire: string;
  notes: null | string;
  barcode: null | string;
  return: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  sell_price: number;
  vat_cost: number;
  vat_sell: number;
  free_quantity: number;
  finalSellPrice: number;
  finalCostPrice: number;
  deposit: Deposit;
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
  supplier: Supplier;
  user: User;
}

export interface User {
  id: number;
  username: string;
  created_at: string;
  updated_at: string;
  doctor_id: null;
  is_nurse: number;
  roles: Role[];
  routes: Route2[];
  sub_routes: Subroute2[];
  doctor: null;
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: Pivot;
}

export interface Pivot {
  model_type: string;
  model_id: number;
  role_id: number;
}

export interface Supplier {
  id: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  created_at: string;
  updated_at: string;
}
