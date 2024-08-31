import { Button, Divider, IconButton, Stack } from "@mui/material";
import React from "react";
import { Item } from "../constants";
import {
  Download,
  ElectricBolt,
  FilterTiltShift,
  FormatListBulleted,
  Lock,
  LockOpen,
  Panorama,
  PanoramaHorizontal,
  StarBorder,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import axiosClient from "../../../axios-client";
import CableIcon from "@mui/icons-material/Cable";
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
  return (
    <Stack
      sx={{ mr: 1 }}
      gap={"5px"}
      divider={<Divider orientation="vertical" flexItem />}
      direction={"column"}
    >
      {actviePatient && <Item>
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
      </Item>}

      <IconButton target="_blank" href="http://127.0.0.1/server/classes/server.php" title="LIS" color="inherit">
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
