import React from "react";
import { Tabs, Tab, Box, Card } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import TabItem from "./TabItem";
import CardItem from "./CardItem";
function ItemGroups()  {
 const {drugCategory,selectedDrugs, setSelectedDrugs} =   useOutletContext()
  const handleTestAdd = (item) => {

    setSelectedDrugs((prev)=>{
        return [...prev,item]
    })
  
  }
  const [value, setValue] = React.useState(0);
 


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  console.log("start fetching", "packages and their tests");

  return (
    <Box>
      
      <Tabs
        textColor="secondary"
        indicatorColor="secondary"
        value={value}
        onChange={handleChange}
        variant="scrollable"
      >
        {drugCategory.map((p) => {
          return <Tab key={p.id} label={p.name} />;
        })}
      </Tabs>
      {drugCategory.filter((g)=>{
        return g.items.length > 0 
      }).map((p, index) => {
        return (
          <TabItem key={p.id} index={index} value={value}>
            {p.items.map((t) =>{ 
             const founded =  selectedDrugs.find((ts)=>ts.id == t.id)

            //   return <Card
            //     onClick={()=>handleTestAdd(p,t)}
                
            //     key={t.id}
            //   >
            //     {t.market_name}
            //   </Card>
              return <CardItem active ={
                founded? true:false
              } handleTestAdd = {handleTestAdd}  myItem={t} key={t.id}/>
            
            }
            )}
          </TabItem>
        );
      })}
    </Box>
  );
}

export default ItemGroups;
