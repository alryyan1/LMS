import {
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { TransitionGroup } from "react-transition-group";

import DiscountSelect from "./DiscountSelect";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { url } from "../constants";
import { LoadingButton } from "@mui/lab";
import MyCheckBox from "./MyCheckBox";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";
import Patient from "./Patient";
function RequestedTests({ setPatients }) {
  console.log("requested tests rendered");
  const {
    setDialog,
    setActivePatient,
    actviePatient,
    tests,
    companies,
  } = useOutletContext();
  console.log(actviePatient, "active patient in requested tests");
  const [loading, setLoading] = useState(false);
  console.log(actviePatient, "active patient", setActivePatient);
  console.log("patient tests rendered with tests", tests);
  const payHandler = () => {
    const totalPaid = actviePatient.labrequests.reduce((accum, test) => {
      console.log(Number((test.discount_per * test.price) / 100));
      const discount = Number((test.discount_per * test.price) / 100);
      return accum + (test.price - discount);
    }, 0);
    setLoading(true);
    axiosClient
      .patch(`labRequest/payment/${actviePatient.id}`, { paid: totalPaid })
      .then(({ data: data }) => {
        console.log(data,'patient paid data');
        if (data.status) {
          setActivePatient(data.data);

          setLoading(false);
          setPatients((prevPatients) => {
            return prevPatients.map((p) => {
              if (p.id === actviePatient.id) {
                return  data.data
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
        }
      }).finally(()=>setLoading(false));
  };
  const cancelPayHandler = () => {
    setLoading(true);
    fetch(`${url}labRequest/cancelPayment/${actviePatient.id}`, {
      method: "PATCH",

      headers: { "content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "data from cancel");
        if (data.status) {
          setLoading(false);
          setPatients((prevPatients) => {
            return prevPatients.map((p) => {
              if (p.id === actviePatient.id) {
                return {
                  ...p,
                  is_lab_paid: false,
                  lab_paid: 0,
                };
              } else {
                return p;
              }
            });
          });
          //show success dialog
          setDialog(() => ({
            msg: "تمت الغاء السداد بنجاح",
            open: true,
          }));
          setActivePatient((p) => {
            return { ...p, is_lab_paid: false, lab_paid: 0 };
          });
        }
      });
  };
  // useEffect(() => {
  //   axiosClient.get(`labRequest/${actviePatient.id}`)
  //     .then(({data}) => {
  //       console.log(data)
  //       console.log(data, "lab requestes");
  //       setTests(data.labrequests);
  //       // setActivePatient(data)
  //     }).catch((err)=>console.log(err));
  // }, [actviePatient]);

  const deleteTest = (id) => {
    console.log(id);
    axiosClient.delete(`labRequest/${id}`)
      .then(({data}) => {

        console.log(data,'data')
        if (data.status) {
          setActivePatient(data.data);
          setPatients((prev) => {
            return prev.map((p) => {
              if (p.id === actviePatient.id) {
                return data.data
              } else {
                return p;
              }
            });
          });
        }
      });
  };
  let total_endurance = 0;
  return (
    <>
      <div className="requested-tests">
        <div className="requested-table">
          <TableContainer sx={{ border: "none", textAlign: "left" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell> Name</TableCell>
                  <TableCell align="right">Price</TableCell>
                  {actviePatient.company ? "": <TableCell align="right">Discount</TableCell>}
                  {actviePatient.company ? "":   <TableCell align="right">Bankak</TableCell>}
                  {actviePatient.company ?  <TableCell align="right">Endurance</TableCell>: "" }
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
                <TableBody>
                  {actviePatient.labrequests.map((test) => {
                    console.log(test,'test')
                        let price  
                        let company
                        let endurance
                        if(actviePatient.company_id != null) {
                           company = companies.find((c)=>c.id == actviePatient.company_id)
                           price  = company.tests.find((t)=>t.id == test.id).pivot.price
                           endurance =   (price * company.lab_endurance) /100
                           total_endurance+= endurance;
                          console.log(company,'patient company')
                        }else{
                          price  = test.main_test.price
                        }
                    console.log(
                      "test.pivot.is_bankak",
                      typeof test.is_bankak
                    );
                    console.log(
                      "test.pivot.is_bankak = ",
                      test.is_bankak
                    );

                    return (
                        <TableRow
                          sx={{
                            borderBottom: "1px solid rgba(224, 224, 224, 1)",
                          }}
                          key={test.id}
                        >
                          <TableCell sx={{ border: "none" }} scope="row">
                            {test.main_test.main_test_name}
                          </TableCell>

                          <TableCell sx={{ border: "none" }} align="right">
                            {price}
                          </TableCell>
                          {actviePatient.company ? "":  <TableCell sx={{ border: "none" }} align="right">
                            <DiscountSelect
                             
                              setPatients={setPatients}
                              id={test.id}
                              disc={test.discount_per}
                              actviePatient={actviePatient}
                            />
                          </TableCell>}
                          {actviePatient.company ? "":   <TableCell sx={{ border: "none" }} align="right">
                            <MyCheckBox
                              setPatients={setPatients}
                              key={actviePatient.id}
                              isbankak={test.is_bankak == 1}
                              id={test.id}
                            ></MyCheckBox>
                          </TableCell>}
                  {actviePatient.company ?  <TableCell align="right">{endurance}</TableCell>: "" }

                          <TableCell sx={{ border: "none" }} align="right">
                            <IconButton
                              disabled={actviePatient?.is_lab_paid == 1}
                              aria-label="delete"
                              onClick={() => deleteTest(test.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
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
            {actviePatient.is_lab_paid ? (
              <LoadingButton
                loading={loading}
                color="error"
                onClick={cancelPayHandler}
                sx={{ textAlign: "center", mb: 1 }}
                variant="contained"
              >
                الغاء السداد
              </LoadingButton>
            ) : (
              <LoadingButton
                loading={loading}
                disabled={actviePatient.is_lab_paid == 1}
                color={actviePatient.is_lab_paid ? "success" : "primary"}
                onClick={payHandler}
                sx={{ textAlign: "center", mb: 1 }}
                variant="contained"
              >
                دفع الرسوم
              </LoadingButton>
            )}
            <div className="total-price">
              <div className="sub-price">
                <div className="title">Total</div>
                <div>
                  {actviePatient.company_id ==null  ? actviePatient.labrequests.reduce((accum, test) => {
                    const discount = Number(
                      (test.discount_per * test.main_test.price) / 100
                    );
                    return accum + (test.main_test.price - discount);
                  }, 0):total_endurance}
                </div>
              </div>
              <div className="sub-price">
                <div className="title">Paid</div>
                <div>
                  {actviePatient.is_lab_paid ? actviePatient.paid : 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RequestedTests;
