import {
  Button,
  Card,
  IconButton,
  Stack,
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
import { formatNumber, webUrl } from "../constants";
import { t } from "i18next";
import BottomMoney from "./BottomMoney";
import { Company, DoctorShift, DoctorVisit, User } from "../../types/Patient";
interface RequestedServiceProps {
  actviePatient:DoctorVisit;
  setDialog:( data:()=>void )=>void;
  setShowServicePanel:()=>void;
  setShowPatientServices :()=>void;
  activeShift:DoctorShift;
  companies:Company[]
  user:User
  update:(data:DoctorVisit)=>void;
}
function RequestedServices({
  actviePatient,
  setDialog,
  setShowServicePanel,
  setShowPatientServices,
  activeShift,
  companies,
  user,
  update
}:RequestedServiceProps) {
  const [loading, setLoading] = useState(false);
  console.log(companies, "companies");

  const pay = (id, setLoading) => {
    setLoading(true);
    axiosClient
      .patch(`requestedService/pay/${id}`)
      .then(({ data }) => {
        console.log(data, "pay service");
        update(data.patient)
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
       
          update(data.patient)

          setDialog((prev) => {
            return {
              ...prev,
              open: true,
              message: "تم الغاء السداد بنجاح",
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
          update(data.patient)
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
       <Stack direction={'row'} gap={1}>
       <Button
          sx={{ m: 1 }}
          onClick={() => {
            setShowPatientServices(false);
            setShowServicePanel(true);
          }}
        >
          {t("servicesPanel")}
        </Button>
        <a
          href={`${webUrl}printReceptionReceipt?doctor_visit=${actviePatient.id}&user=${user?.id}`}
        >
          Receipt
        </a>
       </Stack>
        

        <div style={{ position: "relative" }} className="requested-table">
          <TableContainer
            component={Card}
            sx={{
              backgroundColor: "#ffffffbb!important",
            
              minHeight: " 100px",
            
              p:1,
        
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell> {t("name")}</TableCell>
                  <TableCell align="right">{t("price")}</TableCell>
                  {actviePatient.patient.company ? (
                    <TableCell align="right">التحمل</TableCell>
                  ) : (
                    ""
                  )}
                  <TableCell align="right">{t("paid")}</TableCell>

                  {actviePatient.patient.company ? (
                    ""
                  ) : (
                    <TableCell align="right">{t("bank")}</TableCell>
                  )}
                  <TableCell width={"5%"} align="right">
                    {t("pay")}
                  </TableCell>
                  <TableCell width={"5%"} align="right">
                    {t("other")}
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


                      total_endurance += service.endurance;
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
                            {service.endurance}
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
                          
                              update={update}
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
                            update={update}
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
          {/* <TableContainer style={{ width: "20%", display: "inline-block" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textAlign: "center" }} colSpan={2}>
                    {" "}
                    Services
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell> Total </TableCell>
                  <TableCell className="title">
                    {" "}
                    {actviePatient.total_services}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Discount </TableCell>
                  <TableCell>{actviePatient.total_discounted}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Amount Paid</TableCell>
                  <TableCell className="title">
                    {actviePatient.total_paid_services}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer> */}
        </div>
        {actviePatient && <BottomMoney
          activeShift={activeShift}
          actviePatient={actviePatient}
          total_endurance={total_endurance}
        />}
      </div>
    </>
  );
}

export default RequestedServices;
