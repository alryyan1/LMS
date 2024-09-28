import { Button, Divider, IconButton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Item } from "../constants";
import {
  Download,
  ElectricBolt,
  FilterTiltShift,
  FormatListBulleted,
  Lock,
  LockOpen,
  Notifications,
  Panorama,
  PanoramaHorizontal,
  StarBorder,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import axiosClient from "../../../axios-client";
import CableIcon from "@mui/icons-material/Cable";
import { socket } from "../../socket";
function ResultSidebar({
  actviePatient,
  loading,
  setLoading,
  setSelectedTest,
  setActivePatient,
  selectedTest,
  setResultUpdated,
  setDialog,
  setShift,
}) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  function onConnect() {
    setIsConnected(true);
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
      console.log("lab connected succfully with id" + socket.id, args);
    });

    socket.on("newLabPatientFromServer", (pid) => {
      console.log('newEvent from Server')
      axiosClient.get(`findPatient/${pid}`).then(({ data }) => {
         console.log(actviePatient,'active patient')
        if (actviePatient?.id == pid) {
          console.log(data,'from find')
          setActivePatient(data);
          
        }
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

         
          }else{
            return {
             ...prev,
              patients: [...prev.patients, {...data }],
            };
          }
        });
      });
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("authenticatedResult");
    };
  }, []);
  return (
    <Stack
      sx={{ mr: 1 }}
      gap={"5px"}
      divider={<Divider orientation="vertical" flexItem />}
      direction={"column"}
    >
      <Divider />
      <LoadingButton
        sx={{ mt: 1 }}
        color="inherit"
        title="show patient list"
        size="small"
        onClick={() => {
          isConnected ? socket.disconnect() : socket.connect();
        }}
        variant="contained"
      >
        <Notifications color={isConnected ? "success" : "error"} />
      </LoadingButton>
      {actviePatient && (
        <Item>
          <IconButton
            size="small"
            title="add organism"
            onClick={() => {
              const result = confirm("add organism to result ? ");
              if (result) {
                axiosClient
                  .post(`addOrganism/${selectedTest.id}`)
                  .then(({ data }) => {
                    setActivePatient(data.patient);
                    setShift((prev) => {
                      return {
                        ...prev,
                        patients: prev.patients.map((p) => {
                          if (p.id === data.patient.id) {
                            return { ...data.patient, active: true };
                          }
                          return p;
                        }),
                      };
                    });
                  });
              }
            }}
            variant="contained"
          >
            <FilterTiltShift />
          </IconButton>
        </Item>
      )}

      <IconButton
        target="_blank"
        href="http://127.0.0.1/server/classes/server.php"
        title="LIS"
        color="inherit"
      >
        <CableIcon />
      </IconButton>

      {actviePatient && (
        <LoadingButton
          color="inherit"
          size="small"
          loading={loading}
          onClick={() => {
            setLoading(true);
            axiosClient
              .get(`printLock/${actviePatient.id}`)
              .then(({ data }) => {
                console.log(data, "labrequest data");
                setSelectedTest((prev) => {
                  console.log(prev, "previous selected test");
                  return data.patient.labrequests.find(
                    (labr) => labr.id == prev.id
                  );
                });
                setShift((prev) => {
                  return {
                    ...prev,
                    patients: prev.patients.map((p) => {
                      if (p.id === data.patient.id) {
                        return { ...data.patient, active: true };
                      }
                      return p;
                    }),
                  };
                });
                setActivePatient(data.patient)?.map((prev) => {
                  return prev.map((patient) => {
                    if (patient.id === actviePatient.id) {
                      return {
                        ...data.patient,
                        active: true,
                      };
                    }
                    return patient;
                  });
                });
              })
              .finally(() => setLoading(false));
          }}
          variant="contained"
        >
          {actviePatient.result_is_locked ? (
            <Lock color="error" />
          ) : (
            <LockOpen />
          )}
        </LoadingButton>
      )}

      {selectedTest && (
        <LoadingButton
          color="inherit"
          size="small"
          loading={loading}
          onClick={() => {
            setLoading(true);
            axiosClient
              .post(`requestedResult/default/${selectedTest.id}`)
              .then(({ data }) => {
                console.log(data, "labrequest data");
                setSelectedTest((prev) => {
                  console.log(prev, "previous selected test");
                  return data.patient.labrequests.find(
                    (labr) => labr.id == prev.id
                  );
                });
                setResultUpdated((prev) => {
                  return prev + 1;
                });
                setActivePatient(data.patient)?.map((prev) => {
                  return prev.map((patient) => {
                    if (patient.id === actviePatient.id) {
                      return {
                        ...data.patient,
                        active: true,
                      };
                    }
                    return patient;
                  });
                });
              })
              .finally(() => setLoading(false));
          }}
          variant="contained"
        >
          <Download />
        </LoadingButton>
      )}
      {selectedTest && (
        <LoadingButton
          color="inherit"
          title="fetch patient cbc data"
          size="small"
          loading={loading}
          onClick={() => {
            setLoading(true);
            axiosClient
              .post(`populatePatientCbcData/${actviePatient?.id}`, {
                main_test_id: selectedTest?.main_test_id,
              })
              .then(({ data }) => {
                if (data.status == false) {
                  setDialog((prev) => {
                    return {
                      ...prev,
                      open: true,
                      color: "error",
                      message: data.message,
                    };
                  });

                  return;
                }
                if (data.status) {
                  console.log(data, "patient cbc");
                  setSelectedTest((prev) => {
                    console.log(prev, "previous selected test");
                    return data.patient.labrequests.find(
                      (labr) => labr.id == prev.id
                    );
                  });
                  setResultUpdated((prev) => {
                    return prev + 1;
                  });
                  setActivePatient(data.patient)?.map((prev) => {
                    return prev.map((patient) => {
                      if (patient.id === actviePatient.id) {
                        return {
                          ...data.patient,
                          active: true,
                        };
                      }
                      return patient;
                    });
                  });
                }
              })
              .finally(() => setLoading(false));
          }}
          variant="contained"
        >
          <FormatListBulleted
            color={actviePatient.hasCbc ? "error" : "inherit"}
          />
        </LoadingButton>
      )}

      {selectedTest && (
        <LoadingButton
          color="inherit"
          size="small"
          title="fetch hormone data"
          loading={loading}
          onClick={() => {
            setLoading(true);
            axiosClient
              .post(`populatePatientHormoneData/${actviePatient?.id}`, {
                main_test_id: selectedTest?.main_test_id,
              })
              .then(({ data }) => {
                if (data.status == false) {
                  setDialog((prev) => {
                    return {
                      ...prev,
                      open: true,
                      color: "error",
                      message: data.message,
                    };
                  });

                  return;
                }
                if (data.status) {
                  console.log(data, "patient cbc");
                  setSelectedTest((prev) => {
                    console.log(prev, "previous selected test");
                    return data.patient.labrequests.find(
                      (labr) => labr.id == prev.id
                    );
                  });
                  setResultUpdated((prev) => {
                    return prev + 1;
                  });
                  setActivePatient(data.patient)?.map((prev) => {
                    return prev.map((patient) => {
                      if (patient.id === actviePatient.id) {
                        return {
                          ...data.patient,
                          active: true,
                        };
                      }
                      return patient;
                    });
                  });
                }
              })
              .finally(() => setLoading(false));
          }}
          variant="contained"
        >
          <PanoramaHorizontal
            color={actviePatient.hasCbc ? "error" : "inherit"}
          />
        </LoadingButton>
      )}
      {selectedTest && (
        <LoadingButton
          title="fetch chemistry data"
          color="inherit"
          size="small"
          loading={loading}
          onClick={() => {
            setLoading(true);
            axiosClient
              .post(`populatePatientChemistryData/${actviePatient?.id}`, {
                main_test_id: selectedTest?.main_test_id,
              })
              .then(({ data }) => {
                if (data.status == false) {
                  setDialog((prev) => {
                    return {
                      ...prev,
                      open: true,
                      color: "error",
                      message: data.message,
                    };
                  });

                  return;
                }
                if (data.status) {
                  console.log(data, "patient cbc");
                  setSelectedTest((prev) => {
                    console.log(prev, "previous selected test");
                    return data.patient.labrequests.find(
                      (labr) => labr.id == prev.id
                    );
                  });
                  setResultUpdated((prev) => {
                    return prev + 1;
                  });
                  setActivePatient(data.patient)?.map((prev) => {
                    return prev.map((patient) => {
                      if (patient.id === actviePatient.id) {
                        return {
                          ...data.patient,
                          active: true,
                        };
                      }
                      return patient;
                    });
                  });
                }
              })
              .finally(() => setLoading(false));
          }}
          variant="contained"
        >
          <ElectricBolt />
        </LoadingButton>
      )}
    </Stack>
  );
}

export default ResultSidebar;
