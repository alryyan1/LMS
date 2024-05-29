import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import MyTableCell from "../inventory/MyTableCell";
import MyLoadingButton from "../../components/MyLoadingButton";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import MyAutoCompeleteTableCell from "../inventory/MyAutoCompeleteTableCell";
import { useOutletContext } from "react-router-dom";
import AddDoctorForm from "./AddDoctorForm";

function Doctors() {
  const { specialists, doctorUpdater ,setDialog} = useOutletContext();

  const [search, setSearch] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [links, setLinks] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedDoctorServices, setSelectedDoctorServices] = useState([]);
  const [page, setPage] = useState(10);
  const [doctors, setDoctors] = useState([]);
  const [openDocotrServiceDialog, setOpenDoctorServiceDialog] = useState(false);
  const showDoctorServicesDialog = () => {
    setOpenDoctorServiceDialog(true);
  };

  const searchHandler = (word) => {
    setSearch(word);
    axiosClient
      .get(`doctors/pagination/${page}?word=${word}`)
      .then(({ data: { data, links } }) => {
        console.log(data, "pagination");
        // console.log(links);
        setDoctors(data);
        // console.log(links)
        setLinks(links);
      });
  };
  const updateDoctorsTable = (link, setLoading) => {
    // console.log(search);
    setLoading(true);
    fetch(link.url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: search ? JSON.stringify({ word: search }) : null,
    })
      .then((res) => {
        return res.json();
      })
      .then(({ data, links }) => {
        console.log(data, links,'doctors data');
        setDoctors(data);
        setLinks(links);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const [loading, setLoading] = useState(false);

  // console.log(isSubmitting);
  useEffect(() => {
    setLoading(true);
    axiosClient.get("service/all").then(({ data }) => {
      console.log(data,'service data')
      setServices(data);
    });
    // console.log("start of use effect");
    //fetch all Items
    axiosClient
      .get(`doctors/pagination/${page}`)
      .then(({ data: { data, links } }) => {
        console.log(data,'doctors data');
        // console.log(data, "companies");
        // console.log(links);
        setDoctors(data);
        // console.log(links);
        setLinks(links);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [page, doctorUpdater]);

  return (
    <>
      <Dialog fullWidth open={openDocotrServiceDialog}>
        <DialogTitle>خدمات الطبيب</DialogTitle>
        <DialogContent>
          <Stack direction={'row'}>
            <Button variant="contained" onClick={()=>{
              console.log(selectedDoctorServices)
              axiosClient.post(`doctors/${selectedDoctor.id}/services`, {services:selectedDoctorServices.map((s)=>s.id)}).then(({data})=>{
                if (data.status) {
                  setSelectedDoctor(data.doctor)
                  setSelectedDoctorServices([])
                  
                }
              }).catch(({response:{data}})=>{
                console.log(data,'my error')
                console.log(setDialog)
                setDialog(()=>{
                  return {
                    open:true,
                    title: "خطأ",
                    msg: data.message,
                    color: "error",
                  }
                })
              });
            }}>+</Button>
            <Autocomplete 
            value={selectedDoctorServices}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionKey={(option) => option.id}
            onChange={(e, data) =>{
              setSelectedDoctorServices(data)
            }}
          fullWidth
          multiple
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} />}
            options={services}
          />
          </Stack>
          <TableContainer>
            <Table size="small" style={{direction:'rtl',marginTop:'5px'}}>
              <TableHead>
                <TableRow>
                  <TableCell>الاسم</TableCell>
                  <TableCell>حذف</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                  {selectedDoctor && selectedDoctor.services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => {
                            axiosClient.delete(`doctors/${selectedDoctor.id}/service?service_id=${service.id}`).then(({data}) =>{
                              console.log(data)
                              if (data.status) {
                                setSelectedDoctor(data.doctor)
                              }

                            })
                            
                          }}
                        >
                          x
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

            </Table>
          </TableContainer>
         
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            onClick={() => {
              setOpenDoctorServiceDialog(false);
            }}
          >
            close
          </Button>
        </DialogActions>
      </Dialog>
      <Stack direction={"row"} gap={3}>
        {loading ? (
          <Skeleton height={400} style={{ flexGrow: "2" }}></Skeleton>
        ) : (
          <div style={{ flexGrow: 2 }}>
            <TableContainer sx={{ mb: 1 }}>
              <Stack
                sx={{ mb: 1 }}
                direction={"row"}
                justifyContent={"space-between"}
              >
                <select
                  value={page}
                  onChange={(val) => {
                    setPage(val.target.value);
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <TextField
                  size="small"
                  value={search}
                  onChange={(e) => {
                    searchHandler(e.target.value);
                  }}
                  label="بحث"
                ></TextField>
              </Stack>

              <Table dir="rtl" size="small">
                <thead>
                  <TableRow>
                    <TableCell>رقم</TableCell>
                    <TableCell>الاسم</TableCell>
                    <TableCell>نسبه(النقدي) </TableCell>
                    <TableCell> نسبه(التامين) </TableCell>
                    <TableCell> رقم الهاتف </TableCell>
                    <TableCell> التخصص </TableCell>
                    <TableCell> الثابت </TableCell>
                    <TableCell> الخدمات </TableCell>
                  </TableRow>
                </thead>
                <TableBody>
                  {doctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell>{doctor.id}</TableCell>
                      <MyTableCell
                        table="doctors"
                        colName={"name"}
                        item={doctor}
                      >
                        {doctor.name}
                      </MyTableCell>
                      <MyTableCell
                        table="doctors"
                        colName={"cash_percentage"}
                        item={doctor}
                      >
                        {doctor.cash_percentage}
                      </MyTableCell>
                      <MyTableCell
                        table="doctors"
                        colName={"company_percentage"}
                        item={doctor}
                      >
                        {doctor.company_percentage}
                      </MyTableCell>
                      <MyTableCell
                        table="doctors"
                        colName={"phone"}
                        item={doctor}
                      >
                        {doctor.phone}
                      </MyTableCell>
                      <MyAutoCompeleteTableCell
                        val={doctor.specialist}
                        table="doctors"
                        colName={"specialist_id"}
                        item={doctor}
                        sections={specialists}
                      >
                        {doctor.specialist}
                      </MyAutoCompeleteTableCell>
                      <MyTableCell
                        table="doctors"
                        colName={"static_wage"}
                        item={doctor}
                      >
                        {doctor.static_wage}
                      </MyTableCell>
                      <TableCell>
                        <Button onClick={()=>{
                          setSelectedDoctor(doctor);
                          showDoctorServicesDialog(true)
                        }}>
                          الخدمات
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Grid sx={{ gap: "4px" }} container>
              {links.map((link, i) => {
                if (i == 0) {
                  return (
                    <Grid item xs={1} key={i}>
                      <MyLoadingButton
                        onClick={(setLoading) => {
                          updateDoctorsTable(link, setLoading);
                        }}
                        variant="contained"
                        key={i}
                      >
                        <ArrowBack />
                      </MyLoadingButton>
                    </Grid>
                  );
                } else if (links.length - 1 == i) {
                  return (
                    <Grid item xs={1} key={i}>
                      <MyLoadingButton
                        onClick={(setLoading) => {
                          updateDoctorsTable(link, setLoading);
                        }}
                        variant="contained"
                        key={i}
                      >
                        <ArrowForward />
                      </MyLoadingButton>
                    </Grid>
                  );
                } else
                  return (
                    <Grid item xs={1} key={i}>
                      <MyLoadingButton
                        active={link.active}
                        onClick={(setLoading) => {
                          updateDoctorsTable(link, setLoading);
                        }}
                      >
                        {link.label}
                      </MyLoadingButton>
                    </Grid>
                  );
              })}
            </Grid>
          </div>
        )}
        <AddDoctorForm />
      </Stack>
    </>
  );
}

export default Doctors;
