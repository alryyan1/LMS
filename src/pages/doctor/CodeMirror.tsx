import React, {  Dispatch, SetStateAction, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { autocompletion } from "@codemirror/autocomplete";
import axiosClient from "../../../axios-client";
import { updateHandler } from "../constants";
import { LoadingButton } from "@mui/lab";
import { DoctorVisit } from "../../types/Patient";
interface CodeEditorPrps {
  options: string[];
  setOptions: (options: string[]) => void;
  init: string;
  colName: string;
  patient: DoctorVisit;
  setActiveDoctorVisit: Dispatch<SetStateAction<DoctorVisit>>
  tableName: string;
  api:string;
  changeUrl?: boolean;
  apiUrl: string;
}
function CodeEditor({
  options,
  setOptions,
  init,
  colName,
  patient,
  setActiveDoctorVisit,
  tableName,
  changeUrl = false,
  apiUrl,
}:CodeEditorPrps) {
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
        height="200px"
        width="100%"
        dir="ltr"
        value={value}
        // height="200px"
        extensions={[autocompletion({ override: [myCompletions] })]}
        onChange={onChange}
      />
      
      <LoadingButton
      sx={{mt:1}}
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
          updateHandler(value, colName, patient, setActiveDoctorVisit,changeUrl,apiUrl).then(
            (_, data) => {
            }
          ).finally(()=>{
            setLoading(false);

          });
        }}
      >
        Save
      </LoadingButton>
    </>
  );
}
export default CodeEditor;
