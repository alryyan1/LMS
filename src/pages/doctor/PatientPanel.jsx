import { Tabs, Tab, Box, Card } from "@mui/material";
import { useStateContext } from "../../appContext";
function PatientPanel({ value, setValue }) {
  const { user } = useStateContext();

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
        <Tab value={0} label="Patient Information" />;
        <Tab value={1} label="General Examination" />;
        {!user?.is_nurse && <Tab value={2} label="Presenting Complains" />}
        {!user?.is_nurse && <Tab value={3} label="Medicine Prescribed" />}
        {!user?.is_nurse && <Tab value={4} label="History" />}
        {!user?.is_nurse && <Tab value={5} label="Provisional Diagnosis" />}
         <Tab value={6} label="Laboratory" />
        {/* <Tab  label='Appointments' />; */}
        <Tab value={7} label="Medical Service Request " />;
        {user?.is_nurse && <Tab value={8} label="Sample Collection " />}
      </Tabs>
    </Box>
  );
}

export default PatientPanel;
