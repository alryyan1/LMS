import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import { Close, Download } from "@mui/icons-material";
import MyLoadingButton from "../../components/MyLoadingButton";
import MyCheckboxReception from "./MycheckboxReception";
import RequestedServiceOptions from "./RequestedServiceOptions";
import { formatNumber } from "../constants";
import { t } from "i18next";
function RequestedServices({
  actviePatient,
  setDialog,
  setActivePatient,
  setShowServicePanel,
  setShowPatientServices,
  setUpdate,
  activeShift,
  companies,
}) {
  const [loading, setLoading] = useState(false);
  console.log(companies, "companies");

  const pay = (id, setLoading) => {
    setLoading(true);
    axiosClient
      .patch(`requestedService/pay/${id}`)
      .then(({ data }) => {
        console.log(data, "pay service");
        setActivePatient(data.patient);
        setUpdate((prev) => prev + 1);

        setDialog((prev) => {
          return {
            ...prev,
            open: true,
            message: "تم  السداد بنجاح",
            color: "success",
          };
        });
      })
      .catch(({ response: { data } }) => {
        // alert(data.message)
        setDialog((prev) => {
          return {
            ...prev,
            open: true,
            message: data.message,
            color: "error",
          };
        });
      })
      .finally(() => {
        setLoading(false);
      })
      .catch(({ response: { data } }) => {
        setDialog((prev) => {
          return {
            ...prev,
            open: true,
            message: data.message,
            color: "error",
          };
        });
      });
  };
  const cancelPayHandler = (id) => {
    setLoading(true);
    axiosClient
      .patch(`requestedService/cancel/${id}`)
      .then(({ data }) => {
        if (data.status) {
          if (setUpdate) {
            setUpdate((prev) => prev + 1);
          }

          setDialog((prev) => {
            return {
              ...prev,
              open: true,
              message: "تم الغاء السداد بنجاح",
              color: "success",
            };
          });
          setActivePatient(data.patient);
        }
      })
      .catch(({ response: { data } }) => {
        setDialog((prev) => {
          return {
            ...prev,
            open: true,
            message: data.message,
            color: "error",
          };
        });
      })
      .finally(() => {
        setLoading(loading);
      })
      .catch(({ response: { data } }) => {
        setDialog((prev) => {
          return {
            ...prev,
            open: true,
            message: data.message,
            color: "error",
          };
        });
      });
  };
  // console.log(actviePatient,'active patient')
  // alert(actviePatient.company_id)

  const deleteService = (id) => {
    axiosClient
      .delete(`requestedService/${id}`)
      .then(({ data }) => {
        if (data.status) {
          setActivePatient(data.patient);
          setUpdate((prev) => prev + 1);
          setDialog((prev) => {
            return {
              ...prev,
              open: true,
              message: "Delete was successfull",
              color: "success",
            };
          });
        }
      })
      .catch(({ response: { data } }) => {
        setDialog((prev) => {
          return {
            ...prev,
            open: true,
            message: data.message,
            color: "error",
          };
        });
      });
  };
  let total_endurance = 0;
  let total_price = 0;

  return (
    <>
      <div className="requested-tests">
        <div style={{ position: "relative" }} className="requested-table">
          <Button
            sx={{ m: 1 }}
            onClick={() => {
              setShowPatientServices(false);
              setShowServicePanel(true);
            }}
          >
          {t("servicesPanel")}
          </Button>
          <TableContainer sx={{ border: "none", textAlign: "left" }}>
            <Table size="small" style={{ direction: "rtl" }}>
              <TableHead>
                <TableRow>
                  <TableCell> {t('name')}</TableCell>
                  <TableCell align="right">{t('price')}</TableCell>
                  {actviePatient.patient.company ? (
                    <TableCell align="right">التحمل</TableCell>
                  ) : (
                    ""
                  )}
                  <TableCell align="right">{t('paid')}</TableCell>

                  {actviePatient.patient.company ? (
                    ""
                  ) : (
                    <TableCell align="right">{t('bank')}</TableCell>
                  )}
                  <TableCell width={"5%"} align="right">
                    {t('pay')}
                  </TableCell>
                  <TableCell width={"5%"} align="right">
                    {t('other')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {actviePatient?.services
                  .filter((service) => {
                    return service.doctor_id == activeShift.doctor.id;
                  })
                  .map((service) => {
                    // console.log(actviePatient,'active patient')

                    let price;
                    let company;
                    let endurance;
                    if (actviePatient.patient.company != null) {
                      company = companies.find(
                        (c) => c.id == actviePatient.patient.company_id
                      );
                      //  console.log(company,'finded company')
                      //  console.log(service,'service')
                      const companyService = company.services.find(
                        (s) => s.pivot.service_id == service.service.id
                      );
                      //  console.log(companyService,'company service')
                      price = service.price;
                      //  alert(price)

                      if (companyService.pivot.static_endurance > 0) {
                        endurance =
                          service.count * companyService.pivot.static_endurance;
                      } else {
                        if (companyService.pivot.percentage_endurance > 0) {
                          // alert(companyService.percentage_endurance)
                          endurance =
                            (price *
                              service.count *
                              companyService.pivot.percentage_endurance) /
                            100;
                        } else {
                          endurance =
                            (price *
                              service.count *
                              company.service_endurance) /
                            100;
                        }
                      }

                      total_endurance += endurance;
                      // console.log(company,'patient company')
                    } else {
                      price = service.price;
                    }
                    total_price += price;
                    // console.log(price,'price ')
                    return (
                      <TableRow
                        sx={{
                          borderBottom: "1px solid rgba(224, 224, 224, 1)",
                        }}
                        key={service.id}
                      >
                        <TableCell sx={{ border: "none" }} scope="row">
                          {service.service.name}
                        </TableCell>

                        <TableCell sx={{ border: "none" }} align="right">
                          {price}
                        </TableCell>
                        {actviePatient.patient.company ? (
                          <TableCell
                            sx={{ border: "none", color: "red" }}
                            align="right"
                          >
                            {endurance}
                          </TableCell>
                        ) : (
                          ""
                        )}
                        <TableCell sx={{ border: "none" }} align="right">
                          {service.amount_paid}
                        </TableCell>

                        {actviePatient.patient.company ? (
                          ""
                        ) : (
                          <TableCell sx={{ border: "none" }} align="right">
                            <MyCheckboxReception
                              setUpdate={setUpdate}
                              disabled={service.is_paid == 0}
                              checked={service.bank == 1}
                              id={service.id}
                            ></MyCheckboxReception>
                          </TableCell>
                        )}

                        <TableCell sx={{ border: "none" }} align="right">
                          <MyLoadingButton
                            active={service.is_paid}
                            disabled={service.is_paid === 1}
                            loading={loading}
                            onClick={(setLoading) =>
                              pay(service.id, setLoading)
                            }
                          >
                            <Download />
                          </MyLoadingButton>
                        </TableCell>
                        <TableCell>
                          <RequestedServiceOptions
                            setDialog={setDialog}
                            setActivePatient={setActivePatient}
                            setUpdate={setUpdate}
                            deleteService={deleteService}
                            actviePatient={actviePatient}
                            cancelPayHandler={cancelPayHandler}
                            loading={loading}
                            service={service}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="requested-total">
          <div className="money-info">
            <div
              className="total-price"
              style={{ width: "100%", justifyContent: "space-around" }}
            >
              <div className="sub-price">
                <div className="title">Total</div>

                <Typography variant="h3">
                  {actviePatient.company_id == null
                    ? actviePatient?.services
                        .filter((service) => {
                          return service.doctor_id == activeShift.doctor.id;
                        })
                        .reduce((accum, service) => {
                          // console.log(service.count,'service.count)')
                          const total = service.price * service.count;
                          const discount = Number(
                            (service.discount * total) / 100
                          );
                          return accum + (total - discount);
                        }, 0)
                    : total_endurance}
                </Typography>
              </div>
              <div className="sub-price">
                <div className="title">Paid</div>
                <Typography variant="h3">
                  {formatNumber(actviePatient?.total_paid_services)}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RequestedServices;
