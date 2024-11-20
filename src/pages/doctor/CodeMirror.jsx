import React, {  useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { autocompletion } from "@codemirror/autocomplete";
import axiosClient from "../../../axios-client";
import { updateHandler } from "../constants";
import { LoadingButton } from "@mui/lab";
function CodeEditor({
  options,
  setOptions,
  init,
  colName,
  patient,
  setActiveDoctorVisit,
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
  const onChange = React.useCallback((val) => {
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
          updateHandler(value, colName, patient, setActiveDoctorVisit, setDialog).then(
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
