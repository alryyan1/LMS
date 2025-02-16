import {
  Badge,
  Button,
  Grid,
  IconButton,
  Paper,
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
import { formatNumber, webUrl } from "../constants.js";
import DateComponent from "./DateComponent.tsx";
import GeminiImageUploader from "./Gemini.tsx";

function AccountEntries() {
  const [loading, setLoading] = useState(false);
  //create state variable to store all Accounts
  const [entries, setEntries] = useState([]);
  const [update, setUpdate] = useState(0);
  const { dilog, setDialog } = useOutletContext();

  useEffect(() => {
    document.title = "قيود اليوميه";
  }, []);

  useEffect(() => {
    //fetch all Accounts
    axiosClient(
      `financeEntries?first=${firstDate.format("YYYY/MM/DD")}&second=${secondDate.format("YYYY/MM/DD")}`
    ).then(({ data }) => {
      setEntries(data);
      console.log(data, "accounts");
    });
  }, [update]);
  const [firstDate, setFirstDate] = useState(dayjs().startOf('month'));

  const [secondDate, setSecondDate] = useState(dayjs(new Date()));
  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <Paper sx={{ p: 1 }}>
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

          <Button href={`${webUrl}entries?first=${firstDate.format("YYYY/MM/DD")}&second=${secondDate.format("YYYY/MM/DD")}`}>PDF</Button>
          {/* <GeminiImageUploader/> */}
          {/* create table with all clients */}
          <TableContainer sx={{height:`${window.innerHeight - 200}px`,overflow:'auto'}}>
            <Table  dir="rtl" size="small">
              <thead>
                <TableRow>
                  <TableCell>التاريخ</TableCell>
                  <TableCell>رقم القيد</TableCell>
                  <TableCell>البيان</TableCell>
                  <TableCell>Debit </TableCell>
                  <TableCell> Credit </TableCell>
                </TableRow>
              </thead>

              <TableBody>
                {entries.map((entry, i) => (
                  <>
                    <TableRow>
                      <TableCell
                        rowSpan={
                          Math.max( entry.debit.length,entry.credit.length) + 2
                        }
                      >
                        {dayjs(new Date(Date.parse(entry.created_at))).format(
                          "YYYY-MM-DD"
                        )}
                      </TableCell>
                      <TableCell
                        rowSpan={
                          Math.max( entry.debit.length,entry.credit.length) + 2
                        }
                        // style={{ textAlign: "right", color: "lightblue" }}
                      >
                        {entry.id}
                      </TableCell>
                      <TableCell> </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    {entry.debit.map((e,debitIndex) => {
                      return (
                        <TableRow
                          sx={{
                            backgroundColor: i % 2 == 0 ? "#8080800f" : "",
                          }}
                          key={e.id}
                        >
                         {debitIndex == 0 && entry.debit.length > 1  ? <Badge anchorOrigin={{horizontal:'left',vertical:'top'}} badgeContent='من مذكورين' color="primary">
                          <TableCell>
                            {`  ح / ${e?.account?.name}
                         
                          `}
                          </TableCell>
                          </Badge> : 
                          <TableCell>
                          {entry.debit.length > 1  ? `  ح / ${e?.account?.name}
                         
                          `: ` من ح / ${e?.account?.name}
                         
                          `}  
                          </TableCell>
                         } 
                          <TableCell>{formatNumber(e?.amount)}</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      );
                    })}
                    {entry.credit.map((e,creditIndex) => {
                      return (
                        <TableRow
                          sx={{
                            backgroundColor: i % 2 == 0 ? "#8080800f" : "",
                          }}
                          key={e.id}
                        >
                          
                         {creditIndex == 0 && entry.credit.length > 1  ? <Badge anchorOrigin={{horizontal:'left',vertical:'top'}} badgeContent='الي مذكورين' color="primary">
                          <TableCell>
                            {`  .......  ح  / ${e?.account?.name}
                         
                          `}
                          </TableCell>
                          </Badge> : 
                          <TableCell>
                         { entry.credit.length > 1 ? `  .......  ح / ${e?.account?.name}
                         
                         `:`  ....... الي ح / ${e?.account?.name}
                         
                         `}
                          </TableCell>
                         } 
                          
                          
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
                          fontWeight:'bold',
                          textAlign: "center",
                          color: i % 2 == 0 ? "blue" : "",
                          fontSize:'10pz'
                        }}
                        colSpan={5}
                      >
                        {entry.description}
                      </TableCell>
                    </TableRow>
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <AddEntryForm
          setUpdate={setUpdate}
          setEntries={setEntries}
          loading={loading}
          setDialog={setDialog}
          setLoading={setLoading}
        />
      </Grid>
    </Grid>
  );
}

export default AccountEntries;
