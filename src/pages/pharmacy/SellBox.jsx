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
          color={sell.complete == 0 ? "error" : "success"}
        >
          <Box
          style={{
          
          backgroundColor: sell.complete == 1 && activeSell?.id != sell.id  ? "#00e676" : ""
          }}
        
            onClick={() => {
              onClick(sell);
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
