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
import DeleteIcon from "@mui/icons-material/Delete";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";
import DiscountSelectService from "./DiscountSelectService";
import { Close, Download } from "@mui/icons-material";
import MyLoadingButton from "../../components/MyLoadingButton";
import MyCheckboxReception from "./MycheckboxReception";
import ServiceCountSelect from "./ServiceCountSelect";
function RequestedServices({ setPatients }) {
  const { setDialog, setActivePatient, actviePatient,setShowServicePanel,setShowPatientServices,setUpdate,activeShift,companies} = useOutletContext();
  const [loading, setLoading] = useState(false);
  console.log(companies,'companies')

  const pay = (id,setLoading) => {
    setLoading(true);
    axiosClient
      .get(`patient/service/pay/${actviePatient.id}?service_id=${id}`)
      .then(({ data }) => {
        console.log(data,'pay service')
        setActivePatient(data.patient);
        setUpdate((prev)=>prev+1)

        setDialog((prev)=>{
          return{
           ...prev,
            open:true,
            msg:"تم  السداد بنجاح",
            color:"success"
          }
        })
      }).finally(() => {setLoading(false);}).catch(({response:{data}})=>{
        setDialog((prev)=>{
          return{
           ...prev,
            open:true,
            msg:data.message,
            color:"error"
          }
        })
      });
  };
  const cancelPayHandler = (id,setLoading) => {
    setLoading(true);
     axiosClient.get(`patient/service/cancel/${actviePatient.id}?service_id=${id}`).then(({ data }) => {
      if(data.status) {
        setUpdate((prev)=>prev+1)

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
     }).finally(() => {setLoading(loading)}).catch(({response:{data}})=>{
      setDialog((prev)=>{
        return{
         ...prev,
          open:true,
          msg:data.message,
          color:"error"
        }
      })
    });
  };

  const deleteService = (id) => {
    axiosClient
      .delete(`patient/service/${actviePatient.id}?service_id=${id}`)
      .then(({ data }) => {
        if (data.status) {
          setActivePatient(data.patient);
          setUpdate((prev)=>prev+1)
          setDialog((prev) => {
            return {
              ...prev,
              open: true,
              msg: "تم الحذف بنجاح",
              color: "success",
            };
          });
        }
      }).catch(({response:{data}})=>{
        setDialog((prev)=>{
          return{
           ...prev,
            open:true,
            msg:data.message,
            color:"error"
          }
        })
      });
  };
  let total_endurance = 0

  return (
    <>
      <div className="requested-tests">
        <div style={{position:'relative'}}  className="requested-table">
          <Button sx={{position:'absolute',top:'-40px',left:'0px'}} onClick={()=>{
            setShowPatientServices(false)
            setShowServicePanel(true)}}>عرض قائمه الخدمات</Button>
          <TableContainer sx={{ border: "none", textAlign: "left" }}>
            <Table size="small" style={{ direction: "rtl" }}>
              <TableHead>
                <TableRow>
                  <TableCell> Name</TableCell>
                  <TableCell align="right">Price</TableCell>
                  { actviePatient.company_id ? <TableCell align="right">Endurance</TableCell>:   "" }
                  <TableCell align="right">paid</TableCell>
                  { actviePatient.company_id ? "":   <TableCell align="right">Discount</TableCell> }
                
                  { actviePatient.company_id ? "": <TableCell align="right">Bankak</TableCell>}
                  <TableCell align="right">count</TableCell>
                  <TableCell width={'5%'} align="right">delete</TableCell>
                  <TableCell width={'5%'} align="right">cancel</TableCell>
                  <TableCell width={'5%'} align="right">pay</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {actviePatient.services.filter((service)=>{
                  return service.pivot.doctor_id ==activeShift.doctor.id
                }).map((service) => {

                  let price  
                  let company
                  let endurance
                  if(actviePatient.company_id != null) {
                     company = companies.find((c)=>c.id == actviePatient.company_id)
                     price  = company.services.find((s)=>s.id == service.id).pivot.price
                     endurance =   (price * service.pivot.count) *company.service_endurance /100
                     total_endurance+= endurance;
                    console.log(company,'patient company')
                  }else{
                    price  = service.pivot.price
                  }
                  console.log(price,'price ')
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
                        {price}
                      </TableCell>
                      { actviePatient.company_id ?  <TableCell sx={{ border: "none" ,color:'red'}} align="right">
                       {endurance}
                      </TableCell>: ""}
                      <TableCell sx={{ border: "none" }} align="right">
                        {service.pivot.amount_paid}
                      </TableCell>
                      { actviePatient.company_id ? "": <TableCell sx={{ border: "none" }} align="right">
                        <DiscountSelectService
                          service={service}
                          id={service.id}
                          actviePatient={actviePatient}
                        />
                      </TableCell>}
                      { actviePatient.company_id ? "":  <TableCell sx={{ border: "none" }} align="right">
                        <MyCheckboxReception
                          disabled={service.pivot.is_paid == 0}
                          checked={service.pivot.bank == 1}
                          
                          id={service.id}
                        ></MyCheckboxReception>
                      </TableCell>}
                      <TableCell sx={{ border: "none" }} align="right">
                        <ServiceCountSelect
                          service={service}
                          id={service.id}
                          actviePatient={actviePatient}
                          disabled={service.pivot.is_paid == 1}
                        />
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
                
                <Typography  variant="h3">
                  {actviePatient.company_id ==null  ? actviePatient.services.filter((service)=>{
                  return service.pivot.doctor_id == activeShift.doctor.id
                }).reduce((accum, service) => {
                    console.log(service.pivot.count,'service.pivot.count)')
                    const total = service.price * service.pivot.count;
                    const discount = Number(
                      (service.pivot.discount * total ) / 100
                    );
                    return accum + (total - discount);
                  }, 0) : total_endurance}
                </Typography>
              </div>
              <div className="sub-price">
                <div className="title">Paid</div>
                <Typography  variant="h3">
                {actviePatient.services.filter((service)=>{
                  return service.pivot.doctor_id ==activeShift.doctor.id
                }).reduce((accum, service) => {
                   
                    return accum + service.pivot.amount_paid ;
                  }, 0)}
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
