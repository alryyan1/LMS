import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Modal from "./Modal";
import TestOptions from "./pages/Laboratory/TestOptions";
import axiosClient from "../axios-client";
import {
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
} from "@mui/material";
import MyTableCell from "./pages/inventory/MyTableCell";
import ChildGroupAutoComplete from "./pages/Laboratory/ChildGroupAutoComplete";
import UnitAutocomplete from "./components/UnitAutocomplete";
import {  Book, BookOpen, Plus, Trash } from "lucide-react";
import { OfflinePinSharp } from "@mui/icons-material";

function MainTestChildren() {
  const {
    activeTestObj,
    addChildTestHandler,
    setActiveTestObj,
    loading,
    setTests,
  } = useOutletContext();
  const [showModal, setShowModal] = useState(false);
  const [activeChild, setActiveChild] = useState();
  const [update, setUpdate] = useState(0);

  const addTestOptionHandler = () => {
    axiosClient
      .post(`childTestOption/${activeChild.id}`, { name: "new" })
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

      <Stack direction={"row"} gap={1} flexWrap={"wrap"}>
      <Tooltip title="حذف">

        <IconButton
          size="small"
          loading={loading}
          onClick={() => {
            const result = confirm(
              "هل انت متاكد من حذف هذا الفحص نهائيا سيتم حذفه من سجلات المرضي"
            );
            if (result) {
              axiosClient
                .delete(`maintest/${activeTestObj.id}`)
                .then(({ data }) => {
                  if (data.status) {
                    setActiveTestObj(null);
                    setTests((prev) => {
                      return prev.filter((p) => p.id != activeTestObj.id);
                    });
                  }
                });
            }
          }}
        >
          <Trash />
        </IconButton>
        </Tooltip>
        <Tooltip title="اضافه">
          <IconButton
            size="small"
            loading={loading}
            onClick={() => {
              addChildTestHandler(activeTestObj.id);
            }}
          >
            <Plus />
          </IconButton>
        </Tooltip>
        <Tooltip title="متاح">
          <IconButton
            size="small"
            color={activeTestObj.available ? 'success' : 'danger'}
            loading={loading}
            onClick={() => {
              axiosClient.patch(`mainTest/${activeTestObj.id}`,{
                colName:`available`,
                val:!activeTestObj.available
              }).then(({data})=>{
                setActiveTestObj(data.data)
              })
            }}
          >
            <OfflinePinSharp />
          </IconButton>
        </Tooltip>
        <Tooltip title="قسم النتيجه">
          <IconButton
            size="small"
            color={activeTestObj.divided ? 'success' : 'danger'}
            loading={loading}
            onClick={() => {
              axiosClient.patch(`mainTest/${activeTestObj.id}`,{
                colName:`divided`,
                val:!activeTestObj.divided
              }).then(({data})=>{
                setActiveTestObj(data.data)
              })
            }}
          >
            <BookOpen />
          </IconButton>
        </Tooltip>
      </Stack>
      <Paper>
        <Table size="small">
          <thead>
            <TableRow>
              {/* <TableCell>order</TableCell> */}
              <TableCell>Name</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Default value</TableCell>
              <TableCell>Normal range</TableCell>
              <TableCell>Low</TableCell>
              <TableCell>High</TableCell>
              <TableCell>childGroup</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </thead>
          <TableBody>
            {activeTestObj.child_tests.map((child) => {
              console.log(child, "child inloop");
              return (
                <tr key={child.id}>
                  {/* <MyTableCell
                    table="child_tests"
                    colName={"test_order"}
                    item={activeTestObj}
                    child_id={child.id}
                  >
                    {child.test_order}
                  </MyTableCell> */}
                  <MyTableCell
                    table="child_tests"
                    colName={"child_test_name"}
                    item={child}
                    child_id={child.id}
                    updateTests={setTests}
                  >
                    {child.child_test_name}
                  </MyTableCell>
                  <TableCell>
                    <UnitAutocomplete
                      child_id={child.id}
                      unitObj={child.unit}
                    />
                  </TableCell>

                  <MyTableCell
                    table="child_tests"
                    colName={"defval"}
                    item={child}
                    child_id={child.id}
                    updateTests={setTests}
                  >
                    {child.defval}
                  </MyTableCell>
                  <MyTableCell
                    multiline={true}
                    table="child_tests"
                    colName={"normalRange"}
                    item={child}
                    child_id={child.id}
                    updateTests={setTests}
                  >
                    {child.normalRange}
                  </MyTableCell>

                  <MyTableCell
                    table="child_tests"
                    colName={"lowest"}
                    item={child}
                    child_id={child.id}
                    updateTests={setTests}
                  >
                    {child.lowest}
                  </MyTableCell>
                  <MyTableCell
                    table="child_tests"
                    colName={"max"}
                    item={child}
                    child_id={child.id}
                    updateTests={setTests}
                  >
                    {child.max}
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
                      flexWrap={true}
                     gap={1}
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
                        color="error"
                        onClick={() => deleteChild(child.id)}
                      >
                        <Trash/>
                      </Button>
                    </Stack>
                  </TableCell>
                </tr>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

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
