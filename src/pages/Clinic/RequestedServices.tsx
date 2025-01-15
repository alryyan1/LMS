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
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import { AirlineStops, Close, Download } from "@mui/icons-material";
import MyLoadingButton from "../../components/MyLoadingButton";
import MyCheckboxReception from "./MycheckboxReception";
import RequestedServiceOptions from "./RequestedServiceOptions";
import { formatNumber, Item, webUrl } from "../constants";
import BottomMoney from "./BottomMoney";
import {
  Company,
  DoctorShift,
  DoctorVisit,
  RequestedService,
  User,
} from "../../types/Patient";
import MyTableCell from "../inventory/MyTableCell";
import { PanelBottom } from "lucide-react";
import { useTranslation } from "react-i18next";
import bloodTest from "./../../assets/images/blood-test.png";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import printJS from "print-js";
import EmptyDialog from "../Dialogs/EmptyDialog";

interface RequestedServiceProps {
  actviePatient: DoctorVisit;
  setDialog: (data: () => void) => void;
  setShowServicePanel: () => void;
  setShowPatientServices: () => void;
  activeShift: DoctorShift;
  companies: Company[];
  user: User;
  setAllMoneyUpdated: () => void;
  update: (data: DoctorVisit) => void;
}
function RequestedServices({
  actviePatient,
  setAllMoneyUpdated,
  activeShift,
  companies,
  user,
  update,
  setActivePatient,
}: RequestedServiceProps) {
  const [loading, setLoading] = useState(false);
  console.log(companies, "companies");
  const { t } = useTranslation("requestedServiceTable");
  const [showServiceCost, setShowServiceCost] = useState(false);
  const [selectedRequestedService, setSelectedRequestedService] =
    useState<RequestedService | null>(null);
  
  const pay = (id: number, setLoading: (loading: boolean) => void) => {
    setLoading(true);
    axiosClient
      .patch(`requestedService/pay/${id}`)
      .then(({ data }: any) => {
        //print reciet

        //print reciet

        console.log(data, "pay service");
        update(data.patient);
        if(setAllMoneyUpdated){

          setAllMoneyUpdated((prev) => prev + 1);
        }
      })
      .catch(({ response: { data } }: any) => {
        // alert(data.message)
      })
      .finally(() => {
        setLoading(false);

        const form = new URLSearchParams();

        axiosClient
          .get(
            `printRecieptionOneService?doctor_visit=${actviePatient.id}&service=${id}&base64=1`
          )
          .then(({ data }) => {
            form.append("data", data);
            console.log(data, "daa");
            printJS({
              printable: data.slice(data.indexOf("JVB")),
              base64: true,
              type: "pdf",
            });

            // fetch("http://127.0.0.1:4000/", {
            //   method: "POST",
            //   headers: {
            //     "Content-Type":
            //       "application/x-www-form-urlencoded",
            //   },

            //   body: form,
            // }).then(() => {});
          });
      });
  };
  const cancelPayHandler = (id: number) => {
    setLoading(true);
    axiosClient
      .patch(`requestedService/cancel/${id}`)
      .then(({ data }: any) => {
        setAllMoneyUpdated((prev) => prev + 1);

        if (data.status) {
          update(data.patient);
        }
      })

      .finally(() => {
        setLoading(loading);
      });
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const response = await axiosClient.post(
          "doctorvisitById",
          { id: actviePatient.id },
          {
            signal: controller.signal,
          }
        );
        console.log(response.data, "daaaaaaaaaata");
        setActivePatient(response.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();

    return () => {
      controller.abort(); // Cancel the request on component unmount
    };
  }, []);

  // console.log(actviePatient,'active patient')
  // alert(actviePatient.company_id)

  const deleteService = (id: number) => {
    axiosClient.delete(`requestedService/${id}`).then(({ data }: any) => {
      if (data.status) {
        setAllMoneyUpdated((prev) => prev + 1);
        update(data.patient);
      }
    });
  };
  let total_endurance = 0;
  let total_price = 0;
  console.log(actviePatient, "active patient");
  return (
    <>
      <div className="requested-tests">
        <div className="requested-table">
          <Typography>Medical Services</Typography>
          <TableContainer component={Card}>
            <Table className="table-small" size="small">
              <TableHead className="thead">
                <TableRow>
                  <TableCell> {t("name")}</TableCell>
                  <TableCell>{t("price")}</TableCell>
                  <TableCell>{t("discount")}</TableCell>
                  {actviePatient.patient.company ? (
                    <TableCell>{t("endurance")}</TableCell>
                  ) : (
                    ""
                  )}
                  <TableCell>{t("paid")}</TableCell>

                  {actviePatient.patient.company ? (
                    ""
                  ) : (
                    <TableCell>{t("bank")}</TableCell>
                  )}
                  <TableCell>{t("pay")}</TableCell>
                  <TableCell>{t("other")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {actviePatient?.services
                  .filter((service) => {
                    return true;
                    // return service.doctor_id == activeShift.doctor.id;
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
                        <TableCell
                          onClick={() => {
                            setShowServiceCost(true);
                            setSelectedRequestedService(service);
                          }}
                          sx={{ width: "200px" }}
                          scope="row"
                        >
                          <Tooltip title={service.user_requested.username}>
                            {service.service.name} {service.requested_service_costs.length > 0 && <IconButton title="هذه الخدمه تحتوي علي مصروفات"><AirlineStops/></IconButton>}
                          </Tooltip>
                        </TableCell>

                        <TableCell>{formatNumber(price)}</TableCell>
                        <MyTableCell
                          colName={"discount"}
                          disabled={service.is_paid == 1}
                          table="requestedService/discount"
                          item={service}
                          sx={{ width: "50px" }}
                          update={update}
                        >
                          {service.discount}
                        </MyTableCell>
                        {actviePatient.patient.company ? (
                          <TableCell sx={{ border: "none", color: "red" }}>
                            {service.endurance}
                          </TableCell>
                        ) : (
                          ""
                        )}
                        <TableCell>
                          <Tooltip title={service?.user_deposited?.username}>
                            {" "}
                            {service.amount_paid}
                          </Tooltip>
                        </TableCell>

                        {actviePatient.patient.company ? (
                          ""
                        ) : (
                          <TableCell>
                            <MyCheckboxReception
                              setAllMoneyUpdated={setAllMoneyUpdated}
                              update={update}
                              disabled={service.is_paid == 0}
                              checked={service.bank == 1}
                              id={service.id}
                            ></MyCheckboxReception>
                          </TableCell>
                        )}

                        <TableCell>
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
        {actviePatient && (
          <BottomMoney
            activeShift={activeShift}
            actviePatient={actviePatient}
            total_endurance={total_endurance}
          />
        )}
      </div>
     {selectedRequestedService && <EmptyDialog title={selectedRequestedService.service.name}
        setShow={setShowServiceCost}
        show={showServiceCost}
      >
        <Table>
            <TableRow>
              <TableCell> مصروف</TableCell>
              <TableCell>المبلغ</TableCell>
            </TableRow>
            <TableBody>
              {
                selectedRequestedService?.requested_service_costs.map((rc)=>{
                  return(
                    <TableRow key={rc.id}>
                    <TableCell>{rc.service_cost.sub_service_cost.name}</TableCell>
                    <MyTableCell sx={{width:'60px'}} colName={'amount'} isNum={true}  table="updateRequestedServiceCost" item={rc}>{rc.amount}</MyTableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
        </Table>
            <Button onClick={()=>{
              axiosClient.patch(`updateRequestedServiceCostAfterUdate/${selectedRequestedService.id}`).then(({data})=>{
                setActivePatient(data)
              })
            }} fullWidth variant="contained">تحديث</Button>
        
        </EmptyDialog>}
    </>
  );
}

export default RequestedServices;
