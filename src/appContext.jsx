import { createContext, useContext, useState } from "react";

const StateContext =  createContext({
    user : null,
    token : "123",
    setUser:()=>{},
    setToken:()=>{},

})

export const UserContextProvider = ({children})=>{

    const [token , _setToken] =  useState(localStorage.getItem('ACCESS_TOKEN'))
    const [user , setUser] =  useState()
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
          user,
          token,
          setUser,
          setToken
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)


