import React from 'react'
import AddCostForm from '../components/AddCostForm';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import MyCustomLoadingButton from '../components/MyCustomLoadingButton';
import axiosClient from '../../axios-client';

function AuditCost({selectedShift,setSelectedShift}) {
  return (
     <div
    style={{
      marginTop: "5px",
      gap: "15px",
      transition: "0.3s all ease-in-out",
  
      display: "grid",
      direction: "rtl",
      gridTemplateColumns: `1fr  1fr  1fr   1fr     `,
    }}
  >
       <AddCostForm  setShift={setSelectedShift} selectedShift={selectedShift}/>
        <Typography
         textAlign={"center"}>مصروفات الورديه</Typography>
  
          <List  dense>
            {selectedShift.cost.map((cost) => {
              return (
                <ListItem
                  
                  secondaryAction={
                    <MyCustomLoadingButton onClick={(setLoading)=>{
                      setLoading(true)
                      axiosClient.delete(`cost/${cost.id}`).then((
                        {data}
                      ) => {
                        console.log(data);
                        setSelectedShift((prev)=>{
                          const newShift = {...prev };
                          newShift.cost = newShift.cost.filter(
                            (c) => c.id!== cost.id
                          );
                          return newShift;
                        })
                      }).finally(()=>setLoading(true));
                    }}>حذف</MyCustomLoadingButton>
                  }
                  key={cost.id}
                >
                  <ListItemIcon>{cost.amount}</ListItemIcon>
                  <ListItemButton 
                    style={{
                      marginBottom: "2px",
                    }}
                  >
                    <ListItemText>{cost.description}</ListItemText>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        
    </div>
  )
}

export default AuditCost