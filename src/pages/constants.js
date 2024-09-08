import { Paper, createTheme, styled } from "@mui/material"
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import stylisRTLPlugin from "stylis-plugin-rtl";
// export const url = "https://intaj-starstechnology.com/lms/laravel-react-app/public/api/"
export const url = "http://127.0.0.1/laravel-react-app/public/api/"
// ALWAFEI export const url = "http://192.168.1.5/laravel-react-app/public/api/"
// export const url = "https://om-pharmacy.com/laravel-react-app/public/api/"
// export const webUrl = "https://intaj-starstechnology.com/lms/laravel-react-app/public/"
// ALAWAFEI export const webUrl = "http://192.168.1.5/laravel-react-app/public/"
 export const webUrl = "http://127.0.0.1/laravel-react-app/public/"
// export const webUrl = "https://om-pharmacy.com/laravel-react-app/public/"
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

  export function toFixed(num, fixed) {
    try {
        if (typeof num == 'string' && isNaN(num)) {
      return 0
    }
    var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
    return num.toString().match(re)[0];
    } catch (error) {
      return 0
    }
  
  }

  export  function formatNumber(number){
     return String(number).replace(
    /^\d+/,
    number => [...number].map(
        (digit, index, digits) => (
            !index || (digits.length - index) % 3 ? '' : ','
        ) + digit
    ).join('')
);
  }
  