import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  IconButton,
} from "@mui/material";
import { TicketsPlaneIcon } from "lucide-react";
import LedjerTDialog from "./LedjerTDialog";
import { useOutletContext } from "react-router-dom";
import { webUrl } from "../constants";
import TitleIcon from '@mui/icons-material/Title';

const AccountCard = ({ selectedAccount, handleEditAccount,first,second }) => {
  const { dialog, setDialog } = useOutletContext();

  return (
    <Card sx={{ maxWidth: 400, boxShadow: 3, borderRadius: 2,textAlign:"center" }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {selectedAccount.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          <strong>Code:</strong> {selectedAccount.code}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {selectedAccount.description}
        </Typography>
        <Stack direction="row" gap={1} mt={2} justifyContent={'center'} alignItems={'center'}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEditAccount(selectedAccount)}
          >
            تعديل
          </Button>
          <IconButton
            onClick={() => {
              setDialog((prev) => {
                return { ...prev, showDialog: true };
              });
            }}
            title=" T الاستاذ حرف "
          >
          <TitleIcon/>
          </IconButton>
          <Button href={`${webUrl}ledger/${selectedAccount?.id}?first=${first}&second=${second}`}>PDF</Button>
        </Stack>
      </CardContent>
      {selectedAccount && (
        <LedjerTDialog
          account={selectedAccount}
          debits={selectedAccount.debits}
          credits={selectedAccount.credits}
        />
      )}
    </Card>
  );
};

export default AccountCard;
