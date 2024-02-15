import "./app.css";
import "./tests.css";
import useApp from "./hooks/useApp";
import Nav from "./Nav";
import {Outlet} from 'react-router-dom'
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
    showAddTest
  } = useApp();
  // console.log(data)
  return (

      <>
      <div className="app-container">
      <Nav/>
         <Outlet context={{
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
      }}/> 
     </div>
      </>
    
  );
}
export default App;
 