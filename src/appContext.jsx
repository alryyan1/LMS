import { createContext, useContext, useState } from "react";

const StateContext =  createContext({
    user : null,
    token : "123",
    setUser:()=>{},
    setToken:()=>{},
    setLabDrawer:()=>{},
    labDrawer : false,
    clinicDrawer : false,
    pharmcyDrawer : false,
    setPharmacyDrawer:()=>{},

     setClinicDrawer : ()=>{},

})

export const UserContextProvider = ({children})=>{

    const [token , _setToken] =  useState(localStorage.getItem('ACCESS_TOKEN'))
    const [user , setUser] =  useState()
    const [labDrawer, setLabDrawer] = useState(false);
    const [clinicDrawer, setClinicDrawer] = useState(false);
    const [pharmcyDrawer, setPharmacyDrawer] = useState(false);

    const setToken = (token)=>{
        _setToken(token)
        if (token) {
            localStorage.setItem('ACCESS_TOKEN',token)
        }else{
            localStorage.removeItem('ACCESS_TOKEN')
        }
    }

    return (
        <StateContext.Provider value={{
            labDrawer,
            setLabDrawer,
          user,
          token,
          setUser,
          setToken,
          clinicDrawer, 
          setClinicDrawer,
          pharmcyDrawer, 
          setPharmacyDrawer,
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)


