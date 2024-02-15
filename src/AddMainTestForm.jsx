import { useState, useRef } from "react";
import {useOutletContext} from 'react-router-dom'
import Loader from "./loader";

function AddMainTestForm() {
  const [loading, setIsLoading] = useState(false);
  const nameRef = useRef();
  const priceRef = useRef();
  const packRef = useRef();
  const containerRef = useRef();
  const AppData = useOutletContext();
  const addTest = () => {
    setIsLoading(true);
    const answer = confirm("A New Test Will Be Added !!");
    if (answer) {
      fetch(
        `http://127.0.0.1/projects/bootstraped/new/api.php?AddMainTest=1&name=${nameRef.current.value}&price=${priceRef.current.value}&container=${containerRef.current.value}&pack=${packRef.current.value}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            AppData.setActiveTestObj(data.activeTestObj);
            AppData.setShowAddTest(false);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="Test-Details">
      {loading ? (
        <Loader />
      ) : (
        <div>
          <h1 style={{ textAlign: "center" }}>Add New Test</h1>
          <div className="form-control">
            <label htmlFor="">Test Name</label>
            <input ref={nameRef} type="text" />
          </div>
          <div className="form-control">
            <label htmlFor="">Price</label>
            <input ref={priceRef} type="number" />
          </div>
          <div className="form-control">
            <label htmlFor="">Container</label>
            <select ref={containerRef}>
              {AppData.containerData.map((el) => (
                <option key={el.id} value={el.id}>
                  {el.container_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label htmlFor="">Department</label>
            <select ref={packRef}>
              {AppData.packageData.map((el) => {
                // console.log(el)

                return (
                  <option key={el.package_id} value={el.package_id}>
                    {el.package_name}
                  </option>
                );
              })}
            </select>
          </div>
          <button className="btn1" onClick={addTest}>
            Save
          </button>
        </div>
      )}
    </div>
  );
}

export default AddMainTestForm;
