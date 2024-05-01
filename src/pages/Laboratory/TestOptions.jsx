import { useEffect, useState } from "react";
import TestOption from "./TestOption";
import Loading from "../../loader";

function TestOptions({ activeChild, update, setUpdate }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(data.length);

  useEffect(() => {
    setLoading(true);
    fetch(
      `http://127.0.0.1/projects/bootstraped/new/api.php?options=1&child=${activeChild.child_test_id}`
    )
      .then((res) => res.json())
      .then(setData)
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
