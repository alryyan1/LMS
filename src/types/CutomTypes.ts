import { Dispatch, SetStateAction } from "react";
import { Company, DoctorShift, DoctorVisit } from "./Patient";
import { Shift } from "./Shift";


 export  interface ShiftDetails {
  total : number;
  bank : number;
  expenses : number;
  cash : number;
  safi: number;
 }

 export interface ReceptionLayoutProps {
  openLabReport: boolean;
  message: string;
  color: "success" | "error";
  open: boolean;
  openError: boolean;
  showDoctorsDialog: boolean;
  showHistory: boolean;
  showMoneyDialog: boolean;
  showLabTests: boolean;
  showPatientServices: boolean;
  showServicePanel: boolean;
  showTestPanel: boolean;
  openEdit: boolean;
  actviePatient: DoctorShift | null;
  openedDoctors: DoctorShift[];
  activeShift: DoctorShift | null;
  serviceCategories: any[];
  selectedServices: any[];
  selectedTests: any[];
  packageData: any[];
  companies: Company[];
  user: any;
  setActivePatient: (visit:DoctorVisit)=>void; 
  setOpen: ()=>void;
  setDialog: ()=>void;
  setFoundedPatients: ()=>void;
  foundedPatients: DoctorVisit;
  setOpenedDoctors: (  opened:(opened:DoctorShift[])=>void )=>void;
  setActiveShift: (shift:(shift:DoctorShift)=>void)=>void;
  setOpenEdit: () => void;
  setShowPatientServices:  ()=>void;
}


export interface ResultProps {
  setPatients: (patients: any[]) => void;
  setShift: (shift:(sh:Shift)=>void) => void;
  setActivePatient: (patient: any) => void;
  setResultUpdated: (resultUpdated: number) => void;
  setLoading: (loading: boolean) => void;
  setSelectedTest: (test: any) => void;
  setSelectedResult: (result: any) => void;
  setPatientsLoading: (loading: boolean) => void;
  setIsConnected: (isConnected: boolean) => void;
  shift:Shift;
  actviePatient:DoctorVisit;
  selectedReslult:Requestedresult;
  
}