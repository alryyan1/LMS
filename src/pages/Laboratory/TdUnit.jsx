import { useEffect, useRef, useState } from "react";

function TdUnit({ unitName, id, units, setUnits }) {
  //  console.log(val)
  const [editChildName, setEditChildName] = useState(false);
  const [name, setName] = useState(unitName);
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
  function editUnit(e) {
    setName(e.target.value);
    console.log(e.target.value);
    fetch(
      `http://127.0.0.1/projects/bootstraped/new/api.php?editUnit=1&name=${e.target.value}&id=${id}`
    );
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      const newUnits = units.map((unit) => {
        if (unit.id == id) {
          return {
            id: id,
            Unit_name: name,
          };
        } else {
          return unit;
        }
      });
      setUnits(newUnits);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [editChildName]);
  return (
    <td data-id={id} onClick={(e) => editName(e)}>
      <div className={editChildName ? "" : "hide"}>
        <input
          ref={inputRef}
          onBlur={() => setEditChildName(false)}
          onChange={(e) => {
            editUnit(e);
          }}
          value={name}
        />
      </div>
      <div className={editChildName ? "hide" : ""}>{name}</div>
    </td>
  );
}

export default TdUnit;
