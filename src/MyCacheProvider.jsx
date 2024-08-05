import { CacheProvider } from "@emotion/react";
import { useContext, useEffect, useState } from "react";
import { cacheRtl,ltrCache } from "./pages/constants";
import { useTranslation } from "react-i18next";



export const MyCacheProvider = ({ children }) => {

  const { i18n } = useTranslation();
  
  const [cache, setCache] = useState(localStorage.getItem('lang')  == 'ar' ? cacheRtl : ltrCache);
  useEffect(()=>{
    if(i18n.language  == 'ar'){
      setCache(cacheRtl)

    } else if(i18n.language == 'en'){
      // alert('en')
      setCache(ltrCache)

      // setCache(cacheRtl)
      // setCache(cacheRtl)

    }
  },[i18n.language])

//   useEffect(()=>{
//     if(lang === "ar"){

//     }else{

//     }

//   },[mode])



  return (
    <CacheProvider
      value={cache}
    >
    {children}
    </CacheProvider>
  );
};

export default MyCacheProvider;
