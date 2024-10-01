import { Paper, createTheme, styled } from "@mui/material"
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import stylisRTLPlugin from "stylis-plugin-rtl";
import axiosClient from "../../axios-client";
export function onlyAdmin (user,action){
  if(user != 1){
     return action()
  }
}

export function blurForNoramlUsers (){
  // return classname has filter properties
  return "blurForNormalUsers"
}
// export const url = "https://intaj-starstechnology.com/jawda1/laravel-react-app/public/api/"
export const url = "http://127.0.0.1/laravel-react-app/public/api/"
//  export const url = "http://192.168.1.5/laravel-react-app/public/api/"
// export const url = "https://om-pharmacy.com/laravel-react-app/public/api/"
// export const webUrl = "https://intaj-starstechnology.com/jawda1/laravel-react-app/public/"
//  export const webUrl = "http://192.168.1.5/laravel-react-app/public/"
 export const webUrl = "http://127.0.0.1/laravel-react-app/public/"
// export const webUrl = "https://om-pharmacy.com/laravel-react-app/public/"
export   const notifyMe = (title, data, address, action) => {
  // alert(Notification.permission)
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
    const notification = new Notification(title, { icon: address });
    notification.onclick = function () {
      console.log(action, "action");
      if (action) {
        // alert('ss')
        action(data);
      }
    };

    // …
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        const notification = new Notification(title, { icon: address });

        // …
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them anymore.
};
export const updateHandler = (val, colName,patient,change,setDialog) => {
  return new Promise((resolve,reject)=>{
    axiosClient
    .patch(`patients/${patient.id}`, {
      [colName]: val,
    })
    .then(({ data }) => {
      console.log(data);
      if (data.status) {
        change(data.patient);
        resolve(data.patient);
        setDialog((prev) => {
          return {
            ...prev,
            message: "Saved",
            open: true,
            color: "success",
          };
        });
      }
    })
    .catch(({ response: { data } }) => {
      console.log(data);
      setDialog((prev) => {
        return {
          ...prev,
          message: data.message,
          open: true,
          color: "error",
        };
      });
    });
  })

};
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
  export const newImage = 'data:image/png;base64,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'

  export const finishedImg = 'data:image/png;base64,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'