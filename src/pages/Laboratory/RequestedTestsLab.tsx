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
  Typography,
} from "@mui/material";

import DiscountSelect from "./DiscountSelect";
import { act, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatNumber, url } from "../constants";
import { LoadingButton } from "@mui/lab";
import MyCheckBox from "./MyCheckBox";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";
import { useStateContext } from "../../appContext";
import { t } from "i18next";
import printJS from "print-js";
import DiscountSelectLab from "./DiscountSelectLab";
import MyCheckBoxLab from "./MyCheckboxLab";
import { socket } from "../../socket";
import { LabLayoutPros } from "../../LabLayout";
import { Company, DoctorVisit, MainTest } from "../../types/Patient";
import MyTableCell from "../inventory/MyTableCell";
interface RequestedTestsLab {
  setDialog: (dialog: any) => void;
  actviePatient: DoctorVisit;
  companies: Company[];
  userSettings: any;
  update : (patient: DoctorVisit) => void;
}
function RequestedTestsLab({
  setDialog,
  actviePatient,
  companies,
  userSettings,
  update
}: RequestedTestsLab) {
  console.log(actviePatient,'activePatient from')
  const { user } = useStateContext();
  const [loading, setLoading] = useState(false);
  const payHandler = () => {
    const result = confirm(
      `${t("paycheckMsg")} ${actviePatient?.patient.total_lab_value_will_pay}`
    );
    if (!result) {
      return;
    }
    // axiosClient.get(`patient/barcode/${actviePatient.id}`).then(({data})=>{
    //   console.log(data,'barcode')
    //   })

    fetch("http://127.0.0.1:5000/", {
      method: "POST",
      headers: {
        "Content-Type": "APPLICATION/JSON",
      },

      body: JSON.stringify(actviePatient),
    }).then(() => {});
    setLoading(true);
    axiosClient
      .patch(`payment/${actviePatient.id}`, {
        paid: actviePatient?.patient.total_lab_value_will_pay,
      })
      .then(({ data: data }) => {
        
 
        console.log(data, "patient paid data");
        if (data.status) {
          update(data.data);
          socket.emit("labPayment", data.data);

          const r = confirm("هل تريد طباعه الايصال");
          if (r) {
            const form = new URLSearchParams();
            axiosClient
              .get(`printLab/${actviePatient.id}?base64=1`)
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
          }

          setLoading(false);
    
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
      .patch(`cancelPayment/${actviePatient.id}`)
      .then(({ data }) => {
        console.log(data, "data from cancel");
        if (data.status) {
          setLoading(false);
          setDialog(() => ({
            message: "تمت الغاء السداد بنجاح",
            open: true,
          }));
          update(data.data)
        }
      })
      .catch(({ response: { data } }) => {
        setDialog((prev) => {
          return { ...prev, open: true, message: data.message, color: "error" };
        });
      })
      .finally(() => setLoading(false));
  };
  const deleteTest = (id:number,doctorVisit:DoctorVisit) => {
    axiosClient.delete(`labRequest/${id}/${doctorVisit.id}`).then(({ data }) => {
      console.log(data, "data deleted");
        update(data.data)
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
                  <TableCell> Name</TableCell>
                  <TableCell >Price</TableCell>
                  {actviePatient.patient?.company ? (
                    ""
                  ) : (
                    <TableCell >Discount</TableCell>
                  )}
               
                    <TableCell >Bank</TableCell>
                  
                  {actviePatient.patient?.company ? (
                    <TableCell >التحمل</TableCell>
                  ) : (
                    ""
                  )}
                  {actviePatient.patient?.company ? (
                    <TableCell >الموافقه</TableCell>
                  ) : (
                    ""
                  )}
                  {/* <TableCell >{t("requestedBy")}</TableCell> */}

                  <TableCell >-</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {actviePatient.patient.labrequests.map((test) => {
                  // console.log(test, "test");
                  let price;
                  let endurance;
                  let founedTest;
                  if (actviePatient.patient.company_id != null) {
                    price = test.price;
                    total_endurance += endurance;
                  } else {
                    price = test.main_test.price;
                  }

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

                      <TableCell >
                        {formatNumber(price)}
                      </TableCell>
                      {actviePatient.patient.company ? (
                        ""
                      ) : (
                        <MyTableCell update={update} disabled={actviePatient.patient.is_lab_paid} sx={{width:'70px'}} table="labRequest" colName={'discount_per'} item={test} >
                         {test.discount_per}
                        </MyTableCell>
                      )}
                  
                        <TableCell >
                          <MyCheckBoxLab
                          activePatient={actviePatient}
                            update={update}
                            key={actviePatient.id}
                            isbankak={test.is_bankak == 1}
                            id={test.id}
                          ></MyCheckBoxLab>
                        </TableCell>
                      
                      {actviePatient.patient.company ? (
                        <TableCell >{test.endurance}</TableCell>
                      ) : (
                        ""
                      )}
                      {actviePatient.patient.company ? (
                        <TableCell >
                          {test.approve ? (
                            <Button>الموافقه</Button>
                          ) : (
                            "لا يحتاج موافقه"
                          )}{" "}
                        </TableCell>
                      ) : (
                        ""
                      )}
                      {/* <TableCell >
                        {test.user_requested.username}
                      </TableCell> */}
                      <TableCell >
                        <IconButton
                          disabled={actviePatient.patient?.is_lab_paid == 1}
                          aria-label="delete"
                          onClick={() => deleteTest(test.id,actviePatient)}
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

        <div  className="total-price mt-1">
          <div className="sub-price">
            <div className="title">Total</div>
            <Typography variant="h4">{formatNumber(actviePatient.patient?.total_lab_value_unpaid)}</Typography>
          </div>
          <div className="sub-price">
            <div className="title">Discount</div>
            <Typography variant="h4">{formatNumber(actviePatient.patient?.discountAmount)}</Typography>
          </div>
          <div className="sub-price">
            <div className="title">Paid</div>
            <Typography variant="h4">
              {actviePatient.patient.is_lab_paid
                ? actviePatient.patient.paid
                : 0}
            </Typography>
          </div>
          <div className="requested-total">
          <div className="money-info">
            {actviePatient.patient.is_lab_paid ? (
              <LoadingButton
                // disabled={actviePatient.patient.result_print_date}
                loading={loading}
                color="error"
                onClick={cancelPayHandler}
                sx={{ textAlign: "center" }}
                variant="contained"
              >
                {t("cancel")}
              </LoadingButton>
            ) : (
              <LoadingButton
                loading={loading}
                disabled={actviePatient.patient.is_lab_paid == 1}
                color={
                  actviePatient.patient.is_lab_paid ? "success" : "primary"
                }
                onClick={payHandler}
                sx={{ textAlign: "center" }}
                variant="contained"
              >
                {t("pay")}
              </LoadingButton>
            )}
          </div>
        </div>
        </div>
        
      </Box>
    </>
  );
}

export default RequestedTestsLab;
