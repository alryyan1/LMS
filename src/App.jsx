import "./app.css";
import './pages/inventory/inventory.css'
import "./tests.css";
import useApp from "./hooks/useApp";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Nav from "./Nav";
import { Outlet } from "react-router-dom";
function App() {


  const {
    selectTestHandler,
    units,
    setActiveTestObj,
    activeTestObj,
    inputRef,
    containerData,
    packageData,
    setShowAddTest,
    setUnits,
    showUnitList,
    setShowUnitList,
    testsIsLoading,
    showAddTest,
    doctors,
  } = useApp();
  // console.log(data)
  return (
    <>
          <div className="app-container">
            <Nav />
            <Outlet
              context={{
                showAddTest,
                selectTestHandler,
                showUnitList,
                testsIsLoading,
                setShowUnitList,
                units,
                setActiveTestObj,
                activeTestObj,
                searchInput: inputRef.current,
                containerData,
                packageData,
                setShowAddTest,
                setUnits,
                doctors
              }}
            />
          </div>
    </>
  );
}
export default App;
