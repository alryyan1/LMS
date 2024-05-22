import { DataObject, Download, Upload } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Grid,
  Icon,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LineChart, PieChart } from "@mui/x-charts";
import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import axiosClient from "../../../axios-client";

function ItemStatisticsPie() {
  const [items, setItems] = useState([]);
  const sections =   useLoaderData()
  const [selectedSection, setSelectedSection] = useState(null);
  useEffect(() => {
    if (selectedSection !== null) {
      axiosClient
        .get(`items/all/pie/${selectedSection.id}`)
        .then(({ data }) => {
          setItems(data);
          console.log(data);
        });
    }
  }, [selectedSection]);


  return (
    <>
      <Grid justifyContent={"center"} container>
        <Grid xs={5} item>
          <Autocomplete
          fullWidth
            sx={{ mb: 1 }}
            value={selectedSection}
            options={sections}
           onChange={(e,data)=>{
            console.log('chaned',data)
            setSelectedSection(data);
           }}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => {
              return <TextField fullWidth {...params} label="القسم" variant="filled" />;
            }}
          ></Autocomplete>
        </Grid>
      
      </Grid>
      <Grid container justifyContent={'center'} >
      {items.length > 0 && (
          <PieChart
          title="المخزن"
        
            series={[
              {
                outerRadius: 100,

                cx: -200,
                data: items.map((item) => {
                  return {
                    id: item.id,
                    value: item.remaining,
                    label: item.name,
                  };
                }),
                //   [
                //     { id: 0, value: 60, label: "series A" },
                //     { id: 1, value: 15, label: "series B" },
                //     { id: 2, value: 20, label: "series C" },
                //   ]
              },
            ]}
            width={1000}
            height={400}
          />
        )}
      </Grid>
      
    </>
  );
}

export default ItemStatisticsPie;
