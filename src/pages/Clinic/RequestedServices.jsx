import {
  Button,
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
import MyCheckboxReception from "./MycheckboxReception";
function RequestedServices({ setPatients }) {
  const { setDialog, setActivePatient, actviePatient,setShowServicePanel,setShowPatientServices} = useOutletContext();
  const [loading, setLoading] = useState(false);

  const pay = (id,setLoading) => {
    setLoading(true);
    axiosClient
      .get(`patient/service/pay/${actviePatient.id}?service_id=${id}`)
      .then(({ data }) => {
        console.log(data)
        setActivePatient(data.patient);
       
        setDialog((prev)=>{
          return{
           ...prev,
            open:true,
            msg:"تم  السداد بنجاح",
            color:"success"
          }
        })
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
          <Button onClick={()=>{
            setShowPatientServices(false)
            setShowServicePanel(true)}}>عرض قائمه الخدمات</Button>
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
                          id={service.id}
                          actviePatient={actviePatient}
                        />
                      </TableCell>
                      <TableCell sx={{ border: "none" }} align="right">
                        <MyCheckboxReception
                          setPatients={setPatients}
                          key={actviePatient.id}
                          disabled={service.pivot.is_paid == 0}
                          checked={service.pivot.bank == 1}
                          
                          id={service.id}
                        ></MyCheckboxReception>
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
                        disabled={service.pivot.is_paid === 1}

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
                {actviePatient.services.reduce((accum, service) => {
                   
                    return accum + service.pivot.amount_paid ;
                  }, 0)}
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
