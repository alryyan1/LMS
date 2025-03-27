import {
  Box,
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
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import BasicPopover from "../pharmacy/MyPopOver";
import { LoadingButton } from "@mui/lab";
import { Shift } from "../../types/Shift";
import { useStateContext } from "../../appContext";
import ShiftCostsTable from "../../components/ShiftCostsTable";
import MyCustomLoadingButton from "../../components/MyCustomLoadingButton";

function AllMoneyDetails({
  allMoneyUpdated,
  allMoneyUpdatedLab,
  setAllMoneyUpdatedLab,
  user,
}) {
  const { dialog, setDialog } = useOutletContext();
  const { t } = useTranslation("allMoneyDetails");
  const [money, setMoney] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingLab, setLoadingLab] = useState(false);
  const [bank, setBank] = useState();
  const [shiftSummary, setShiftSummary] = useState<ShiftDetails | null>(null);
  useEffect(() => {
    axiosClient.get("shift/last").then(({ data: { data } }) => {
      // setShift(data);
      axiosClient.get(`shift/summary/${data.id}`).then(({ data }) => {
        console.log(data, "shift summary");
        setShiftSummary(data);
      });
    });
  }, [allMoneyUpdated, allMoneyUpdatedLab]);
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
    <div style={{ textAlign: "center" }}>
        {user?.user_money_collector_type == "all" ||
      user?.user_money_collector_type == "clinic" ? (    <Box>
        <Typography className="text-center" variant="h5">
          {t("clinics")}
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <Table className="table" size="small">
            <TableHead className="thead">
              <TableRow>
                <TableCell>{t("total")}</TableCell>
                <TableCell>{t("bank")}</TableCell>
                <TableCell>{t("cash")}</TableCell>
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
      </Box>) :''}

      {user?.user_money_collector_type == "all" ||
      user?.user_money_collector_type == "lab" ? (
        <Box>
          <Divider />
          <Typography className="text-center" variant="h5">
            {t("lab")}
          </Typography>
          <Table className="table" size="small">
            <TableHead className="thead">
              <TableRow>
                <TableCell>{t("total")}</TableCell>
                <TableCell>{t("bank")}</TableCell>
                <TableCell>{t("cash")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingLab ? (
                <CircularProgress />
              ) : (
                <TableRow>
                  <TableCell>{formatNumber(labUserMoney?.total)}</TableCell>
                  <TableCell>{formatNumber(labUserMoney?.bank)}</TableCell>
                  <TableCell>
                    {formatNumber(labUserMoney?.total - labUserMoney?.bank)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      ) : (
        ""
      )}

      <Divider />
        {user?.user_money_collector_type == 'all' ? <List>
        <ListItem
          secondaryAction={
            <div>
              {formatNumber(
                Number(shiftSummary?.total) + Number(shiftSummary?.lab)
              )}
            </div>
          }
          key="1"
        >
          <ListItemText primary={t("all_total")} />
        </ListItem>

        <ListItem
          secondaryAction={<div>{formatNumber(shiftSummary?.bank)}</div>}
          key="2"
        >
          <ListItemText primary={t("bank")} />
        </ListItem>

        <ListItem
          secondaryAction={<div>{formatNumber(shiftSummary?.cash)}</div>}
          key="3"
        >
          <ListItemText primary={t("cash")} />
        </ListItem>

        <ListItem
          secondaryAction={
            <BasicPopover
              content={
                <>
                  <ShiftCostsTable
                    setAllMoneyUpdatedLab={setAllMoneyUpdatedLab}
                  />
                </>
              }
              title={formatNumber(shiftSummary?.expenses)}
            ></BasicPopover>
          }
          key="4"
        >
          <ListItemText primary={t("expenses")} />
        </ListItem>

        <ListItem
          sx={{ backgroundColor: shiftSummary?.safi < 0 ? "lightpink" : "" }}
          secondaryAction={
            <div>
              {formatNumber(shiftSummary?.cash - shiftSummary?.totalCostCash)}
            </div>
          }
          key="5"
        >
          <ListItemText primary={t("net_cash")} />
        </ListItem>

        <ListItem
          secondaryAction={
            <div>
              {formatNumber(shiftSummary?.bank - shiftSummary?.totalCostBankak)}
            </div>
          }
          key="6"
        >
          <ListItemText primary="صافي بنكك" />
        </ListItem>
      </List> : <List>
  

     

        <ListItem
          secondaryAction={
            <BasicPopover
              content={
                <>
                  <ShiftCostsTable
                    setAllMoneyUpdatedLab={setAllMoneyUpdatedLab}
                  />
                </>
              }
              title={formatNumber(shiftSummary?.expenses)}
            ></BasicPopover>
          }
          key="4"
        >
          <ListItemText primary={t("expenses")} />
        </ListItem>

        <ListItem
          sx={{ backgroundColor: shiftSummary?.safi < 0 ? "lightpink" : "" }}
          secondaryAction={
            <div>
              {formatNumber(shiftSummary?.cash - shiftSummary?.totalCostCash)}
            </div>
          }
          key="5"
        >
          <ListItemText primary={t("net_cash")} />
        </ListItem>

        <ListItem
          secondaryAction={
            <div>
              {formatNumber(shiftSummary?.bank - shiftSummary?.totalCostBankak)}
            </div>
          }
          key="5"
        >
          <ListItemText primary="صافي بنكك" />
        </ListItem>
      </List>}
      <MyCustomLoadingButton onClick={(setLoading)=>{
        setLoading(true)
        let r = confirm('هل انت متأكد من انشاء قيد صافي الورديه')
        if(r){
            axiosClient.post('createFinalShiftEntry',{
                user:user?.id,
                bank:shiftSummary?.bank - shiftSummary?.totalCostBankak,
                cash:shiftSummary?.cash - shiftSummary?.totalCostCash
            }).then(({data})=>{

            }).finally(()=>{
              setLoading(false)
            })
        }
      }}>انشاء قيد صافي الورديه </MyCustomLoadingButton>
    </div>
  );
}

export default AllMoneyDetails;
