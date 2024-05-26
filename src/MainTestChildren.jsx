import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Td from "./pages/Laboratory/Td";
import TdSelect from "./pages/Laboratory/TdSelect";
import TdTextArea from "./pages/Laboratory/TdTextArea";
import Modal from "./Modal";
import TestOptions from "./pages/Laboratory/TestOptions";
import axiosClient from "../axios-client";
import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import MyTableCell from "./pages/inventory/MyTableCell";
import MyAutoCompeleteTableCell from "./pages/inventory/MyAutoCompeleteTableCell";
import { LoadingButton } from "@mui/lab";
import ChildGroupAutoComplete from "./pages/Laboratory/ChildGroupAutoComplete";

function MainTestChildren() {
  const {
    activeTestObj,
    addChildTestHandler,
    setActiveTestObj,
    units,
    loading,
    setUpdateTests,
  } = useOutletContext();
  const [showModal, setShowModal] = useState(false);
  const [activeChild, setActiveChild] = useState();
  const [update, setUpdate] = useState(0);

  const addTestOptionHandler = () => {
    axiosClient
      .post(`childTestOption/${activeChild.id}`)
      .then((data) => console.log(data))
      .finally(() => {
        setUpdate((prev) => prev + 1);
      });
  };
  function showModalHandler(child) {
    setShowModal(true);
    setActiveChild(child);
    console.log(activeChild, "activeChild");
    setUpdate((prev) => prev + 1);
  }

  const deleteChild = (id) => {
    console.log(id);
    const result = confirm("one parameter will be deleted !!");
    if (result) {
      axiosClient
        .delete(`childTest/${id}`)
        .then(({ data }) => {
          console.log(data);
          if (data.status) {
            console.log("first");
            const filterredChildren = activeTestObj.child_tests.filter(
              (child) => child.id != id
            );
            setActiveTestObj((prev) => {
              return { ...prev, child_tests: [...filterredChildren] };
            });
          }
        })
        .finally(() => {});
    }
  };

  return (
    <div className="table-children">
      <h1 style={{ textAlign: "center" }}>Test Parameters</h1>

      <LoadingButton
        variant={"contained"}
        sx={{ position: "absolute", top: "0px" }}
        loading={loading}
        onClick={() => {
          addChildTestHandler(activeTestObj.id);
        }}
      >
        +
      </LoadingButton>

      <Table size="small">
        <thead>
          <TableRow>
            <TableCell>order</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell>Default value</TableCell>
            <TableCell>Normal range</TableCell>
            <TableCell>Max</TableCell>
            <TableCell>Lowest</TableCell>
            <TableCell>childGroup</TableCell>
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
                  colName={"test_order"}
                  item={activeTestObj}
                  child_id={child.id}
                >
                  {child.test_order}
                </MyTableCell>
                <MyTableCell
                  table="child_tests"
                  colName={"child_test_name"}
                  item={activeTestObj}
                  child_id={child.id}
                  stateUpdater={setUpdateTests}
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
                  stateUpdater={setUpdateTests}
                />
                <MyTableCell
                  table="child_tests"
                  colName={"defval"}
                  item={activeTestObj}
                  child_id={child.id}
                  stateUpdater={setUpdateTests}
                >
                  {child.defval}
                </MyTableCell>
                <MyTableCell
                  multiline={true}
                  table="child_tests"
                  colName={"normalRange"}
                  item={activeTestObj}
                  child_id={child.id}
                  stateUpdater={setUpdateTests}
                >
                  {child.normalRange}
                </MyTableCell>
                <MyTableCell
                  table="child_tests"
                  colName={"max"}
                  item={activeTestObj}
                  child_id={child.id}
                  stateUpdater={setUpdateTests}
                >
                  {child.max}
                </MyTableCell>
                <MyTableCell
                  table="child_tests"
                  colName={"lowest"}
                  item={activeTestObj}
                  child_id={child.id}
                  stateUpdater={setUpdateTests}
                >
                  {child.lowest}
                </MyTableCell>
                <TableCell width={"13%"}>
                  <ChildGroupAutoComplete
                    childGroup={child.child_group}
                    child_id={child.id}
                  />
                </TableCell>
                <TableCell width={"13%"}>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-around"}
                    spacing={2}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => showModalHandler(child)}
                    >
                      options
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => deleteChild(child.id)}
                    >
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
