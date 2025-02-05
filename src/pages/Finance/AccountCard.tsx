import { Card, CardContent, Typography, Button, Box } from "@mui/material";

const AccountCard = ({ selectedAccount, handleEditAccount }) => {
  return (
    <Card sx={{ maxWidth: 400, boxShadow: 3, borderRadius: 2 }}>
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
        <Box mt={2} textAlign="right">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleEditAccount(selectedAccount)}
          >
            Edit
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
