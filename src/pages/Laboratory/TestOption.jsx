import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";

function TestOption({ testOptionId, name: optionName, setUpdate }) {
  console.log(optionName);
  const [started, setStarted] = useState(false);
  const [edited, setEdited] = useState(false);
  const [name, setName] = useState(optionName);
  useEffect(() => {
    if (started) {
      const timer = setTimeout(() => {
        axiosClient.patch(
          `childTestOption/${testOptionId}`,{val:name}
        ).then((data)=>{
          console.log(data)
        })
      }, 300);
      return () => {
        clearTimeout(timer);
      };
    }
    console.log("here");
    setStarted(true);
  }, [name]);
  function deleteHandler(id) {
    axiosClient.delete(
      `childTestOption/${id}`
    ).finally(() => {
      setUpdate((prev) => prev + 1);
    });
  }
  return (
    <li >
      <div className="flex">
        <div style={{cursor:"pointer"}} onClick={() => setEdited(true)}>
          {" "}
          {edited ? (
            <TextField
            onFocus={
              (e) => {
                e.target.select();
              
              }
            }
            multiline
            autoFocus
              onChange={(e) => setName(e.target.value)}
              type="text"
              value={name}
            />
          ) : (
            name
          )}
        </div>

        <button onClick={() => deleteHandler(testOptionId)}>x</button>
      </div>
    </li>
  );
}

export default TestOption;
