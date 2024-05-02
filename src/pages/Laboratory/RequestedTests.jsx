import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DiscountSelect from "./DiscountSelect";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { url } from "../constants";
import { LoadingButton } from "@mui/lab";
import MyCheckBox from "./MyCheckBox";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";
function RequestedTests({setPatients}) {
  const  {setActivePatient,actviePatient,tests,setTests,setOpenSuccessDialog} = useOutletContext()
  const [loading, setLoading] = useState(false);
  console.log(actviePatient,'active patient',setActivePatient)
  console.log("patient tests rendered with tests", tests);
  const payHandler = () => {
    const totalPaid = tests.reduce((accum, test) => {
      console.log(Number((test.pivot.discount_per * test.price) / 100));
      const discount = Number((test.pivot.discount_per * test.price) / 100);
      return accum + (test.price - discount);
    }, 0);
    setLoading(true);
    axiosClient.patch(`labRequest/payment/${actviePatient.id}`,{ paid: totalPaid })
      .then(({data:data}) => {
        console.log(data)
        if (data.status) {
          setLoading(false);
          setPatients((prevPatients)=>{
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
          })
          //show success dialog
          setOpenSuccessDialog(() => ({
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
          setPatients((prevPatients)=>{
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
          })
          //show success dialog
          setOpenSuccessDialog(() => ({
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
   
     
          <TableContainer sx={{border:'none',textAlign:"left" }}>
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
                    <TableRow sx={{borderBottom:'1px solid rgba(224, 224, 224, 1)'}} key={test.id}>
                      <TableCell sx={{border:'none'}} component="th" scope="row">
                        {test.main_test_name}
                      </TableCell>
                      <TableCell  sx={{border:'none'}} align="right">{test.price}</TableCell>
                      <TableCell sx={{border:'none'}} align="right">
                        <DiscountSelect 
                        
                          setTests={setTests}
                          id={test.id}
                          disc={test.pivot.discount_per}
                          actviePatient={actviePatient}
                        />
                      </TableCell>
                      <TableCell sx={{border:'none'}} align="right">
                        < MyCheckBox isbankak={test.pivot.is_bankak}   id={test.id}></MyCheckBox>
                      </TableCell>
                      <TableCell sx={{border:'none'}} align="right">
                        <IconButton  disabled={actviePatient?.is_lab_paid == 1}
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
            disabled={actviePatient.is_lab_paid == 1}
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
