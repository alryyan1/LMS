import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Table,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";

function LedjerTDialog({ account, debits, credits }) {
  const { dialog, setDialog } = useOutletContext();
  console.log(account, "selected account");
  let largerNumber = 0;
  let totalCredits = account.credits.reduce(
    (accum, current) => accum + current.amount,
    0
  );
  let totalDebits = account.debits.reduce(
    (accum, current) => accum + current.amount,
    0
  );
  console.log(totalCredits, "total credits", totalDebits, "total dedits");
  largerNumber = Math.max(totalCredits, totalDebits);




  return (
    <div>
      <Dialog open={dialog.showDialog}>
        <DialogTitle textAlign={"center"}> T شكل دفتر الاستاذ حرف </DialogTitle>
        <DialogContent>
          <div style={{ width: "500px" }}>
            <Typography variant="h3" textAlign={"center"}>
              ح/ {account?.name}
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
              {account.credits.map((debitEntry) => {
                if (debitEntry.finance_account_id == account.id) {
                  const credit = debits.find(
                    (ce) => ce.finance_entry_id == debitEntry.finance_entry_id
                  );

                  return (
                    <div key={debitEntry.id}>
                   
                      {`   من ح / ${credit.account.name} OMR ${debitEntry.amount}  `}{" "}
                    </div>
                  );
                }
              })}
            </Grid>
            <Grid item sx={{ p: 1 }} xs={6}>
              {account.debits.map((debitEntry) => {
                if (debitEntry.finance_account_id == account.id) {
                  const credit = credits.find(
                    (ce) => ce.finance_entry_id == debitEntry.finance_entry_id
                  );
                  console.log(credit, "credit");
                  return (
                    <div key={debitEntry.id}>
                   
                      {`   الي ح / ${credit.account.name} OMR ${debitEntry.amount}  `}{" "}
                    </div>
                  );
                }
              })}
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
                {largerNumber}
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
                {largerNumber}
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
