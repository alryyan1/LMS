import {
  Badge,
  Button,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosClient from "../../../axios-client.js";
import dayjs from "dayjs";
import AddEntryForm from "./AddEntryForm.tsx";
import {
  formatNumber,
  host,
  schema,
  sendNotifications,
  webUrl,
} from "../constants.js";
import DateComponent from "./DateComponent.tsx";
import GeminiImageUploader from "./Gemini.tsx";
import EmptyDialog from "../Dialogs/EmptyDialog.tsx";
import { Eye, Plus } from "lucide-react";

function AccountEntries() {
  // const [loading, setLoading] = useState(false);
  //create state variable to store all Accounts
  const [entries, setEntries] = useState([]);
  const [update, setUpdate] = useState(0);
  const [show, setShow] = useState(0);
  const { dilog, setDialog } = useOutletContext();

  useEffect(() => {
    document.title = "قيود اليوميه";
  }, []);

  useEffect(() => {
    //fetch all Accounts
  }, [update]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);

  const [firstDate, setFirstDate] = useState(dayjs().startOf("month"));
  useEffect(() => {
    axiosClient.get("settings").then(({ data }) => {
      setSettings(data);
      setLoading(true);
      setFirstDate(dayjs(data.financial_year_start));
      setSecondDate(dayjs(data.financial_year_end));
      console.log(data, "data");
      axiosClient(
        `financeEntries?first=${data.financial_year_start}&second=${data.financial_year_end}`
      )
        .then(({ data }) => {
          setEntries(data);
          console.log(data, "accounts");
        })
        .finally(() => setLoading(false));
    });
  }, []);

  const [secondDate, setSecondDate] = useState(dayjs(new Date()));
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper sx={{ p: 1 }}>
          <Button onClick={()=>{
            setShow(true)
          }}><Plus/></Button>
          <DateComponent
            api={`financeEntries?first=${firstDate.format("YYYY/MM/DD")}&second=${secondDate.format("YYYY/MM/DD")}`}
            setData={setEntries}
            setFirstDate={setFirstDate}
            setSecondDate={setSecondDate}
            firstDate={firstDate}
            secondDate={secondDate}
            accounts={[]}
            setAccounts={() => {}}
          />

          <Button
            href={`${webUrl}entries?first=${firstDate.format("YYYY/MM/DD")}&second=${secondDate.format("YYYY/MM/DD")}`}
          >
            PDF
          </Button>
          <Button
            href={`${webUrl}entries-excel?first=${firstDate.format("YYYY/MM/DD")}&second=${secondDate.format("YYYY/MM/DD")}`}
          >
            Excel
          </Button>
          {/* <GeminiImageUploader/> */}
          {/* create table with all clients */}
          {loading ? (
            <Skeleton height={window.innerHeight - 200} />
          ) : (
            <TableContainer
              sx={{ height: `${window.innerHeight - 200}px`, overflow: "auto" }}
            >
              <Table sx={{ width: "100%" }} dir="rtl" size="small">
                <thead>
                  <TableRow>
                    <TableCell>التاريخ</TableCell>
                    <TableCell>رقم القيد</TableCell>
                    <TableCell>البيان</TableCell>
                    <TableCell>Debit </TableCell>
                    <TableCell> Credit </TableCell>
                    <TableCell> انشاء اذن الصرف </TableCell>
                  </TableRow>
                </thead>

                <TableBody>
                  {entries.map((entry, i) => {
                    let showLink = false;
                    let link = "";
                    if (entry.doctor_shift_id != null || entry.user_net != null)
                      showLink = true;
                    if (entry.doctor_shift_id != null) {
                      link = `${webUrl}clinics/doctor/report?doctorshift=${entry.doctor_shift_id}`;
                    }
                    if (entry.user_net != null) {
                      link = `${webUrl}clinics/all?user_id=${entry.user_net}`;
                    }
                    return (
                      <>
                        <TableRow>
                          <TableCell
                            rowSpan={
                              entry.debit.length + entry.credit.length + 2
                            }
                          >
                            {dayjs(
                              new Date(Date.parse(entry.created_at))
                            ).format("YYYY-MM-DD")}
                          </TableCell>
                          <TableCell
                            rowSpan={
                              entry.debit.length + entry.credit.length + 2
                            }
                            // style={{ textAlign: "right", color: "lightblue" }}
                          >
                            {entry.id}
                          </TableCell>
                          <TableCell> </TableCell>
                          <TableCell> </TableCell>
                          <TableCell> </TableCell>
                          <TableCell
                            rowSpan={
                              entry.debit.length + entry.credit.length + 2
                            }
                          >
                         <Stack direction={'column'} gap={1}>
                         <Button
                              disabled={entry.hasPetty}
                              variant="contained"
                              onClick={() => {
                                // alert('s')
                                //CONFIRM USE ALERT
                                let result = confirm("هل تريد انشاء اذن الصرف");
                                if (result) {
                                  axiosClient
                                    .post("createPettyCash", {
                                      amount: entry.credit.reduce(
                                        (prev, curr) => prev + curr.amount,
                                        0
                                      ),
                                      finance_entry_id: entry.id,
                                      description: entry.description,
                                    })
                                    .then(({ data }) => {
                                      console.log(data);
                                      setEntries((prev) => {
                                        return prev.map((item) =>
                                          item.id === entry.id
                                            ? data.data.entry
                                            : item
                                        );
                                      });
                                      sendNotifications(
                                        data.data.id,
                                        "اذن صرف جديد",
                                        `${data.data.description} \n  المبلغ  ${formatNumber(data.data.amount)}   `
                                      );

                                      // fetch(`${schema}://${host}:8000/msg`, {
                                      //   method: "POST",
                                      //   headers: {
                                      //     "Content-Type": "application/json",
                                      //   },
                                      //   body: JSON.stringify({
                                      //     id:data.data.id,
                                      //     title:'اذن صرف جديد',
                                      //     description: `${data.data.description} \n  المبلغ  ${formatNumber(data.data.amount)}   `,
                                      //   }),
                                      // });
                                    });
                                }
                              }}
                            >
                               اذن الصرف
                            </Button>
                          {entry.file_name != null ? <Button href={entry.file_name}><Eye/></Button>:  <input type="file" accept="application/pdf" onChange={(e)=>{
                              console.log(e.target.files[0])
                              let file = e.target.files[0]
                              if(file){
                                let formData = new FormData()
                                formData.append('file',file)
                                formData.append('entry_id',entry.id)
                                axiosClient.post('handleIncomeProoveFile',formData,{
                                  headers:{
                                    'Content-Type':'multipart/form-data'
                                  }
                                })
                              }
                            }} />}
                         </Stack>
                          </TableCell>{" "}
                        </TableRow>
                        {entry.debit.map((e, debitIndex) => {
                          return (
                            <TableRow
                              sx={{
                                backgroundColor: i % 2 == 0 ? "#8080800f" : "",
                                color: (theme) =>
                                  entry.hasPetty
                                    ? theme.palette.primary.light
                                    : "",
                              }}
                              key={e.id}
                            >
                              {debitIndex == 0 && entry.debit.length > 1 ? (
                                <Badge
                                  anchorOrigin={{
                                    horizontal: "left",
                                    vertical: "top",
                                  }}
                                  badgeContent="من مذكورين"
                                  color="primary"
                                >
                                  <TableCell>
                                    {`  ح / ${e?.account?.name}
                         
                          `}
                                  </TableCell>
                                </Badge>
                              ) : (
                                <TableCell>
                                  {entry.debit.length > 1
                                    ? `  ح / ${e?.account?.name}
                         
                          `
                                    : ` من ح / ${e?.account?.name}
                         
                          `}
                                </TableCell>
                              )}
                              <TableCell>{formatNumber(e?.amount)}</TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          );
                        })}
                        {entry.credit.map((e, creditIndex) => {
                          return (
                            <TableRow
                              sx={{
                                backgroundColor: i % 2 == 0 ? "#8080800f" : "",
                              }}
                              key={e.id}
                            >
                              {creditIndex == 0 && entry.credit.length > 1 ? (
                                <Badge
                                  anchorOrigin={{
                                    horizontal: "left",
                                    vertical: "top",
                                  }}
                                  badgeContent="الي مذكورين"
                                  color="primary"
                                >
                                  <TableCell>
                                    {`  .......  ح  / ${e?.account?.name}
                         
                          `}
                                  </TableCell>
                                </Badge>
                              ) : (
                                <TableCell>
                                  {entry.credit.length > 1
                                    ? `  .......  ح / ${e?.account?.name}
                         
                         `
                                    : `  ....... الي ح / ${e?.account?.name}
                         
                         `}
                                </TableCell>
                              )}

                              <TableCell></TableCell>
                              <TableCell>{formatNumber(e?.amount)}</TableCell>
                            </TableRow>
                          );
                        })}
                        <TableRow
                          sx={{
                            backgroundColor: i % 2 == 0 ? "#8080800f" : "",
                          }}
                          key={entry.id}
                        >
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              textAlign: "center",
                              color: i % 2 == 0 ? "blue" : "",
                              fontSize: "10pz",
                            }}
                            colSpan={5}
                          >
                            {showLink ? (
                              <Button
                                variant="outlined"
                                target="_blank"
                                href={link}
                              >
                                {entry.description}
                              </Button>
                            ) : (
                              entry.description
                            )}
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Grid>
      
      <EmptyDialog setShow={setShow} show={show}>
      <AddEntryForm
      
          setUpdate={setUpdate}
          setEntries={setEntries}
          loading={loading}
          setDialog={setDialog}
          setLoading={setLoading}
        />
      </EmptyDialog>
    </Grid>
  );
}

export default AccountEntries;
