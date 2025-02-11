import {
  Box,
  Button,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import DiscountSelect from "./DiscountSelect";
import { act, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatNumber, printBarcodeRaw, PrintLab, updateHandler, url } from "../constants";
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
import { Company, DoctorVisit, MainTest, User } from "../../types/Patient";
import MyTableCell from "../inventory/MyTableCell";
import MyLoadingButton from "../../components/MyLoadingButton";
import { DollarSignIcon, Download, Group } from "lucide-react";
import {
  Cancel,
  CancelOutlined,
  CurrencyExchange,
  KeyboardDoubleArrowDown,
  Money,
} from "@mui/icons-material";
import InvoiceCard from "../Clinic/InvoiceCard";
import InvoiceCardLab from "../Clinic/InvoiceCardLab";
interface RequestedTestsLab {
  setDialog: (dialog: any) => void;
  actviePatient: DoctorVisit;
  companies: Company[];
  userSettings: any;
  update: (patient: DoctorVisit) => void;
}
function RequestedTestsLab({
  setDialog,
  actviePatient,
  companies,
  userSettings,
  update,
  setAllMoneyUpdatedLab
}: RequestedTestsLab) {
  console.log(actviePatient, "activePatient from");
  const { user }= useStateContext();
  const [loading, setLoading] = useState(false);
  const payHandler = async() => {

    if(!user?.canPayLab){
      PrintLab(actviePatient,userSettings)

      return
    }
    const result = confirm(
      `${t("هل تؤكد استلامك مبلغ قدره")} ${actviePatient?.patient.labrequests.filter((l) => l.is_paid == 0).reduce((prev, curr) => prev + curr.price, 0) - actviePatient.patient.discountAmount}`
    );
    if (!result) {
      return;
    }
    // axiosClient.get(`patient/barcode/${actviePatient.id}`).then(({data})=>{
    //   console.log(data,'barcode')
    //   })
    try{
      printBarcodeRaw(actviePatient)

    }catch(e){

    }

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
          if(setAllMoneyUpdatedLab){

            setAllMoneyUpdatedLab((prev)=>prev+1)
          }
          const r = confirm("هل تريد طباعه الايصال");
          if (r) {
            PrintLab(actviePatient,userSettings)
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
  const payHandlerSingleTest = (test_id, setLoading) => {
    setLoading(true);
    axiosClient
      .patch(`paymentSingleTest/${actviePatient.id}`, {
        test_id
      })
      .then(({ data: data }) => {
        if(setAllMoneyUpdatedLab){

          setAllMoneyUpdatedLab((prev)=>prev+1)
        }

        console.log(data, "patient paid data");
        if (data.status) {
          update(data.data);

          setLoading(false);

          //show success dialog
        }
      })

      .finally(() => setLoading(false));
  };
  const cancelPayHandler = () => {
    setLoading(true);
    axiosClient
      .patch(`cancelPayment/${actviePatient.id}`)
      .then(({ data }) => {

        if(setAllMoneyUpdatedLab){

          setAllMoneyUpdatedLab((prev)=>prev+1)
        }

        console.log(data, "data from cancel");
        if (data.status) {
          setLoading(false);
          setDialog(() => ({
            message: "تمت الغاء السداد بنجاح",
            open: true,
          }));
          update(data.data);
        }
      })
      .catch(({ response: { data } }) => {
        setDialog((prev) => {
          return { ...prev, open: true, message: data.message, color: "error" };
        });
      })
      .finally(() => setLoading(false));
  };
  const cancelPaySingleTestHandler = (test) => {
    setLoading(true);
    axiosClient
      .patch(`cancelPaymentSingleTest/${actviePatient.id}`, {
        test_id: test.id,
      })
      .then(({ data }) => {
        if(setAllMoneyUpdatedLab){

          setAllMoneyUpdatedLab((prev)=>prev+1)
        }

        if (data.status) {
          setLoading(false);
          update(data.data);
        }
      })

      .finally(() => setLoading(false));
  };
  const deleteTest = (id: number, doctorVisit: DoctorVisit) => {
    axiosClient
      .delete(`labRequest/${id}/${doctorVisit.id}`)
      .then(({ data }) => {
        if(setAllMoneyUpdatedLab){

          setAllMoneyUpdatedLab((prev)=>prev+1)
        }

        console.log(data, "data deleted");
        update(data.data);
      });
  };
  let total_endurance = 0;
  return (
    <>
     {actviePatient.patient.labrequests.length > 0 ?  <Box sx={{ p: 1 }} className="">
        <div className="">
          <Stack direction='row' gap={1}>
          <Typography>Lab Requests</Typography>
          {actviePatient.patient.is_lab_paid ? (
                <LoadingButton
                  // disabled={actviePatient.patient.result_print_date}
                  loading={loading}
                  color="error"
                  onClick={cancelPayHandler}
                  sx={{ textAlign: "center" }}
                >
                  <CancelOutlined />
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
                >
                  <KeyboardDoubleArrowDown />
                </LoadingButton>
              )}
          </Stack>
        
          <TableContainer sx={{height:'350px',overFlow:'auto'}}>
            <Table className="table-small" size="small">
              <TableHead className="thead">
                <TableRow>
                  <TableCell> Name</TableCell>
                  <TableCell>Price</TableCell>
                  {actviePatient.patient?.company ? (
                    ""
                  ) : (
                    <TableCell>Discount</TableCell>
                  )}

                  <TableCell>Paid</TableCell>
                  <TableCell>Bank</TableCell>

                  {actviePatient.patient?.company ? (
                    <TableCell>التحمل</TableCell>
                  ) : (
                    ""
                  )}
                  {actviePatient.patient?.company ? (
                    <TableCell>الموافقه</TableCell>
                  ) : (
                    ""
                  )}
                  {/* <TableCell >{t("requestedBy")}</TableCell> */}
                  <TableCell>Pay</TableCell>
                  <TableCell>-</TableCell>
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
                    <TableRow key={test.id}>
                      <TableCell sx={{ width: "200px" }}>
                        <Tooltip title={`added by ${test.user_requested?.username}`}>
                          {test.main_test.main_test_name}
                        </Tooltip>{" "}
                      </TableCell>

                      <TableCell>{formatNumber(price)}</TableCell>
                      {actviePatient.patient.company ? (
                        ""
                      ) : (
                        <MyTableCell
                          update={update}
                          disabled={test.is_paid}
                          sx={{ width: "50px" }}
                          table="labRequest"
                          colName={"discount_per"}
                          item={test}
                        >
                          {test.discount_per}
                        </MyTableCell>
                      )}
                      <TableCell sx={{ width: "200px" }}>
                        <Tooltip title={`paid by ${test?.user_deposited?.username}`}>
                          {test.amount_paid}
                        </Tooltip>{" "}
                      </TableCell>

                      {/* <TableCell>{test.amount_paid}</TableCell> */}

                      <TableCell>
                        <MyCheckBoxLab
                        disabled={!test.is_paid}
                         setAllMoneyUpdatedLab={setAllMoneyUpdatedLab}
                          activePatient={actviePatient}
                          update={update}
                          key={actviePatient.id}
                          isbankak={test.is_bankak == 1}
                          id={test.id}
                        ></MyCheckBoxLab>
                      </TableCell>

                      {actviePatient.patient.company ? (
                        <TableCell>{test.endurance}</TableCell>
                      ) : (
                        ""
                      )}
                      {actviePatient.patient.company ? (
                        <TableCell>
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
                      <TableCell>
                        {test.is_paid ? (
                          <LoadingButton
                            // disabled={actviePatient.patient.result_print_date}
                            loading={loading}
                            color="error"
                            onClick={() => {
                              cancelPaySingleTestHandler(test);
                            }}
                            sx={{ textAlign: "center" }}
                          >
                            <Cancel />
                          </LoadingButton>
                        ) : (
                          <MyLoadingButton
                            active={test.is_paid}
                            disabled={test.is_paid === 1}
                            loading={loading}
                            onClick={(setLoading) => {
                              payHandlerSingleTest(test.id, setLoading);
                            }}
                          >
                            <Download />
                          </MyLoadingButton>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          disabled={test.is_paid == 1}
                          aria-label="delete"
                          onClick={() => deleteTest(test.id, actviePatient)}
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
          {actviePatient.patient.discountAmount > 0 && <TextField defaultValue={actviePatient.patient.discount_comment} onChange={(e)=>{
            updateHandler(e.target.value,'discount_comment',actviePatient)
          }} label='سبب التخفيض' fullWidth sx={{mt:2}}/>}
        </div>

        {/* <div className="total-price mt-1">
          <div className="sub-price">
            <div className="title">Total</div>
            <Typography variant="h5">
              {formatNumber(actviePatient.patient?.total_lab_value_unpaid)}
            </Typography>
          </div>
          <div className="sub-price">
            <div className="title">Discount</div>
            <Typography variant="h5">
              {formatNumber(actviePatient.patient?.discountAmount)}
            </Typography>
          </div>
          <div className="sub-price">
            <div className="title">Paid</div>
            <Typography variant="h5">
              {formatNumber(actviePatient.patient.paid)}
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
                >
                  <CancelOutlined />
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
                >
                  <KeyboardDoubleArrowDown />
                </LoadingButton>
              )}
            </div>
          </div>
        </div> */}
        <InvoiceCardLab actviePatient={actviePatient}/>
     
      </Box>: <div className='text-center'>لا يوجد تحاليل مطلوبه</div> }
    </>
  );
}

export default RequestedTestsLab;
