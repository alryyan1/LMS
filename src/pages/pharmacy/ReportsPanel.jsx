import { Tabs, Tab, Box, Card, Stack } from "@mui/material";
import { useStateContext } from "../../appContext";
function ReportsPanel({ value, setValue }) {
  const { user } = useStateContext();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // console.log("start fetching", "packages and their tests");

  return (
    <Stack
      justifyContent={"space-around"}
      direction={"column"}
      component={Card}
      sx={{ border: "1px dashed black", p: 1 }}
    >
      <Tabs
      
        indicatorColor="primary"
        orientation="vertical"
        textColor="secondary"
        value={value}
        onChange={handleChange}
      >
        <Stack
          className={` hover:bg-sky-700 cursor-pointer     font-extrabold  ${
            value == 0 ? "bg-sky-500 hover:text-black" : ""
          }`}
          onClick={() => {
            setValue(0);
          }}
          sx={{ p: 1, color: "black", fontWeight: "600" }}
          direction={"row"}
          gap={1}
        >
          <Tab
            className={`opacity-1 ${value == 0 ? "header" : ""}`}
            value={0}
            label="Profit & Loss"
          />
        </Stack>
        <Stack
          className={` hover:bg-sky-700 cursor-pointer   ${
            value == 1 ? "bg-sky-500 hover:text-white font-extrabold " : ""
          }`}
          onClick={() => {
            setValue(1);
          }}
          sx={{ p: 1, color: "black" }}
          direction={"row"}
          gap={1}
        >
          <Tab
            className={`opacity-1 ${value == 1 ? "header" : ""}`}
            value={1}
            label="Sales"
          />
        </Stack>
       
          <Stack
            className={` hover:bg-sky-700 cursor-pointer   ${
              value == 2 ? "bg-sky-500 hover:text-white font-extrabold " : ""
            }`}
            onClick={() => {
              setValue(2);
            }}
            sx={{ p: 1, color: "black" }}
            direction={"row"}
            gap={1}
          >
          
         
              <Tab
                className={`opacity-1 ${value == 2 ? "header" : ""}`}
                value={2}
                label="Items"
              />
            
          </Stack>
        

       
          <Stack
            className={` hover:bg-sky-700 cursor-pointer   ${
              value == 3 ? "bg-sky-500 hover:text-white font-extrabold " : ""
            }`}
            onClick={() => {
              setValue(3);
            }}
            sx={{ p: 1, color: "black" }}
            direction={"row"}
            gap={1}
          >
           
              <Tab
                className={`opacity-1 ${value == 3 ? "header" : ""}`}
                value={3}
                label="Shifts"
              />
            
          </Stack>
        

        <Stack
          className={` hover:bg-sky-700 cursor-pointer   ${
            value == 4 ? "bg-sky-500 hover:text-white font-extrabold " : ""
          }`}
          onClick={() => {
            setValue(4);
          }}
          sx={{ p: 1, color: "black" }}
          direction={"row"}
          gap={1}
        >
          <Tab
            className={`opacity-1 ${value == 4 ? "header" : ""}`}
            value={4}
            label="Expenses"
          />
        </Stack>
        <Stack
          className={` hover:bg-sky-700 cursor-pointer   ${
            value == 5 ? "bg-sky-500 hover:text-white font-extrabold " : ""
          }`}
          onClick={() => {
            setValue(5);
          }}
          sx={{ p: 1, color: "black" }}
          direction={"row"}
          gap={1}
        >
          <Tab
            className={`opacity-1 ${value == 5 ? "header" : ""}`}
            value={5}
            label="Top Sales"
          />
        </Stack>
       
          <Stack
            className={` hover:bg-sky-700 cursor-pointer    ${
              value == 9 ? "bg-sky-500 hover:text-white font-extrabold " : ""
            }`}
            onClick={() => {
              setValue(9);
            }}
            sx={{ p: 1, color: "black" }}
            direction={"row"}
            gap={1}
          >
           
              <Tab
                className={`opacity-1 ${value == 9 ? "header" : ""}`}
                value={9}
                label=" Damaged Items"
              />
          </Stack>
        {/* <Tab  label='Appointments' />; */}
        <Stack
          className={` hover:bg-sky-700 cursor-pointer   ${
            value == 6 ? "bg-sky-500 hover:text-white font-extrabold " : ""
          }`}
          onClick={() => {
            setValue(6);
          }}
          sx={{ p: 1, color: "black" }}
          direction={"row"}
          gap={1}
        >
          <Tab
            className={`opacity-1 ${value == 6 ? "header" : ""}`}
            value={6}
            label="Expired Items"
          />
        </Stack>
        
       
          <Stack
            className={` hover:bg-sky-700 cursor-pointer   ${
              value == 7 ? "bg-sky-500 hover:text-white font-extrabold " : ""
            }`}
            onClick={() => {
              setValue(7);
            }}
            sx={{ p: 1, color: "black" }}
            direction={"row"}
            gap={1}
          >
           
              <Tab
                className={`opacity-1 ${value == 7 ? "header" : ""}`}
                value={7}
                label="Inventory"
              />
          </Stack>
       
          <Stack
            className={` hover:bg-sky-700 cursor-pointer   ${
              value == 8 ? "bg-sky-500 hover:text-white font-extrabold " : ""
            }`}
            onClick={() => {
              setValue(8);
            }}
            sx={{ p: 1, color: "black" }}
            direction={"row"}
            gap={1}
          >
           
              <Tab
                className={`opacity-1 ${value == 8 ? "header" : ""}`}
                value={8}
                label="Clients"
              />
          </Stack>
        
          <Stack
            className={` hover:bg-sky-700 cursor-pointer   ${
              value == 11 ? "bg-sky-500 hover:text-white font-extrabold " : ""
            }`}
            onClick={() => {
              setValue(11);
            }}
            sx={{ p: 1, color: "black" }}
            direction={"row"}
            gap={1}
          >
           
              <Tab
                className={`opacity-1 ${value == 11 ? "header" : ""}`}
                value={11}
                label="Suppliers"
              />
          </Stack>
      </Tabs>
    
    </Stack>
  );
}

export default ReportsPanel;
