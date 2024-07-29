import { createTheme, ThemeProvider } from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  mode: "",
  setMode: () => {},
});

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem('theme')?? 'light');


  useEffect(()=>{
    if(mode === "light"){
        document.documentElement.style.setProperty("--clr-2", "#f4f6f9");
        document.documentElement.style.setProperty("--clr-1", "#000000");

    }else{
        document.documentElement.style.setProperty("--clr-2", "#073438");
        document.documentElement.style.setProperty("--clr-1", "#f4f6f9");

    }

  },[mode])

  const theme = createTheme({
     
  palette: {
      
      mode: mode,
      
     
     
    },
   
    
    // direction: "rtl",
     
    typography: {
       
      fontFamily: [].join(","),
    },
  });


  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
      }}
    >
      <ThemeProvider theme={theme} >{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
