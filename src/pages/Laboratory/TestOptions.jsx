import { useEffect, useState } from "react";
import TestOption from "./TestOption";
import Loading from "../../loader";
import axiosClient from "../../../axios-client";

function TestOptions({ activeChild, update, setUpdate }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(data.length);

  useEffect(() => {
    setLoading(true);
    axiosClient.get(
      `childTestOption/${activeChild.id}`
    )
      .then((data)=>{
        console.log(data)
        setData(data.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeChild, update]);

  return (
    <div>
      {" "}
      {loading ? (
        <Loading />
      ) : (
        <ul>
          {data.length == 0
            ? "No Test Options"
            : data.map((option) => {
                return (
                  <TestOption
                    setUpdate={setUpdate}
                    key={option.id}
                    name={option.result_option}
                    testOptionId={option.id}
                  />
                );
              })}
        </ul>
      )}
    </div>
  );
}

export default TestOptions;
