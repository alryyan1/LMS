import { useState, useRef, useEffect } from "react";

function TdTextArea({ val, col, child }) {
  //  console.log(val)
  const [editChildName, setEditChildName] = useState(false);
  const [nr, setNr] = useState(child.normalRange);
  function editName() {
    //show input for edit
    setEditChildName(true);
  }
  const inputRef = useRef();

  useEffect(() => {
    // console.log(inputRef.current)
    if (editChildName) {
      inputRef.current.focus();
    }
  }, [editChildName]);
  function editTest(e) {
    setNr(e.target.value);
    const url = 'http://127.0.0.1/projects/bootstraped/new/api.php';
    const params = new URLSearchParams( `editChild=1&col=${col}&result=${e.target.value}&childID=${child.child_test_id}`)
    console.log(params)
    fetch(url,{method:'POST',headers :{"content-Type":"Application/json"},body :params}
     
    )
      .then((res) => {
        return res.json();
      })
      
  }
  return (
    <td onClick={(e) => editName(e)}>
      {editChildName ? (
        <textarea
          ref={inputRef}
          onBlur={() => setEditChildName(false)}
          defaultValue={val}
          onChange={(e) => {
            editTest(e);
          }}
          cols="30"
          rows="3"
        ></textarea>
      ) : (
        nr
      )}
    </td>
  );
}

export default TdTextArea;
