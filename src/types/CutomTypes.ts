import { DoctorShift } from "./Patient";

export   interface OutletContextType {
    openedDoctors : DoctorShift[];
    activeShift: DoctorShift|null
  }