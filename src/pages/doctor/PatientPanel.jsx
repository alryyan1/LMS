import { Tabs, Tab, Box, Card, Stack } from "@mui/material";
import { useStateContext } from "../../appContext";
import info from "./../../assets/images/info.png";
import examination from "./../../assets/images/medical.png";
import dissatisfaction from "./../../assets/images/dissatisfaction.png";
import pills from "./../../assets/images/pills.png";
import diagnosis from "./../../assets/images/diagnosis.png";
import historyBook from "./../../assets/images/history-book.png";
import bloodTest from "./../../assets/images/blood-test.png";
import labResult from "./../../assets/images/experiment-results.png";
import healthcare from "./../../assets/images/healthcare.png";
import barcode from "./../../assets/images/barcode.png";
import sickleave from "./../../assets/images/sickleave.png";
function PatientPanel({ value, setValue }) {
  const { user } = useStateContext();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // console.log("start fetching", "packages and their tests");

  return (
    <Box>
      <Tabs
        sx={{ gap: 3 }}
        orientation="vertical"
        textColor="secondary"
        indicatorColor="secondary"
        value={value}
        onChange={handleChange}
      >
        <Stack
          className={` hover:bg-sky-700 ${
            value == 0 ? "bg-sky-500 hover:text-white" : ""
          }`}
          onClick={() => {
            setValue(0);
          }}
          sx={{ p: 1, color: "black" }}
          direction={"row"}
          gap={1}
        >
          <img style={{ marginRight: "5px" }} width={50} src={info} />
          <Tab value={0} label="Patient Information" />
        </Stack>
        <Stack
          className={` hover:bg-sky-700 ${
            value == 1 ? "bg-sky-500 hover:text-white" : ""
          }`}
          onClick={() => {
            setValue(1);
          }}
          sx={{ p: 1, color: "black" }}
          direction={"row"}
          gap={1}
        >
          <img style={{ marginRight: "5px" }} width={50} src={examination} />
          <Tab value={1} label="General Examination" />
        </Stack>
        {!user?.is_nurse &&  <Stack
          className={` hover:bg-sky-700 ${
            value == 2 ? "bg-sky-500 hover:text-white" : ""
          }`}
          onClick={() => {
            setValue(2);
          }}
          sx={{ p: 1, color: "black" }}
          direction={"row"}
          gap={1}
        >
          <img
            style={{ marginRight: "5px" }}
            width={50}
            src={dissatisfaction}
          />
          {!user?.is_nurse && <Tab value={2} label="Presenting Complains" />}
        </Stack>}
  
        {!user?.is_nurse &&    <Stack
          className={` hover:bg-sky-700 ${
            value == 4 ? "bg-sky-500 hover:text-white" : ""
          }`}
          onClick={() => {
            setValue(4);
          }}
          sx={{ p: 1, color: "black" }}
          direction={"row"}
          gap={1}
        >
          <img style={{ marginRight: "5px" }} width={50} src={historyBook} />
          {!user?.is_nurse && <Tab value={4} label="History" />}
        </Stack>}
      
        <Stack
          className={` hover:bg-sky-700 ${
            value == 6 ? "bg-sky-500 hover:text-white" : ""
          }`}
          onClick={() => {
            setValue(6);
          }}
          sx={{ p: 1, color: "black" }}
          direction={"row"}
          gap={1}
        >
          <img style={{ marginRight: "5px" }} width={50} src={bloodTest} />
          <Tab value={6} label="Lab Request" />
        </Stack>
        <Stack
          className={` hover:bg-sky-700 ${
            value == 9 ? "bg-sky-500 hover:text-white" : ""
          }`}
          onClick={() => {
            setValue(9);
          }}
          sx={{ p: 1, color: "black" }}
          direction={"row"}
          gap={1}
        >
          <img style={{ marginRight: "5px" }} width={50} src={labResult} />
          <Tab value={9} label="Lab Result" />
        </Stack>
        {!user?.is_nurse &&   <Stack
          className={` hover:bg-sky-700 ${
            value == 5 ? "bg-sky-500 hover:text-white" : ""
          }`}
          onClick={() => {
            setValue(5);
          }}
          sx={{ p: 1, color: "black" }}
          direction={"row"}
          gap={1}
        >
          <img style={{ marginRight: "5px" }} width={50} src={diagnosis} />
          {!user?.is_nurse && <Tab value={5} label="Provisional Diagnosis" />}
        </Stack>}
        {/* <Tab  label='Appointments' />; */}
        <Stack
          className={` hover:bg-sky-700 ${
            value == 7 ? "bg-sky-500 hover:text-white" : ""
          }`}
          onClick={() => {
            setValue(7);
          }}
          sx={{ p: 1, color: "black" }}
          direction={"row"}
          gap={1}
        >
          <img style={{ marginRight: "5px" }} width={50} src={healthcare} />
          <Tab value={7} label=" Service Request " />
        </Stack>
        {user?.is_nurse == 1 &&   <Stack
          className={` hover:bg-sky-700 ${
            value == 8 ? "bg-sky-500 hover:text-white" : ""
          }`}
          onClick={() => {
            setValue(8);
          }}
          sx={{ p: 1, color: "black" }}
          direction={"row"}
          gap={1}
        >
          <img style={{ marginRight: "5px" }} width={50} src={barcode} />
          {user?.is_nurse == 1 && <Tab value={8} label="Sample Collection " />}
        </Stack>}
        {!user?.is_nurse &&  <Stack
          className={` hover:bg-sky-700 ${
            value == 3 ? "bg-sky-500 hover:text-white" : ""
          }`}
          onClick={() => {
            setValue(3);
          }}
          sx={{ p: 1, color: "black" }}
          direction={"row"}
          gap={1}
        >
          <img style={{ marginRight: "5px" }} width={50} src={pills} />
          {!user?.is_nurse && <Tab value={3} label="Medicine Prescribed" />}
        </Stack>}
        {!user?.is_nurse &&  <Stack
          className={` hover:bg-sky-700 ${
            value == 10 ? "bg-sky-500 hover:text-white" : ""
          }`}
          onClick={() => {
            setValue(10);
          }}
          sx={{ p: 1, color: "black" }}
          direction={"row"}
          gap={1}
        >
          <img style={{ marginRight: "5px" }} width={50} src={sickleave} />
          {!user?.is_nurse && <Tab value={10} label="Sick Leave" />}
        </Stack>}
      </Tabs>
    </Box>
  );
}

export default PatientPanel;
