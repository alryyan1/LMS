import { useState, useRef, useContext, useEffect } from "react";
import { Button, Stack } from "@mui/material";
import Loader from "./loader";
import context from "./appContext";
import DeleteIcon from "@mui/icons-material/Delete";
import {useOutletContext} from 'react-router-dom'
function TestMainInfo({ test, setActiveTestObj }) {
  const [loading, setIsLoading] = useState(false);
  const nameRef = useRef();
  const priceRef = useRef();
  const packRef = useRef();
  const containerRef = useRef();
  const AppData = useOutletContext(context);
  const deleteTest = (id) => {
    setIsLoading(true);
    const answer = confirm("Test will be deleted permenantly");
    if (answer) {
      fetch(
        "http://127.0.0.1/projects/bootstraped/new/api.php?deleteMainTest=1&id=" +
          id
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.status) {
            setActiveTestObj(undefined);
            setIsLoading(false);
            const filteredTests = AppData.allTests.filter(
              (test) => test.id !== id
            );
            console.log(filteredTests);
            AppData.setAllTests(filteredTests);
            AppData.searchInput.focus();
            AppData.searchInput.value = "";
          }
        });
    }
  };
  useEffect(() => {
    console.log(test);
    nameRef.current.value = test.main_test_name;
    priceRef.current.value = test.price;
    packRef.current.value = test.pack_id;
    containerRef.current.value = test.container_id;
  }, [test]);

  const changeTestDetails = (id, col, val) => {
    fetch(
      `http://127.0.0.1/projects/bootstraped/new/api.php?changeTestDetails=1&id=${id}&col=${col}&val=${val}`
    );
  };

  return (
    <div className="Test-Details">
      {test.main_test_name}
      {loading ? (
        <Loader />
      ) : (
        <div>
          <div className="form-control">
            <label htmlFor="">Test Name</label>
            <input
              ref={nameRef}
              onChange={(e) => {
                changeTestDetails(test.id, "main_test_name", e.target.value);
              }}
              type="text"
            />
          </div>
          <div className="form-control">
            <label htmlFor="">Price</label>
            <input
              ref={priceRef}
              onChange={(e) => {
                changeTestDetails(test.id, "price", e.target.value);
              }}
              type="text"
            />
          </div>
          <div className="form-control">
            <label htmlFor="">Container</label>
            <select
              ref={containerRef}
              onChange={(e) => {
                changeTestDetails(test.id, "container_id", e.target.value);
              }}
              defaultValue={test.container_id}
            >
              {AppData.containerData.map((el) => (
                <option key={el.id} value={el.id}>
                  {el.container_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label htmlFor="">Department</label>
            <select
              ref={packRef}
              onChange={(e) => {
                changeTestDetails(test.id, "pack_id", e.target.value);
              }}
              defaultValue={test.pack_id}
            >
              {AppData.packageData.map((el) => {
                return (
                  <option key={el.package_id} value={el.package_id}>
                    {el.package_name}
                  </option>
                );
              })}
            </select>
          </div>
          <Stack>
            <Button
              color="info"
              onClick={() => deleteTest(test.id)}
              endIcon={<DeleteIcon />}
              variant="contained"
            >
              Delete
            </Button>
          </Stack>
        </div>
      )}
    </div>
  );
}

export default TestMainInfo;
