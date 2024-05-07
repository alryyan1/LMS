import { createTheme } from "@mui/material"
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import stylisRTLPlugin from "stylis-plugin-rtl";
export const url = "http://127.0.0.1/laravel-react-app/public/api/"
export const webUrl = "http://127.0.0.1/laravel-react-app/public/"
export const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, stylisRTLPlugin],
  });
export const theme = createTheme({ direction: 'rtl' ,typography :{
    fontFamily: [
    
 
    ].join(','),
   } })