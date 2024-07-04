import { Lock } from "@mui/icons-material";
import { Badge, Box, Grow,  } from "@mui/material";
import 'animate.css';

function SellBox({ onClick, sell,index,activeSell }) {
  
  

  return (
    <Grow  timeout={2000} in>
      {sell.deducted_items.length > 0 ? (
        <Badge
        
         
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "bottom",
          }}
        
          badgeContent={sell.deducted_items.length}
          color={sell.complete == 0 ? "secondary" : "warning"}
        >
          <Box
          
        
            onClick={() => {
              onClick(sell);
            }}
            sx={ activeSell?.id == sell.id ? {
                borderBottom:"4px solid blue",
                fontWeight:"bolder",
                backgroundColor :(theme)=>theme.palette.primary.light
    
              }:{
                backgroundColor:'white'
              }}   
          >
            {index}
            <span>
             {sell.result_is_locked ?  <Lock/> :""}
            </span>
          </Box>
        </Badge>
      ) : (
        <Box
       
          onClick={() => {
            onClick(sell);
          }}
          sx={ activeSell?.id == sell.id ? {
            borderBottom:"4px solid blue",
            fontWeight:"bolder",
            backgroundColor :(theme)=>theme.palette.primary.light

          }:{
            backgroundColor:'white'
          }}        >
          {index}
          <span >
             {sell.result_is_locked ?  <Lock/> :""}
            </span>
        </Box>
      )}
    </Grow>
  );
}

export default SellBox;