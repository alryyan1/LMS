import { useEffect, useRef, useState } from "react";
import axiosClient from "../../../axios-client";
import { newImage, notifyMe } from "../constants";
import { socket } from "../../socket";
import { Shift } from "../../types/Shift";
import { ResultProps } from "../../types/CutomTypes";

export default function useResult():ResultProps {
  const audioRef = useRef();

  //   const updateHandler = (val, colName) => {
  //     setLoading(true)
  //     axiosClient
  //       .patch(`patients/${actviePatient.id}`, {
  //         [colName]: val,
  //       })
  //       .then(({ data }) => {

  //         if (data.status) {
  //           setActivePatient(data.patient);
  //           setShift((prev)=>{
  //             return {...prev, patients:prev.patients.map((p)=>{
  //               if(p.id === data.patient.id){
  //                 return {...data.patient, active:true}
  //               }
  //               return p;
  //             }) };
  //           })
  //           setDialog((prev) => {
  //             return {
  //               ...prev,
  //               message: "Saved",
  //               open: true,
  //               color: "success",
  //             };
  //           });
  //         }
  //       })
  //       .catch(({ response: { data } }) => {

  //         setDialog((prev) => {
  //           return {
  //             ...prev,
  //             message: data.message,
  //             open: true,
  //             color: "error",
  //           };
  //         });
  //       }).finally(()=>setLoading(false));
  //   };

  
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [resultUpdated, setResultUpdated] = useState(0);
  const [shift, setShift] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedReslult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [actviePatient, setActivePatient] = useState(null);
  function onConnect() {
    setIsConnected(true);
    console.log("connected succfully");
  }

  function onDisconnect() {
    setIsConnected(false);
  }

  const [layOut, setLayout] = useState({
    form: "1fr",
    tests: "1fr",
    testWidth: "400px",
    requestedDiv: "minmax(0,1.5fr)",
    showTestPanel: false,
    patientDetails: "0.8fr",
  });

  useEffect(() => {
    document.title = "تنزيل النتائج";
  }, []);
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
  useEffect(() => {
    setPatientsLoading(true);
    axiosClient.get(`shiftWith?with=patients`).then(({ data: data }) => {
      setShift(data);
      setPatientsLoading(false);
    });
  }, []);

  const setActivePatientHandler = (pat) => {
    setSelectedResult(null);
    // if (pat.shift_id == shift.maxShiftId) {
    //   axiosClient.get(`shift/last`).then(({ data: data }) => {
    //     setShift(data.data);
    //     setPatientsLoading(false);
    //   });
    // }
    setActivePatient({ ...pat });
    setSelectedTest(pat.patient.labrequests[0]);
  };

  const patientsUpdateSocketHandler = (pid) => {
    axiosClient.get(`findPatient/${pid}`).then(({ data }) => {
      //patient is already exists and selected
      console.log(data, "founded patient");
      console.log(actviePatient, "active patient");
      if (actviePatient?.id == data.id) {
        console.log("patient is currently focus ");
        setActivePatient(data);
      }

      //if patietn exist replace
      setShift((prev) => {
        if (prev.patients.map((p) => p.id).includes(pid)) {
          return {
            ...prev,
            patients: prev.patients.map((p) => {
              if (p.id === data.id) {
                return { ...data };
              }
              return p;
            }),
          };

          //else add patient
        } else {
          return {
            ...prev,
            patients: [...prev.patients, { ...data }],
          };
        }
      });
    });
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
    selectedReslult,setActivePatient ,
    setSelectedResult
  };
}
