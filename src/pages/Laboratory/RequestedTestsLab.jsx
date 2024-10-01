import {
    Box,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
  } from "@mui/material";
  
  import DiscountSelect from "./DiscountSelect";
  import { useState } from "react";
  import DeleteIcon from "@mui/icons-material/Delete";
  import { url } from "../constants";
  import { LoadingButton } from "@mui/lab";
  import MyCheckBox from "./MyCheckBox";
  import { useOutletContext } from "react-router-dom";
  import axiosClient from "../../../axios-client";
  import { useStateContext } from "../../appContext";
  import {t} from "i18next"
  import printJS from "print-js";
import DiscountSelectLab from "./DiscountSelectLab";
import MyCheckBoxLab from "./MyCheckboxLab";
import { socket } from "../../socket";
  function RequestedTestsLab({ setPatients }) {
    // console.log("requested tests rendered");
    const {
      setDialog,
      setActivePatient,
      actviePatient,
      tests,
      companies,
      userSettings,
    } = useOutletContext();
    const { user } = useStateContext();
    // console.log(actviePatient, "active patient in requested tests");
    const [loading, setLoading] = useState(false);
    // console.log(actviePatient, "active patient", setActivePatient);
    // console.log("patient tests rendered with tests", tests);
    const payHandler = () => {
      // const totalPaid = actviePatient.labrequests.reduce((accum, test) => {
      //   console.log(Number((test.discount_per * test.price) / 100));
      //   const discount = Number((test.discount_per * test.price) / 100);
      //   return accum + (test.price - discount);
      // }, 0);
      const result = confirm(`${t('paycheckMsg')} ${actviePatient?.total_lab_value_will_pay}`);
      if (!result) {
        return;
      }
      setLoading(true);
      axiosClient
        .patch(`lab/payment/${actviePatient.id}`, { paid: actviePatient?.total_lab_value_will_pay })
        .then(({ data: data }) => {
          console.log(data, "patient paid data");
          if (data.status) {
            setActivePatient(data.data);
          socket.emit('labPayment',actviePatient.id)
            
            const form = new URLSearchParams();
            axiosClient
              .get(`printLab?pid=${actviePatient.id}&base64=1`)
              .then(({ data }) => {
                form.append("data", data);
                form.append("node_direct", userSettings.node_direct);
                console.log(data, "daa");
                if (userSettings?.web_dialog) {
                  printJS({
                    printable: data.slice(data.indexOf("JVB")),
                    base64: true,
                    type: "pdf",
                  });
                }
                if (userSettings?.node_direct) {
                  fetch("http://127.0.0.1:4000/", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
  
                    body: form,
                  }).then(() => {});
                }
              });
  
            setLoading(false);
            setPatients((prevPatients) => {
              return prevPatients.map((p) => {
                if (p.id === actviePatient.id) {
                  return { ...data.data, active: true };
                } else {
                  return p;
                }
              });
            });
            //show success dialog
            setDialog(() => ({
              message: "تمت عمليه السداد بنجاح",
              open: true,
            }));
          }
        })
        .catch(({ response: { data } }) => {
          setDialog((prev) => {
            return { ...prev, open: true, message: data.message, color: "error" };
          });
        })
        .finally(() => setLoading(false));
    };
    const cancelPayHandler = () => {
      setLoading(true);
      axiosClient
        .patch(`cancelPaymentLab/${actviePatient.id}`)
        .then(({ data }) => {
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
                    active: true,
                  };
                } else {
                  return p;
                }
              });
            });
            //show success dialog
            setDialog(() => ({
              message: "تمت الغاء السداد بنجاح",
              open: true,
            }));
            setActivePatient((p) => {
              return { ...p, is_lab_paid: false, lab_paid: 0 };
            });
          }
        })
        .catch(({ response: { data } }) => {
          setDialog((prev) => {
            return { ...prev, open: true, message: data.message, color: "error" };
          });
        })
        .finally(() => setLoading(false));
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
      // console.log(id);
      axiosClient.delete(`deleteLab/labRequest/${id}`).then(({ data }) => {
        // console.log(data, "data");
        if (data.status) {
          setActivePatient(data.data);
          setPatients((prev) => {
            return prev.map((p) => {
              if (p.id === actviePatient.id) {
                return { ...data.data, active: true };
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
        <Box sx={{ p: 1 }} className="requested-tests">
          <div className="requested-table">
            <TableContainer sx={{ border: "none", textAlign: "left" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell> {t('name')}</TableCell>
                    <TableCell align="right">{t('price')}</TableCell>
                    {actviePatient.company ? (
                      ""
                    ) : (
                      <TableCell align="right">{t('discount')}</TableCell>
                    )}
                    {actviePatient.company ? (
                      ""
                    ) : (
                      <TableCell align="right">{t('bank')}</TableCell>
                    )}
                    {actviePatient.company ? (
                      <TableCell align="right">{t('endurance')}</TableCell>
                    ) : (
                      ""
                    )}
                        {actviePatient.company ? (
                      <TableCell align="right">{t('approval')}</TableCell>
                    ) : (
                      ""
                    )}
                    <TableCell align="right">{t('requestedBy')}</TableCell>
  
                    <TableCell align="right">-</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {actviePatient.labrequests.map((test) => {
                    // console.log(test, "test");
                    let price;
                    let company;
                    let endurance;
                    let founedTest;
                    if (actviePatient.company_id != null) {
                      company = companies.find(
                        (c) => c.id == actviePatient.company_id
                      );
                      // console.log("founded company", company);
                       founedTest = company.tests.find(
                        (t) => t.id == test.main_test_id
                      );
                      // console.log(test, "patient test");
                      // console.log(founedTest, "founed test");
                      price = test.price;
                      if (founedTest.pivot.endurance_static > 0) {
                        // alert('s')
                        endurance =founedTest.pivot.endurance_static
                        
                      }else{
                         if(founedTest.pivot.endurance_percentage > 0 ){
                        endurance = (price * founedTest.pivot.endurance_percentage) / 100;
  
                      }else{
                        endurance = (price * company.lab_endurance) / 100;
  
                      }
                      }
                     
                      total_endurance += endurance;
                      // console.log(company, "patient company");
                    } else {
                      price = test.main_test.price;
                    }
                    // console.log("test.pivot.is_bankak", typeof test.is_bankak);
                    // console.log("test.pivot.is_bankak = ", test.is_bankak);
  
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
                        {actviePatient.company ? (
                          ""
                        ) : (
                          <TableCell sx={{ border: "none" }} align="right">
                            <DiscountSelectLab
                             setActivePatient={setActivePatient}
                             setPatients={setPatients}
                              setDialog={setDialog}
                            
                              id={test.id}
                              disc={test.discount_per}
                              actviePatient={actviePatient}
                            />
                          </TableCell>
                        )}
                        {actviePatient.company ? (
                          ""
                        ) : (
                          <TableCell sx={{ border: "none" }} align="right">
                            <MyCheckBoxLab
                            setActivePatient={setActivePatient}
                        
                            
                              setPatients={setPatients}
                              key={actviePatient.id}
                              isbankak={test.is_bankak == 1}
                              id={test.id}
                            ></MyCheckBoxLab>
                          </TableCell>
                        )}
                        {actviePatient.company ? (
                          <TableCell align="right">{endurance}</TableCell>
                        ) : (
                          ""
                        )}
    {actviePatient.company ? (
                      <TableCell align="right">{founedTest.pivot.approve ? <Button>الموافقه</Button> :'لا يحتاج موافقه' } </TableCell>
                    ) : (
                      ""
                    )}
                    <TableCell sx={{ border: "none" }} align="right">{test.user_requested.username}</TableCell>
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
  
          <div style={{ marginTop: "10px" }} className="total-price">
            <div className="sub-price">
              <div className="title">Total</div>
              <div>
                {actviePatient?.total_lab_value_unpaid}
              </div>
            </div>
            <div className="sub-price">
              <div className="title">Paid</div>
              <div>{actviePatient.is_lab_paid ? actviePatient.paid : 0}</div>
            </div>
          </div>
          <div className="requested-total">
            <div className="money-info">
              {actviePatient.is_lab_paid ? (
                <LoadingButton
                  // disabled={actviePatient.result_print_date}
                  loading={loading}
                  color="error"
                  onClick={cancelPayHandler}
                  sx={{ textAlign: "center", mb: 1 }}
                  variant="contained"
                >
                   {t('cancel')}
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
                  {t('pay')} 
                </LoadingButton>
              )}
            </div>
          </div>
        </Box>
      </>
    );
  }
  
  export default RequestedTestsLab;