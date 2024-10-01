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
import { url, webUrl } from "../constants";
import { LoadingButton } from "@mui/lab";
import MyCheckBox from "./MyCheckBox";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";
import { useStateContext } from "../../appContext";
import { t } from "i18next";
import printJS from "print-js";
import { socket } from "../../socket";
function RequestedTests({
  setPatients,
  activePatient: actviePatient,
  setActivePatient,
  doctorVisit,
  change,
  pid 
}) {
  console.log(doctorVisit, "doctorVisit");
  // console.log("requested tests rendered");
  const {
    setDialog,

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
    const result = confirm(
      `${t("paycheckMsg")} ${actviePatient?.patient.total_lab_value_will_pay}`
    );
    if (!result) {
      return;
    }
    setLoading(true);
    axiosClient
      .patch(`payment/${doctorVisit.id}`)
      .then(({ data: data }) => {
        if (data.status) {
          console.log(data, "data");
          change(data.data);
          const form = new URLSearchParams();
          axiosClient
            .get(`printLab?pid=${actviePatient.patient.id}&base64=1`)
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
      .patch(`cancelPayment/${actviePatient.id}`)
      .then(({ data }) => {
        console.log(data, "data from cancel");
        if (data.status) {
          setLoading(false);

          change(data.data);
          //show success dialog
          setDialog(() => ({
            message: "Operation completed successfully",
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
    axiosClient.delete(`labRequest/${id}/${actviePatient.id}`).then(({ data }) => {
      // console.log(data, "data");
      if (data.status) {
       
        change(data.patient)
      }
    });
  };
  let total_endurance = 0;
  return (
    <>
      <Box className="">
      <a href={`${webUrl}printLabReceipt/${actviePatient.patient?.id}/${user?.id}`}>Receipt</a>

        <div className="requested-table">
          <TableContainer
          
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell> {t("name")}</TableCell>
                  <TableCell align="right">{t("price")}</TableCell>
                  {actviePatient.company ? (
                    ""
                  ) : (
                    <TableCell align="right">{t("discount")}</TableCell>
                  )}
                  {actviePatient.company ? (
                    ""
                  ) : (
                    <TableCell align="right">{t("bank")}</TableCell>
                  )}
                  {actviePatient.company ? (
                    <TableCell align="right">{t("endurance")}</TableCell>
                  ) : (
                    ""
                  )}
                  {actviePatient.company ? (
                    <TableCell align="right">{t("approval")}</TableCell>
                  ) : (
                    ""
                  )}
                  <TableCell align="right">{t("requestedBy")}</TableCell>

                  <TableCell align="right">-</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {actviePatient.patient.labrequests.map((test) => {
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
                      endurance = founedTest.pivot.endurance_static;
                    } else {
                      if (founedTest.pivot.endurance_percentage > 0) {
                        endurance =
                          (price * founedTest.pivot.endurance_percentage) / 100;
                      } else {
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
                          <DiscountSelect
                            setDialog={setDialog}
                            id={test.id}
                            disc={test.discount_per}
                            change={change}
                            actviePatient={actviePatient}
                          />
                        </TableCell>
                      )}
                      {actviePatient.company ? (
                        ""
                      ) : (
                        <TableCell sx={{ border: "none" }} align="right">
                          <MyCheckBox 
                          change={change}
                            key={actviePatient.id}
                            isbankak={test.is_bankak == 1}
                            id={test.id}
                          ></MyCheckBox>
                        </TableCell>
                      )}
                      {actviePatient.company ? (
                        <TableCell align="right">{endurance}</TableCell>
                      ) : (
                        ""
                      )}
                      {actviePatient.company ? (
                        <TableCell align="right">
                          {founedTest.pivot.approve ? (
                            <Button>الموافقه</Button>
                          ) : (
                            "لا يحتاج موافقه"
                          )}{" "}
                        </TableCell>
                      ) : (
                        ""
                      )}
                      <TableCell sx={{ border: "none" }} align="right">
                        {test.user_requested.username}
                      </TableCell>
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
          {/* <TableContainer sx={{m:1}} style={{ width: "18%", display: "inline-block" }}>
              <Table  size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{textAlign:'center'}} colSpan={2}> Laboratory</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell> Total </TableCell>
                <TableCell className="title">
                  {" "}
                  {actviePatient.patient?.total_lab_value_unpaid}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Discount </TableCell>
                <TableCell>
                  {actviePatient.patient?.discountAmount}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Amount Paid</TableCell>
                <TableCell className="title">
                  {actviePatient.patient.is_lab_paid
                    ? actviePatient.patient.paid
                    : 0}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>
                  {actviePatient.patient.is_lab_paid ? (
                    <LoadingButton
                      // disabled={actviePatient.patient.result_print_date}
                      loading={loading}
                      color="error"
                      onClick={cancelPayHandler}
                      sx={{ textAlign: "center", mb: 1 }}
                      variant="contained"
                    >
                      {t("cancel")}
                    </LoadingButton>
                  ) : (
                    <LoadingButton
                      loading={loading}
                      disabled={actviePatient.patient.is_lab_paid == 1}
                      color={
                        actviePatient.patient.is_lab_paid
                          ? "success"
                          : "primary"
                      }
                      onClick={payHandler}
                      sx={{ textAlign: "center", mb: 1 }}
                      variant="contained"
                    >
                      {t("pay")}
                    </LoadingButton>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          </TableContainer> */}
        
        </div>
        {actviePatient.patient.is_lab_paid ? (
                    <LoadingButton
                      // disabled={actviePatient.patient.result_print_date}
                      loading={loading}
                      color="error"
                      onClick={cancelPayHandler}
                      sx={{ textAlign: "center", mb: 1 }}
                      variant="contained"
                    >
                      {t("cancel")}
                    </LoadingButton>
                  ) : (
                    <LoadingButton
                      loading={loading}
                      disabled={actviePatient.patient.is_lab_paid == 1}
                      color={
                        actviePatient.patient.is_lab_paid
                          ? "success"
                          : "primary"
                      }
                      onClick={payHandler}
                      sx={{ textAlign: "center", mb: 1 }}
                      variant="contained"
                    >
                      {t("pay")}
                    </LoadingButton>
                  )}
      </Box>
    </>
  );
}

export default RequestedTests;
