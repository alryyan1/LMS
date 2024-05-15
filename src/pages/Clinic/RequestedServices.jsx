import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DiscountSelect from "../Laboratory/DiscountSelect";
import { useEffect, useState } from "react";
import { url } from "../constants";
import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";
import MyCheckBox from "../Laboratory/MyCheckBox";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";
import DiscountSelectService from "./DiscountSelectService";
import { Close, Download } from "@mui/icons-material";
import MyLoadingButton from "../../components/MyLoadingButton";
function RequestedServices({ setPatients }) {
  const { setDialog, setActivePatient, actviePatient } = useOutletContext();
  const [loading, setLoading] = useState(false);
  const payHandler = () => {
    const totalPaid = actviePatient.labrequests.reduce((accum, test) => {
      const discount = Number((test.pivot.discount_per * test.price) / 100);
      return accum + (test.price - discount);
    }, 0);
    setLoading(true);
    axiosClient
      .patch(`labRequest/payment/${actviePatient.id}`, { paid: totalPaid })
      .then(({ data: data }) => {
        if (data.status) {
          setLoading(false);
          setPatients((prevPatients) => {
            return prevPatients.map((p) => {
              if (p.id === actviePatient.id) {
                return {
                  ...p,
                  is_lab_paid: true,
                  lab_paid: totalPaid,
                };
              } else {
                return p;
              }
            });
          });
          //show success dialog
          setDialog(() => ({
            msg: "تمت عمليه السداد بنجاح",
            open: true,
          }));
          setActivePatient((p) => {
            return { ...p, is_lab_paid: true, lab_paid: totalPaid };
          });
        }
      });
  };
  const pay = (id,setLoading) => {
    setLoading(true);
    axiosClient
      .get(`patient/service/pay/${actviePatient.id}?service_id=${id}`)
      .then(({ data }) => {
        setActivePatient(data.patient);
      }).finally(() => {setLoading(false);});
  };
  const cancelPayHandler = (id,setLoading) => {
    setLoading(true);
     axiosClient.get(`patient/service/cancel/${actviePatient.id}?service_id=${id}`).then(({ data }) => {
      if(data.status) {
        setDialog((prev)=>{
          return{
           ...prev,
            open:true,
            msg:"تم الغاء السداد بنجاح",
            color:"success"
          }
        })
        setActivePatient(data.patient);
      }
     }).finally(() => {setLoading(loading)})
  };

  const deleteService = (id) => {
    axiosClient
      .delete(`patient/service/${actviePatient.id}?service_id=${id}`)
      .then(({ data }) => {
        if (data.status) {
          setActivePatient(data.patient);
          setDialog((prev) => {
            return {
              ...prev,
              open: true,
              msg: "تم الحذف بنجاح",
              color: "success",
            };
          });
        }
      });
  };
  return (
    <>
      <div className="requested-tests">
        <div className="requested-table">
          <TableContainer sx={{ border: "none", textAlign: "left" }}>
            <Table size="small" style={{ direction: "rtl" }}>
              <TableHead>
                <TableRow>
                  <TableCell> Name</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">paid</TableCell>
                  <TableCell align="right">Discount</TableCell>
                  <TableCell align="right">Bankak</TableCell>
                  <TableCell align="right">user</TableCell>
                  <TableCell align="right">delete</TableCell>
                  <TableCell align="right">cancel</TableCell>
                  <TableCell align="right">pay</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {actviePatient.services.map((service) => {
                  return (
                    <TableRow
                      sx={{
                        borderBottom: "1px solid rgba(224, 224, 224, 1)",
                      }}
                      key={service.id}
                    >
                      <TableCell sx={{ border: "none" }} scope="row">
                        {service.name}
                      </TableCell>

                      <TableCell sx={{ border: "none" }} align="right">
                        {service.pivot.price}
                      </TableCell>
                      <TableCell sx={{ border: "none" }} align="right">
                        {service.pivot.amount_paid}
                      </TableCell>
                      <TableCell sx={{ border: "none" }} align="right">
                        <DiscountSelectService
                          service={service}
                          setPatients={setPatients}
                          id={service.id}
                          disc={service.pivot.discount}
                          actviePatient={actviePatient}
                        />
                      </TableCell>
                      <TableCell sx={{ border: "none" }} align="right">
                        <MyCheckBox
                          setPatients={setPatients}
                          key={actviePatient.id}
                          isbankak={service.pivot.bank == 1}
                          id={service.id}
                        ></MyCheckBox>
                      </TableCell>
                      <TableCell sx={{ border: "none" }} align="right">
                        {service.pivot.user.username}
                      </TableCell>
                      <TableCell sx={{ border: "none" }} align="right">
                        <IconButton
                          disabled={actviePatient?.is_lab_paid == 1}
                          aria-label="delete"
                          onClick={() => deleteService(service.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{ border: "none" }} align="right">
                      <MyLoadingButton
                         disabled={service.pivot.is_paid == 0}

                        loading={loading}
                         
                          onClick={(setLoading) => cancelPayHandler(service.id,setLoading)}
                        >
                          <Close />
                        </MyLoadingButton>
                      </TableCell>
                      <TableCell sx={{ border: "none" }} align="right">
                        <MyLoadingButton
                        active={service.pivot.is_paid}
                        disabled={service.pivot.is_paid}

                        loading={loading}
                         
                          onClick={(setLoading) => pay(service.id,setLoading)}
                        >
                          <Download />
                        </MyLoadingButton>
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
        
            <div className="total-price">
              <div className="sub-price">
                <div className="title">Total</div>
                <div>
                  {actviePatient.services.reduce((accum, service) => {
                    const discount = Number(
                      (service.pivot.discount * service.price) / 100
                    );
                    return accum + (service.price - discount);
                  }, 0)}
                </div>
              </div>
              <div className="sub-price">
                <div className="title">Paid</div>
                <div>
                  {actviePatient.is_lab_paid ? actviePatient.lab_paid : 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RequestedServices;
