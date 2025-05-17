import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import MyTableCell from "../inventory/MyTableCell";
import MyLoadingButton from "../../components/MyLoadingButton";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import MyAutoCompeleteTableCell from "../inventory/MyAutoCompeleteTableCell";
import { useOutletContext } from "react-router-dom";
import AddDoctorForm from "./AddDoctorForm";
import { useTranslation } from "react-i18next";
import EmptyDialog from "../Dialogs/EmptyDialog";
import { Plus } from "lucide-react";
import MySelectTableCell from "../inventory/MySelectTableCell";

function Doctors() {
  const { specialists, doctorUpdater, setDialog } = useOutletContext();
  const { t } = useTranslation("doctorsTable");
  const [search, setSearch] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [links, setLinks] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedDoctorServices, setSelectedDoctorServices] = useState([]);
  const [page, setPage] = useState(10);
  const [doctors, setDoctors] = useState([]);
  const [open, setOpen] = useState(false);
  const [openCosts, setOpenCosts] = useState(false);

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
        console.log(data, links, "doctors data");
        setDoctors(data);
        setLinks(links);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const [subServiceCosts, setSubServiceCosts] = useState([]);

  useEffect(() => {
    axiosClient.get("subServiceCosts").then(({ data }) => {
      setSubServiceCosts(data);
    });
  }, []);
  useEffect(() => {
    setDoctors((prev)=>{
      return prev.map((d)=>{
        if(d.id == selectedDoctor?.id){
          return {...selectedDoctor}
        }
        return d;
      })
    })
  }, [selectedDoctor]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.title = t("doctors");
  }, []);
  // console.log(isSubmitting);
  useEffect(() => {
    setLoading(true);
    axiosClient.get("service/all").then(({ data }) => {
      console.log(data, "service data");
      setServices(data);
    });
    // console.log("start of use effect");
    //fetch all Items
    axiosClient
      .get(`doctors/pagination/${page}`)
      .then(({ data: { data, links } }) => {
        console.log(data, "doctors data");
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
      <IconButton onClick={() => setOpen(true)}>
        <Plus />
      </IconButton>
      <Dialog fullWidth open={openDocotrServiceDialog}>
        <DialogTitle>{t("doctor_services")}</DialogTitle>
        <DialogContent>
          <Stack direction={"row"}>
            <Button
              variant="contained"
              onClick={() => {
                console.log(selectedDoctorServices);
                axiosClient
                  .post(`doctors/${selectedDoctor.id}/services`, {
                    services: selectedDoctorServices.map((s) => s.id),
                  })
                  .then(({ data }) => {
                    if (data.status) {
                      setSelectedDoctor(data.doctor);
                      setSelectedDoctorServices([]);
                    }
                  })
                  .catch(({ response: { data } }) => {
                    console.log(data, "my error");
                    console.log(setDialog);
                    setDialog(() => {
                      return {
                        open: true,
                        title: t("error"),
                        msg: data.message,
                        color: "error",
                      };
                    });
                  });
              }}
            >
              +
            </Button>
            <Autocomplete
              value={selectedDoctorServices}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionKey={(option) => option.id}
              onChange={(e, data) => {
                setSelectedDoctorServices(data);
              }}
              fullWidth
              multiple
              getOptionLabel={(option) => option.name}
              renderInput={(params) => <TextField {...params} />}
              options={services}
            />
          </Stack>
          <TableContainer>
            <Table size="small" style={{ direction: "rtl", marginTop: "5px" }}>
              <TableHead>
                <TableRow>
                  <TableCell>{t("name")}</TableCell>
                  <TableCell>{t("doctor_percentage")}</TableCell>
                  <TableCell>{t("doctor_amount")}</TableCell>
                  <TableCell>{t("delete")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedDoctor &&
                  selectedDoctor.services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.service.name}</TableCell>
                      <MyTableCell
                        table="doctor/service"
                        colName={"percentage"}
                        item={service}
                      >
                        {service.percentage}
                      </MyTableCell>
                      <MyTableCell
                        table="doctor/service"
                        colName={"fixed"}
                        item={service}
                      >
                        {service.fixed}
                      </MyTableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => {
                            axiosClient
                              .delete(`doctors/doctor/${service.id}`)
                              .then(({ data }) => {
                                console.log(data);
                                if (data.status) {
                                  setSelectedDoctor(data.doctor);
                                }
                              });
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
            {t("close")}
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
                  label={t("search")}
                ></TextField>
              </Stack>

              <Table dir="rtl" size="small">
                <thead>
                  <TableRow>
                    <TableCell>{t("id")}</TableCell>
                    <TableCell>{t("name")}</TableCell>
                    <TableCell>{t("cash_percentage")}</TableCell>
                    <TableCell>{t("insurance_percentage")}</TableCell>
                    <TableCell>{t("phone")}</TableCell>
                    <TableCell>{t("fixed")}</TableCell>
                    <TableCell>{t("start")}</TableCell>
                    <TableCell>{t("specialist")}</TableCell>
                    {/* <TableCell> {t("fixed")} </TableCell> */}
                    <TableCell>{t("services")}</TableCell>
                    <TableCell>{t("costs")}</TableCell>
                    <TableCell>احتساب التامين</TableCell>
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
                      <MyTableCell
                        table="doctors"
                        colName={"static_wage"}
                        item={doctor}
                      >
                        {doctor.static_wage}
                      </MyTableCell>
                      <MyTableCell
                        table="doctors"
                        colName={"start"}
                        item={doctor}
                      >
                        {doctor.start}
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
                      {/* <MyTableCell
                        table="doctors"
                        colName={"static_wage"}
                        item={doctor}
                      >
                        {doctor.static_wage}
                      </MyTableCell> */}
                      <TableCell>
                        <Button
                          onClick={() => {
                            setSelectedDoctor(doctor);
                            showDoctorServicesDialog(true);
                          }}
                        >
                          {t("services")}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            setSelectedDoctor(doctor);
                            setOpenCosts(true);
                          }}
                        >
                          {t("costs")}
                        </Button>
                      </TableCell>
                      <TableCell>
                          <MySelectTableCell
                                                item={doctor}

                        
                                                myVal={doctor.calc_insurance}
                                                table="doctors"
                                                colName={"calc_insurance"}
                                              ></MySelectTableCell>
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
      </Stack>

      <EmptyDialog show={open} setShow={setOpen}>
        <AddDoctorForm setOpen={setOpen} />
      </EmptyDialog>
      {selectedDoctor && <EmptyDialog show={openCosts} setShow={setOpenCosts}>
        <Typography variant="h4" textAlign={'center'}>{selectedDoctor.name}</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t("name")}</TableCell>
              <TableCell>{t("check")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
                subServiceCosts  .map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Checkbox
                        defaultChecked={selectedDoctor.doctor_sub_service_costs
                          .map((dc) => dc.sub_service_cost_id)
                          .includes(item.id)}
                        onChange={(e) => {
                          axiosClient.post(`addDoctorServiceCost`, {
                            doctor_id: selectedDoctor.id,
                            sub_service_cost_id: item.id,
                            add: e.target.checked ? 1 : 0,
                          }).then(({data})=>{
                            setSelectedDoctor(data)
                          });
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </EmptyDialog>}
    </>
  );
}

export default Doctors;
