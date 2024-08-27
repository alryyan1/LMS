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
import { toFixed } from "../constants";

function PurchaseInvoiceSummery({ deposit }) {
  const { showSummery, setShowSummery } = useOutletContext();
  // console.log(deposit, "deposit");

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
                  <TableCell> Items Number</TableCell>
                  <TableCell>{deposit?.items?.length}</TableCell>
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
                  <TableCell>{toFixed(deposit?.totalAmountPaid,3)}</TableCell>
                </TableRow>
              
                <TableRow>
                  <TableCell>
                    <PriceCheck />
                  </TableCell>
                  <TableCell> Profit</TableCell>
                  <TableCell>{toFixed(deposit.totalSell -  deposit.totalCost)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <LocalOffer />
                  </TableCell>
                  <TableCell> Discount</TableCell>
                  <TableCell>{toFixed(deposit?.totalAmountPaid * deposit.discount / 100,3)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <LocalOffer />
                  </TableCell>
                  <TableCell> Paid (discount applied)</TableCell>
                  <TableCell>{toFixed(deposit.totalAmountPaid-(deposit?.totalAmountPaid * deposit.discount / 100),3)}</TableCell>
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
