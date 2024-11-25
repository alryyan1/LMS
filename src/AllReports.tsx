import {
  Autocomplete,
  Box,
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
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { ReactElement, useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { User } from "./types/Patient";
import { UserIcon } from "lucide-react";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";
import { formatNumber } from "./pages/constants";
type Report = "Insurance Reclaim" | "Lab Statistics" | "Lab Income" | "Clinics";
function AllReports() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [firstDate, setFirstDate] = useState(dayjs(new Date()));
  const [secondDate, setSecondDate] = useState(dayjs(new Date()));
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctors, setDoctors] = useState([]);
  const [tableElement, setTableElement] = useState<ReactElement | null>(null);
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
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
      case "Lab Statistics":
        url = "lab-statistics";
        break;
      case "Lab Income":
        url = "lab-income";
        break;
      case "Clinics":
        url = "clinics";
        break;

      default:
        url = "insurance-reclaim";
    }
    axiosClient
      .post(url, {
        first: firstDayjs,
        second: secondDayjs,
        doctor: selectedDoctor?.id,
      })
      .then(({ data }) => {
        console.log(data);
        switch (report) {
          case "Insurance Reclaim":
            setDoctorReclaimFromInsuranceTable(data);
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
            <Typography variant="h5">
              {formatNumber(data.total_cash)}
            </Typography>
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
  const userSelectHandler = (user: User) => {
    setSelectedUser(user);
  };
  const selectReportHandler = (report) => {
    setReport(report);
  };
  return (
    <div className="all-report">
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
              setSelectedUser(val);
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
      <div className="gird-item grid-item-2">
        {loading ? <Skeleton width={"100%"} height={"100%"} /> : tableElement}
      </div>
      <div className="gird-item grid-item-3">
        <List>
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
              }}
            >
              استحقاق الطبيب{" "}
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
                return report == "Clinics"
                  ? theme.palette.primary.light
                  : "";
              },
            }}
          >
            <ListItemText
              sx={{ cursor: "pointer" }}
              onClick={() => {
                selectReportHandler("Clinics");
              }}
            >
               العيادات{" "}
            </ListItemText>
          </ListItem>
        </List>
      </div>
    </div>
  );
}

export default AllReports;
