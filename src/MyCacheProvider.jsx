import { CacheProvider } from "@emotion/react";
import { useContext, useEffect, useState } from "react";
import { cacheRtl,ltrCache } from "./pages/constants";



export const MyCacheProvider = ({ children }) => {
  const [cache, setCache] = useState(localStorage.getItem('lang')  == 'ar' ? cacheRtl : ltrCache);


//   useEffect(()=>{
//     if(lang === "ar"){

//     }else{

//     }

//   },[mode])



  return (
    <CacheProvider.Provider
      value={cacheRtl}
    >
    {children}
    </CacheProvider.Provider>
  );
};

export default MyCacheProvider;
