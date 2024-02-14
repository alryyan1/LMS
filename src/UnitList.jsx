import { useContext, useState, useRef, useEffect } from "react";
import context from "./appContext";
import TdUnit from "./TdUnit";

function UnitList() {
  const [editChildName, setEditChildName] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    // console.log(inputRef.current)
    if (editChildName) {
      console.log(inputRef.current);
      inputRef.current.focus();
    }
  }, [editChildName]);

  const appData = useContext(context);

  const addUnitHandler = () => {
    fetch("http://127.0.0.1/projects/bootstraped/new/api.php?addUnit=1")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data) {
          appData.setUnits((pre) => {
            return [...pre, data.data];
          });
          setTimeout(() => {
            document
              .querySelector(`[data-id="${data.data.id}"]`)
              .scrollIntoView();
            console.log("timer");
            console.log(data.data.id);
          }, 300);
        }
      });
  };

  return (
    <div className="table-children">
      <h1>Units List</h1>
      <button onClick={addUnitHandler} className="btn">
        +
      </button>
      <div className="table">
        <table>
          <thead>
            <th>Name</th>
          </thead>
          <tbody>
            {appData.units.map((unit) => {
              // console.log(child.normalRange)
              return (
                <tr key={unit.id}>
                  <TdUnit
                    units={appData.units}
                    setUnits={appData.setUnits}
                    id={unit.id}
                    unitName={unit.Unit_name}
                  />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UnitList;
