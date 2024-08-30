import { Tabs, Tab, Box, Card } from "@mui/material";
function PatientPanel({value,setValue}) {

 


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // console.log("start fetching", "packages and their tests");

  return (
    <Box>
      
      <Tabs
    orientation="vertical"
        textColor="secondary"
        indicatorColor="secondary"
        value={value}
        onChange={handleChange}
      >
       <Tab  label='Patient Information' />;
       <Tab  label='General Examination' />;
       <Tab  label='Presenting Complains' />;
       <Tab  label='Medicine Prescribed' />;
       <Tab  label='History' />;
       <Tab  label='Provisional Diagnosis' />;
       <Tab  label='Laboratory' />;
       <Tab  label='Appointments' />;
       <Tab  label='Nursing ' />;
       
      </Tabs>

        
     
    </Box>
  );
}

export default PatientPanel;
