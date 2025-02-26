import { useEffect, useRef, useState } from "react";
import axiosClient from "../../../axios-client";
import { getDoctorVisit, getDoctorVisitById, newImage, notifyMe } from "../constants";
import { socket } from "../../socket";
import { Shift } from "../../types/Shift";
import { ResultProps } from "../../types/CutomTypes";
import { DoctorVisit, Labrequest, RequestedResult } from "../../types/Patient";
import { useOutletContext } from "react-router-dom";

export default function useResult(): ResultProps {
  const audioRef = useRef();

  const [patientsLoading, setPatientsLoading] = useState(false);
  const [resultUpdated, setResultUpdated] = useState(0);
  const [shift, setShift] = useState<Shift | null>(null);
  const [patients, setPatients] = useState<DoctorVisit[]>([]);
  const [selectedTest, setSelectedTest] = useState<Labrequest | null>(null);
  const [selectedReslult, setSelectedResult] = useState<RequestedResult | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [actviePatient, setActivePatient] = useState<DoctorVisit | null>(null);
  const [isConnected, setIsConnected] = useState(socket.connected);

  function onConnect() {
    setIsConnected(true);
    console.log("connected succfully");
  }

  function onDisconnect() {
    setIsConnected(false);
  }
  useEffect(() => {
    //  const socket =  io('ws://localhost:3000')

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });
    socket.on("connect", (args) => {
      console.log("doctor connected succfully with id" + socket.id, args);
    });

    socket.on("labrRquestConfirmFromServer", (pid) => {
      console.log("labrRquestConfirmFromServer " + pid);
      notifyMe(`New Lab Request '`, null, newImage, null);
      patientsUpdateSocketHandler(pid);
    });
    socket.on("labPaymentFromServer", (pid) => {
      console.log("newEvent from Server");
      patientsUpdateSocketHandler(pid);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("labrRquestConfirmFromServer");
      socket.off("labPaymentFromServer");
    };
  }, []);
  const update = (actviePatient: DoctorVisit) => {
    setPatients((prev) => {
      if (actviePatient.patient.shift_id == shift?.id) {
        //هنا اذا كان البشين في نفس الورديه بنضاف عن طريق socket
        //المشكله كانت لما كان يعمل سيرش لبيشن قديم كان بنضاف في الورديه الاسي
        if (!prev.find((p) => p.id == actviePatient.id))
          return [actviePatient, ...prev];
      }
      return prev.map((p) => {
        if (p.id === actviePatient?.id) {
          return { ...actviePatient };
        }
        return p;
      });
    });
  };
  useEffect(() => {
    if (actviePatient) {
      // setShift((prev) => {
      //   return {
      //     ...prev,
      //     patients: prev.patients.map((p) => {
      //       if (p.id === actviePatient?.id) {
      //         return { ...actviePatient };
      //       }
      //       return p;
      //     }),
      //   };
      // });

      update(actviePatient);
    }
  }, [actviePatient]);
  const [layOut, setLayout] = useState({
    form: "1fr",
    tests: "1fr",
    testWidth: "400px",
    requestedDiv: "minmax(0,1.5fr)",
    showTestPanel: false,
    patientDetails: "0.8fr",
  });
  const [showSearch, setShowSearch] = useState(false);

  const SearchHandler = (e) => {
    console.log(e.key);
    if (e.key == "F9") {
      setShowSearch(true);
    }
  };
  useEffect(() => {
    document.title = "تنزيل النتائج";
    document.addEventListener("keydown", SearchHandler);

    return () => {
      document.removeEventListener("keydown", SearchHandler);
    };
  }, []);

  useEffect(() => {
    setPatientsLoading(true);
    axiosClient.get(`shiftWith?with=patients`).then(({ data: data }) => {
      setShift(data);
      setPatients(data.patients);
      setPatientsLoading(false);
    });
  }, []);
  useEffect(() => {
    // alert(value)

    //update latest patients for doctor
    const controller = new AbortController();
    if (actviePatient) {
      getDoctorVisitById(actviePatient?.id,controller).then((data)=>{
        console.log(data,'dd')
        setActivePatient(data)
      })
    }

    return () => controller.abort(); // Clean up the abort controller when component unmounts.
  }, [actviePatient?.id]);
  const setActivePatientHandler = (pat) => {
    setSelectedResult(null);
    setActivePatient({ ...pat });
    setSelectedTest(pat.patient.labrequests[0]);
  };

  const patientsUpdateSocketHandler = (doctorVisit) => {
    console.log(doctorVisit, "doctorVisit from socket handler");
    //  setActivePatient(doctorVisit,false)
    update(doctorVisit);
  };

  return {
    shift,
    layOut,
    setActivePatientHandler,
    audioRef,
    loading,
    patientsLoading,
    selectedTest,
    resultUpdated,
    isConnected,
    setShift,
    setLoading,
    setResultUpdated,
    setSelectedTest,
    actviePatient,
    selectedReslult,
    setActivePatient,
    setSelectedResult,
    patients,
    setPatients,

    showSearch,
  };
}
