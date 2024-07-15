import { Paper, createTheme, styled } from "@mui/material"
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import stylisRTLPlugin from "stylis-plugin-rtl";
export const url = "http://127.0.0.1/laravel-react-app/public/api/"
export const webUrl = "http://127.0.0.1/laravel-react-app/public/"
export const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, stylisRTLPlugin],
  });
 export const ltrCache = createCache({
    key: 'mui',
  });
export const theme = createTheme({
  palette:{
    mode:'dark'
  },
  
  direction: 'rtl' ,typography :{
    fontFamily: [
    
 
    ].join(','),
   } })


  export const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  