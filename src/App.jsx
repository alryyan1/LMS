import "./app.css";
import "./tests.css";
import TestMainInfo from "./TestMainInfo";
import MainTestChildren from "./MainTestChildren";
import context from "./appContext";
import useApp from "./hooks/useApp";
import AddMainTestForm from "./AddMainTestForm";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import UnitList from "./UnitList";
import Test from  "./Test"
function App() {
  const {
    selectTestHandler,
    addChildTestHandler,
    searchTestList,
    searchHandler,
    units,
    showSearchBox,
    setActiveTestObj,
    activeTestObj,
    data,
    setData,
    inputRef,
    searchedTest,
    containerData,
    packageData,
    setShowAddTest,
    showAddTest,
    setUnits,
    showUnitList,
    setShowUnitList,testsIsLoading
  } = useApp();

  return (
    <context.Provider
      value={{
        selectTestHandler,
        testsIsLoading,
        setShowUnitList,
        units,
        setActiveTestObj,
        activeTestObj,
        allTests: data,
        setAllTests: setData,
        searchInput: inputRef.current,
        containerData,
        packageData,
        setShowAddTest,
        setUnits,
      }}
    >
      <div className="container">
       {<Test selectTestHandler={selectTestHandler} tests = {data}/>} 
        {/* {JSON.stringify(data)} */}
        <div>
          <Button
            onClick={() => {
              setActiveTestObj(undefined);
              setShowAddTest(true);
            }}
            variant="contained"
          >
            +
          </Button>
          ;
        </div>
        <div className="searchContainer">
          <div className="form-control search-container">
            <div>Search</div>
            <div>
              <input
                onBlur={() => {
                  //     setShowSearchBox(false);
                }}
                ref={inputRef}
                onChange={searchHandler}
                type="text"
              />
            </div>
          </div>

          <div className={showSearchBox ? "searchedItemsBox" : "hide"}>
            <ul>{searchedTest == "" ? "" : searchTestList}</ul>
          </div>
          <div className="mainTestInfo">
            {activeTestObj && (
              <h1 style={{ textAlign: "center" }}>Main Test Info</h1>
            )}

            {activeTestObj && (
              <TestMainInfo
                setActiveTestObj={setActiveTestObj}
                test={activeTestObj}
              />
            )}
            {showAddTest && (
              <AddMainTestForm
                packageData={packageData}
                containerData={containerData}
              />
            )}
          </div>
        </div>
        <div>
          <button
            onClick={() => {
              setActiveTestObj(undefined);
              setShowUnitList(true);
            }}
          >
            units
          </button>
        </div>

        <div>
          {showUnitList && <UnitList />}

          {activeTestObj && (
            <MainTestChildren
              addChildTestHandler={addChildTestHandler}
              test={activeTestObj}
            />
          )}
        </div>
      </div>
    </context.Provider>
  );
}
export default App;
