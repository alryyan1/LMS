
import { useState } from "react";

import { Alert, Box, Stack, TextField, Typography } from "@mui/material";
import { useStateContext } from "../appContext";
import axiosClient from "../../axios-client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "/src/components/ui/card"
import { Label } from "/src/components/ui/label"
import { Button } from "../components/ui/button";
import { useAuthStore } from "../AuthStore";
import back from "../assets/images/dental.jpg"

function Login() {
  console.log("login page");
  const {setCloseLoginDialog,startSession} = useAuthStore((state)=>state)

  const [error, setError] = useState({ val: false, msg: "" });
  const [loading, setLoading] = useState(false);
  const { setToken, setUser } = useStateContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
 
  const sumbitHamdler = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosClient
      .post("login",  {
        username,
        password
      })
      .then(({ data }) => {
        console.log(data, "success data");
        if (data.status) {
          // alert('s')
          setUser(data.user);
          setToken(data.token);
          setCloseLoginDialog()
          startSession(data.token,data.user)

        }
      })
      .catch((error) => {
        setError({ val: true, msg: error.response.data.message });
      })
      .finally(() => setLoading(false));
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
        // backgroundColor:'red'
        backgroundImage: `url(${back})`,
      }}
    >
      <Stack  justifyContent="center" className="  rounded-md bg-white" alignItems="center" sx={{borderRadius:'10px',minWidth:'400px'}} direction="column">
        <Card style={{borderRadius:'10px',minWidth:'400px' }} className="rtl text-right rounded-md shadow-md  p-6 text-gray-800">
          <CardHeader>
            <Typography variant="h5" className="text-center  ">
              نظام جوده الطبي
            </Typography>
          </CardHeader>
          <CardContent>
            <form noValidate dir="rtl" onSubmit={sumbitHamdler}>
              <Stack direction="column" gap={3}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5 text-right">
                    <Label htmlFor="username">اسم الدخول</Label>
                    <TextField
                      id="username"
                    
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                 
                  </div>

                  <div className="flex flex-col space-y-1.5 text-right">
                    <Label htmlFor="password">كلمه السر</Label>
                    <TextField
                      id="password"
                      
               
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                
                  </div>
                </div>

                <Button
                  type="submit"
                  className="bg-blue-800 hover:bg-blue-900"
                  style={{
                    borderRadius: "5px",
                    padding: "10px",
                    fontWeight: "bold",
                    color: "white",
                  }}
                  disabled={loading}
                >
                  {loading ? 'جاري التحميل . . . ' : 'تسجيل الدخول'}
                </Button>
              </Stack>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center mt-2 text-white">
            {error.val && (
              <Alert severity="error" variant="outlined" sx={{ width: "100%" }}>
                {error.msg}
              </Alert>
            )}
          </CardFooter>
        </Card>
      </Stack>
      
    </Box>
  );
}

export default Login;
