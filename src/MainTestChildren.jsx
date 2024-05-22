import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Td from "./pages/Laboratory/Td";
import TdSelect from "./pages/Laboratory/TdSelect";
import TdTextArea from "./pages/Laboratory/TdTextArea";
import Modal from "./Modal";
import TestOptions from "./pages/Laboratory/TestOptions";
import axiosClient from "../axios-client";
import { Button, Stack, Table, TableBody, TableCell, TableRow } from "@mui/material";
import MyTableCell from "./pages/inventory/MyTableCell";
import MyAutoCompeleteTableCell from "./pages/inventory/MyAutoCompeleteTableCell";

function MainTestChildren() {
  const { activeTestObj, addChildTestHandler, setActiveTestObj, units } =
    useOutletContext();
  const [showModal, setShowModal] = useState(false);
  const [activeChild, setActiveChild] = useState();
  const [update, setUpdate] = useState(0);

  const addTestOptionHandler = () => {
    axiosClient.post(`childTestOption/${activeChild.id}`).then((data)=>console.log(data)).finally(() => {
      setUpdate((prev) => prev + 1);
    });
  };
  function showModalHandler(child) {
    setShowModal(true);
    setActiveChild(child);
    console.log(activeChild,'activeChild')
    setUpdate((prev) => prev + 1);
  }

  const deleteChild = (argChild) => {
    const result = confirm("one parameter will be deleted !!");
    if (result) {
      axiosClient.delete(`childTest/${activeChild.id}`).finally(() => {
        const filterredChildren = activeTestObj.children.filter(
          (child) => child.id != argChild.id
        );
        setActiveTestObj((prev) => {
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
          addChildTestHandler(activeChild.id);
        }}
      >
        +
      </button>

      <Table  size="small">
        <thead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell>Default value</TableCell>
            <TableCell>Normal range</TableCell>
            <TableCell>Max</TableCell>
            <TableCell>Lowest</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </thead>
        <TableBody>
          {activeTestObj.child_tests.map((child) => {
            // console.log(child.normalRange)
            return (
              <tr key={child.id}>
                <MyTableCell
                  table="child_tests"
                  colName={"child_test_name"}
                  item={activeTestObj}
                  child_id={child.id}
                >
                  {child.child_test_name}
                </MyTableCell>
                <MyAutoCompeleteTableCell
                child_id={child.id}
                  sections={units}
                  colName={"unit_id"}
                  item={activeTestObj}
                  val={child.unit}
                  table="child_tests"
                  
                />
                <MyTableCell
                  table="child_tests"
                  colName={"defval"}
                  item={activeTestObj}
                  child_id={child.id}
                >
                  {child.defval}
                </MyTableCell>
                <MyTableCell
                  multiline={true}
                  table="child_tests"
                  colName={"normalRange"}
                  item={activeTestObj}
                  child_id={child.id}
                >
                  {child.normalRange}
                </MyTableCell>
                <MyTableCell
                 table="child_tests"
                 colName={'max'}
                 item={activeTestObj}
                 
                 child_id={child.id}

                >
                  {child.max}
                </MyTableCell>  
                <MyTableCell
                 table="child_tests"
                 colName={'lowest'}
                 item={activeTestObj}
                 
                 child_id={child.id}

                >
                  {child.lowest}
                </MyTableCell>  
                <TableCell width={'13%'} >
                  <Stack direction={'row'} justifyContent={'space-around'} spacing={2}>
                  <Button size="small" variant="contained" onClick={() => showModalHandler(child)}>
                    options
                  </Button>
                  <Button size="small" variant="contained" onClick={() => deleteChild(child)}>
                    delete
                  </Button>
                  </Stack>
                 
                </TableCell>
               
              </tr>
            );
          })}
        </TableBody>
      </Table>
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
