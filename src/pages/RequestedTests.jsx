import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DiscountSelect from "./discountSelect";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { ArrowBack } from "@mui/icons-material";
import { url } from "./constants";
import { LoadingButton } from "@mui/lab";
import MyCheckBox from "./MyCheckBox";
function RequestedTests({
  setActivePatient,
  actviePatient,
  tests,
  setTests,
  setLayOout,
  setOpenSuccessDialog,
}) {
  const [loading, setLoading] = useState(false);
  console.log("patient tests rendered with tests", tests);
  const payHandler = () => {
    const totalPaid = tests.reduce((accum, test) => {
      console.log(Number((test.pivot.discount_per * test.price) / 100));
      const discount = Number((test.pivot.discount_per * test.price) / 100);
      return accum + (test.price - discount);
    }, 0);
    setLoading(true);
    fetch(`${url}labRequest/payment/${actviePatient.id}`, {
      method: "PATCH",
      body: JSON.stringify({ paid: totalPaid }),
      headers: { "content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setLoading(false);
          //show success dialog
          setOpenSuccessDialog((pre) => ({
            msg: "تمت عمليه السداد بنجاح",
            open: true,
          }));
          setActivePatient((p) => {
            return { ...p, is_lab_paid: true ,lab_paid:totalPaid};
          });
        }
      });
  };
  const cancelPayHandler = () => {
   
    setLoading(true);
    fetch(`${url}labRequest/cancelPayment/${actviePatient.id}`, {
      method: "PATCH",
    
      headers: { "content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data,'data from cancel')
        if (data.status) {
          setLoading(false);
          //show success dialog
          setOpenSuccessDialog((pre) => ({
            msg: "تمت الغاء السداد بنجاح",
            open: true,
          }));
          setActivePatient((p) => {
            return { ...p, is_lab_paid:false,lab_paid:0};
          });
        }
      });
  };
  useEffect(() => {
    fetch(`${url}labRequest/${actviePatient.id}`, {
      headers: { "content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "lab requestes");
        setTests(data.labrequests);
      });
  }, [actviePatient]);


  const deleteTest = (id) => {
    console.log(id);
    fetch(`${url}labRequest/${actviePatient.id}`, {
      method: "DELETE",
      body: new URLSearchParams({ id }),
      headers: { "content-type": "application/x-www-form-urlencoded" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setTests(tests.filter((test) => test.id != id));
        }
      });
  };
  return (
    <>
      <div className="requested-tests">
        <div className="requested-table">
          <IconButton
            onClick={() => {
              setLayOout((pre) => {
                return {
                  ...pre,
                  showTestPanel: true,
                  tests: "",
                  requestedDiv: "2fr",
                };
              });
            }}
          >
            <ArrowBack></ArrowBack>
          </IconButton>
          <TableContainer sx={{ p: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell> Name</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Discount</TableCell>
                  <TableCell align="right">Bankak</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tests.map((test) => {
                  return (
                    <TableRow key={test.id}>
                      <TableCell component="th" scope="row">
                        {test.main_test_name}
                      </TableCell>
                      <TableCell align="right">{test.price}</TableCell>
                      <TableCell align="right">
                        <DiscountSelect 
                        
                          setTests={setTests}
                          id={test.id}
                          disc={test.pivot.discount_per}
                          activePatient={actviePatient}
                        />
                      </TableCell>
                      <TableCell align="right">
                        < MyCheckBox isbankak={test.pivot.is_bankak} activePatient={actviePatient}  id={test.id}></MyCheckBox>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton  disabled={actviePatient.is_lab_paid}
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
          {
            actviePatient.is_lab_paid ?      <LoadingButton 
              loading={loading}
              color="error"
              onClick={cancelPayHandler}
              sx={{ textAlign: "center",mb:1 }}
              variant="contained"
            >
              الغاء السداد
            </LoadingButton>:<LoadingButton
            loading={loading}
            disabled={actviePatient.is_lab_paid}
            color={actviePatient.is_lab_paid ? "success" : "primary"}
            onClick={payHandler}
            sx={{ textAlign: "center",mb:1 }}
            variant="contained"
          >
            دفع الرسوم
          </LoadingButton> 
          }
            <div className="total-price">
              <div className="sub-price">
                <div className="title">Total</div>
                <div>
                  {tests.reduce((accum, test) => {
                    console.log(
                      Number((test.pivot.discount_per * test.price) / 100)
                    );
                    const discount = Number(
                      (test.pivot.discount_per * test.price) / 100
                    );
                    return accum + (test.price - discount);
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

export default RequestedTests;
