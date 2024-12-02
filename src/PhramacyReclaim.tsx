
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useOutletContext } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid/components';
import axiosClient from "../axios-client";
import { Deduct } from "./types/Shift";

function CustomToolbar() {
  useEffect(()=>{
    document.title = 'المطالبات'
  },[])
  return (
    <GridToolbarContainer>
      <GridToolbarExport
        csvOptions={{ utf8WithBom: true }} // Ensures UTF-8 encoding with BOM
      />
    </GridToolbarContainer>
  );
}
function PhramacyReclaim() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(null);
  const [companies, setCompanies] = useState([]);
  useEffect(() => {
    axiosClient.get("company/all").then(({ data }) => setCompanies(data));
  }, []);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      from: dayjs(new Date()),
      to: dayjs(new Date()),
    },
  });
  const submitHandler = (data) => {
    setLoading(true);
    console.log(data, "data");
    axiosClient.post(`insuranceReclaimPharmacy`,{
      companyId: data.company.id,
      fromDate: data.from.format('YYYY-MM-DD'),
      toDate: data.to.format('YYYY-MM-DD'),
    }).then(({data})=>{
      console.log(data,'data')
      setRows(data.data)
    }).finally(()=>setLoading(false))
  };
  const columns = [
    { field: "id", headerName: "ID", width: 90,align:'center',valueGetter:(value,row)=>{
      return row.id
    } },
    {
      field: "created_at",
      headerName: "Date",
      width: 150,
      headerAlign:'center',
      flex:1,
      align:'center',

      valueGetter: (value, row) =>
        dayjs(new Date(Date.parse(row.created_at))).format("YYYY/MM/DD H;m A"),
    },
 
    ,
    {
      field: "Paid",
      headerAlign:'center',
      flex:1,

      headerName: "المدفوع",
      width: 110,
      align:'center',
      valueGetter:(value,row:Deduct)=>{
        return  row?.paid 
      }
    }

    ,
    {
      field: "المبلغ",
      headerAlign:'center',
      flex:1,

      headerName: "Paid",
      width: 110,
      align:'center',
      valueGetter:(value,row:Deduct)=>{
        return  row?.total_price 
      }
    }


  
    ,
    {
      field: "itemsConcatenated",
      headerAlign:'center',
      flex:1,

      headerName: "الاصناف",
      width: 110,
      align:'center',
      valueGetter:(value,row:Deduct)=>{
        return  row?.itemsConcatenated 
      }
    }
    ,

    {
      field: "subcompany.name",
      headerAlign:'center',
      flex:1,

      headerName: "الجهه",
      width: 110,
      align:'center',

      valueGetter:(value,row:Deduct)=>{
        return `${row.doctorvisit.patient?.subcompany?.name}`
      }
    }
    ,

    {
      field: "guarantor",
      headerAlign:'center',
      flex:1,

      headerName: "العائل",
      width: 110,
      align:'center',

      valueGetter:(value,row:Deduct)=>{
        return `${row.doctorvisit.patient.guarantor}`
      }
    }
    ,

    {
      field: "insurance_no",
      headerAlign:'center',
      flex:1,

      headerName: "رقم البطاقه",
      width: 110,
      align:'center',

      valueGetter:(value,row:Deduct)=>{
        return `${row.doctorvisit.patient.insurance_no}`
      }
    }
    ,

    {
      field: "name",
      headerAlign:'center',
      flex:1,

      headerName: "الاسم",
      width: 110,
      align:'center',

      valueGetter:(value,row:Deduct)=>{
        return `${row.doctorvisit.patient.name}`
      }
    }
  
   
  ];
  const handleExport = () => {
    const csvContent = document.querySelector('.MuiDataGrid-root').querySelector('button[aria-label="Export CSV"]').click();
  };
  return (
    <Grid container spacing={1}>
      
      <Grid item xs={10}>
        
      <DataGrid
        
            slots={{
              toolbar: CustomToolbar,
            }}
          
            componentsProps={{
              toolbar: { printOptions: { disableToolbarButton: true } },
            }}
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[5,10,20,50]}
            checkboxSelection
            disableRowSelectionOnClick
          />
      </Grid>
      <Grid item xs={2}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Stack direction={"column"} gap={2} justifyContent={"space-between"}>
            <Controller
              name="company"
              rules={{
                required: {
                  value: true,
                  message: "الحقل مطلوب",
                },
              }}
              control={control}
              render={({ field }) => {
                return (
                  <Autocomplete
                    size="small"
                    onChange={(e, newVal) => {
                      field.onChange(newVal);
                    }}
                    getOptionKey={(op) => op.id}
                    getOptionLabel={(option) => option.name}
                    options={companies}
                    renderInput={(params) => {
                      // console.log(params)

                      return (
                        <TextField
                          inputRef={field.ref}
                          error={errors?.doctor}
                          {...params}
                          label={"الشركه"}
                        />
                      );
                    }}
                  ></Autocomplete>
                );
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                control={control}
                name="from"
                render={({ field }) => {
                  return (
                    <DateField
                      fullWidth
                      size="small"
                      format="YYYY-MM-DD"
                      onChange={(val) => {
                        field.onChange(val)
                      }}
                      defaultValue={dayjs(new Date())}
                      label="من"
                    />
                  );
                }}
              ></Controller>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                control={control}
                name="to"
                render={({ field }) => {
                  return (
                    <DateField
                      {...field}
                      fullWidth
                      size="small"
                      format="YYYY-MM-DD"
                      onChange={(val) => {
                        field.onChange(val);
                      }}
                      defaultValue={dayjs(new Date())}
                      label="الي"
                    />
                  );
                }}
              ></Controller>
            </LocalizationProvider>
            <LoadingButton loading={loading} type="submit" size="medium" variant="contained">
              Go
            </LoadingButton>
          </Stack>
        </form>
      </Grid>
    </Grid>
  );
}

export default PhramacyReclaim;
