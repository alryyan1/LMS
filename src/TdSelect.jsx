import React, { useContext, useState } from "react";
import {useOutletContext} from 'react-router-dom'
import context from "./appContext";

function TdSelect({ selectedUnit, child }) {
  const val = useOutletContext(context);
  const unit = val.units.find((unit) => unit.id == selectedUnit);

  const [editChild, setEditChild] = useState(false);
  const [name, setName] = useState(unit.Unit_name);
  function editName() {
    //show input for edit
    setEditChild(true);
  }
  function changeUnitHandler(selectedUnitId, child) {
    const unit = val.units.find((unit) => unit.id == selectedUnitId);
    setName(unit.Unit_name);

    console.log(unit.Unit_name);
    fetch(
      `http://127.0.0.1/projects/bootstraped/new/api.php?editChild=1&childID=${child.child_test_id}&result=${selectedUnitId}&col=unit`
    );
  }
  return (
    <td onClick={(e) => editName(e)}>
      {editChild ? (
        <select
          onBlur={() => setEditChild(false)}
          onChange={(e) => changeUnitHandler(e.target.value, child)}
          defaultValue={child.Unit}
        >
          {val.units.map((unit) => {
            return (
              <option key={unit.id} value={unit.id}>
                {unit?.Unit_name}
              </option>
            );
          })}
        </select>
      ) : (
        name
      )}
    </td>
  );
}

export default TdSelect;
