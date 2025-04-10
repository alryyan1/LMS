import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Table,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { formatNumber } from "../constants";
import { Account, Debit } from "../../types/type";
import { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";

function LedjerTDialog({ account }:{account:Account}) {
  const { dialog, setDialog } = useOutletContext();
  console.log(account, "selected account");
  let largerNumber = 0;
  let totalCredits = 0;
  let totalDebits = 0;
  console.log(totalCredits, "total credits", totalDebits, "total dedits");
  largerNumber = Math.max(totalCredits, totalDebits);

  const [debits, setDebits] = useState<Debit[]>([]);
  const [credits, setCredits] = useState([]);

  useEffect(() => {
    //fetch all Accounts
  
      axiosClient(`debits`)
      .then(({data}) => {
          setDebits(data);
        console.log(data,'debits');
      });
      axiosClient(`credits`)
      .then(({data}) => {
          setCredits(data);
        console.log(data,'credits');
      });
  }, []);
 
   let greaterNumber = Math.max(totalCredits, totalDebits);
   let balance = 0;
   if(totalCredits > totalDebits){
     balance = totalCredits - totalDebits;
   }else{
     balance = totalDebits - totalCredits;
   }
  return (
    <div>
      <Dialog open={dialog.showDialog}>
        <DialogTitle textAlign={"center"}> T شكل دفتر الاستاذ حرف </DialogTitle>
        <DialogContent>
          <div style={{ width: "800px" }}>
            <Typography variant="h3" textAlign={"center"}>
              ح/ {account?.name}   ( {account?.id })
            </Typography>
           
          </div>
          <Grid sx={{ borderBottom: "1px solid grey" }} container>
            <Grid item xs={6}>
              له
            </Grid>
            <Grid item xs={6}>
              منه
            </Grid>
          </Grid>
          <Grid container>
            <Grid sx={{ borderLeft: "1px solid Grey", p: 1 }} item xs={6}>
              <List>

              {account?.credits?.map((debitEntry) => {
                if (debitEntry.finance_account_id == account.id) {
                  const credit = debits.find(
                    (ce) => ce.finance_entry_id == debitEntry.finance_entry_id
                  );

                  return (
                    <ListItem secondaryAction={`SDG ${formatNumber(debitEntry.amount)}`}  key={debitEntry.id}>

                        <ListItemText>
                        {debitEntry.entry?.debit?.length > 1 ? `من مذكورين` : `   من ح / ${credit?.account?.name}` } 

                        </ListItemText>
                    </ListItem>
                    // <div key={debitEntry.id}>
                   
                    //   {`   من ح / ${credit?.account?.name} ٍSDG ${formatNumber(debitEntry.amount)}  `}{" "}
                    // </div>
                  );
                }
              })}
              </List>
               <Box>
                {totalCredits > totalDebits ?  <> <Typography variant="h5" style={{ marginTop: "10px" }}>
                     الرصيد : {formatNumber(balance)}
                  </Typography></> : ''}
                 
 
               </Box>
            </Grid>
            <Grid item sx={{ p: 1 }} xs={6}>
              <List>
              {account?.debits?.map((debitEntry) => {
                if (debitEntry.finance_account_id == account.id) {
                  const credit = credits.find(
                    (ce) => ce.finance_entry_id == debitEntry.finance_entry_id
                  );
                  console.log(credit, "credit");
                  return (
                    <ListItem secondaryAction={`SDG ${formatNumber(debitEntry.amount)}`}  key={debitEntry.id}>
                    <ListItemText>
                   {debitEntry.entry?.credit?.length > 1   ? `الي مذكورين` : `   الي ح / ${credit?.account?.name}` } 
                    </ListItemText>
                </ListItem>
                    // <div key={debitEntry.id}>
                   
                    //   {`   الي ح / ${credit?.account?.name} ٍSDG ${formatNumber(debitEntry.amount)}  `}{" "}
                    // </div>
                  );
                }
              })}
              </List>
              <Box>
                {totalDebits > totalCredits ?  <> <Typography variant="h5" style={{ marginTop: "10px" }}>
                     الرصيد : {formatNumber(balance)}
                  </Typography></> : ''}
                 
 
               </Box>
            </Grid>

            <Grid item xs={6}>
              <div
                style={{
                  width: "90px",
                  borderTop: "1px solid grey",
                  borderBottom: "1px solid grey",
                  marginTop: "1px",
                }}
              >
                {formatNumber(largerNumber)}
              </div>
              <div
                style={{
                  width: "90px",
                  borderBottom: "1px solid grey",
                  marginTop: "1px",
                }}
              ></div>
            </Grid>
            <Grid item xs={6}>
              <div
                style={{
                  width: "90px",
                  borderTop: "1px solid grey",
                  borderBottom: "1px solid grey",
                  marginTop: "1px",
                }}
              >
                {formatNumber(largerNumber)}
              </div>
              <div
                style={{
                  width: "90px",
                  borderBottom: "1px solid grey",
                  marginTop: "1px",
                }}
              ></div>
            </Grid>
          </Grid>
          <Divider />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setDialog((prev) => {
                return { ...prev, showDialog: false };
              })
            }
          >
            close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default LedjerTDialog;
