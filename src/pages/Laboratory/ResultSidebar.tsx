import { Button, Divider, IconButton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { host, Item } from "../constants";
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
import { DoctorVisit, Labrequest } from "../../types/Patient";
import { useOutletContext } from "react-router-dom";
interface ResultSideBarPros {
  actviePatient: DoctorVisit;
  loading: boolean;
  setLoading: Function;
  setSelectedTest: Function;
  setActivePatient: Function;
  selectedTest: Labrequest;
  setResultUpdated: Function;
  setShift: Function;
  socket: any;
  isConnected: boolean;
}
function ResultSidebar({
  actviePatient,
  loading,
  setLoading,
  setSelectedTest,
  setActivePatient,
  selectedTest,
  setResultUpdated,
 
  setShift,
  socket,
  isConnected,update
}:ResultSideBarPros) {

 const {setDialog} =  useOutletContext()
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
        title="Sync"
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
        href={`http://${host}/server/classes/server.php`}
        title="Chemistry LIS"
        color="inherit"
      >
        <CableIcon />
      </IconButton>
      <IconButton
        target="_blank"
        href={`http://${host}/server/classes/client.php`}
        title="CBC LIS"
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
              .get(`printLock/${actviePatient.patient.id}`)
              .then(({ data }) => {
                console.log(data, "labrequest data");
                setSelectedTest((prev) => {
                  console.log(prev, "previous selected test");
                  return data.data.patient.labrequests.find(
                    (labr) => labr.id == prev.id
                  );
                });
               
                setActivePatient(data.data)
              })
              .finally(() => setLoading(false));
          }}
          variant="contained"
        >
          {actviePatient.patient.result_is_locked ? (
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
                  return data.data.patient.labrequests.find(
                    (labr) => labr.id == prev.id
                  );
                });
               
                setActivePatient(data.data)
                setResultUpdated((prev) => {
                  return prev + 1;
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
              

                  return;
                }
                if (data.status) {
                  console.log(data, "patient cbc");
             
                 setActivePatient(data.data)
                 setSelectedTest((prev) => {
                  console.log(prev, "previous selected test");
                  return data.data.patient.labrequests.find(
                    (labr) => labr.id == prev.id
                  );
                });
                setResultUpdated((prev) => {
                  return prev + 1;
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
                  setActivePatient(data.data)
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
             
                 setActivePatient(data.data)
                 setSelectedTest((prev) => {
                  console.log(prev, "previous selected test");
                  return data.data.patient.labrequests.find(
                    (labr) => labr.id == prev.id
                  );
                });
                setResultUpdated((prev) => {
                  return prev + 1;
                });
                }
              })
              .finally(() => setLoading(false));
          }}
          variant="contained"
        >
          <ElectricBolt             color={actviePatient.hasChemistry ? "warning" : "inherit"}
 />
        </LoadingButton>
      )}
    </Stack>
  );
}

export default ResultSidebar;
