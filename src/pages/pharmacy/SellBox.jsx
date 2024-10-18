import { Lock } from "@mui/icons-material";
import { Badge, Box, Grow,  } from "@mui/material";
import 'animate.css';
import axiosClient from "../../../axios-client";

function SellBox({ onClick, sell,index,activeSell,setActiveSell,setShift,update }) {
  
  

  return (
    <Grow  timeout={2000} in>
      {sell.deducted_items.length > 0 ? (
        <Badge
        
         
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "bottom",
          }}
        
          badgeContent={sell.deducted_items.length}
          color={sell.complete == 0 ? "error" : "success"}
        >
          <Box
          style={{
          
          backgroundColor: sell.complete == 1 && activeSell?.id != sell.id  ? "#00e676" : ""
          }}
        
            onClick={() => {
              onClick(sell);
              axiosClient(`sells/find/${sell.id}`).then(({ data }) => {
               update(data)
                });
            }}
            
            sx={ activeSell?.id == sell.id ? {
                borderBottom:"4px solid blue",
                fontWeight:"bolder",
                backgroundColor :(theme)=>theme.palette.warning.light
    
              }:{
                
              }}   
          >
            {sell.number}
          
          </Box>
        </Badge>
      ) : (
        <Box
            
          onClick={() => {
            onClick(sell);
            axiosClient(`sells/find/${sell.id}`).then(({ data }) => {
              setActiveSell(data)
               setShift((prev)=>{
                 return {...prev, deducts : prev.deducts.map((d)=>{
                   if(d.id == sell.id){
                     return {...data}
                   }
                   return d;
                 })}
               })
             });
          }}
          sx={ activeSell?.id == sell.id ? {
            borderBottom:"4px solid blue",
            fontWeight:"bolder",
            backgroundColor :(theme)=>theme.palette.warning.light

          }:{
            
          }}        >
          {sell.number}
        
        </Box>
      )}
    </Grow>
  );
}

export default SellBox;
