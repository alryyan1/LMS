import {
  AttachMoney,
  AttachMoneyOutlined,
  LocalOffer,
  MoneyOff,
  Paid,
  PriceCheck,
  Widgets,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
function toFixed(num, fixed) {
  var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  return num.toString().match(re)[0];
}
function PurchaseInvoiceSummery({ deposit }) {
  const { showSummery, setShowSummery } = useOutletContext();
  console.log(deposit, "deposit");

  return (
    <div>
      <Dialog open={showSummery}>
        <DialogTitle variant="h3"></DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table sx={{fontSize:'larger'}} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Icon</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Widgets />
                  </TableCell>
                  <TableCell> Count</TableCell>
                  <TableCell>{deposit?.items.length}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <AttachMoneyOutlined />
                  </TableCell>
                  <TableCell> Cost</TableCell>
                  <TableCell>{deposit?.totalCost}</TableCell>
                </TableRow>
        
                <TableRow>
                  <TableCell>
                    <MoneyOff />
                  </TableCell>
                  <TableCell> Vat (OMR)</TableCell>
                  <TableCell>
                    {toFixed(deposit?.totalVatCostMoney, 3)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Paid />
                  </TableCell>
                  <TableCell> Buy</TableCell>
                  <TableCell>{deposit?.totalAmountPaid}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <MoneyOff />
                  </TableCell>
                  <TableCell> Offer Price</TableCell>
                  <TableCell>{deposit?.free_quantity}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <PriceCheck />
                  </TableCell>
                  <TableCell> Profit</TableCell>
                  <TableCell>{deposit?.free_quantity}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <LocalOffer />
                  </TableCell>
                  <TableCell> Discount</TableCell>
                  <TableCell>{deposit?.free_quantity}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Divider></Divider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSummery(false)}>close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PurchaseInvoiceSummery;
