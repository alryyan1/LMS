import { Divider, IconButton, Stack } from '@mui/material';
import React from 'react'
import { Item } from '../constants';
import { Download, FilterTiltShift, FormatListBulleted, Lock, LockOpen, StarBorder } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import axiosClient from '../../../axios-client';

function ResultSidebar({actviePatient,loading,setLoading,setSelectedTest,setActivePatient,selectedTest,setResultUpdated,setDialog}) {
  return (
    <Stack
    sx={{ mr: 1 }}
    gap={"5px"}
    divider={<Divider orientation="vertical" flexItem />}
    direction={"column"}
  >
    <Item>
    <IconButton
    size="small"
        
        variant="contained"
      >
        <FilterTiltShift />
      </IconButton>
    </Item>
    {actviePatient && (
        <LoadingButton
        size="small"
         loading={loading}
          onClick={() => {
            setLoading(true)
            axiosClient
              .get(`printLock/${actviePatient.id}`)
              .then(({ data }) => {
                console.log(data, "labrequest data");
                setSelectedTest((prev) => {
                  console.log(prev, "previous selected test");
                  return data.patient.labrequests.find((labr)=>labr.id == prev.id)
                });
               
                setActivePatient(data.patient)
                ?.map((prev) => {
                  return prev.map((patient) => {
                    if (patient.id === actviePatient.id) {
                      return {
                        ...data.patient,
                        active:true
                      };
                    }
                    return patient;
                  });
                });
              }).finally(()=>
              setLoading(false));
          }}
          variant="contained"
        >
        {actviePatient.result_is_locked ? <Lock color="error" />:  <LockOpen  />}
        </LoadingButton>
    )}   

    {selectedTest && (
        <LoadingButton
        size="small"
         loading={loading}
          onClick={() => {
            setLoading(true)
            axiosClient
              .post(`requestedResult/default/${selectedTest.id}`)
              .then(({ data }) => {
                console.log(data, "labrequest data");
                setSelectedTest((prev) => {
                  console.log(prev, "previous selected test");
                  return data.patient.labrequests.find((labr)=>labr.id == prev.id)
                });
                setResultUpdated((prev) => {
                  return prev + 1;
                });
                setActivePatient(data.patient)
                ?.map((prev) => {
                  return prev.map((patient) => {
                    if (patient.id === actviePatient.id) {
                      return {
                        ...data.patient,
                        active:true
                      };
                    }
                    return patient;
                  });
                });
              }).finally(()=>
              setLoading(false));
          }}
          variant="contained"
        >
          <Download />
        </LoadingButton>
    )}
       {selectedTest && (
        <LoadingButton
        size="small"
        loading={loading}
          onClick={() => {
            setLoading(true)
            axiosClient
              .post(`populatePatientCbcData/${actviePatient?.id}`,{'main_test_id':selectedTest?.main_test_id})
              .then(({ data }) => {
                if(data.status == false){
                  setDialog((prev)=>{
                    return {
                     ...prev,
                      open:true,
                      color:'error',
                      message:data.message
                    }
                  })


                  return
                }
                if(data.status)
                  {
                    console.log(data,'patient cbc')
                    setSelectedTest((prev) => {
                      console.log(prev, "previous selected test");
                      return data.patient.labrequests.find((labr)=>labr.id == prev.id)
                    });
                    setResultUpdated((prev) => {
                      return prev + 1;
                    });
                    setActivePatient(data.patient)
                    ?.map((prev) => {
                      return prev.map((patient) => {
                        if (patient.id === actviePatient.id) {
                          return {
                            ...data.patient,
                            active:true
                          };
                        }
                        return patient;
                      });
                    });
                  }
            
               
              }).finally(()=> 
              setLoading(false));
          }}
          variant="contained"
        >
          <FormatListBulleted />
        </LoadingButton>
    )}
     {selectedTest && (
        <LoadingButton
        size="small"
        loading={loading}
          onClick={() => {
            setLoading(true)
            axiosClient
              .post(`populatePatientChemistryData/${actviePatient?.id}`,{'main_test_id':selectedTest?.main_test_id})
              .then(({ data }) => {
                if(data.status == false){
                  setDialog((prev)=>{
                    return {
                     ...prev,
                      open:true,
                      color:'error',
                      message:data.message
                    }
                  })


                  return
                }
                if(data.status)
                  {
                    console.log(data,'patient cbc')
                    setSelectedTest((prev) => {
                      console.log(prev, "previous selected test");
                      return data.patient.labrequests.find((labr)=>labr.id == prev.id)
                    });
                    setResultUpdated((prev) => {
                      return prev + 1;
                    });
                    setActivePatient(data.patient)
                    ?.map((prev) => {
                      return prev.map((patient) => {
                        if (patient.id === actviePatient.id) {
                          return {
                            ...data.patient,
                            active:true
                          };
                        }
                        return patient;
                      });
                    });
                  }
            
               
              }).finally(()=> 
              setLoading(false));
          }}
          variant="contained"
        >
          <StarBorder />
        </LoadingButton>
    )}
  </Stack>
  )
}

export default ResultSidebar