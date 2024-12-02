import { User } from "./Patient";
import { Deduct } from "./Shift";

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
    lastDepositItem: DepositItem;
    section: null;
    category: null;
    type: null;
    deposit_item: DepositItem;
  }
  
  
  

export interface DepositItem {
  id: number;
  item_id: number;
  deposit_id: number;
  quantity: number;
  cost: number;
  batch: null;
  expire: string;
  notes: null;
  barcode: null;
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
  item: DrugItem
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


export interface Supplier {
  id: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  created_at: string;
  updated_at: string;
}
export interface PharmacyLayoutPros {
  depositItems:DepositItem[];
  setDepositItems:(depositItem:DepositItem[])=>void
  depositItemsSearch:string;
  setDepositItemsSearch:(search:string)=>void;
  depositItemsLinks : string[];
  setDepositItemsLinks: (data:string[])=>void;
  setDeduct:()=>void;
  activeSell:Deduct;
}







