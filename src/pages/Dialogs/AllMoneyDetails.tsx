import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client";
import { formatNumber } from "../constants";
import { BarChartIcon, PanelsTopLeftIcon, PieChartIcon } from "lucide-react";
import { ShiftDetails } from "../../types/CutomTypes";

function AllMoneyDetails({ allMoneyUpdated, allMoneyUpdatedLab }) {
  const { dialog, setDialog } = useOutletContext();
  const [money, setMoney] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingLab, setLoadingLab] = useState(false);
  const [bank, setBank] = useState();
    const [shiftSummary, setShiftSummary] = useState<ShiftDetails | null>(null);
  
  useEffect(()=>{
    axiosClient.get("shift/last").then(({ data: { data } }) => {
        // setShift(data);
        axiosClient.get(`shift/summary/${data.id}`).then(({ data }) => {
          console.log(data, "shift summary");
          setShiftSummary(data);
        });
      });
  },[ allMoneyUpdated, allMoneyUpdatedLab])
  // console.log(dialog);
  useEffect(() => {
    setLoading(true);
    axiosClient
      .get("service/money")
      .then(({ data: { total } }) => {
        console.log(total);
        setMoney(total);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  }, [dialog.showMoneyDialog, allMoneyUpdated]);

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get("service/money/bank")
      .then(({ data: { total } }) => {
        console.log(total);
        setBank(total);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [dialog.showMoneyDialog, allMoneyUpdated]);
  const [labUserMoney, setLabUserMoney] = useState(null);
  // console.log(dialog);
  useEffect(() => {
    setLoadingLab(true);
    axiosClient
      .get("totalUserLabTotalAndBank")
      .then(({ data }) => {
        setLabUserMoney(data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoadingLab(false));
  }, [allMoneyUpdatedLab]);

  return (
    <div style={{ textAlign: "center", direction: "rtl" }}>
      <Typography className="text-center" variant="h5">
        العيادات
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Table size="small">
          <TableHead className="thead">
            <TableRow>
              <TableCell>اجمالي</TableCell>
              <TableCell>البنك</TableCell>
              <TableCell>النقدي</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell> {formatNumber(money)}</TableCell>
              <TableCell> {formatNumber(bank)}</TableCell>
              <TableCell> {formatNumber(money - bank)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
      <Divider />
      <Typography className="text-center" variant="h5">
        المختبر
      </Typography>
      {loadingLab ? (
        <CircularProgress />
      ) : (
        <Table size="small">
          <TableHead className="thead">
            <TableRow>
              <TableCell>اجمالي</TableCell>
              <TableCell>البنك</TableCell>
              <TableCell>النقدي</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{formatNumber(labUserMoney?.total)}</TableCell>
              <TableCell>{formatNumber(labUserMoney?.bank)}</TableCell>
              <TableCell>
                {formatNumber(labUserMoney?.total - labUserMoney?.bank)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
      <Divider />
      <List>
        <ListItem secondaryAction={<div>{formatNumber(shiftSummary?.total + shiftSummary?.lab)}</div>} key="1">
          <ListItemIcon>
            <PieChartIcon />
          </ListItemIcon>
          <ListItemText  primary="الاجمالي" />
        </ListItem>

        <ListItem secondaryAction={<div>{formatNumber(shiftSummary?.bank)}</div>} key="2">
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="البنك" />
        </ListItem>


        <ListItem secondaryAction={<div>{formatNumber(shiftSummary?.cash)}</div>}  key="3">
          <ListItemIcon>
            <PanelsTopLeftIcon />
          </ListItemIcon>
          <ListItemText primary="النقدي" />
        </ListItem>

        <ListItem secondaryAction={<div>{formatNumber(shiftSummary?.expenses)}</div>}  key="4">
          <ListItemIcon>
            <PanelsTopLeftIcon />
          </ListItemIcon>
          <ListItemText primary="المصروفات" />
        </ListItem>

        <ListItem secondaryAction={<div>{formatNumber(shiftSummary?.safi)}</div>}  key="5">
          <ListItemIcon>
            <PanelsTopLeftIcon />
          </ListItemIcon>
          <ListItemText primary="صافي النقدي" />
        </ListItem>
      </List>
    </div>
  );
}

export default AllMoneyDetails;
