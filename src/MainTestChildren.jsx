import {  useState } from "react";
import {useOutletContext} from 'react-router-dom'
import Td from "./Td";
import TdSelect from "./TdSelect";
import TdTextArea from "./TdTextArea";
import Modal from "./Modal";
import TestOptions from "./TestOptions";

function MainTestChildren({ test, addChildTestHandler }) {
  const appData = useOutletContext();
  const [showModal, setShowModal] = useState(false);
  const [activeChild, setActiveChild] = useState();
  const [update, setUpdate] = useState(0);

  const addTestOptionHandler = () => {
    fetch(
      "http://127.0.0.1/projects/bootstraped/new/api.php?addTestOption=1&child=" +
        activeChild.child_test_id
    ).finally(() => {
      setUpdate((prev) => prev + 1);
    });
  };
  function showModalHandler(child) {
    setShowModal(true);
    setActiveChild(child);
    setUpdate((prev) => prev + 1);
  }

  const deleteChild = (argChild) => {
    const result = confirm("one parameter will be deleted !!");
    if (result) {
      fetch(
        "http://127.0.0.1/projects/bootstraped/new/api.php?deleteChild=1&child=" +
          argChild.child_test_id
      ).finally(() => {
        const filterredChildren = appData.activeTestObj.children.filter(
          (child) => child.child_test_id != argChild.child_test_id
        );
        appData.setActiveTestObj((prev) => {
          return { ...prev, children: [...filterredChildren] };
        });
      });
    }
  };

  return (
    <div className="table-children">
      <h1 style={{ textAlign: "center" }}>Test Parameters</h1>

      <button
        className="btn"
        onClick={() => {
          addChildTestHandler(test.id);
        }}
      >
        +
      </button>

      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Unit</td>
            <td>Default value</td>
            <td>Normal range</td>
            <td>Max</td>
            <td>Lowest</td>
            <td>Options</td>
            <td>Delete</td>
          </tr>
        </thead>
        <tbody>
          {test.children.map((child) => {
            // console.log(child.normalRange)
            return (
              <tr key={child.child_test_id}>
                <Td
                  child={child}
                  col={"child_test_name"}
                  val={child.child_test_name}
                />
                <TdSelect child={child} selectedUnit={child.Unit} />
                <Td child={child} col={"defval"} val={child.defval} />
                <TdTextArea
                  child={child}
                  col={"normalRange"}
                  val={child.normalRange}
                />
                <Td child={child} col={"max"} val={child.max} />
                <Td child={child} col={"lowest"} val={child.lowest} />
                <td>
                  <button onClick={() => showModalHandler(child)}>
                    options
                  </button>
                </td>
                <td>
                  <button onClick={() => deleteChild(child)}>delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {activeChild && (
        <Modal
          addHandler={addTestOptionHandler}
          showModal={showModal}
          setShowModal={setShowModal}
        >
          <TestOptions
            setUpdate={setUpdate}
            update={update}
            activeChild={activeChild}
          />
        </Modal>
      )}
    </div>
  );
}

export default MainTestChildren;
