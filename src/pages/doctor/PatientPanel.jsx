import { Tabs, Tab, Box, Card, Stack } from "@mui/material";
import { useStateContext } from "../../appContext";
import info from "./../../assets/images/info.png";
import examination from "./../../assets/images/medical.png";
import dissatisfaction from "./../../assets/images/dissatisfaction1.png";
import pills from "./../../assets/images/pills1.png";
import diagnosis from "./../../assets/images/diagnosis.png";
import historyBook from "./../../assets/images/history-book.png";
import bloodTest from "./../../assets/images/blood-test1.png";
import labResult from "./../../assets/images/experiment-results.png";
import healthcare from "./../../assets/images/healthcare.png";
import barcode from "./../../assets/images/barcode.png";
import sickleave from "./../../assets/images/sickleave.png";
import diet from "./../../assets/images/diet.png";
import { LoadingButton } from "@mui/lab";
import axiosClient from "../../../axios-client";
import { useState } from "react";

function PatientPanel({ value, setValue, setActiveDoctorVisit, patient }) {
  const { user } = useStateContext();
  const [loading, setLoading] = useState();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // console.log("start fetching", "packages and their tests");

  return (
      <Stack direction={'column'} gap={1}>
        <Box
      className='patient-panel'
    >
      {/* <Tabs
        indicatorColor=""
        sx={{ gap: 1 }}
        orientation="vertical"
        variant="scrollable"
        textColor=""
        value={value}
        onChange={handleChange}
      > */}
        <Stack
          
          className={` hover:bg-sky-700 cursor-pointer  hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500  rounded-md border-2 border-dashed      ${
            value == 0 ? "bg-sky-500 hover:text-black" : ""
          }`}
          onClick={() => {
            setValue(0);
          }}
          sx={{ p: 1, color: "black", fontWeight: "600" }}
          direction={"column"}
          gap={1}
        >
          <img style={{ marginRight: "5px" }} width={50} src={info} />
          <Tab
            className={`opacity-1 ${value == 0 ? "header" : ""}`}
            value={0}
            label=" Information"
          />
        </Stack>

        {!user?.is_nurse && (
          <Stack
            className={` hover:bg-sky-700 cursor-pointer  hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500  rounded-md border-2 border-dashed  ${
              value == 2 ? "bg-sky-500 hover:text-white  " : ""
            }`}
            onClick={() => {
              setValue(2);
            }}
            sx={{ p: 1, color: "black" }}
            direction={"column"}
            gap={1}
          >
            <img
              style={{ marginRight: "5px" }}
              width={50}
              src={dissatisfaction}
            />
            {!user?.is_nurse && (
              <Tab
                className={`opacity-1 ${value == 2 ? "header" : ""}`}
                value={2}
                label="P. Complains"
              />
            )}
          </Stack>
        )}

        {!user?.is_nurse && (
          <Stack
            className={` hover:bg-sky-700 cursor-pointer  hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500  rounded-md border-2 border-dashed  ${
              value == 3 ? "bg-sky-500 hover:text-white  " : ""
            }`}
            onClick={() => {
              setValue(3);
            }}
            sx={{ p: 1, color: "black" }}
            direction={"column"}
            gap={1}
          >
            <img style={{ marginRight: "5px" }} width={50} src={historyBook} />
            {!user?.is_nurse && (
              <Tab
                className={`opacity-1 ${value == 3 ? "header" : ""}`}
                value={3}
                label="History"
              />
            )}
          </Stack>
        )}
      {!user?.is_nurse && (  <Stack
          className={` hover:bg-sky-700 cursor-pointer  hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500  rounded-md border-2 border-dashed  ${
            value == 1 ? "bg-sky-500 hover:text-white  " : ""
          }`}
          onClick={() => {
            setValue(1);
          }}
          sx={{ p: 1, color: "black" }}
          direction={"column"}
          gap={1}
        >
          <img style={{ marginRight: "5px" }} width={50} src={examination} />
          <Tab
            className={`opacity-1 ${value == 1 ? "header" : ""}`}
            value={1}
            label=" Examination"
          />
        </Stack>)}
        {/* {!user?.is_nurse && (  <Stack
          className={` hover:bg-sky-700 cursor-pointer  hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500  rounded-md border-2 border-dashed  ${
            value == 12 ? "bg-sky-500 hover:text-white  " : ""
          }`}
          onClick={() => {
            setValue(12);
          }}
          sx={{ p: 1, color: "black" }}
          direction={"column"}
          gap={1}
        >
          <img style={{ marginRight: "5px" }} width={50} src={examination} />
          <Tab
            className={`opacity-1 ${value == 12 ? "header" : ""}`}
            value={12}
            label=" Review Of Systems"
          />
        </Stack>)} */}
        {/* <Stack
          className={` hover:bg-sky-700 cursor-pointer  hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500  rounded-md border-2 border-dashed  ${
            value == 6 ? "bg-sky-500 hover:text-white  " : ""
          }`}
          onClick={() => {
            setValue(6);
          }}
          sx={{ p: 1, color: "black" }}
          direction={"column"}
          gap={1}
        >
          <img style={{ marginRight: "5px" }} width={50} src={bloodTest} />
          <Tab
            className={`opacity-1 ${value == 6 ? "header" : ""}`}
            value={6}
            label="Lab Request"
          />
        </Stack> */}
        {/* <Stack
          className={` hover:bg-sky-700 cursor-pointer  hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500  rounded-md border-2 border-dashed  ${
            value == 9 ? "bg-sky-500 hover:text-white  " : ""
          }`}
          onClick={() => {
            setValue(9);
          }}
          sx={{ p: 1, color: "black" }}
          direction={"column"}
          gap={1}
        >
          <img style={{ marginRight: "5px" }} width={50} src={labResult} />
          <Tab
            className={`opacity-1 ${value == 9 ? "header" : ""}`}
            value={9}
            label="Lab Result"
          />
        </Stack> */}
        {!user?.is_nurse && (
          <Stack
            className={` hover:bg-sky-700 cursor-pointer  hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500  rounded-md border-2 border-dashed   ${
              value == 5 ? "bg-sky-500 hover:text-white  " : ""
            }`}
            onClick={() => {
              setValue(5);
            }}
            sx={{ p: 1, color: "black" }}
            direction={"column"}
            gap={1}
          >
            <img className="" width={50} src={diagnosis} />
            {!user?.is_nurse && (
              <Tab
                className={`opacity-1 ${value == 5 ? "header" : ""}`}
                value={5}
                label=" Diagnosis"
              />
            )}
          </Stack>
        )}
        {/* <Tab  label='Appointments' />; */}
        <Stack
          className={` hover:bg-sky-700 cursor-pointer  hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500  rounded-md border-2 border-dashed  ${
            value == 7 ? "bg-sky-500 hover:text-white  " : ""
          }`}
          onClick={() => {
            setValue(7);
          }}
          sx={{ p: 1, color: "black" }}
          direction={"column"}
          gap={1}
        >
          <img style={{ marginRight: "5px" }} width={50} src={healthcare} />
          <Tab
            className={`opacity-1 ${value == 7 ? "header" : ""}`}
            value={7}
            label=" Service Request "
          />
        </Stack>
        {user?.is_nurse == 1 && (
          <Stack
            className={` hover:bg-sky-700 cursor-pointer  hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500  rounded-md border-2 border-dashed  ${
              value == 8 ? "bg-sky-500 hover:text-white  " : ""
            }`}
            onClick={() => {
              setValue(8);
            }}
            sx={{ p: 1, color: "black" }}
            direction={"column"}
            gap={1}
          >
            <img style={{ marginRight: "5px" }} width={50} src={barcode} />
            {user?.is_nurse == 1 && (
              <Tab
                className={`opacity-1 ${value == 8 ? "header" : ""}`}
                value={8}
                label="Sample Collection "
              />
            )}
          </Stack>
        )}
        {!user?.is_nurse && (
          <Stack
            className={` hover:bg-sky-700 cursor-pointer  hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500  rounded-md border-2 border-dashed  ${
              value == 4 ? "  " : ""
            }`}
            onClick={() => {
              setValue(4);
            }}
            sx={{ p: 1, color: "black" }}
            direction={"column"}
            gap={1}
          >
            <img style={{ marginRight: "5px" }} width={50} src={pills} />
            {!user?.is_nurse && (
              <Tab
                className={`opacity-1 ${value == 4 ? "header" : ""}`}
                value={4}
                label="Medicines"
              />
            )}
          </Stack>
        )}
        {!user?.is_nurse && (
          <Stack
            className={` hover:bg-sky-700 cursor-pointer  hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500  rounded-md border-2 border-dashed  ${
              value == 10 ? "bg-sky-500 hover:text-white  " : ""
            }`}
            onClick={() => {
              setValue(10);
            }}
            sx={{ p: 1, color: "black" }}
            direction={"column"}
            gap={1}
          >
            <img style={{ marginRight: "5px" }} width={50} src={sickleave} />
            {!user?.is_nurse && (
              <Tab
                className={`opacity-1 ${value == 10 ? "header" : ""}`}
                value={10}
                label="Reports"
              />
            )}
          </Stack>
        )}
        {!user?.is_nurse && (
          <Stack
            className={` hover:bg-sky-700 cursor-pointer  hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500  rounded-md border-2 border-dashed  ${
              value == 11 ? "bg-sky-500 hover:text-white  " : ""
            }`}
            onClick={() => {
              setValue(11);
            }}
            sx={{ p: 1, color: "black" }}
            direction={"column"}
            gap={1}
          >
            <img style={{ marginRight: "5px" }} width={50} src={diet} />
            {!user?.is_nurse && (
              <Tab
                className={`opacity-1 ${value == 11 ? "header" : ""}`}
                value={11}
                label="Plan of Care"
              />
            )}
          </Stack>
        )}
      {/* </Tabs> */}
     
    </Box>
    {!user?.is_nurse && (
        <LoadingButton
         sx={{width: '100%'}}
          disabled={patient.patient.doctor_finish == 1}
          loading={loading}
          color={patient.doctor_finish ? "success" : "primary"}
          onClick={() => {
            if (patient.present_complains == "") {
              alert("please Fill Presenting complains field first");
              return;
            }
            setLoading(true);
            axiosClient
              .patch(`patients/${patient.patient.id}`, {
                doctor_finish: 1,
              })
              .then(({ data }) => {
                console.log(data);
                if (data.status) {
                  setActiveDoctorVisit(data.data);
                }
              })
              .catch(({ response: { data } }) => {
                console.log(data);
              })
              .finally(() => setLoading(false));
          }}
          variant="contained"
        >
          Complete
        </LoadingButton>
      )}
      </Stack>
  );
}

export default PatientPanel;
