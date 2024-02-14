import { useEffect, useState } from "react";

function TestOption({ testOptionId, name: optionName, setUpdate }) {
  console.log(optionName);
  const [started, setStarted] = useState(false);
  const [edited, setEdited] = useState(false);
  const [name, setName] = useState(optionName);
  useEffect(() => {
    if (started) {
      const timer = setTimeout(() => {
        fetch(
          `http://127.0.0.1/projects/bootstraped/new/api.php?editOption=1&testOptionId=${testOptionId}&val=${name}`
        );
      }, 300);
      return () => {
        clearTimeout(timer);
      };
    }
    console.log("here");
    setStarted(true);
  }, [name]);
  function deleteHandler(id) {
    fetch(
      `http://127.0.0.1/projects/bootstraped/new/api.php?deleteOption=1&testOptionId=${id}}`
    ).finally(() => {
      setUpdate((prev) => prev + 1);
    });
  }
  return (
    <li onClick={() => setEdited(true)}>
      <div className="flex">
        <div>
          {" "}
          {edited ? (
            <input
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
