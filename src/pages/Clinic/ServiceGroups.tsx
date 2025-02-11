import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Card,
  Paper,
  Autocomplete,
  Button,
} from "@mui/material";
import TestGroupChildren from "../TestGroupChildren";
import { useOutletContext } from "react-router-dom";
import AddTestAutoComplete from "../Laboratory/AddTestAutoComplete";
import AddServiceAutocomplete from "./AddServiceAutocomplete";
import { ReceptionLayoutProps } from "../../types/CutomTypes";
import axiosClient from "../../../axios-client";
function ServiceGroup({socket,setShowPatientServices,setShowServicePanel,activeShift,actviePatient,setActivePatient,settings,activeTooth}) {
  const [serviceCategories, setServiceCategories] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);


  useEffect(() => {
    Promise.all([
     
  
      axiosClient
        .get(`serviceGroup/all`)
        .then(({ data: data }) => {
          console.log(data, "serviceGroup ");
          setServiceCategories(data);
        })
        .catch((err) => console.log(err)),
    ]).finally(() => {});
  }, []);
  const serviceAddHandler = (service) => {
    setSelectedServices((prev) => {
      const founded = prev.find((s) => s.id === service.id);
      if (founded) {
        return prev.filter((s) => s.id != founded.id);
      } else {
        return [...prev, service];
      }
    });
    console.log(service);
  };
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  console.log("start fetching", "packages and their tests");

  return (
    <Box sx={{ p: 2 }}>
      {/* <Button
        onClick={() => {
          setShowPatientServices(true);
          setShowServicePanel(false);
        }}
      >
        عرض الخدمات المضافه
      </Button> */}
      <AddServiceAutocomplete
  activeTooth={activeTooth}

        setSelectedServices={setSelectedServices}
        setShowPatientServices={setShowPatientServices}
        setShowServicePanel={setShowServicePanel}
        settings={settings}
        activeShift={activeShift}
        patient={actviePatient}
        selectedServices={selectedServices}
        setActiveDoctorVisit={setActivePatient}
        socket={socket}
      />
      <Tabs
        textColor="secondary"
        indicatorColor="secondary"
        value={value}
        onChange={handleChange}
        variant="scrollable"
      >
        {serviceCategories.map((group) => {
          return <Tab key={group.id} label={group.name} />;
        })}
      </Tabs>
      {serviceCategories.map((group, index) => {
        return (
          <TestGroupChildren key={group.id} index={index} value={value}>
            {group.services.map((service) => {
              const founedService = selectedServices.find(
                (s) => s.id === service.id
              );

              return (
                //test to add
                <Card
                  style={
                    founedService
                      ? {
                          borderBottom: "4px solid blue",
                          fontWeight: "bolder",
                          textAlign: "center",
                        }
                      : { textAlign: "center" }
                  }
                  className={
                    founedService ? "active " : " "
                  }
                  onClick={() => serviceAddHandler(service)}
                  sx={{ cursor: "pointer", p: 1, minWidth: "80px" }}
                  key={service.id}
                >
                  {service.name}
                </Card>
              );
            })}
          </TestGroupChildren>
        );
      })}
    </Box>
  );
}

export default ServiceGroup;
