import {
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { ReactElement, useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { DoctorVisit, User } from "./types/Patient";
import { FileIcon, Info, UserIcon } from "lucide-react";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";
import { formatNumber, toFixed, webUrl } from "./pages/constants";
import { Cost, Deduct } from "./types/Shift";
import { format, setQuarter } from "date-fns";
import { DeleteOutline } from "@mui/icons-material";
import PatientDetailsDialog from "./pages/Dialogs/PatientDetailsDialog";
type Report =
  | "Insurance Reclaim"
  | "Insurance Reclaim from Company"
  | "Lab Statistics"
  | "Lab Income"
  | "Clinics"
  | "Service Statistics"
  | "Costs-1"
  | "Costs-2"
  | "Pharmacy Income 2"
  | "Patients"
  | "Discount";
function AllReports() {
  const [users, setUsers] = useState<User[]>([]);
  const [bankFilter, setBankFilter] = useState(false);
  const [discountFilter, setDiscountFilter] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  console.log(selectedUser, "selected user");
  const [firstDate, setFirstDate] = useState(dayjs(new Date()));
  const [secondDate, setSecondDate] = useState(dayjs(new Date()));
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctors, setDoctors] = useState([]);
  const [tableElement, setTableElement] = useState<ReactElement | null>(null);
  const [show, setShow] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<DoctorVisit | null>(
    null
  );
  console.log(bankFilter,'bankfilter')
  const [queryString, setqueryString] = useState("");
  useEffect(() => {
    document.title = "التقارير";

    axiosClient("users").then(({ data }) => {
      setUsers(data);
    });
    axiosClient("doctors").then(({ data }) => {
      setDoctors(data);
    });
  }, []);
  const searchHandler = () => {
    setLoading(true);
    const firstDayjs = firstDate.format("YYYY/MM/DD");
    const secondDayjs = secondDate.format("YYYY/MM/DD");
    let url = "";
    switch (report) {
      case "Insurance Reclaim":
        url = "doctorReclaimFromInsurance";

        break;
        case "Insurance Reclaim from Company":
          url = `getDoctorReclaimAccordingToCompany?doctor_id=${selectedDoctor?.id}`;
  
          break;
      case "Lab Statistics":
        url = "lab-statistics";
        break;
      case "Lab Income":
        url = "lab-income";
        break;
      case "Clinics":
        url = "clinics";
        break;
      case "Service Statistics":
        url = "service-statistics";
        break;
      case "Costs-1":
        url = `costs-1${queryString}`;
        break;
      case "Costs-2":
        url = "costs-2";
        break;

   
        case "Pharmacy Income 2":
          url = "searchDeductsByDate2";
          break;
      case "Patients":
        url = "patients-all";
        break;
      case "Discount":
        url = "discount";
        break;

      default:
        url = "insurance-reclaim";
    }
    axiosClient
      .post(url, {
        first: firstDate.toISOString(),
        second: secondDate.toISOString(),
        doctor: selectedDoctor?.id,
      })
      .then(({ data }) => {
        console.log(data);
        switch (report) {
          case "Insurance Reclaim":
            setDoctorReclaimFromInsuranceTable(data);
            break;
            case "Insurance Reclaim from Company":
              setDoctorReclaimFromCompanyTable(data);
              break;
          case "Lab Statistics":
            setLabStatistics(data);
            break;
          case "Lab Income":
            setLabIncome(data);
            break;
          case "Clinics":
            setClinics(data);
            break;
          case "Service Statistics":
            setServiceStatistics(data);
            break;
          case "Costs-1":
            setCosts1(data);
            break;
          case "Costs-2":
            setCosts2(data);
            break;
          case "Pharmacy Income":
            setPharmacyIncome(data);
            break;
            case "Pharmacy Income 2":
              setPharmacyIncome2(data);
              break;
          case "Patients":
            setPatients(data);
            break;
          case "Discount":
            setDiscount(data);
            break;
          default:
          // setTableElement(setInsuranceReclaimTable());
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const setDoctorReclaimFromInsuranceTable = (data) => {
    setTableElement(
      <>
        <Stack
          justifyContent={"space-around"}
          direction={"row"}
          gap={1}
          sx={{ mb: 1 }}
        >
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            gap={1}
            className="shadow-sm text-center items-center  bg-red-100 p-2 rounded-sm "
          >
            <Typography variant="h5">استحقاق التامين</Typography>
            <Typography variant="h5">
              {formatNumber(data.total_reclaim_insurance)}
            </Typography>
          </Stack>
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            gap={1}
            className="shadow-sm text-center items-center bg-red-100 p-2 rounded-sm "
          >
            <Typography variant="h5">استحقاق النقدي</Typography>
            <Typography variant="h5">
              {formatNumber(data.total_reclaim_cash)}
            </Typography>
          </Stack>
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            gap={1}
            className="shadow-sm text-center items-center bg-red-100 p-2 rounded-sm "
          >
            <Typography variant="h5"> عدد المرضي (نقدي)</Typography>
            <Typography variant="h5">{data.count_cash}</Typography>
          </Stack>
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            gap={1}
            className="shadow-sm text-center items-center bg-red-100 p-2 rounded-sm "
          >
            <Typography variant="h5"> عدد المرضي (تامين)</Typography>
            <Typography variant="h5">{data.count_insurance}</Typography>
          </Stack>
        </Stack>
        <Divider />
        <Table style={{ direction: "rtl" }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>التاريخ</TableCell>
              <TableCell>اجمالي المبلغ</TableCell>
              <TableCell>نصيب الطبيب نقدي</TableCell>
              <TableCell>نصيب الطبيب التامين</TableCell>
              <TableCell>عدد المرضي (نقدي)</TableCell>
              <TableCell>عدد المرضي (تامين)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.day}</TableCell>
                <TableCell>{item.total}</TableCell>
                <TableCell>{formatNumber(item.reclaim_cash)}</TableCell>
                <TableCell>{formatNumber(item.reclaim_insurance)}</TableCell>
                <TableCell>{item.count_cash}</TableCell>
                <TableCell>{item.count_insurance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  };
  const setDoctorReclaimFromCompanyTable = (data) => {
    setTableElement(
      <>
        <Button href={`${webUrl}generateDoctorReclaimReport?doctor_id=${selectedDoctor?.id}&first=${firstDate.toISOString()}&second=${secondDate.toISOString()}`}>PDF</Button>
        <Table className="table" style={{ direction: "rtl" }} size="small">
          <TableHead className="thead">
            <TableRow>
              <TableCell>الشركه</TableCell>
              <TableCell>الاستحقاق</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.company_name}</TableCell>
                <TableCell>{formatNumber(item.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  };
  const setLabStatistics = (data: any[]) => {
    let cut = data.length / 4;
    setTableElement(
      <>
        <div className="tests-statistics">
          <div>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Test</TableCell>
                  <TableCell>Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(0, data.length / 4).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.main_test_name}</TableCell>
                    <TableCell>{item.testCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Test</TableCell>
                  <TableCell>Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(cut, cut * 2).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.main_test_name}</TableCell>
                    <TableCell>{item.testCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Test</TableCell>
                  <TableCell>Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(cut * 2, cut * 3).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.main_test_name}</TableCell>
                    <TableCell>{item.testCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Test</TableCell>
                  <TableCell>Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(cut * 3, cut * 4).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.main_test_name}</TableCell>
                    <TableCell>{item.testCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </>
    );
  };

  const setLabIncome = (data) => {
    setTableElement(
      <>
        <Stack
          justifyContent={"space-around"}
          direction={"row"}
          gap={1}
          sx={{ mb: 1 }}
        >
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            gap={1}
            className="shadow-sm text-center items-center  bg-red-100 p-2 rounded-sm "
          >
            <Typography variant="h5"> التامين</Typography>
            <Typography variant="h5">
              {formatNumber(data.total_insurance)}
            </Typography>
          </Stack>
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            gap={1}
            className="shadow-sm text-center items-center bg-red-100 p-2 rounded-sm "
          >
            <Typography variant="h5"> التحمل</Typography>
            <Typography variant="h5">
              {formatNumber(data.total_endurance)}
            </Typography>
          </Stack>
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            gap={1}
            className="shadow-sm text-center items-center bg-red-100 p-2 rounded-sm "
          >
            <Typography variant="h5"> النقدي</Typography>
            <Typography variant="h5">
              {formatNumber(data.total_cash)}
            </Typography>
          </Stack>
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            gap={1}
            className="shadow-sm text-center items-center bg-red-100 p-2 rounded-sm "
          >
            <Typography variant="h5"> عدد المرضي (نقدي)</Typography>
            <Typography variant="h5">{data.count_cash}</Typography>
          </Stack>
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            gap={1}
            className="shadow-sm text-center items-center bg-red-100 p-2 rounded-sm "
          >
            <Typography variant="h5"> عدد المرضي (تامين)</Typography>
            <Typography variant="h5">{data.count_insurance}</Typography>
          </Stack>
        </Stack>
        <Divider />
        <Table style={{ direction: "rtl" }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>التاريخ</TableCell>
              <TableCell> النقدي</TableCell>
              <TableCell> التامين</TableCell>
              <TableCell>عدد المرضي (نقدي)</TableCell>
              <TableCell>عدد المرضي (تامين)</TableCell>
              <TableCell>التحمل</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.day}</TableCell>
                <TableCell>{formatNumber(item.t_cash)}</TableCell>
                <TableCell>{formatNumber(item.t_insurance)}</TableCell>
                <TableCell>{item.count_cash}</TableCell>
                <TableCell>{item.count_insurance}</TableCell>
                <TableCell>{formatNumber(item.endurance)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  };
  const setClinics = (data) => {
    setTableElement(
      <>
        <Stack
          justifyContent={"space-around"}
          direction={"row"}
          gap={1}
          sx={{ mb: 1 }}
        >
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            gap={1}
            className="shadow-sm text-center items-center  bg-red-100 p-2 rounded-sm "
          >
            <Typography variant="h5"> استحقاق الاطباء من التامين</Typography>
            <Typography variant="h5">
              {formatNumber(data.insurance_reclaim)}
            </Typography>
          </Stack>
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            gap={1}
            className="shadow-sm text-center items-center bg-red-100 p-2 rounded-sm "
          >
            <Typography variant="h5"> استحقاق الاطباء من النقدي</Typography>
            <Typography variant="h5">
              {formatNumber(data.cash_reclaim)}
            </Typography>
          </Stack>
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            gap={1}
            className="shadow-sm text-center items-center bg-red-100 p-2 rounded-sm "
          >
            <Typography variant="h5"> اجمالي النقدي</Typography>
            <Typography variant="h5">{formatNumber(data.total)}</Typography>
          </Stack>
        </Stack>
        <Divider />
        <Table style={{ direction: "rtl" }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>التخصص</TableCell>
              <TableCell> اجمالي النقدي</TableCell>
              <TableCell> استحقاق الطبيب من النقدي</TableCell>
              <TableCell> استحقاق الطبيب من التامين</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{formatNumber(item.total)}</TableCell>
                <TableCell>{formatNumber(item.cash)}</TableCell>
                <TableCell>{formatNumber(item.company)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  };
  const setServiceStatistics = (data: any[]) => {
    let cut = data.length / 4;
    setTableElement(
      <>
        <div className="tests-statistics">
          <div>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Service</TableCell>
                  <TableCell>Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(0, data.length / 4).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.serviceCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Service</TableCell>
                  <TableCell>Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(cut, cut * 2).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.serviceCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Service</TableCell>
                  <TableCell>Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(cut * 2, cut * 3).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.serviceCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Service</TableCell>
                  <TableCell>Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(cut * 3, cut * 4).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.serviceCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </>
    );
  };

  const setCosts1 = (data: { data: Cost[] }) => {
    setTableElement(
      <>
        <Stack direction={"row"} gap={2} justifyContent={"space-around"}>
          <Stack
            key={selectedUser?.id}
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            gap={1}
            className="shadow-sm text-center items-center  bg-red-100 p-2 rounded-sm "
          >
            <Typography variant="h5"> اجمالي المنصرف</Typography>
            <Typography key={selectedUser?.id} variant="h5">
              {data.data.reduce((prev, curr) => {
                if (selectedUser) {
                  //  alert('changed')
                  console.log("changed");
                  if (selectedUser.id != curr.user.id) {
                    return 0;
                  }
                }
                return prev + curr.amount;
              }, 0)}
            </Typography>
          </Stack>
        </Stack>
        <Table style={{ direction: "rtl" }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>التاريخ</TableCell>
              <TableCell> المبلغ</TableCell>
              <TableCell> الوصف</TableCell>
              <TableCell> المستخدم</TableCell>
              <TableCell> الفئه</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((item: Cost, index) => (
              <TableRow key={index}>
                <TableCell>
                  {dayjs(Date.parse(new Date(item.created_at))).format(
                    "YYYY-MM-DD H:m A"
                  )}
                </TableCell>
                <TableCell>{formatNumber(item.amount)}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.user.username}</TableCell>
                <TableCell>{item?.cost_category?.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  };

  const setCosts2 = (data) => {
    setTableElement(
      <>
        <Stack direction={"row"} gap={2} justifyContent={"space-around"}>
          <Stack
            key={selectedUser?.id}
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            gap={1}
            className="shadow-sm text-center items-center  bg-red-100 p-2 rounded-sm "
          >
            <Typography variant="h5"> اجمالي المنصرف</Typography>
            <Typography key={selectedUser?.id} variant="h5"></Typography>
          </Stack>
        </Stack>
        <Table style={{ direction: "rtl" }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>الوصف</TableCell>
              <TableCell> المبلغ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{formatNumber(item.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  };
  const setPharmacyIncome = (data: Deduct[]) => {
    setTableElement(
      <>
        <Stack direction={"row"} gap={2} justifyContent={"space-around"}>
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            gap={1}
            className="shadow-sm text-center items-center  bg-red-100 p-2 rounded-sm "
          >
            <Typography variant="h5"> اجمالي المبيعات </Typography>
            <Typography variant="h5">
              {formatNumber(
                data.reduce((prev, curr) => {
                  return prev + curr.paid;
                }, 0)
              )}
            </Typography>
          </Stack>
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            gap={1}
            className="shadow-sm text-center items-center  bg-red-100 p-2 rounded-sm "
          >
            <Typography variant="h5"> اجمالي الارباح </Typography>
            <Typography variant="h5">
              {formatNumber(
                toFixed(
                  data.reduce((prev, curr) => {
                    return prev + curr.profit;
                  }, 0),
                  2
                )
              )}{" "}
            </Typography>
          </Stack>{" "}
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            gap={1}
            className="shadow-sm text-center items-center  bg-red-100 p-2 rounded-sm "
          >
            <Typography variant="h5"> اجمالي التكلفه </Typography>
            <Typography variant="h5">
              {formatNumber(
                data.reduce((prev, curr) => {
                  return prev + curr.cost;
                }, 0).toFixed(1)
              )}{" "}
            </Typography>
          </Stack>
        </Stack>

        <Table className="table" size="small">
          <TableHead className="thead">
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>profit</TableCell>
              <TableCell>Invoice</TableCell>
              <TableCell>client</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  {dayjs(new Date(Date.parse(item.created_at))).format(
                    "YYYY/MM/DD HH:MM A"
                  )}
                </TableCell>
                <TableCell>{formatNumber(item.total_price)}</TableCell>
                <TableCell>{item.user.username}</TableCell>
                <TableCell>{item.payment_method}</TableCell>
                <TableCell>
                  {item.deducted_items.map(
                    (deducted) => `${deducted.item.market_name}-`
                  )}
                </TableCell>
                <TableCell>{formatNumber(toFixed(item.profit, 2))}</TableCell>
                <TableCell>
                  {" "}
                  <a href={`${webUrl}deduct/invoice?id=${item.id}`}>
                    Invoice PDF
                  </a>
                </TableCell>
                <TableCell>{item?.client?.name}</TableCell>
                <TableCell>
                  <LoadingButton
                    loading={loading}
                    onClick={() => {
                      setLoading(true);
                      axiosClient
                        .delete(`deduct/${item.id}`)
                        .then(({ data }) => {
                          console.log(data);
                        })
                        .finally(() => {
                          setLoading(false);
                        });
                    }}
                  >
                    <DeleteOutline />
                  </LoadingButton>
                </TableCell>
              </TableRow>
            ))}

            {data.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={5}>No data found.</TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell>.</TableCell>
              <TableCell>.</TableCell>
              <TableCell>.</TableCell>
              <TableCell>
                {data.reduce((prev, curr) => {
                  return prev + curr.total_price;
                }, 0)}
              </TableCell>
              <TableCell>.</TableCell>
              <TableCell>.</TableCell>
              <TableCell>.</TableCell>
              <TableCell>
                {data.reduce((prev, curr) => {
                  return prev + curr.profit;
                }, 0)}
              </TableCell>
              <TableCell>.</TableCell>
              <TableCell>.</TableCell>
              <TableCell>.</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </>
    );
  };
  const setPharmacyIncome2 = (data) => {
    setTableElement(
      <>
        <Stack direction={"row"} gap={2} justifyContent={"space-around"}>
       
         
        </Stack>

        <Table className="table" style={{direction:'rtl'}} size="small">
          <TableHead className="thead">
            <TableRow>
              <TableCell>التاريخ</TableCell>
              <TableCell>اجمالي</TableCell>
              <TableCell>التخفيض</TableCell>
              <TableCell>المدفوع</TableCell>
              <TableCell>كاش</TableCell>
              <TableCell>البنك</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
               
                <TableCell>{item.date}</TableCell>
                <TableCell>{formatNumber(item.total)}</TableCell>
                <TableCell>{formatNumber(item.discount)}</TableCell>
                <TableCell>{formatNumber(item.paid)}</TableCell>
                <TableCell>{formatNumber(item.cash)}</TableCell>
                <TableCell>{formatNumber(item.bank)}</TableCell>
              </TableRow>
            ))}

            {data.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={5}>No data found.</TableCell>
              </TableRow>
            )}
           
          </TableBody>
        </Table>
        <Divider/>
   
      </>
    );
  };
  const userSelectHandler = (user: User) => {
    setSelectedUser(user);
  };
  const selectReportHandler = (report) => {
    setReport(report);
  };
  const setPatients = (data:DoctorVisit[]) => {
    // console.log(data,'data')

    let filteredData = data.filter((d)=>{
      if (bankFilter) {
        return d.patient.totalLabBank > 0 || d.totalservicebank > 0
      }else{
        return d
      }
    })
    
     filteredData = filteredData.filter((d)=>{
      if (discountFilter) {
       return   d.total_discounted > 0 || d.patient.discountAmount > 0
      }else{
        return d
      }
    })
    filteredData = filteredData.filter((d)=>{
      if (selectedUser) {
       return  d.patient.user_id == selectedUser.id
      }else{
        return d
      }
    })
    filteredData = filteredData.filter((d)=>{
      if (selectedDoctor) {
       return    d.patient.doctor_id == selectedDoctor.id
      }else{
        return d
      }
    })
    setTableElement(
      <Box key={bankFilter}>
        <Stack
          justifyContent={"space-around"}
          direction={"row"}
          gap={1}
          sx={{ mb: 1 }}
        >
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            gap={1}
            className="shadow-sm text-center items-center  bg-red-100 p-2 rounded-sm "
          >
            <Typography variant="h5">اجمالي المرضى</Typography>
            <Typography variant="h5">{filteredData.length}</Typography>
          </Stack>
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            gap={1}
            className="shadow-sm text-center items-center  bg-red-100 p-2 rounded-sm "
          >
            <Typography variant="h5">اجمالي البنك</Typography>
            <Typography variant="h5">{filteredData.reduce((prev,curr)=>{
              return prev + curr.totalservicebank + curr.patient.totalLabBank 
            },0)}</Typography>
          </Stack>
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            gap={1}
            className="shadow-sm text-center items-center  bg-red-100 p-2 rounded-sm "
          >
            <Typography variant="h5">اجمالي التخفيض</Typography>
            <Typography variant="h5">{filteredData.reduce((prev,curr)=>{
              return prev + curr.total_discounted + curr.patient.discountAmount 
            },0)}</Typography>          </Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            gap={1}
          >
            <Chip
             variant={bankFilter ? 'filled' :'outlined'}
              color={bankFilter ? 'primary':'default'}
              onClick={() => {
                setBankFilter(!bankFilter);
              }}
              label="Bank"
            ></Chip>
            <Chip 
             variant={discountFilter ? 'filled' :'outlined'}
              color={discountFilter ? 'primary':'default'}


              onClick={() => {
                setDiscountFilter(!discountFilter);
              }}
            label="Discount"></Chip>
          </Stack>
        </Stack>
        <Divider />
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Bank</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Lab</TableCell>
                <TableCell>Services</TableCell>
                <TableCell>Reciet</TableCell>
                <TableCell>File</TableCell>
                <TableCell>Info</TableCell>
              </TableRow>

              {/* Add more table headers here */}
            </TableHead>
            <TableBody>
              {filteredData.map((visit: DoctorVisit, i) => {
                console.log(visit, "doctor ");

                return (
                  <TableRow key={visit.id}>
                    <TableCell>{++i}</TableCell>
                    <TableCell>{visit.patient.name}</TableCell>
                    <TableCell>
                      {dayjs(new Date(visit.patient.created_at)).format(
                        "DD/MM/YYYY H:m A"
                      )}
                    </TableCell>
                    <TableCell>{visit.patient?.doctor?.name}</TableCell>
                    <TableCell>
                      {formatNumber(
                        visit.total_paid_services + visit.patient.paid
                      )}
                    </TableCell>
                    <TableCell>
                      {formatNumber(
                        visit.totalservicebank + visit.patient.totalLabBank
                      )}
                    </TableCell>
                    <TableCell>
                      {formatNumber(
                        visit.total_discounted + visit.patient.discountAmount
                      )}
                    </TableCell>
                    <TableCell>{visit.patient?.user.username}</TableCell>
                    <TableCell>
                      {visit.patient.labrequests.map((l) => l.name).join("")}
                    </TableCell>
                    <TableCell>
                      {visit.services.reduce(
                        (prev, curr) => `${prev} - ${curr.service.name}`,
                        ""
                      )}
                    </TableCell>

                    <TableCell>
                      {" "}
                      <a
                        href={`${webUrl}printLabAndClinicReceipt?doctor_visit=${visit.id}`}
                      >
                        Receipt
                      </a>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        href={`${webUrl}file?doctor_visit=${visit.id}`}
                        variant="outlined"
                      >
                        <FileIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          setShow(true);
                          setSelectedPatient(visit);
                        }}
                        size="small"
                        variant="outlined"
                      >
                        <Info />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };
  const setDiscount = (data) => {
    setTableElement(
      <>
        <Stack
          justifyContent={"space-around"}
          direction={"row"}
          gap={1}
          sx={{ mb: 1 }}
        >
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            gap={1}
            className="shadow-sm text-center items-center  bg-red-100 p-2 rounded-sm "
          >
            <Typography variant="h5"> اجمالي البنك </Typography>
            <Typography variant="h5">
              {/* {formatNumber(data.insurance_reclaim)} */}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Lab</TableCell>
                <TableCell>Services</TableCell>
                <TableCell>Reciet</TableCell>
                <TableCell>File</TableCell>
                <TableCell>Info</TableCell>
              </TableRow>

              {/* Add more table headers here */}
            </TableHead>
            <TableBody>
              {data.map((visit: DoctorVisit, i) => {
                console.log(visit, "doctor ");
                return (
                  <TableRow key={visit.id}>
                    <TableCell>{++i}</TableCell>
                    <TableCell>{visit.patient.name}</TableCell>
                    <TableCell>
                      {dayjs(new Date(visit.patient.created_at)).format(
                        "DD/MM/YYYY H:m A"
                      )}
                    </TableCell>
                    <TableCell>{visit.patient?.doctor?.name}</TableCell>
                    <TableCell>
                      {formatNumber(
                        visit.total_paid_services + visit.patient.paid
                      )}
                    </TableCell>
                    <TableCell>{visit.patient?.user.username}</TableCell>
                    <TableCell>
                      {visit.patient.labrequests.map((l) => l.name).join("")}
                    </TableCell>
                    <TableCell>
                      {visit.services.reduce(
                        (prev, curr) => `${prev} - ${curr.service.name}`,
                        ""
                      )}
                    </TableCell>

                    <TableCell>
                      {" "}
                      <a
                        href={`${webUrl}printLabAndClinicReceipt?doctor_visit=${visit.id}&user=${user?.id}`}
                      >
                        Receipt
                      </a>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        href={`${webUrl}file?doctor_visit=${visit.id}&user=${user?.id}`}
                        variant="outlined"
                      >
                        <FileIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          setShow(true);
                          setSelectedPatient(visit);
                        }}
                        size="small"
                        variant="outlined"
                      >
                        <Info />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };
  return (
    <div style={{ overflow: "auto" }} className="all-report">
      <div className="gird-item grid-item-1">
        <Stack
          direction={"row"}
          justifyItems={"start"}
          alignContent={"start"}
          gap={1}
        >
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateField
                format="YYYY/MM/DD"
                onChange={(val) => {
                  setFirstDate(val);
                }}
                defaultValue={dayjs(new Date())}
                sx={{ m: 1 }}
                label="From"
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateField
                format="YYYY/MM/DD"
                onChange={(val) => {
                  setSecondDate(val);
                }}
                defaultValue={dayjs(new Date())}
                sx={{ m: 1 }}
                label="To"
              />
            </LocalizationProvider>
            <LoadingButton
              onClick={searchHandler}
              loading={loading}
              sx={{ mt: 2 }}
              size="medium"
              variant="contained"
            >
              Go
            </LoadingButton>
          </Box>
          <Autocomplete
            sx={{ width: "200px" }}
            size="small"
            value={selectedUser}
            options={users}
            onChange={(e, val) => {
              console.log(val, "val");
              userSelectHandler(val);
              if (val == null) {
                setqueryString("");
                return;
              }
              setqueryString((prev) => {
                return `?user=${val?.id}`;
              });
            }}
            getOptionLabel={(user) => user.username}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  variant="standard"
                  size="small"
                  label="users"
                />
              );
            }}
          />
          <Autocomplete
            sx={{ width: "200px" }}
            size="small"
            value={selectedDoctor}
            options={doctors}
            onChange={(e, val) => {
              setSelectedDoctor(val);
            }}
            getOptionLabel={(doctor) => doctor.name}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  variant="standard"
                  size="small"
                  label="doctors"
                />
              );
            }}
          />
        </Stack>
      </div>
      <div className="gird-item grid-item-2 p-2">
        {loading ? <Skeleton width={"100%"} height={"100%"} /> : tableElement}
      </div>
      <Card className="gird-item grid-item-3">
        <Typography className="text-center" variant="h4">
          التقارير
        </Typography>
        <List sx={{ overflow: "auto", height: "70vh" }}>
          <ListItem
            sx={{
              cursor: "pointer",
              backgroundColor: (theme) => {
                return report == "Insurance Reclaim"
                  ? theme.palette.primary.light
                  : "";
              },
            }}
          >
            <ListItemText
              onClick={() => {
                selectReportHandler("Insurance Reclaim");
                setTableElement(null);
              }}
            >
              استحقاق الطبيب{" "}
            </ListItemText>
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              backgroundColor: (theme) => {
                return report == "Insurance Reclaim from Company"
                  ? theme.palette.primary.light
                  : "";
              },
            }}
          >
            <ListItemText
              onClick={() => {
                selectReportHandler("Insurance Reclaim from Company");
                setTableElement(null);
              }}
            >
               استحقاق الطبيب من الشركات{" "}
            </ListItemText>
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              backgroundColor: (theme) => {
                return report == "Lab Statistics"
                  ? theme.palette.primary.light
                  : "";
              },
            }}
          >
            <ListItemText
              onClick={() => {
                selectReportHandler("Lab Statistics");
                setTableElement(null);
              }}
            >
              احصاء المختبر{" "}
            </ListItemText>
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              backgroundColor: (theme) => {
                return report == "Lab Income"
                  ? theme.palette.primary.light
                  : "";
              },
            }}
          >
            <ListItemText
              sx={{ cursor: "pointer" }}
              onClick={() => {
                selectReportHandler("Lab Income");
              }}
            >
              ايرادات المختبر{" "}
            </ListItemText>
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              backgroundColor: (theme) => {
                return report == "Clinics" ? theme.palette.primary.light : "";
              },
            }}
          >
            <ListItemText
              sx={{ cursor: "pointer" }}
              onClick={() => {
                selectReportHandler("Clinics");
                setTableElement(null);
              }}
            >
              العيادات{" "}
            </ListItemText>
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              backgroundColor: (theme) => {
                return report == "Service Statistics"
                  ? theme.palette.primary.light
                  : "";
              },
            }}
          >
            <ListItemText
              sx={{ cursor: "pointer" }}
              onClick={() => {
                selectReportHandler("Service Statistics");
                setTableElement(null);
              }}
            >
              احصاء الخدمات{" "}
            </ListItemText>
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              backgroundColor: (theme) => {
                return report == "Costs-1" ? theme.palette.primary.light : "";
              },
            }}
          >
            <ListItemText
              sx={{ cursor: "pointer" }}
              onClick={() => {
                selectReportHandler("Costs-1");
                setTableElement(null);
              }}
            >
              المصروفات - 1{" "}
            </ListItemText>
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              backgroundColor: (theme) => {
                return report == "Costs-2" ? theme.palette.primary.light : "";
              },
            }}
          >
            <ListItemText
              sx={{ cursor: "pointer" }}
              onClick={() => {
                selectReportHandler("Costs-2");
                setTableElement(null);
              }}
            >
              المصروفات - 2{" "}
            </ListItemText>
          </ListItem>
          {/* <ListItem
            sx={{
              cursor: "pointer",
              backgroundColor: (theme) => {
                return report == "Pharmacy Income"
                  ? theme.palette.primary.light
                  : "";
              },
            }}
          >
            <ListItemText
              sx={{ cursor: "pointer" }}
              onClick={() => {
                selectReportHandler("Pharmacy Income");
                setTableElement(null);
              }}
            >
              ايرادات المبيعات
            </ListItemText>
          </ListItem> */}
          <ListItem
            sx={{
              cursor: "pointer",
              backgroundColor: (theme) => {
                return report == "Pharmacy Income 2"
                  ? theme.palette.primary.light
                  : "";
              },
            }}
          >
            <ListItemText
              sx={{ cursor: "pointer" }}
              onClick={() => {
                selectReportHandler("Pharmacy Income 2");
                setTableElement(null);
              }}
            >
              2 - ايرادات المبيعات
            </ListItemText>
          </ListItem>
          <ListItem
            sx={{
              cursor: "pointer",
              backgroundColor: (theme) => {
                return report == "Patients" ? theme.palette.primary.light : "";
              },
            }}
          >
            <ListItemText
              sx={{ cursor: "pointer" }}
              onClick={() => {
                selectReportHandler("Patients");
                setTableElement(null);
              }}
            >
              المرضي
            </ListItemText>
          </ListItem>
        </List>
      </Card>
      {selectedPatient && (
        <PatientDetailsDialog
          setShow={setShow}
          show={show}
          patient={selectedPatient}
        />
      )}
    </div>
  );
}

export default AllReports;
