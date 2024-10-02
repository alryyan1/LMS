import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion } from "@codemirror/autocomplete";
import axiosClient from "../../../axios-client";
import { updateHandler } from "../constants";
import { Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";

// [
//     {label: "match", type: "keyword"},
//     {label: "hello", type: "variable", info: "(World)"},
//     {label: "magic", type: "text", apply: "⠁⭒*.✩.*⭒⠁", detail: "macro"}
//   ]

function CodeEditor({
  options,
  setOptions,
  init,
  colName,
  patient,
  change,
  setDialog,
  tableName
}) {
  const [value, setValue] = React.useState(init);
  const [loading, setLoading] = useState(false);

  function myCompletions(context) {
    let word = context.matchBefore(/\w*/);
    if (word.from == word.to && !context.explicit) return null;
    return {
      from: word.from,
      options: options,
    };
  }
  //   useEffect(()=>{
  //    const timer =    setTimeout(() => {
  //     if (init != value) {
  //          console.log('start of time out')
  //         //updateHandler(value,colName,patient,null,setDialog)
  //     }

  //     }, 300);
  //     return  ()=>{
  //         console.log('clear time out')
  //         clearTimeout(timer);

  //     }
  //   },[value])

  const onChange = React.useCallback((val, viewUpdate) => {
    console.log("val:", val);
    setValue(val);
  }, []);
  return (
    <>
      <CodeMirror
        width="100%"
        value={value}
        height="200px"
        extensions={[autocompletion({ override: [myCompletions] })]}
        onChange={onChange}
      />
      ;
      <LoadingButton
        loading={loading}
        fullWidth
        variant="contained"
        onClick={() => {
          setLoading(true);
          axiosClient
            .patch("updateTable", {
              table: tableName,
              val: String(value)
                .replace(/\n/g, " ")
                .split(" ")
                .filter((v) => {
                  return v != "";
                }),
            })
            .then(({ data }) => {
                setOptions(data.map((c) => ({label:c.name,type:c.name})));

              console.log(data, "update table db");
            });
          updateHandler(value, colName, patient, change, setDialog).then(
            (_, data) => {
              setLoading(false);
            }
          );
        }}
      >
        Save
      </LoadingButton>
    </>
  );
}
export default CodeEditor;
