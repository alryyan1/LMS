import { useState } from "react";
import { 
  Box,
  Stack,
  TextField,
  Typography,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Button,
  CircularProgress,
  useTheme
} from "@mui/material";
import { useStateContext } from "../appContext";
import axiosClient from "../../axios-client";
import { useAuthStore } from "../AuthStore";
import back from "../assets/images/calc.jpg";

function Login() {
  const { setCloseLoginDialog, startSession } = useAuthStore((state) => state);
  const [error, setError] = useState({ val: false, msg: "" });
  const [loading, setLoading] = useState(false);
  const { setToken, setUser } = useStateContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const theme = useTheme();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data } = await axiosClient.post("login", {
        username,
        password
      });

      if (data.status) {
        setUser(data.user);
        setToken(data.token);
        setCloseLoginDialog();
        startSession(data.token, data.user);
      }
    } catch (error) {
      setError({ val: true, msg: error.response.data.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundImage: `url(${back})`,
      }}
    >
      <Card
        sx={{
          minWidth: 400,
          borderRadius: 2,
          boxShadow: theme.shadows[10],
          backgroundColor: 'background.paper',
          p: 3
        }}
      >
        <CardHeader
          title={
            <Typography variant="h5" align="center">
              نظام جوده
            </Typography>
          }
          sx={{ pb: 2 }}
        />
        
        <CardContent>
          <form onSubmit={submitHandler} dir="rtl">
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="اسم الدخول"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
              
              <TextField
                fullWidth
                label="كلمه السر"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontWeight: 'bold',
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    جاري التحميل...
                  </>
                ) : (
                  'تسجيل الدخول'
                )}
              </Button>
            </Stack>
          </form>
        </CardContent>
        
        <CardContent sx={{ pt: 0 }}>
          {error.val && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error.msg}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;