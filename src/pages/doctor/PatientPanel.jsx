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
function PatientPanel({ value, setValue, change, setDialog, patient }) {
  const { user } = useStateContext();
  const [loading, setLoading] = useState();
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
        sx={{ gap: 3 }}
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
          <img style={{ marginRight: "5px" }} width={50} src={info} />
          <Tab
            className={`opacity-1 ${value == 0 ? "header" : ""}`}
            value={0}
            label="Patient Information"
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
          <img style={{ marginRight: "5px" }} width={50} src={examination} />
          <Tab
            className={`opacity-1 ${value == 1 ? "header" : ""}`}
            value={1}
            label="General Examination"
          />
        </Stack>
        {!user?.is_nurse && (
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
            <img
              style={{ marginRight: "5px" }}
              width={50}
              src={dissatisfaction}
            />
            {!user?.is_nurse && (
              <Tab
                className={`opacity-1 ${value == 2 ? "header" : ""}`}
                value={2}
                label="Presenting Complains"
              />
            )}
          </Stack>
        )}

        {!user?.is_nurse && (
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
          <img style={{ marginRight: "5px" }} width={50} src={bloodTest} />
          <Tab
            className={`opacity-1 ${value == 6 ? "header" : ""}`}
            value={6}
            label="Lab Request"
          />
        </Stack>
        <Stack
          className={` hover:bg-sky-700 cursor-pointer   ${
            value == 9 ? "bg-sky-500 hover:text-white font-extrabold " : ""
          }`}
          onClick={() => {
            setValue(9);
          }}
          sx={{ p: 1, color: "black" }}
          direction={"row"}
          gap={1}
        >
          <img style={{ marginRight: "5px" }} width={50} src={labResult} />
          <Tab
            className={`opacity-1 ${value == 9 ? "header" : ""}`}
            value={9}
            label="Lab Result"
          />
        </Stack>
        {!user?.is_nurse && (
          <Stack
            className={` hover:bg-sky-700 cursor-pointer    ${
              value == 5 ? "bg-sky-500 hover:text-white font-extrabold " : ""
            }`}
            onClick={() => {
              setValue(5);
            }}
            sx={{ p: 1, color: "black" }}
            direction={"row"}
            gap={1}
          >
            <img className="" width={50} src={diagnosis} />
            {!user?.is_nurse && (
              <Tab
                className={`opacity-1 ${value == 5 ? "header" : ""}`}
                value={5}
                label="Provisional Diagnosis"
              />
            )}
          </Stack>
        )}
        {/* <Tab  label='Appointments' />; */}
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
          <img style={{ marginRight: "5px" }} width={50} src={healthcare} />
          <Tab
            className={`opacity-1 ${value == 7 ? "header" : ""}`}
            value={7}
            label=" Service Request "
          />
        </Stack>
        {user?.is_nurse == 1 && (
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
            <img style={{ marginRight: "5px" }} width={50} src={pills} />
            {!user?.is_nurse && (
              <Tab
                className={`opacity-1 ${value == 4 ? "header" : ""}`}
                value={4}
                label="Medicine Prescribed"
              />
            )}
          </Stack>
        )}
        {!user?.is_nurse && (
          <Stack
            className={` hover:bg-sky-700 cursor-pointer   ${
              value == 10 ? "bg-sky-500 hover:text-white font-extrabold " : ""
            }`}
            onClick={() => {
              setValue(10);
            }}
            sx={{ p: 1, color: "black" }}
            direction={"row"}
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
            <img style={{ marginRight: "5px" }} width={50} src={diet} />
            {!user?.is_nurse && (
              <Tab
                className={`opacity-1 ${value == 11 ? "header" : ""}`}
                value={11}
                label="Patient Care Plan"
              />
            )}
          </Stack>
        )}
      </Tabs>
      {!user?.is_nurse && (
        <LoadingButton
          disabled={patient.doctor_finish == 1}
          loading={loading}
          color={patient.doctor_finish ? "success" : "primary"}
          onClick={() => {
            setLoading(true);
            axiosClient
              .patch(`patients/${patient.id}`, {
                doctor_finish: 1,
              })
              .then(({ data }) => {
                console.log(data);
                if (data.status) {
                  change(data.patient);
                  setDialog((prev) => {
                    return {
                      ...prev,
                      message: "Saved",
                      open: true,
                      color: "success",
                    };
                  });
                }
              })
              .catch(({ response: { data } }) => {
                console.log(data);
                setDialog((prev) => {
                  return {
                    ...prev,
                    message: data.message,
                    open: true,
                    color: "error",
                  };
                });
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
