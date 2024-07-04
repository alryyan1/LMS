import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Td from "./pages/Laboratory/Td";
import TdSelect from "./pages/Laboratory/TdSelect";
import TdTextArea from "./pages/Laboratory/TdTextArea";
import Modal from "./Modal";
import TestOptions from "./pages/Laboratory/TestOptions";
import axiosClient from "../axios-client";
import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import MyTableCell from "./pages/inventory/MyTableCell";
import MyAutoCompeleteTableCell from "./pages/inventory/MyAutoCompeleteTableCell";
import { LoadingButton } from "@mui/lab";
import ChildGroupAutoComplete from "./pages/Laboratory/ChildGroupAutoComplete";
import { Delete } from "@mui/icons-material";
import UnitAutocomplete from "./components/UnitAutocomplete";

function MainTestChildren() {
  const {
    activeTestObj,
    addChildTestHandler,
    setActiveTestObj,
    units,
    loading,
    setUpdateTests,
    setTests
  } = useOutletContext();
  const [showModal, setShowModal] = useState(false);
  const [activeChild, setActiveChild] = useState();
  const [update, setUpdate] = useState(0);

  const addTestOptionHandler = () => {
    axiosClient
      .post(`childTestOption/${activeChild.id}`,{name:'new'})
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

      <Box sx={{ position: "relative" }}>
      <LoadingButton
      color="error"
          variant={"contained"}
          sx={{ position: "absolute", top: "-40px", left: "0px" }}
          loading={loading}
          onClick={() => {
            const result =   confirm("هل انت متاكد من حذف هذا الفحص نهائيا سيتم حذفه من سجلات المرضي")
            if (result) {
              axiosClient.delete(`maintest/${activeTestObj.id}`).then(({data}) => {
            
                if (data.status) {
                   setActiveTestObj(null)
                   setTests((prev)=>{
                     return prev.filter((p)=>p.id!= activeTestObj.id)
                   })
                 }
              });
            }
            
          }}
        >
          <Delete/>
        </LoadingButton>
        <LoadingButton
          variant={"contained"}
          sx={{ position: "absolute", top: "-40px", right: "0px" }}
          loading={loading}
          onClick={() => {
            
            addChildTestHandler(activeTestObj.id);
          
          }}
        >
          +
        </LoadingButton>
        <Paper>
        <Table size="small">
          <thead>
            <TableRow>
              {/* <TableCell>order</TableCell> */}
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
              console.log(child,'child inloop')
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
                    stateUpdater={setUpdateTests}
                  >
                    {child.child_test_name}
                  </MyTableCell>
                  <TableCell>
                    <UnitAutocomplete child_id={child.id} unitObj={child.unit}  />
                  </TableCell>
                
                  <MyTableCell
                    table="child_tests"
                    colName={"defval"}
                    item={child}
                    child_id={child.id}
                    stateUpdater={setUpdateTests}
                  >
                    {child.defval}
                  </MyTableCell>
                  <MyTableCell
                    multiline={true}
                    table="child_tests"
                    colName={"normalRange"}
                    item={child}
                    child_id={child.id}
                    stateUpdater={setUpdateTests}
                  >
                    {child.normalRange}
                  </MyTableCell>
                  <MyTableCell
                    table="child_tests"
                    colName={"max"}
                    item={child}
                    child_id={child.id}
                    stateUpdater={setUpdateTests}
                  >
                    {child.max}
                  </MyTableCell>
                  <MyTableCell
                    table="child_tests"
                    colName={"lowest"}
                    item={child}
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
        </Paper>
        
      </Box>

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
