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

function LedjerTDialog({ account,debits,credits }) {
  const { dialog, setDialog } = useOutletContext();
  console.log(account, "selected account");

  return (
    <div>
      <Dialog open={dialog.showDialog}>
        <DialogTitle textAlign={'center'}> T شكل دفتر الاستاذ حرف </DialogTitle>
        <DialogContent>
          <div style={{ width: "400px" }}>
            <Typography variant="h3" textAlign={'center'}>ح/ {account?.name}</Typography>
          </div>
          <Grid sx={{borderBottom:'1px solid grey'}} container>
           
            <Grid item xs={6}>
              له
            </Grid>
            <Grid item xs={6}>
              منه
            </Grid>
          </Grid>
          <Grid container>
         
            <Grid sx={{borderRight:'1px solid Grey'}} item xs={6}>
              {account.credits.map((debitEntry) => {
                if (debitEntry.finance_account_id == account.id) {
                   const credit =  debits.find((ce) =>ce.finance_entry_id == debitEntry.finance_entry_id )

                   return <div key={debitEntry.id}> {`   من ح / ${credit.account.name} OMR ${debitEntry.amount}  `}  </div>;
                }
              })}
            </Grid>
            <Grid item xs={6}>
              {account.debits.map((debitEntry) => {
                if (debitEntry.finance_account_id == account.id) {
                   const credit =  credits.find((ce) =>ce.finance_entry_id == debitEntry.finance_entry_id )
                   console.log(credit,'credit')
                  return <div key={debitEntry.id}> {`   الي ح / ${credit.account.name} OMR ${debitEntry.amount}  `}  </div>;
                }
              })}
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
