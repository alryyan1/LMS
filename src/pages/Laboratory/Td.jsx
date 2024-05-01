import { useEffect, useRef, useState } from "react";

function Td({ val, col, child }) {
  //  console.log(val)
  const [editChildName, setEditChildName] = useState(false);
  const [name, setName] = useState(val);
  const inputRef = useRef();

  useEffect(() => {
    // console.log(inputRef.current)
    if (editChildName) {
      inputRef.current.focus();
    }
  }, [editChildName]);
  function editName() {
    //show input for edit
    setEditChildName(true);
  }
  function editTest(e) {
    setName(e.target.value);
    fetch(
      `http://127.0.0.1/projects/bootstraped/new/api.php?editChild=1&col=${col}&result=${e.target.value}&childID=${child.child_test_id}`
    );
  }
  return (
    <td onClick={(e) => editName(e)}>
      <div className={editChildName ? "" : "hide"}>
        <input
          ref={inputRef}
          onBlur={() => setEditChildName(false)}
          onChange={(e) => {
            editTest(e);
          }}
          value={name}
        />
      </div>
      <div className={editChildName ? "hide" : ""}>{name}</div>
    </td>
  );
}

export default Td;
