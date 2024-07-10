import { Paper, createTheme, styled } from "@mui/material"
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import stylisRTLPlugin from "stylis-plugin-rtl";
import { useStateContext } from "../appContext";
export const url = "https://intaj-starstechnology.com/pharmacy/public/api/"
export const webUrl = "https://intaj-starstechnology.com/pharmacy/laravel-react-app/public/"
export const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, stylisRTLPlugin],
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

  